# Domain: Auth & User

Design reference for the **Auth** and **User** bounded contexts in Mandor Plate. Implements [PRD.md](../../PRD.md) shared-package requirements (MP-002).

## How this file relates to other docs

| Document | Purpose |
|---|---|
| [CONTEXT.md](../../CONTEXT.md) | Ubiquitous language glossary — terms only, no implementation |
| **docs/agents/domain.md** (this file) | Domain design for agents: language rules, schema contracts, API alignment |
| [docs/adr/](../adr/) | Irreversible architectural decisions (create only when trade-off is hard to reverse) |
| [packages/shared/](../../packages/shared/) | Implementation of the Zod schemas defined here |

When a term is resolved during design, update `CONTEXT.md`. When a schema shape is finalized, update this file and `packages/shared`.

### CONTEXT.md conventions

- Lives at the repo root; agents read it before coding
- Contains **ubiquitous language only** — no implementation detail, no file paths beyond pointers
- Table format for terms; keep entries short
- Link to this file (`domain.md`) for schema shapes and API alignment
- Update when introducing new domain terms or renaming existing ones

### ADR conventions

- Store irreversible decisions in `docs/adr/NNN-short-title.md` (e.g. `001-jwt-cookies-bff.md`)
- Create an ADR when a decision is costly to reverse (auth model, role model, validation strategy)
- Reference ADRs from this file and from `CONTEXT.md` → Decisions section
- See **ADR candidates** below for triggers that should prompt an ADR after implementation

## Ubiquitous language

Terms below are canonical for Auth and User. Use them consistently in schemas, UI copy, issues, and agent prompts.

### Auth context

**Credential**
Email address and password submitted together to prove identity.
_Avoid_: login details, auth payload, username/password (unless UI label)

**Session**
The authenticated state established after a successful login or registration. In Mandor Plate, a session is represented by JWT access and refresh tokens; the web app stores them in httpOnly cookies via the BFF.
_Avoid_: cookie, JWT (when describing user-visible state)

**Access token**
Short-lived JWT issued by the API (`token` field in API responses). Sent as `Authorization: Bearer` on protected API calls.
_Avoid_: token (ambiguous — always qualify access vs refresh)

**Refresh token**
Long-lived JWT used to obtain a new access token without re-entering credentials. Rotated by the API on each refresh.
_Avoid_: session token, remember-me token

**Identity provider**
The mechanism that verified the user: `email`, `google`, `facebook`, or `apple`. Stored on the User as `provider`.
_Avoid_: auth method, login type, OAuth provider (prefer identity provider in code)

**Password reset hash**
Opaque single-use token sent by email for forgot-password flow. Submitted as `hash` (not `token`) to the reset endpoint.
_Avoid_: reset token, reset link token

**Email confirmation hash**
Opaque single-use token sent by email to confirm a newly registered address. Submitted as `hash` to the confirm endpoint.
_Avoid_: verification token, confirm token

### User context

**User**
A person with an account in the system. Identified by numeric `id` (PostgreSQL / TypeORM).
_Avoid_: account, member, customer

**Role**
Authorization level attached to a User. Mandor Plate exposes two roles: `admin` and `user`. The API returns role as an object `{ id, name }`; the web app filters navigation by `role.name`.
_Avoid_: permission, Clerk role, organization role

**Status**
Account lifecycle state (e.g. `active`, `inactive`). Distinct from Role — status controls whether the account can authenticate; role controls what an authenticated user may see.
_Avoid_: state, account status

**Profile**
Public-facing user attributes: name, email, photo. Updated via the auth update endpoint or profile UI.
_Avoid_: account settings (when meaning only name/email/photo)

**Photo**
User avatar file reference. API returns `{ id, path }` where `path` is a URL or path resolved by the file driver.
_Avoid_: avatar (acceptable in UI copy; use Photo in schemas and API docs)

---

## Design decisions

### 1. Shared package is the validation contract boundary

Zod schemas in `packages/shared` are the single source of truth for:

