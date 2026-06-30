import { execFileSync } from 'node:child_process';
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';

const [, , featureSlug] = process.argv;

if (!featureSlug) {
  console.error('Usage: pnpm publish:parent-child <feature-slug>');
  process.exit(1);
}

const repoRoot = process.cwd();
const scratchDir = path.join(repoRoot, '.scratch', featureSlug);
const prdPath = path.join(scratchDir, 'PRD.md');
const issuesDir = path.join(scratchDir, 'issues');

assertPathExists(prdPath, `PRD not found at ${prdPath}`);
assertPathExists(issuesDir, `Issues directory not found at ${issuesDir}`);

const initialPrdMarkdown = readFileSync(prdPath, 'utf8');
const childPaths = listIssuePaths(issuesDir);

if (childPaths.length === 0) {
  console.error(`No issue drafts found under ${issuesDir}`);
  process.exit(1);
}

const parentMeta = parseTopMatter(initialPrdMarkdown);
const parentTitle = parsePrdTitle(initialPrdMarkdown);
const parentPriority = parentMeta.Priority ?? 'P1';
let parentNumber = parseGitHubNumber(parentMeta.GitHub);

const childDrafts = childPaths.map((filePath) => parseChildDraft(filePath));

ensureWorkflowLabels();

if (!parentNumber) {
  const parentBody = buildParentBody({
    featureSlug,
    priority: parentPriority,
    prdMarkdown: initialPrdMarkdown,
    childSummaryLines: childDrafts.map((draft) =>
      formatChildSummaryLine({
        number: '<issue-number>',
        title: draft.title,
        priority: draft.priority,
        dependsOn:
          draft.dependsOnRaw.length > 0
            ? draft.dependsOnRaw.join(', ')
            : 'none',
        requiredForCurrentParentPr: draft.requiredForCurrentParentPr,
        state: 'planned',
      }),
    ),
  });

  parentNumber = createIssue({
    title: parentTitle,
    body: parentBody,
    labels: [parentPriority],
  });

  writeFileSync(
    prdPath,
    upsertMetadataLine(initialPrdMarkdown, 'GitHub', `#${parentNumber}`),
  );
  console.log(`Created parent issue #${parentNumber}`);
}

const publishedNumbersByFile = new Map();
const publishedDetails = [];

for (const draft of childDrafts) {
  const issueNumber = publishChildDraft({
    draft,
    featureSlug,
    parentNumber,
    publishedNumbersByFile,
  });

  publishedNumbersByFile.set(path.basename(draft.filePath), issueNumber);
  publishedDetails.push({
    number: issueNumber,
    title: draft.title,
    priority: draft.priority,
    dependsOn: resolveDependencySummary(
      draft.dependsOnRaw,
      publishedNumbersByFile,
    ),
    requiredForCurrentParentPr: draft.requiredForCurrentParentPr,
    state: 'ready-for-agent',
  });
}

const finalPrdMarkdown = readFileSync(prdPath, 'utf8');
editIssue(parentNumber, {
  title: parentTitle,
  body: buildParentBody({
    featureSlug,
    priority: parentPriority,
    prdMarkdown: finalPrdMarkdown,
    childSummaryLines: publishedDetails.map(formatChildSummaryLine),
  }),
});

console.log(
  `Updated parent issue #${parentNumber} with ${publishedDetails.length} child issues.`,
);

function publishChildDraft({
  draft,
  featureSlug,
  parentNumber,
  publishedNumbersByFile,
}) {
  if (draft.status !== 'ready-for-agent') {
    throw new Error(
      `Refusing to publish ${draft.filePath}: Status must be ready-for-agent, got ${draft.status ?? '<missing>'}`,
    );
  }

  if (draft.githubNumber) {
    syncExistingChildIssue({
      issueNumber: draft.githubNumber,
      parentNumber,
      body: buildChildBody({ featureSlug, parentNumber, draft }),
      title: draft.title,
      priority: draft.priority,
      blockedBy: resolveDependencyNumbers(
        draft.dependsOnRaw,
        publishedNumbersByFile,
      ),
    });
    console.log(
      `Synced existing child ${draft.filePath} (#${draft.githubNumber})`,
    );
    return draft.githubNumber;
  }

  const blockedBy = resolveDependencyNumbers(
    draft.dependsOnRaw,
    publishedNumbersByFile,
  );
  const number = createIssue({
    title: draft.title,
    body: buildChildBody({ featureSlug, parentNumber, draft }),
    labels: ['ready-for-agent', draft.priority],
    parent: parentNumber,
    blockedBy,
  });

  writeFileSync(
    draft.filePath,
    upsertMetadataLine(draft.raw, 'GitHub', `#${number}`),
  );
  console.log(
    `Created child issue #${number} from ${path.basename(draft.filePath)}`,
  );
  return number;
}

function syncExistingChildIssue({
  issueNumber,
  parentNumber,
  body,
  title,
  priority,
  blockedBy,
}) {
  editIssue(issueNumber, {
    title,
    body,
    parent: parentNumber,
    addLabels: ['ready-for-agent', priority],
    blockedBy,
  });
}

