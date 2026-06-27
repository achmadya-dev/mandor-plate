/** Use same-origin file URLs so avatar images load through the Next.js rewrite. */
export function normalizeAvatarSrc(path: string | null | undefined): string {
  if (!path) {
    return '';
  }

  if (path.startsWith('/')) {
    return path;
  }

  try {
    return new URL(path).pathname;
  } catch {
    return '';
  }
}
