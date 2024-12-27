'use client';
// PreviousPageTracker.js
import { useEffect } from 'react';

import { usePathname } from 'next/navigation';

export default function PreviousPageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Store in both localStorage and cookie
    localStorage.setItem('previousPage', pathname || '/');
    document.cookie = `previousPage=${pathname || '/'}; path=/; max-age=3600`;
  }, [pathname]);

  return null;
}
