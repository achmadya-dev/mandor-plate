interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleIdConfiguration {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  error_callback?: (error: { type: string; message?: string }) => void;
}

interface GoogleAccountsId {
  initialize: (config: GoogleIdConfiguration) => void;
  renderButton: (
    parent: HTMLElement,
    options: { theme?: string; size?: string; width?: number; text?: string },
  ) => void;
}

interface GoogleAccounts {
  id: GoogleAccountsId;
}

declare global {
  interface Window {
    google?: { accounts: GoogleAccounts };
  }
}

export {};