- Web form input validation (TanStack Form + Zod)
- BFF route handler request parsing
- Optional API-side validation (NestJS may keep class-validator DTOs; shared schemas document the canonical shape)

Request schemas validate **incoming** data. Response schemas validate **outgoing** API payloads before the web app consumes them.

### 2. Align field names with the NestJS API, not generic REST conventions

The upstream brocoders boilerplate uses specific names that differ from common conventions:

| Concept | API field name | Do not use |
|---|---|---|
| Access token | `token` | `accessToken` |
| Refresh token | `refreshToken` | `refresh_token` |
| Token expiry (unix ms) | `tokenExpires` | `expiresAt`, `exp` |
| Password reset token | `hash` | `token`, `resetToken` |
| Google OAuth payload | `idToken` | `code`, `accessToken` |

Shared response schemas must use API field names so parsing does not require ad-hoc mapping layers.

### 3. Roles are identified by name in the web app, by object in API responses

The API `RoleEnum` uses numeric ids (`admin = 1`, `user = 2`). The web app RBAC navigation filters on **`role.name`** (`'admin' | 'user'`). Shared schemas model the API shape (object with id + name) and export a `RoleName` string enum for frontend guards.

### 4. User id is always a number

Mandor Plate uses TypeORM + PostgreSQL only. User `id` is `number`, not `string | number`.

### 5. Email normalization is part of validation

All email fields apply `.trim().toLowerCase()` in a Zod transform before validation, matching the upstream `lowerCaseTransformer`.

### 6. Password rules match the upstream boilerplate

Minimum length **6** characters. No additional complexity rules at boilerplate stage.

### 7. Schemas are grouped by domain, not by consumer

```
packages/shared/src/
├── auth/
│   ├── requests.ts      # login, register, forgot, reset, confirm, google
│   ├── responses.ts     # login, refresh
│   └── index.ts
├── user/
│   ├── role.ts          # RoleName, Role, Status
│   ├── profile.ts       # User, Photo, AuthUpdate
│   └── index.ts
├── common/
│   ├── email.ts         # reusable email schema
│   ├── password.ts      # reusable password schema
│   └── index.ts
└── index.ts             # public exports
```

### 8. BFF does not define separate request shapes for auth

Login, register, forgot-password, and reset-password forms submit the same payloads the API expects. BFF route handlers parse with the same request schemas as the forms.

---

## Schema catalog

### Common primitives

```typescript
import { z } from 'zod';

/** Normalized email: trim + lowercase. */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.string().email());

/** Password with upstream minimum length. */
export const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

/** Non-empty display name part. */
export const namePartSchema = z.string().trim().min(1, 'Required');
```

---

### Auth — request schemas

#### `emailLoginRequestSchema`

Used by: login form, BFF login route, API `POST /auth/email/login`

```typescript
export const emailLoginRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type EmailLoginRequest = z.infer<typeof emailLoginRequestSchema>;
```

| Field | Type | Rules |
|---|---|---|
| `email` | string | normalized email |
| `password` | string | min 6 |

---

#### `registerRequestSchema`

Used by: registration form, BFF register route, API `POST /auth/email/register`

```typescript
export const registerRequestSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: namePartSchema,
  lastName: namePartSchema,
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;
```

| Field | Type | Rules |
|---|---|---|
| `email` | string | normalized email |
| `password` | string | min 6 |
| `firstName` | string | trim, min 1 |
| `lastName` | string | trim, min 1 |

---

#### `forgotPasswordRequestSchema`

Used by: forgot-password form, BFF route, API `POST /auth/forgot/password`

```typescript
export const forgotPasswordRequestSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;
```

---

#### `resetPasswordRequestSchema`

Used by: reset-password form, BFF route, API `POST /auth/reset/password`

The reset token from the email link is submitted as **`hash`**, matching the API.

```typescript
export const resetPasswordRequestSchema = z.object({
  password: passwordSchema,
  hash: z.string().trim().min(1, 'Reset hash is required'),
});

export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;
```

---

#### `confirmEmailRequestSchema`

Used by: email confirmation page, BFF route, API `POST /auth/email/confirm`

