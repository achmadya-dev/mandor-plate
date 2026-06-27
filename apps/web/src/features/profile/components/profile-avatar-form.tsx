'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileUploader } from '@/components/file-uploader';
import {
  refreshSessionUser,
  uploadAvatarViaBff,
} from '@/lib/auth/profile-client';
import { normalizeAvatarSrc } from '@/lib/auth/avatar-url';
import { sessionUserDisplayName, useSessionUser } from '@/lib/auth/use-session';
import { toast } from 'sonner';

const MAX_SIZE = 5 * 1024 * 1024;

export default function ProfileAvatarForm() {
  const user = useSessionUser();
  const [uploadedPhotoPath, setUploadedPhotoPath] = useState<string | null>(
    null,
  );
  const photoSrc = normalizeAvatarSrc(uploadedPhotoPath ?? user?.photo?.path);

  const handleUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    const result = await uploadAvatarViaBff(file);
    if (result.error) {
      toast.error(result.error);
      throw new Error(result.error);
    }

    if (!result.data) {
      toast.error('Upload failed. Try again.');
      throw new Error('Upload failed');
    }

    setUploadedPhotoPath(result.data.user.photo?.path ?? null);
    refreshSessionUser();
  };

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={photoSrc} alt={sessionUserDisplayName(user)} />
          <AvatarFallback className="text-lg">
            {sessionUserDisplayName(user).slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{sessionUserDisplayName(user)}</p>
          <p className="text-muted-foreground text-sm">{user?.email ?? '—'}</p>
        </div>
      </div>

      <FileUploader
        accept={{ 'image/jpeg': [], 'image/png': [], 'image/gif': [] }}
        maxSize={MAX_SIZE}
        maxFiles={1}
        onUpload={handleUpload}
      />
    </div>
  );
}
