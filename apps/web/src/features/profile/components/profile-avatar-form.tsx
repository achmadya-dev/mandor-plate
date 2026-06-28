'use client';

import { FileUploader } from '@/components/file-uploader';
import {
  refreshSessionUser,
  uploadAvatarViaBff,
} from '@/lib/auth/profile-client';
import { toast } from 'sonner';

const MAX_SIZE = 5 * 1024 * 1024;

export default function ProfileAvatarForm() {
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

    refreshSessionUser();
  };

  return (
    <FileUploader
      accept={{ 'image/jpeg': [], 'image/png': [], 'image/gif': [] }}
      maxSize={MAX_SIZE}
      maxFiles={1}
      onUpload={handleUpload}
    />
  );
}
