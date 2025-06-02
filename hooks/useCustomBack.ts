import { useRouter } from 'expo-router';

/**
 * Custom back navigation hook. Handles the case where `router.back()` is not able to navigate back
 * to the previous screen (e.g., when a window is refreshed from a deeply nested route, it loses
 * the nav history).
 * 
 * @param fallbackPath route to navigate to if no route history is available
 */
export function useCustomBack(
  fallbackPath: '/(tabs)' | '/(auth)/login' | '/(auth)/account-setup' = '/(tabs)'
) {
  const router = useRouter();

  return () => {
    // Try router.back() if possible
    if (router.canGoBack?.()) {
      router.back();
    } else if (
      typeof window !== 'undefined' &&
      window.history.length > 1 &&
      document.referrer &&
      document.referrer.startsWith(window.location.origin)
    ) {
      // Only use browser back if referrer is from this app 
      window.history.back();
    } else {
      // Otherwise, go to fallback (tabs or login)
      router.replace(fallbackPath);
    }
  };
}