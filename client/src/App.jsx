import React from "react";
import Calculator from "./pages/Calculator";
import "./styles/index.css";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
      {/* Hero */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <span>✈️</span> Drone Mapping GSD Calculator
          </h1>
          <p className="mt-2 opacity-90">
            Professional tool for calculating ground sampling distance and coverage for drone mapping projects
          </p>
        </div>
      </header>

      {/* Toolbar */}
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <div className="flex items-center gap-3 justify-between">
          <button className="px-3 py-2 rounded-lg border border-slate-300/70 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
            Help &amp; FAQ
          </button>
          <button
            className="px-3 py-2 rounded-lg border border-slate-300/70 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => {
              document.documentElement.classList.toggle("dark");
              localStorage.theme = document.documentElement.classList.contains("dark") ? "dark" : "light";
            }}
          >
            🌙 Dark Mode
          </button>
        </div>
      </div>

      {/* Body */}
      <main className="mx-auto max-w-6xl px-4 py-6">
        <Calculator />
      </main>

      <footer className="mx-auto max-w-6xl px-4 pb-8 text-sm text-slate-500">
        <p>Note: This calculation assumes flat terrain. Variations in elevation will affect actual GSD.</p>
      </footer>
    </div>
  );
}
