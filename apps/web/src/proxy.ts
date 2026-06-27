import { NextRequest, NextResponse } from 'next/server';

/** Public dashboard shell for MP-003 — auth protection added in MP-004. */
export default function proxy(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)'
  ]
};
