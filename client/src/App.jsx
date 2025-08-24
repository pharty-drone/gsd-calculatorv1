import React from 'react';
import Sidebar from './components/Sidebar';
import DarkModeToggle from './components/DarkModeToggle';
import Calculator from './pages/Calculator';

export default function App() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 p-4">
        <div className="flex justify-end mb-4">
          <DarkModeToggle />
        </div>
        <Calculator />
      </div>
    </div>
  );
}
