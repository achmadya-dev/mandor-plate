import { execFileSync } from 'node:child_process';
import path from 'node:path';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const filteredArgs = args.filter((arg) => arg !== '--dry-run');
const [parentArg, baseBranchArg] = filteredArgs;

if (!parentArg) {
  console.error(
    'Usage: pnpm pr:open-parent <parent-issue-number> [base-branch] [--dry-run]',
  );
  process.exit(1);
}

const parentNumber = Number(parentArg);
if (!Number.isFinite(parentNumber)) {
  console.error('Parent issue number must be numeric.');
  process.exit(1);
}

const parentIssue = getIssue(parentNumber);
const parentLabels = parentIssue.labels.map((label) => label.name);

if (parentLabels.includes('hold-pr')) {
  fail(
    `Parent issue #${parentNumber} is labeled hold-pr; refusing to open PR.`,
  );
}

const childEntries = parseChildSummary(parentIssue.body);
if (childEntries.length === 0) {
  fail(`Parent issue #${parentNumber} has no parseable child issue summary.`);
}

const requiredChildren = childEntries.filter(
  (child) => child.requiredForCurrentParentPr === 'yes',
);
if (requiredChildren.length === 0) {
  fail(
    `Parent issue #${parentNumber} has no required child issues for the current PR.`,
  );
}

const childDetails = requiredChildren.map((child) => ({
  ...child,
  issue: getIssue(child.number),
}));

const incompleteChildren = childDetails.filter(
  (child) => !isChildCompleteForParentPr(child.issue),
);
if (incompleteChildren.length > 0) {
  fail(
    `Required child issues are not complete: ${incompleteChildren
      .map((child) => `#${child.number}`)
      .join(', ')}. Expected label awaiting-parent-pr or closed state.`,
  );
}

const currentBranch = runGit(['branch', '--show-current']).trim();
const expectedBranch = buildParentBranchName(parentNumber, parentIssue.title);

if (currentBranch !== expectedBranch) {
  fail(
    `Current branch is ${currentBranch}. Expected parent branch ${expectedBranch} before opening the aggregate PR.`,
  );
}

const title = `feat: #${parentNumber} ${parentIssue.title}`;
const body = buildPrBody({
  parentIssue,
  childDetails,
});

if (dryRun) {
  console.log(
    JSON.stringify(
      {
        eligible: true,
        dryRun: true,
        parent: {
          number: parentIssue.number,
          title: parentIssue.title,
        },
        branch: currentBranch,
        baseBranch: baseBranchArg || 'repo default',
        title,
        body,
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

const commandArgs = [
  'pr',
  'create',
  '--title',
  title,
  '--body',
  body,
  '--head',
  currentBranch,
];
if (baseBranchArg) {
  commandArgs.push('--base', baseBranchArg);
}

const url = runGh(commandArgs);
console.log(url);

function getIssue(number) {
  return JSON.parse(
    runGh([
      'issue',
      'view',
      String(number),
      '--json',
      'number,title,body,state,labels,url',
    ]),
  );
}

function parseChildSummary(body) {
  const section = parseSection(body, 'Child issue summary');
  if (!section) {
    return [];
  }

  return section
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(
        /^- \[[ xX]?\] #(\d+) \| title: (.+?) \| priority: (P\d+) \| depends-on: (.+?) \| required-for-current-parent-pr: (yes|no) \| state: (.+)$/,
      );
      if (!match) {
        return null;
      }

      return {
        number: Number(match[1]),
        title: match[2],
        priority: match[3],
        dependsOn: match[4],
        requiredForCurrentParentPr: match[5],
        state: match[6],
      };
    })
    .filter(Boolean);
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

function isChildCompleteForParentPr(issue) {
  if (issue.state === 'CLOSED') {
    return true;
  }

  return issue.labels.some((label) => label.name === 'awaiting-parent-pr');
}

function buildParentBranchName(number, title) {
  return `feat/parent-${number}-${slugify(title)}`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
}

function buildPrBody({ parentIssue, childDetails }) {
  const includedChildren = childDetails
    .map((child) => `- #${child.number} - ${child.issue.title}`)
    .join('\n');
  const implementationSummary = childDetails
    .map(
      (child) =>
        `- #${child.number}: ${summarizeWhatToBuild(child.issue.body)}`,
    )
    .join('\n');

  return [
    '## Parent Issue',
    '',
    `- Parent: #${parentIssue.number}`,
    '',
    '## Included Child Issues',
    '',
    includedChildren,
    '',
    '## Implementation Summary',
    '',
    implementationSummary,
    '',
    '## Quality Gates',
    '',
    '- `pnpm check`',
    '',
    '## Risks / Follow-up',
    '',
    '- Scope is locked for this PR batch. Only humans may change inclusion for the open batch.',
  ].join('\n');
}

function summarizeWhatToBuild(body) {
  const summary = parseSection(body, 'What to build');
  if (!summary) {
    return 'See child issue body for implementation scope.';
  }

  return summary.replace(/\s+/g, ' ').trim();
}

function runGh(commandArgs) {
  return execFileSync('gh', commandArgs, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function runGit(commandArgs) {
  return execFileSync('git', commandArgs, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
