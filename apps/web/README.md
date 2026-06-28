# Mandor Plate Web

Next.js 16 dashboard + BFF. Monorepo quickstart: [README.md](../../README.md). Domain vocabulary: [CONTEXT.md](../../CONTEXT.md).

## Conventions

- **Auth** — JWT via BFF httpOnly cookies (`src/lib/auth/`)
- **Data** — TanStack Query: server `prefetchQuery` + client `useSuspenseQuery`, `HydrationBoundary`
- **URL state** — nuqs (`searchParamsCache` server, `useQueryStates` client)
- **Icons** — only `@/components/icons`, never `@tabler/icons-react` directly
- **Forms** — `useAppForm` + `useFormFields<T>()` from `@/components/ui/tanstack-form`
- **Headers** — `PageContainer` props, not manual `<Heading>`

---

## Forms (TanStack Form + shadcn)

Type-safe forms built on [TanStack Form](https://tanstack.com/form) with composed field components.

### Architecture

```
form-context.tsx  ←  fields/*.tsx
       ▲                 │
       └── tanstack-form.tsx (useAppForm, useFormFields, Form, SubmitButton)
```

| File                                  | Role                                                      |
| ------------------------------------- | --------------------------------------------------------- |
| `src/components/ui/form-context.tsx`  | Contexts, `FormField`, `FormErrors`, `scrollToFirstError` |
| `src/components/ui/tanstack-form.tsx` | `useAppForm`, `useFormFields`, `Form`, `SubmitButton`     |
| `src/components/forms/fields/`        | 8 field types (base + `Form*` composed variants)          |

### Feature layout

```
src/features/<name>/
├── schemas/<name>.ts       # Zod schema + z.infer type (shared with API)
├── constants/<name>-options.ts
└── components/<name>-form.tsx
```

Reuse the same Zod schema in BFF/API routes — single validation contract with `packages/shared` where applicable.

### Quick start

```tsx
'use client';

import { useAppForm, useFormFields } from '@/components/ui/tanstack-form';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
});

type FormValues = z.infer<typeof schema>;

export default function MyForm() {
  const form = useAppForm({
    defaultValues: { name: '', email: '' } as FormValues,
    validators: { onSubmit: schema },
    onSubmit: ({ value }) => console.log(value),
  });

  const { FormTextField } = useFormFields<FormValues>();

  return (
    <form.AppForm>
      <form.Form>
        <FormTextField
          name="name"
          label="Name"
          required
          validators={{ onBlur: z.string().min(2, 'Name is required') }}
        />
        <FormTextField
          name="email"
          label="Email"
          required
          type="email"
          validators={{ onBlur: z.string().email('Invalid email') }}
        />
        <form.SubmitButton label="Save" />
      </form.Form>
    </form.AppForm>
  );
}
```

### Patterns

| Scenario                         | Approach                                             |
| -------------------------------- | ---------------------------------------------------- |
| Standard fields                  | `useFormFields<T>()` — type-safe names (recommended) |
| Custom fields (date picker, OTP) | `form.AppField` render prop                          |
| Dynamic / prototype field names  | Direct `FormTextField` import (no type safety)       |
| Multi-step                       | `form.AppField` + `StepButton`                       |
| Large forms (15+ fields)         | Split into section components                        |

### Field components

| Composed              | Input                                   |
| --------------------- | --------------------------------------- |
| `FormTextField`       | text, email, password, tel, url, number |
| `FormTextareaField`   | multi-line                              |
| `FormSelectField`     | dropdown (`options`)                    |
| `FormCheckboxField`   | boolean                                 |
| `FormSwitchField`     | toggle                                  |
| `FormRadioGroupField` | radio group                             |
| `FormSliderField`     | range                                   |
| `FormFileUploadField` | drag-and-drop upload                    |

### Validation

- **onBlur** (field) — format/required feedback
- **onChangeAsync** (field) — debounced server checks
- **onSubmit** (form) — Zod schema catch-all via `validators: { onSubmit: schema }`

Use `FormErrors` and `scrollToFirstError` for form-level errors.

### Examples in codebase

- `src/features/products/components/product-form.tsx`
- `src/features/auth/components/user-auth-form.tsx`
- `src/features/forms/components/sheet-product-form.tsx`

---

## Themes

CSS custom properties with `[data-theme]` selectors. Tokens use OKLCH.

### Add a theme

1. Create `src/styles/themes/<name>.css` with `[data-theme='<name>']` (light + `.dark` variant)
2. `@import` in `src/styles/theme.css`
3. Register in `src/components/themes/theme.config.ts` (`THEMES` array)
4. Optional fonts in `src/components/themes/font.config.ts`
5. Optional default: `DEFAULT_THEME` in `src/components/themes/active-theme.tsx`

### Reference files

| File                                       | Purpose                |
| ------------------------------------------ | ---------------------- |
| `src/styles/themes/claude.css`             | Complete theme example |
| `src/styles/theme.css`                     | Theme aggregator       |
| `src/components/themes/theme-selector.tsx` | Switcher UI            |
| `src/components/themes/active-theme.tsx`   | Provider + default     |
| `src/components/themes/theme.config.ts`    | Registered themes      |
| `src/components/themes/font.config.ts`     | Google font variables  |
