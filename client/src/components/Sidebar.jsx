import React, { useState } from 'react';
import AdvancedSettings from './AdvancedSettings';

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        className="p-2"
        onClick={() => setOpen(!open)}
        aria-label="Toggle advanced settings"
      >
        ☰
      </button>
      {open && (
        <div className="absolute left-0 top-0 w-64 h-screen bg-gray-100 dark:bg-gray-800 p-4 shadow">
          <AdvancedSettings />
        </div>
      )}
    </div>
  );
}