function createIssue({ title, body, labels, parent, blockedBy = [] }) {
  const args = ['issue', 'create', '--title', title, '--body', body];

  for (const label of labels) {
    args.push('--label', label);
  }

  if (parent) {
    args.push('--parent', String(parent));
  }

  if (blockedBy.length > 0) {
    args.push('--blocked-by', blockedBy.join(','));
  }

  const output = runGh(args);
  const match = output.match(/\/issues\/(\d+)$/);

  if (!match) {
    throw new Error(`Could not parse issue number from gh output: ${output}`);
  }

  return Number(match[1]);
}

function editIssue(
  number,
  { title, body, parent, addLabels = [], blockedBy = [] },
) {
  const args = [
    'issue',
    'edit',
    String(number),
    '--title',
    title,
    '--body',
    body,
  ];

  if (parent) {
    args.push('--parent', String(parent));
  }

  for (const label of addLabels) {
    args.push('--add-label', label);
  }

  for (const blocker of blockedBy) {
    args.push('--add-blocked-by', blocker);
  }

  runGh(args);
}

function runGh(args) {
  return execFileSync('gh', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function ensureWorkflowLabels() {
  const labels = [
    {
      name: 'ready-for-agent',
      color: 'ededed',
      description: 'Fully specified, AFK-ready',
    },
    {
      name: 'in-progress',
      color: 'fbca04',
      description: 'Currently being worked on',
    },
    {
      name: 'awaiting-parent-pr',
      color: '0e8a16',
      description:
        'Implemented on parent branch and waiting for aggregate PR merge',
    },
    {
      name: 'cancelled',
      color: '6e7781',
      description: 'No longer active work; kept for audit trail',
    },
    {
      name: 'hold-pr',
      color: 'b60205',
      description: 'Prevents opening the aggregate parent PR',
    },
    {
      name: 'P0',
      color: 'd73a4a',
      description: 'Highest priority work',
    },
    {
      name: 'P1',
      color: 'fbca04',
      description: 'Default planned priority',
    },
    {
      name: 'P2',
      color: '0e8a16',
      description: 'Lower priority work',
    },
  ];

  for (const label of labels) {
    runGh([
      'label',
      'create',
      label.name,
      '--color',
      label.color,
      '--description',
      label.description,
      '--force',
    ]);
  }
}

function parseChildDraft(filePath) {
  const raw = readFileSync(filePath, 'utf8');
  const meta = parseTopMatter(raw);

  return {
    filePath,
    raw,
    title: parseHeading(raw),
    status: meta.Status,
    githubNumber: parseGitHubNumber(meta.GitHub),
    summary: getSection(raw, 'Summary'),
    acceptanceCriteria: getSection(raw, 'Acceptance criteria'),
    implementationChecklist: getSection(raw, 'Implementation checklist'),
    qualityGates: getSection(raw, 'Quality gates'),
    references: getSection(raw, 'References'),
    priority: meta.Priority ?? 'P1',
    requiredForCurrentParentPr: normalizeYesNo(
      meta['Required for current parent PR'] ?? 'yes',
    ),
    dependsOnRaw: parseBlockedBy(getSection(raw, 'Blocked by')),
  };
}

function buildParentBody({
  featureSlug,
  priority,
  prdMarkdown,
  childSummaryLines,
}) {
  return [
    '## Mode',
    '',
    'parent-managed',
    '',
    '## Priority',
    '',
    priority,
    '',
    '## Feature slug',
    '',
    featureSlug,
    '',
    '## Context',
    '',
    getSection(prdMarkdown, 'Problem') || '_No context captured in PRD._',
    '',
    '## Goal',
    '',
    getSection(prdMarkdown, 'Goal') || '_No goal captured in PRD._',
    '',
    '## Non-goals',
    '',
    getSection(prdMarkdown, 'Out of scope') || '- None recorded',
    '',
    '## Acceptance criteria',
    '',
    getSection(prdMarkdown, 'Acceptance criteria') ||
      '- [ ] No acceptance criteria captured',
    '',
    '## Child issue summary',
    '',
    childSummaryLines.join('\n'),
    '',
    '## PR readiness rule',
    '',
    'Open the parent PR only when every child marked `required-for-current-parent-pr: yes` is complete, quality gates pass, and the parent is not labeled `hold-pr`.',
    '',
    '## References',
    '',
    `- PRD: \`.scratch/${featureSlug}/PRD.md\``,
    '- Domain: `CONTEXT.md`',
  ].join('\n');
}

function buildChildBody({ featureSlug, parentNumber, draft }) {
  const implementationChecklist =
    draft.implementationChecklist ||
    '- [ ] Implement the scoped changes\n- [ ] Verify acceptance criteria\n- [ ] Run quality gates';
  const qualityGates = draft.qualityGates || '- `pnpm check`';
  const references = [
    `- Parent: #${parentNumber}`,
    `- PRD: \`.scratch/${featureSlug}/PRD.md\``,
  ];

  if (draft.references) {
    references.push(draft.references);
  }

  return [
    '## Mode',
    '',
    'parent-managed-child',
    '',
    '## Parent',
    '',
    `#${parentNumber}`,
    '',
    '## Priority',
    '',
    draft.priority,
    '',
    '## Depends on',
    '',
    formatDependsOnSection(draft.dependsOnRaw),
    '',
    '## Required for current parent PR',
    '',
    draft.requiredForCurrentParentPr,
    '',
    '## What to build',
    '',
    draft.summary || '_No summary captured in scratch draft._',
    '',
    '## Acceptance criteria',
    '',
    draft.acceptanceCriteria || '- [ ] No acceptance criteria captured',
    '',
    '## Implementation checklist',
    '',
    implementationChecklist,
    '',
    '## Quality gates',
    '',
    qualityGates,
    '',
    '## References',
    '',
    references.join('\n'),
  ].join('\n');
}

function parseTopMatter(markdown) {
  const meta = {};

  for (const line of markdown.split('\n')) {
    const match = line.match(/^([A-Za-z][A-Za-z0-9 -]+):\s*(.*)$/);
    if (!match) {
      continue;
    }

    meta[match[1].trim()] = match[2].trim();
  }

  return meta;
}

function getSection(markdown, heading) {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(
    `^## ${escapedHeading}\\s*\\n([\\s\\S]*?)(?=^## |\\Z)`,
    'm',
  );
  const match = markdown.match(regex);
  return match ? match[1].trim() : '';
}

function parseHeading(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  if (!match) {
    throw new Error('Expected a top-level heading');
  }
  return match[1].trim();
}

function parsePrdTitle(markdown) {
  return parseHeading(markdown)
    .replace(/^PRD:\s*/i, '')
    .trim();
}

function parseGitHubNumber(value) {
  if (!value) {
    return null;
  }

  const match = value.match(/#(\d+)/);
  return match ? Number(match[1]) : null;
}

function parseBlockedBy(section) {
  if (!section) {
    return [];
  }

  return section
    .split('\n')
    .map((line) => line.replace(/^-\s*/, '').trim())
    .filter(Boolean)
    .filter((line) => !/^none\b/i.test(line));
}

function resolveDependencyNumbers(dependsOnRaw, publishedNumbersByFile) {
  return dependsOnRaw.map((entry) => {
    const issueMatch = entry.match(/#(\d+)/);
    if (issueMatch) {
      return issueMatch[1];
    }

    const fileMatch = entry.match(/([A-Za-z0-9._-]+\.md)\b/);
    if (fileMatch) {
      const number = publishedNumbersByFile.get(fileMatch[1]);
      if (!number) {
        throw new Error(
          `Dependency ${entry} has not been published yet. Publish blockers first.`,
        );
      }
      return String(number);
    }

    throw new Error(`Unsupported dependency reference: ${entry}`);
  });
}

function resolveDependencySummary(dependsOnRaw, publishedNumbersByFile) {
  const resolved = dependsOnRaw.map((entry) => {
    const issueMatch = entry.match(/#(\d+)/);
    if (issueMatch) {
      return `#${issueMatch[1]}`;
    }

    const fileMatch = entry.match(/([A-Za-z0-9._-]+\.md)\b/);
    if (fileMatch) {
      const number = publishedNumbersByFile.get(fileMatch[1]);
      if (number) {
        return `#${number}`;
      }
    }

    return entry;
  });

  return resolved.length > 0 ? resolved.join(', ') : 'none';
}

function formatDependsOnSection(dependsOnRaw) {
  return dependsOnRaw.length > 0
    ? dependsOnRaw.map((entry) => `- ${entry}`).join('\n')
    : 'None';
}

function formatChildSummaryLine({
  number,
  title,
  priority,
  dependsOn,
  requiredForCurrentParentPr,
  state,
}) {
  return `- [ ] #${number} | title: ${title} | priority: ${priority} | depends-on: ${dependsOn} | required-for-current-parent-pr: ${requiredForCurrentParentPr} | state: ${state}`;
}

function normalizeYesNo(value) {
  return value.trim().toLowerCase() === 'no' ? 'no' : 'yes';
}

function listIssuePaths(directoryPath) {
  return readdirSync(directoryPath)
    .map((entry) => path.join(directoryPath, entry))
    .filter((entryPath) => statSync(entryPath).isFile())
    .sort();
}

function upsertMetadataLine(markdown, key, value) {
  const regex = new RegExp(`^${escapeRegExp(key)}:\\s*.*$`, 'm');
  if (regex.test(markdown)) {
    return markdown.replace(regex, `${key}: ${value}`);
  }

  const headingMatch = markdown.match(/^(# .+\n)/);
  if (!headingMatch) {
    throw new Error(`Could not insert ${key}: missing top-level heading`);
  }

  return markdown.replace(
    headingMatch[1],
    `${headingMatch[1]}\n${key}: ${value}\n`,
  );
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function assertPathExists(filePath, message) {
  if (!existsSync(filePath)) {
    console.error(message);
    process.exit(1);
  }
}
