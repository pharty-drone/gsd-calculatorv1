import { useEffect } from 'react';

export default function Hardening() {
  useEffect(() => {
    if (!import.meta.env.PROD) return undefined;

    const preventContextMenu = (e) => {
      e.preventDefault();
    };
    const blockDevTools = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && ['I', 'J'].includes(e.key)) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', preventContextMenu, { passive: false });
    document.addEventListener('keydown', blockDevTools, { passive: false });

    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', blockDevTools);
    };
  }, []);

  return null;
}