Included for completeness — upstream boilerplate sends confirmation emails on registration when configured.

```typescript
export const confirmEmailRequestSchema = z.object({
  hash: z.string().trim().min(1, 'Confirmation hash is required'),
});

export type ConfirmEmailRequest = z.infer<typeof confirmEmailRequestSchema>;
```

---

#### `googleLoginRequestSchema`

Used by: Google sign-in button, BFF route, API `POST /auth/google/login`

```typescript
export const googleLoginRequestSchema = z.object({
  idToken: z.string().trim().min(1, 'Google ID token is required'),
});

export type GoogleLoginRequest = z.infer<typeof googleLoginRequestSchema>;
```

---

#### `authUpdateRequestSchema`

Used by: profile/settings form, API `PATCH /auth/me`

All fields optional — only submitted fields are updated. Changing password requires `oldPassword` when `password` is present.

```typescript
export const authUpdateRequestSchema = z
  .object({
    firstName: namePartSchema.optional(),
    lastName: namePartSchema.optional(),
    email: emailSchema.optional(),
    password: passwordSchema.optional(),
    oldPassword: z.string().min(1).optional(),
    photo: z
      .object({
        id: z.string().uuid(),
      })
      .nullable()
      .optional(),
  })
  .refine(
    (data) => !data.password || data.oldPassword,
    { message: 'Current password is required to set a new password', path: ['oldPassword'] },
  );

export type AuthUpdateRequest = z.infer<typeof authUpdateRequestSchema>;
```

---

### Auth — response schemas

#### `tokenPairSchema`

Core JWT payload returned by login and refresh.

```typescript
export const tokenPairSchema = z.object({
  token: z.string().min(1),
  refreshToken: z.string().min(1),
  tokenExpires: z.number().int().positive(),
});

export type TokenPair = z.infer<typeof tokenPairSchema>;
```

---

#### `loginResponseSchema`

Used by: BFF after successful login/register/social auth, API login response parser

```typescript
export const loginResponseSchema = tokenPairSchema.extend({
  user: z.lazy(() => userSchema),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
```

---

#### `refreshResponseSchema`

Used by: BFF refresh route, API `POST /auth/refresh`

```typescript
export const refreshResponseSchema = tokenPairSchema;

export type RefreshResponse = z.infer<typeof refreshResponseSchema>;
```

---

### User — domain schemas

#### `roleNameSchema`

String enum for web RBAC navigation. Values match API `Role.name`.

```typescript
export const roleNameSchema = z.enum(['admin', 'user']);

export type RoleName = z.infer<typeof roleNameSchema>;
```

---

#### `roleSchema`

API role object as returned on User.

```typescript
export const roleSchema = z.object({
  id: z.number().int().positive(),
  name: roleNameSchema,
});

export type Role = z.infer<typeof roleSchema>;
```

---

#### `statusSchema`

Account lifecycle status from API.

```typescript
export const statusSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
});

export type Status = z.infer<typeof statusSchema>;
```

---

#### `photoSchema`

Avatar file reference from API.

```typescript
export const photoSchema = z.object({
  id: z.string().uuid(),
  path: z.string().url().or(z.string().startsWith('/')),
});

export type Photo = z.infer<typeof photoSchema>;
```

`path` accepts absolute URLs (S3, presigned) or relative paths (local driver prefixed by BFF or API).

---

#### `userSchema`

Authenticated user as returned in login response and `GET /auth/me`. Excludes `password`.

```typescript
export const userSchema = z.object({
  id: z.number().int().positive(),
  email: z.string().email().nullable(),
  provider: z.string(),
  socialId: z.string().nullable().optional(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  photo: photoSchema.nullable().optional(),
  role: roleSchema.nullable().optional(),
  status: statusSchema.optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable().optional(),
});

export type User = z.infer<typeof userSchema>;
```

---

#### `sessionUserSchema`

Minimal user shape for middleware and RBAC nav — derived from `userSchema`.

```typescript
export const sessionUserSchema = userSchema.pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  photo: true,
  role: true,
});

export type SessionUser = z.infer<typeof sessionUserSchema>;
```

