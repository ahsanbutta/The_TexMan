import { useEffect } from 'react';

/**
 * Custom hook to lock document body scrolling when a modal or popup is open.
 * Prevents the background page from scrolling behind active popups on mobile & laptop.
 * 
 * @param {boolean} isLocked - Whether body scroll lock is currently active
 */
export function useBodyScrollLock(isLocked) {
  useEffect(() => {
    if (!isLocked) return;

    // Save original overflow style of body
    const originalOverflow = document.body.style.overflow;

    // Apply scroll lock to body
    document.body.style.overflow = 'hidden';

    return () => {
      // Restore original body overflow style on unlock or unmount
      document.body.style.overflow = originalOverflow;
    };
  }, [isLocked]);
}

export default useBodyScrollLock;
