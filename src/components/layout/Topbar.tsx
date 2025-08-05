import React from "react";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 h-16 flex items-center justify-end px-6">
      <div className="flex items-center gap-3">
        <span className="font-semibold">Demo User</span>
        <img
          src="https://api.dicebear.com/7.x/personas/svg?seed=demo"
          alt="avatar"
          className="w-8 h-8 rounded-full border-2 border-primary"
        />
      </div>
    </header>
  );
}
