import React from "react";
import { Users, Mail, Settings, LayoutDashboard } from "lucide-react";
import Link from "next/link";

const nav = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Members", href: "/members", icon: Users },
  { label: "Invites", href: "/invites", icon: Mail },
  { label: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="flex flex-col w-64 bg-neutral-950 text-white h-screen shadow-2xl z-10">
      <div className="flex items-center gap-2 h-16 pl-6 border-b border-neutral-800">
        {/* Logo can be replaced with your SVG or img */}
        <span className="font-bold text-xl tracking-tight">FounderHub</span>
      </div>
      <nav className="flex-1 flex flex-col gap-1 px-2 py-4">
        {nav.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-3 rounded-lg px-4 py-2 text-md font-medium transition bg-neutral-900 hover:bg-neutral-800"
          >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