---

## API contract mapping

| Shared schema | HTTP method | API endpoint | Web consumer |
|---|---|---|---|
| `emailLoginRequestSchema` | POST | `/api/v1/auth/email/login` | Login page |
| `registerRequestSchema` | POST | `/api/v1/auth/email/register` | Register page |
| `forgotPasswordRequestSchema` | POST | `/api/v1/auth/forgot/password` | Forgot-password page |
| `resetPasswordRequestSchema` | POST | `/api/v1/auth/reset/password` | Reset-password page |
| `confirmEmailRequestSchema` | POST | `/api/v1/auth/email/confirm` | Confirm-email page |
| `googleLoginRequestSchema` | POST | `/api/v1/auth/google/login` | Login page (Google button) |
| `authUpdateRequestSchema` | PATCH | `/api/v1/auth/me` | Profile/settings page |
| `loginResponseSchema` | — | login, register, social login responses | BFF sets cookies |
| `refreshResponseSchema` | POST | `/api/v1/auth/refresh` | BFF refresh route |
| `userSchema` | GET | `/api/v1/auth/me` | Middleware, RBAC nav, profile |

Endpoint paths follow the upstream boilerplate version pinned in MP-001. Adjust prefix if the API global prefix differs.

---

## Public exports

`packages/shared` re-exports all schemas and inferred types from a single entry point:

```typescript
// Auth requests
export {
  emailLoginRequestSchema,
  registerRequestSchema,
  forgotPasswordRequestSchema,
  resetPasswordRequestSchema,
  confirmEmailRequestSchema,
  googleLoginRequestSchema,
  authUpdateRequestSchema,
} from './auth/requests';

export type {
  EmailLoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ConfirmEmailRequest,
  GoogleLoginRequest,
  AuthUpdateRequest,
} from './auth/requests';

// Auth responses
export {
  tokenPairSchema,
  loginResponseSchema,
  refreshResponseSchema,
} from './auth/responses';

export type { TokenPair, LoginResponse, RefreshResponse } from './auth/responses';

// User domain
export {
  roleNameSchema,
  roleSchema,
  statusSchema,
  photoSchema,
  userSchema,
  sessionUserSchema,
} from './user';

export type {
  RoleName,
  Role,
  Status,
  Photo,
  User,
  SessionUser,
} from './user';
```

---

## Test expectations (MP-002)

Unit tests in `packages/shared` assert **external validation behavior**, not Zod internals:

| Schema | Valid input passes | Invalid input rejected |
|---|---|---|
| `emailLoginRequestSchema` | normalized email + password ≥ 6 | missing email, invalid email, short password |
| `registerRequestSchema` | all four fields valid | empty firstName/lastName |
| `forgotPasswordRequestSchema` | valid email | invalid email |
| `resetPasswordRequestSchema` | password + hash | missing hash |
| `googleLoginRequestSchema` | non-empty idToken | empty idToken |
| `authUpdateRequestSchema` | partial update without password | password without oldPassword |
| `loginResponseSchema` | full API-shaped payload | missing `token`, malformed user |
| `userSchema` | user with role `{ id: 1, name: 'admin' }` | negative id, invalid role name |
| `roleNameSchema` | `'admin'`, `'user'` | `'superadmin'`, numeric values |

---

## Out of scope for shared schemas

These belong to other layers — do not add to `packages/shared`:

| Concern | Layer |
|---|---|
| httpOnly cookie names and attributes | Web BFF route handlers |
| JWT signing and verification | API auth module |
| Clerk session types | Removed — not applicable |
| File upload multipart parsing | BFF / API file module |
| Database entity shapes | API TypeORM entities |
| Facebook / Apple login request shapes | Stub until enabled; mirror `googleLoginRequestSchema` pattern when activated |

---

## ADR candidates

No ADR required yet. If any of the following change after implementation, create an ADR:

- Renaming API fields (`token` → `accessToken`) — high migration cost
- Adding role values beyond `admin` / `user` — affects RBAC across web and API
- Switching from class-validator to Zod-only validation on the API — architectural shift
