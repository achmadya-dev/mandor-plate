'use client';

import type { RoleName } from '@mandor-plate/shared';
import { useEffect, useState } from 'react';
import { useAppForm, useFormFields } from '@/components/ui/tanstack-form';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Icons } from '@/components/icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createUserMutation, updateUserMutation } from '../api/mutations';
import { userKeys } from '../api/queries';
import type { User } from '../api/types';
import { toast } from 'sonner';
import * as z from 'zod';
import type { UserMutationPayload } from '../api/types';
import { userSchema, type UserFormValues } from '../schemas/user';
import { ROLE_OPTIONS } from './users-table/options';

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
];

interface UserFormSheetProps {
  user?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserFormSheet({
  user,
  open,
  onOpenChange,
}: UserFormSheetProps) {
  const isEdit = !!user;
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    ...createUserMutation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success('User created successfully');
      onOpenChange(false);
      form.reset();
    },
    onError: () => toast.error('Failed to create user'),
  });

  const updateMutation = useMutation({
    ...updateUserMutation,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success('User updated successfully');
      onOpenChange(false);
    },
    onError: () => toast.error('Failed to update user'),
  });

  const form = useAppForm({
    defaultValues: {
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      password: '',
      role: (user?.role ?? 'user') as RoleName,
      status: user?.status ?? 'active',
    } as UserFormValues,
    validators: {
      onSubmit: userSchema,
    },
    onSubmit: async ({ value }) => {
      if (!isEdit && !value.password) {
        toast.error('Password is required');
        return;
      }

      const payload = value as UserMutationPayload;
      if (isEdit) {
        await updateMutation.mutateAsync({ id: user.id, values: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
    },
  });

  useEffect(() => {
    if (!open) return;

    form.reset({
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      password: '',
      role: (user?.role ?? 'user') as RoleName,
      status: user?.status ?? 'active',
    });
  }, [open, user, form]);

  const { FormTextField, FormSelectField } = useFormFields<UserFormValues>();

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>{isEdit ? 'Edit User' : 'New User'}</SheetTitle>
          <SheetDescription>
            {isEdit
              ? 'Update the user details below.'
              : 'Fill in the details to create a new user.'}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-auto">
          <form.AppForm>
            <form.Form id="user-form-sheet" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormTextField
                  name="firstName"
                  label="First Name"
                  required
                  placeholder="John"
                  validators={{
                    onBlur: z
                      .string()
                      .min(2, 'First name must be at least 2 characters'),
                  }}
                />
                <FormTextField
                  name="lastName"
                  label="Last Name"
                  required
                  placeholder="Doe"
                  validators={{
                    onBlur: z
                      .string()
                      .min(2, 'Last name must be at least 2 characters'),
                  }}
                />
              </div>

              <FormTextField
                name="email"
                label="Email"
                required
                type="email"
                placeholder="john@example.com"
                validators={{
                  onBlur: z.string().email('Please enter a valid email'),
                }}
              />

              <FormTextField
                name="password"
                label={isEdit ? 'New Password' : 'Password'}
                required={!isEdit}
                type="password"
                placeholder={
                  isEdit
                    ? 'Leave blank to keep current password'
                    : 'Minimum 6 characters'
                }
                validators={{
                  onBlur: isEdit
                    ? z.string().optional()
                    : z
                        .string()
                        .min(6, 'Password must be at least 6 characters'),
                }}
              />

              <FormSelectField
                name="role"
                label="Role"
                required
                options={ROLE_OPTIONS}
                placeholder="Select role"
                validators={{
                  onBlur: z.enum(['admin', 'user']),
                }}
              />

              <FormSelectField
                name="status"
                label="Status"
                required
                options={STATUS_OPTIONS}
                placeholder="Select status"
                validators={{
                  onBlur: z.enum(['active', 'inactive']),
                }}
              />
            </form.Form>
          </form.AppForm>
        </div>

        <SheetFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" form="user-form-sheet" isLoading={isPending}>
            <Icons.check /> {isEdit ? 'Update User' : 'Create User'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function UserFormSheetTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Icons.add className="mr-2 h-4 w-4" /> Add User
      </Button>
      <UserFormSheet open={open} onOpenChange={setOpen} />
    </>
  );
}
