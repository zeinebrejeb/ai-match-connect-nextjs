
let navigateCallback: ((path: string) => void) | null = null;
export const setNavigateCallback = (callback: (path: string) => void) => {
  navigateCallback = callback;
};

export const navigate = (path: string) => {
  if (navigateCallback) {
    navigateCallback(path);
  } else {
    console.warn("Navigate callback not set. Falling back to window.location.href for path:", path);
    if (typeof window !== 'undefined') {
      window.location.href = path;
    }
  }
};