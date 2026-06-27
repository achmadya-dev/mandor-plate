export type MaildevEmail = {
  subject: string;
  text: string;
  html: string;
  to: { address: string }[];
};

const MAILDEV_URL = process.env.MAILDEV_URL ?? 'http://127.0.0.1:1080';

export async function clearMaildev(): Promise<void> {
  await fetch(`${MAILDEV_URL}/email/all`, { method: 'DELETE' });
}

export async function waitForEmail(
  toAddress: string,
  options: { timeoutMs?: number; subjectIncludes?: string } = {},
): Promise<MaildevEmail> {
  const { timeoutMs = 20_000, subjectIncludes } = options;
  const deadline = Date.now() + timeoutMs;
  const normalized = toAddress.toLowerCase();

  while (Date.now() < deadline) {
    const response = await fetch(`${MAILDEV_URL}/email`);
    if (response.ok) {
      const emails = (await response.json()) as MaildevEmail[];
      const match = emails.find((email) => {
        const recipient = email.to[0]?.address.toLowerCase();
        if (recipient !== normalized) return false;
        if (subjectIncludes && !email.subject.includes(subjectIncludes))
          return false;
        return true;
      });
      if (match) return match;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for email to ${toAddress}`);
}

export function extractConfirmEmailHash(text: string): string {
  const match = text.match(/confirm-email\?hash=([^&\s]+)/);
  if (!match?.[1]) {
    throw new Error('Confirm-email hash not found in message body');
  }
  return match[1];
}

export function extractPasswordResetUrl(text: string): string {
  const match = text.match(/(https?:\/\/[^\s]+password-change\?hash=[^\s]+)/);
  if (!match?.[1]) {
    throw new Error('Password reset URL not found in message body');
  }
  return match[1];
}

export async function confirmEmailViaApi(hash: string): Promise<void> {
  const apiBase = process.env.API_URL ?? 'http://127.0.0.1:3001';
  const response = await fetch(`${apiBase}/api/v1/auth/email/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hash }),
  });
  if (!response.ok) {
    throw new Error(`Email confirm failed with status ${response.status}`);
  }
}
