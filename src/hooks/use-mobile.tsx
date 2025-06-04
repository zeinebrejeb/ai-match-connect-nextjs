// ai-match-connect-nextjs\src\hooks\use-mobile.tsx
"use client"; // Correct directive for a client hook

import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize state as undefined, then set on mount
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Ensure window is available (though "use client" handles this, defensive check is okay)
    if (typeof window === 'undefined') {
        setIsMobile(false); // Default to false if window not available (SSR)
        return;
    }

    // Use matchMedia for responsive checks
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Add and remove listener for changes
    mql.addEventListener("change", onChange)

    // Set initial state
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Clean up listener
    return () => mql.removeEventListener("change", onChange)
  }, []) // Empty dependency array means this runs once on mount and cleans up on unmount

  // Return boolean; !! converts undefined/null/boolean to boolean
  return !!isMobile
}