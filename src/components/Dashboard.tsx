"use client";

import React, { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Note from "@/lib/logo";
import { 
  FileText, 
  Upload, 
  Settings, 
  Search, 
  Plus, 
  Sun, 
  Moon, 
  LogOut, 
  Clock, 
  HardDrive, 
  Home
} from "lucide-react";
import Workspace from "./Workspace";

export default function DashboardClient({ 
    session ,
    storageUsed,
    totalNotes,
    totalFiles
}: { 
    session: any;
    storageUsed: number,
    totalFiles: number,
    totalNotes: number
}) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      setIsDark(false);
    } else {
      html.classList.add("dark");
      setIsDark(true);
    }
  };

    const maxStorage = 1 * 1024 * 1024 * 1024; // 1GB

    const percent = Math.min(
    (storageUsed / maxStorage) * 100,
    100
    );

    const roundedPercent = percent.toFixed(3);


  useEffect(()=>{
    console.log(session)
  })

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0a0a0a] text-[#1A1A1A] dark:text-neutral-100 flex transition-colors duration-300">
      
      {/* Sidebar Navigation */}
      <aside className="w-20 md:w-64 border-r border-neutral-100 dark:border-neutral-800 flex flex-col bg-white dark:bg-[#0a0a0a] sticky top-0 h-screen z-20 transition-colors">
        <div className="p-6 flex items-center gap-3">
          <Note className="text-2xl text-neutral-900 dark:text-white" />
          <span className="hidden md:block font-medium tracking-tight">paperless</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem href="/dashboard" icon={<Home size={20} />} label="Home" active />
          <SidebarItem href="/dashboard" icon={<FileText size={20} />} label="Notes"/>
          <SidebarItem href="/upload" icon={<Upload size={20} />} label="Files" />
          <SidebarItem href="/settings" icon={<Settings size={20} />} label="Settings" />
          
          {/* Theme Toggle in Sidebar for Mobile/Cleanliness */}
          <button 
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all group"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span className="hidden md:block text-sm font-medium">{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </nav>

        {/* Added: Storage Meter */}
        <div className="px-6 py-4 hidden md:block">
          <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-2">
            <span>Storage</span>
            <span>{`${roundedPercent}% out of 1GB`}</span>
          </div>
          <div className="h-1.5 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: `${percent}%` }} />
          </div>
        </div>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800">
           <div className="flex items-center justify-between gap-3 px-2 py-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors group relative">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 border rounded-full bg-blue-100 dark:bg-blue-900/30 flex-shrink-0 flex items-center justify-center text-xs font-bold text-blue-600">
                  <img src={session.user?.image} alt="image" 
                  className="rounded-full"
                  />
                </div>
                <div className="hidden md:block overflow-hidden">
                    <p className="font-bold text-indigo-500">{session.user?.name}</p>
                  <p className="text-xs font-medium truncate">{session.user?.email}</p>
                </div>
              </div>
              <button 
                onClick={() => signOut()}
                className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
        <Workspace storageUsed={storageUsed}
                    totalFiles= {totalFiles}
                    totalNotes={totalNotes}
        />
    </div>
  );
}

// Internal Sub-components
function SidebarItem({ href, icon, label, active = false }: any) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${active ? 'bg-neutral-50 dark:bg-neutral-900 text-blue-600 dark:text-blue-400' : 'text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white'}`}>
      {icon}
      <span className="hidden md:block text-sm font-medium">{label}</span>
    </Link>
  );
}



