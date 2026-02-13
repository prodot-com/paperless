import { Clock, FileText, HardDrive, Plus, Search } from "lucide-react"
import Link from "next/link";

const Workspace = ({storageUsed, totalFiles, totalNotes}:{
    storageUsed: number,
    totalNotes: number,
    totalFiles: number
}) => {

    function formatBytes(bytes: number) {
        const sizes = ["B", "KB", "MB", "GB"];
        const k = 1000;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
    }

    

    return (
    <div>
        <main className="flex-1 relative overflow-y-auto">
        <div className="relative z-10 p-8 md:p-12 max-w-6xl mx-auto">
          
          {/* Welcome Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 text-neutral-400 text-sm mb-2">
                <Clock size={14} />
                <span>Last synced: Just now</span>
              </div>
              <h1 className="text-4xl font-light tracking-tight italic font-serif italic">Workspace</h1>
            </div>
            
            <div className="flex gap-3">
              <button className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white px-5 py-3 rounded-xl flex items-center gap-2 text-sm font-medium hover:border-neutral-900 dark:hover:border-neutral-400 transition-all">
                <Search size={18} />
                <span className="hidden sm:inline">Search</span>
              </button>
              <button className="bg-[#1A1A1A] dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-lg shadow-neutral-200 dark:shadow-none">
                <Plus size={18} />
                New Entry
              </button>
            </div>
          </header>

          {/* Added: Quick Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <StatBox label="Total Notes" value={totalNotes} />
            <StatBox label="Attached Files" value={totalFiles} />
            <StatBox label="Space Used" value={formatBytes(storageUsed)} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <DashboardCard 
              href="/notes"
              title="Notes"
              description="Capture thoughts in markdown. Organized by date and relevance."
              icon={<FileText size={24} className="text-blue-500" />}
              color="bg-blue-50/50 dark:bg-blue-500/10"
            />
            <DashboardCard 
              href="/upload"
              title="File Vault"
              description="Your encrypted storage for PDFs, images, and documents."
              icon={<HardDrive size={24} className="text-emerald-500" />}
              color="bg-emerald-50/50 dark:bg-emerald-500/10"
            />
          </div>

        </div>
      </main>
    </div>
    )
}

function StatBox({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="bg-white dark:bg-neutral-900/50 border border-neutral-100 dark:border-neutral-800 p-5 rounded-2xl">
      <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 mb-1">{label}</p>
      <p className="text-2xl font-light tracking-tight">{value}</p>
    </div>
  );
}


function DashboardCard({ href, title, description, icon, color }: any) {
  return (
    <Link href={href} className="group relative block h-full">
      <div className="bg-white dark:bg-[#0d0d0d] border border-neutral-100 dark:border-neutral-800 p-8 rounded-3xl shadow-sm hover:border-neutral-300 dark:hover:border-neutral-600 transition-all flex flex-col h-full">
        <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-6`}>
          {icon}
        </div>
        <h2 className="text-xl font-medium mb-2 tracking-tight">{title}</h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light leading-relaxed flex-grow">
          {description}
        </p>
        <div className="mt-8 flex items-center text-xs font-bold uppercase tracking-wider text-neutral-300 group-hover:text-blue-500 transition-colors">
          Explore →
        </div>
      </div>
    </Link>
  );
}

export default Workspace
