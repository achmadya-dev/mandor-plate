# ADR 001: Session-aware JWT access tokens

## Status

Accepted

## Context

Access tokens were validated by signature and payload shape only. Logout deleted the
database session, but existing access tokens remained valid until expiry. Role changes
also stayed stale until token refresh.

## Decision

`JwtStrategy.validate` now checks that:

1. The session referenced by `sessionId` still exists.
2. The user referenced by `id` still exists.
3. The role on the request context is refreshed from the database.

Refresh tokens already rotated session hashes; this closes the gap for access tokens.

## Consequences

- Logout and session deletion invalidate access tokens immediately.
- Role changes take effect on the next authenticated request.
- Each authenticated request performs two database reads (session + user).
- Clients must handle `401` by refreshing or signing in again.

## Alternatives considered

- Shorter access-token TTL only — simpler, but logout would still leave a window.
- Token blocklist — stronger revocation, but adds storage and lookup on every request.
