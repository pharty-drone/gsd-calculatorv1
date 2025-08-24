import React from 'react';
import useDarkMode from '../hooks/useDarkMode';

export default function DarkModeToggle() {
  const [enabled, setEnabled] = useDarkMode();
  return (
    <button
      className="p-2 rounded bg-primary text-white"
      onClick={() => setEnabled(!enabled)}
    >
      {enabled ? 'Light' : 'Dark'}
    </button>
  );
}
