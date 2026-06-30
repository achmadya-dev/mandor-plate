import { execFileSync } from 'node:child_process';

const [, , parentFilter] = process.argv;

const issues = listIssues();
const issuesByNumber = new Map(issues.map((issue) => [issue.number, issue]));

const eligible = issues
  .map((issue) => evaluateIssue(issue, issuesByNumber))
  .filter((issue) => issue.eligible);

if (parentFilter) {
  const numericParent = Number(parentFilter);
  if (!Number.isFinite(numericParent)) {
    console.error('Usage: pnpm work:next [parent-issue-number]');
    process.exit(1);
  }

  eligible.splice(
    0,
    eligible.length,
    ...eligible.filter((issue) => issue.parentNumber === numericParent),
  );
}

if (eligible.length === 0) {
  console.log(
    JSON.stringify(
      {
        eligible: false,
        reason: parentFilter
          ? `No eligible ready-for-agent issues found for parent #${parentFilter}.`
          : 'No eligible ready-for-agent issues found.',
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

eligible.sort(compareEligibleIssues);

console.log(
  JSON.stringify(
    {
      eligible: true,
      selected: formatSelectedIssue(eligible[0], issuesByNumber),
      alternatives: eligible
        .slice(1, 5)
        .map((issue) => formatSelectedIssue(issue, issuesByNumber)),
    },
    null,
    2,
  ),
);

function listIssues() {
  const raw = runGh([
    'issue',
    'list',
    '--state',
    'all',
    '--limit',
    '200',
    '--json',
    'number,title,body,state,labels',
  ]);

  return JSON.parse(raw).map((issue) => ({
    ...issue,
    labelNames: issue.labels.map((label) => label.name),
    mode: parseMode(issue.body),
    parentNumber: parseParent(issue.body),
    priority: parsePriority(issue.body, issue.labels),
    dependsOn: parseDependsOn(issue.body),
  }));
}

function evaluateIssue(issue, issuesByNumber) {
  const ready =
    issue.state === 'OPEN' && issue.labelNames.includes('ready-for-agent');
  const mode = issue.mode || inferMode(issue);
  const priorityRank = priorityToRank(issue.priority);
  const dependencyStatus = issue.dependsOn.map((number) => ({
    number,
    satisfied: isDependencySatisfied(issuesByNumber.get(number)),
  }));

  const parentIssue = issue.parentNumber
    ? issuesByNumber.get(issue.parentNumber)
    : null;
  const branchName =
    mode === 'parent-managed-child'
      ? buildParentBranchName(issue.parentNumber, parentIssue?.title)
      : buildStandaloneBranchName(issue.number, issue.title);

  const reasons = [];
  if (!ready) {
    reasons.push('Issue is not open with label ready-for-agent');
  }

  if (mode === 'parent-managed-child' && !issue.parentNumber) {
    reasons.push('Parent-managed child is missing a parent reference');
  }

  const unsatisfiedDependencies = dependencyStatus.filter(
    (dependency) => !dependency.satisfied,
  );
  if (unsatisfiedDependencies.length > 0) {
    reasons.push(
      `Unsatisfied dependencies: ${unsatisfiedDependencies.map((dependency) => `#${dependency.number}`).join(', ')}`,
    );
  }

  return {
    ...issue,
    mode,
    eligible: reasons.length === 0,
    reasons,
    priorityRank,
    branchName,
    dependencyStatus,
  };
}

function compareEligibleIssues(a, b) {
  if (a.priorityRank !== b.priorityRank) {
    return a.priorityRank - b.priorityRank;
  }

  if (a.parentNumber && b.parentNumber && a.parentNumber === b.parentNumber) {
    return a.number - b.number;
  }

  if (a.parentNumber && !b.parentNumber) {
    return -1;
  }

  if (!a.parentNumber && b.parentNumber) {
    return 1;
  }

  return a.number - b.number;
}

function formatSelectedIssue(issue, issuesByNumber) {
  const parentIssue = issue.parentNumber
    ? issuesByNumber.get(issue.parentNumber)
    : null;

  return {
    number: issue.number,
    title: issue.title,
    mode: issue.mode,
    priority: issue.priority,
    parent: issue.parentNumber
      ? {
          number: issue.parentNumber,
          title: parentIssue?.title ?? null,
        }
      : null,
    branchName: issue.branchName,
    readyTransition: {
      from: 'ready-for-agent',
      to: 'in-progress',
    },
    completionTransition:
      issue.mode === 'parent-managed-child'
        ? {
            from: 'in-progress',
            to: 'awaiting-parent-pr',
          }
        : {
            from: 'in-progress',
            to: 'open PR immediately',
          },
    dependencyStatus: issue.dependencyStatus.map((dependency) => ({
      number: dependency.number,
      satisfied: dependency.satisfied,
    })),
    progressCommentTemplate: buildProgressCommentTemplate(issue),
    blockedCommentTemplate: buildBlockedCommentTemplate(issue),
  };
}

function buildProgressCommentTemplate(issue) {
  return [
    'Progress update',
    '',
    `- Mode: ${issue.mode}`,
    '- Commit: <short-sha>',
    `- Branch: ${issue.branchName}`,
    '- Completed checklist items:',
    '  - <item>',
    '- Quality gates run:',
    '  - <command/result>',
    issue.mode === 'parent-managed-child'
      ? '- Current state: awaiting-parent-pr'
      : '- Current state: PR opened for standalone issue',
  ].join('\n');
}

function buildBlockedCommentTemplate(issue) {
  return [
    'Blocked handoff',
    '',
    `- Mode: ${issue.mode}`,
    `- Branch: ${issue.branchName}`,
    '- Blocker type: <dependency|clarification|quality-gate|other>',
    '- What was tried:',
    '  - <attempt>',
    '- Current status label: in-progress',
    '- Next action needed:',
    '  - <next step>',
  ].join('\n');
}

function isDependencySatisfied(issue) {
  if (!issue) {
    return false;
  }

  if (issue.state === 'CLOSED') {
    return true;
  }

  return issue.labels.some((label) => label.name === 'awaiting-parent-pr');
}

function inferMode(issue) {
  return issue.parentNumber ? 'parent-managed-child' : 'standalone';
}

function parseMode(body) {
  const mode = parseSection(body, 'Mode').trim();
  return mode || '';
}

function parseParent(body) {
  const parent = parseSection(body, 'Parent').trim();
  const match = parent.match(/#(\d+)/);
  return match ? Number(match[1]) : null;
}

function parsePriority(body, labels) {
  const sectionPriority = parseSection(body, 'Priority').trim();
  if (sectionPriority) {
    return sectionPriority;
  }

  const labelPriority = labels
    .map((label) => label.name)
    .find((label) => ['P0', 'P1', 'P2'].includes(label));

  return labelPriority ?? 'P1';
}

function parseDependsOn(body) {
  const dependsOnSection = parseSection(body, 'Depends on').trim();
  if (!dependsOnSection || /^none\b/i.test(dependsOnSection)) {
    return [];
  }

  return dependsOnSection
    .split('\n')
    .map((line) => line.match(/#(\d+)/))
    .filter(Boolean)
    .map((match) => Number(match[1]));
}

function parseSection(body, heading) {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(
    `^## ${escapedHeading}\\s*\\n([\\s\\S]*?)(?=^## |\\Z)`,
    'm',
  );
  const match = body.match(regex);
  return match ? match[1].trim() : '';
}

function priorityToRank(priority) {
  switch (priority) {
    case 'P0':
      return 0;
    case 'P1':
      return 1;
    case 'P2':
      return 2;
    default:
      return 99;
  }
}

function buildStandaloneBranchName(number, title) {
  return `feat/issue-${number}-${slugify(title)}`;
}

function buildParentBranchName(number, title) {
  return `feat/parent-${number}-${slugify(title ?? 'parent-work')}`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

function runGh(args) {
  return execFileSync('gh', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}
