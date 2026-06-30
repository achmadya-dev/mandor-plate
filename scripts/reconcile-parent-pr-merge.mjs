import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const filteredArgs = args.filter((arg) => arg !== '--dry-run');
const [prArg, bodyFileArg] = filteredArgs;

if (!prArg) {
  console.error(
    'Usage: pnpm reconcile:parent-pr <pr-number> [body-file] [--dry-run]',
  );
  process.exit(1);
}

const prNumber = Number(prArg);
if (!Number.isFinite(prNumber)) {
  console.error('PR number must be numeric.');
  process.exit(1);
}

const pr = bodyFileArg
  ? buildSyntheticPr(prNumber, readFileSync(path.resolve(bodyFileArg), 'utf8'))
  : getPullRequest(prNumber);

if (!pr.mergedAt) {
  fail(`PR #${prNumber} is not merged.`);
}

const parentNumber = parseParentNumber(pr.body);
if (!parentNumber) {
  fail(`PR #${prNumber} does not reference a parent issue.`);
}

const includedChildNumbers = parseIncludedChildNumbers(pr.body);
if (includedChildNumbers.length === 0) {
  fail(`PR #${prNumber} does not list included child issues.`);
}

const parentIssue = getIssue(parentNumber);
const parentChildren = parseChildSummary(parentIssue.body);
const parentChildrenByNumber = new Map(
  parentChildren.map((child) => [child.number, child]),
);

const includedChildren = includedChildNumbers.map((number) => {
  const parentChild = parentChildrenByNumber.get(number);
  const issue = getIssue(number);
  return {
    number,
    parentChild,
    issue,
  };
});

const closableChildren = includedChildren.filter((child) =>
  isChildCompleteForMerge(child.issue),
);

const updatedParentBody = rebuildParentBody(
  parentIssue.body,
  parentChildren.map((child) =>
    updateChildState({
      child,
      includedChildNumbers,
      closableNumbers: new Set(closableChildren.map((item) => item.number)),
    }),
  ),
);

const shouldCloseParent = parentChildren.every((child) => {
  if (child.requiredForCurrentParentPr !== 'yes') {
    return true;
  }

  if (
    includedChildNumbers.includes(child.number) &&
    closableChildren.some((item) => item.number === child.number)
  ) {
    return true;
  }

  const currentIssue = getIssue(child.number);
  return currentIssue.state === 'CLOSED';
});

const result = {
  pr: {
    number: pr.number,
    mergedAt: pr.mergedAt,
    url: pr.url,
  },
  parent: {
    number: parentNumber,
    shouldClose: shouldCloseParent,
  },
  closableChildren: closableChildren.map((child) => child.number),
  skippedChildren: includedChildren
    .filter(
      (child) =>
        !closableChildren.some((closable) => closable.number === child.number),
    )
    .map((child) => child.number),
  dryRun,
};

if (dryRun) {
  console.log(
    JSON.stringify(
      {
        ...result,
        updatedParentBody,
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

editIssue(parentNumber, updatedParentBody);

for (const child of closableChildren) {
  if (child.issue.state !== 'CLOSED') {
    closeIssue(
      child.number,
      `Closed after merge of parent PR #${pr.number} linked to parent issue #${parentNumber}.`,
    );
  }
}

if (shouldCloseParent && parentIssue.state !== 'CLOSED') {
  closeIssue(parentNumber, `Closed after merge of parent PR #${pr.number}.`);
}

console.log(JSON.stringify(result, null, 2));

function buildSyntheticPr(number, body) {
  return {
    number,
    body,
    mergedAt: 'synthetic',
    url: `synthetic-pr-${number}`,
  };
}

function getPullRequest(number) {
  return JSON.parse(
    runGh(['pr', 'view', String(number), '--json', 'number,body,mergedAt,url']),
  );
}

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

function parseParentNumber(prBody) {
  const section = parseSection(prBody, 'Parent Issue');
  const match = section.match(/#(\d+)/);
  return match ? Number(match[1]) : null;
}

function parseIncludedChildNumbers(prBody) {
  const section = parseSection(prBody, 'Included Child Issues');
  if (!section) {
    return [];
  }

  return section
    .split('\n')
    .map((line) => line.match(/#(\d+)/))
    .filter(Boolean)
    .map((match) => Number(match[1]));
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
        /^- \[([ xX]?)\] #(\d+) \| title: (.+?) \| priority: (P\d+) \| depends-on: (.+?) \| required-for-current-parent-pr: (yes|no) \| state: (.+)$/,
      );
      if (!match) {
        return null;
      }

      return {
        checked: match[1].toLowerCase() === 'x',
        number: Number(match[2]),
        title: match[3],
        priority: match[4],
        dependsOn: match[5],
        requiredForCurrentParentPr: match[6],
        state: match[7],
      };
    })
    .filter(Boolean);
}

function updateChildState({ child, includedChildNumbers, closableNumbers }) {
  const included = includedChildNumbers.includes(child.number);
  const closable = closableNumbers.has(child.number);

  if (included && closable) {
    return {
      ...child,
      checked: true,
      state: 'merged',
    };
  }

  if (child.checked || child.state === 'merged') {
    return child;
  }

  return child;
}

function rebuildParentBody(body, children) {
  const childSection = children.map(formatChildSummaryLine).join('\n');
  return replaceSection(body, 'Child issue summary', childSection);
}

function formatChildSummaryLine(child) {
  const checkbox = child.checked ? 'x' : ' ';
  return `- [${checkbox}] #${child.number} | title: ${child.title} | priority: ${child.priority} | depends-on: ${child.dependsOn} | required-for-current-parent-pr: ${child.requiredForCurrentParentPr} | state: ${child.state}`;
}

function isChildCompleteForMerge(issue) {
  if (issue.state === 'CLOSED') {
    return true;
  }

  return issue.labels.some((label) => label.name === 'awaiting-parent-pr');
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

function replaceSection(body, heading, newContent) {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(
    `(^## ${escapedHeading}\\s*\\n)([\\s\\S]*?)(?=^## |\\Z)`,
    'm',
  );
  if (!regex.test(body)) {
    return `${body.trim()}\n\n## ${heading}\n\n${newContent}\n`;
  }

  return body.replace(regex, `$1${newContent}\n\n`);
}

function editIssue(number, body) {
  runGh(['issue', 'edit', String(number), '--body', body]);
}

function closeIssue(number, comment) {
  runGh(['issue', 'close', String(number), '--comment', comment]);
}

function runGh(commandArgs) {
  return execFileSync('gh', commandArgs, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
