/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_ALPHA_VANTAGE_API_KEY?: string
  readonly VITE_ENV?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
