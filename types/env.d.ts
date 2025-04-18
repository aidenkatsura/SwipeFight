declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_API_URL: string;
      EXPO_PUBLIC_API_KEY: string;
    }
  }
}

// Ensure this file is treated as a module
export {};