import { useCallback, useState } from 'react';

export default function useOnClickOutside(ref, initialIsVisible, disabled, callback) {
  const [clickedOutside, setClickedOutside] = useState(initialIsVisible);
  const handleClickOutside = useCallback((e) => {
    if (disabled) {
      return;
    }
    const mediaEl = document.getElementById('media-lib');
    if (!ref.current.contains(e.target)) {
      if (mediaEl && mediaEl.contains(e.target)) {
        return;
      }
      if (callback) {
        callback();
      }
      setClickedOutside(true);
    }

  }, [callback, disabled, ref]);

  const addEventListener = () => document.addEventListener('mousedown', handleClickOutside);
  const removeEventListener = () => document.removeEventListener('mousedown', handleClickOutside);

  return { clickedOutside, setClickedOutside, addEventListener, removeEventListener };
}