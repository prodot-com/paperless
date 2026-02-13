import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import Note from "@/lib/logo"; // Using your custom logo component
import { FileText, Upload, Settings, Search, Plus } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-[#0a0a0a] text-[#1A1A1A] dark:text-neutral-100 flex transition-colors duration-300">
      
      {/* Sidebar Navigation */}
      <aside className="w-20 md:w-64 border-r border-neutral-100 dark:border-neutral-800 flex flex-col bg-white dark:bg-[#0a0a0a] sticky top-0 h-screen z-20">
        <div className="p-6 flex items-center gap-3">
          <Note className="text-2xl" />
          <span className="hidden md:block font-medium tracking-tight">paperless</span>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem href="/dashboard" icon={<FileText size={20} />} label="Notes" active />
          <SidebarItem href="/upload" icon={<Upload size={20} />} label="Files" />
          <SidebarItem href="/settings" icon={<Settings size={20} />} label="Settings" />
        </nav>

        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800">
           <div className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600">
                {session.user.email?.[0].toUpperCase()}
              </div>
              <div className="hidden md:block overflow-hidden">
                <p className="text-xs font-medium truncate">{session.user.email}</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="dots-dash" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dots-dash)" />
          </svg>
        </div>

        <div className="relative z-10 p-8 md:p-12 max-w-5xl">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-light tracking-tight italic font-serif">Workspace</h1>
              <p className="text-neutral-500 dark:text-neutral-400 mt-2 font-light">
                Welcome back. You have <span className="text-[#1A1A1A] dark:text-white font-medium underline decoration-blue-500/30">12 notes</span> active today.
              </p>
            </div>
            
            <button className="bg-[#1A1A1A] dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-lg shadow-neutral-200 dark:shadow-none">
              <Plus size={18} />
              New Entry
            </button>
          </header>

          {/* Search Bar - Sophisticated Minimalism */}
          <div className="relative mb-12 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-300 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search through your vault..." 
              className="w-full bg-white dark:bg-[#0d0d0d] border border-neutral-100 dark:border-neutral-800 py-4 pl-12 pr-4 rounded-2xl focus:outline-none focus:border-neutral-300 dark:focus:border-neutral-600 shadow-sm transition-all"
            />
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DashboardCard 
              href="/notes"
              title="Notes"
              description="Write and organize your markdown thoughts."
              icon={<FileText className="text-blue-500" size={24} />}
              color="bg-blue-50/50 dark:bg-blue-900/10"
            />
            <DashboardCard 
              href="/upload"
              title="Files"
              description="Manage your uploaded PDFs, images and docs."
              icon={<Upload className="text-purple-500" size={24} />}
              color="bg-purple-50/50 dark:bg-purple-900/10"
            />
          </div>

          {/* Recent Activity Placeholder */}
          <div className="mt-16">
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6">Recent Activity</h3>
            <div className="space-y-4">
               {[1, 2, 3].map((i) => (
                 <div key={i} className="flex items-center justify-between p-4 border-b border-neutral-50 dark:border-neutral-900 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-4">
                       <div className="w-2 h-2 rounded-full bg-neutral-200 group-hover:bg-blue-400" />
                       <span className="text-sm font-medium">Project_Paperless_Architecture.md</span>
                    </div>
                    <span className="text-xs text-neutral-400">2 hours ago</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Sub-components for cleaner structure
function SidebarItem({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${active ? 'bg-neutral-50 dark:bg-neutral-900 text-blue-600' : 'text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white'}`}>
      {icon}
      <span className="hidden md:block text-sm font-medium">{label}</span>
    </Link>
  );
}

function DashboardCard({ href, title, description, icon, color }: { href: string, title: string, description: string, icon: React.ReactNode, color: string }) {
  return (
    <Link href={href} className="group relative">
      <div className="absolute inset-0 bg-neutral-900 translate-x-1 translate-y-1 rounded-2xl opacity-0 group-hover:opacity-5 dark:group-hover:opacity-20 transition-all" />
      <div className="relative bg-white dark:bg-[#0d0d0d] border border-neutral-100 dark:border-neutral-800 p-8 rounded-2xl shadow-sm hover:border-neutral-300 dark:hover:border-neutral-600 transition-all flex flex-col gap-4">
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-medium mb-1 tracking-tight">{title}</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">{description}</p>
        </div>
        <div className="mt-4 flex items-center text-xs font-bold uppercase tracking-wider text-neutral-300 group-hover:text-blue-500 transition-colors">
          Open Folder →
        </div>
      </div>
    </Link>
  );
}