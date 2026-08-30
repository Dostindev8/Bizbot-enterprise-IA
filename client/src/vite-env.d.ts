/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_API_URL?: string;
  readonly VITE_PUBLIC_SOCKET_URL?: string;
  readonly VITE_PUBLIC_APP_NAME?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
