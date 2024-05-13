/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_FETCH: string;
    // Add other environment variables as needed
  }

  interface ImportMeta {
    env: ImportMetaEnv;
   }