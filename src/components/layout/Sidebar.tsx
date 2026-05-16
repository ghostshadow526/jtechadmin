import { 
  LayoutDashboard, 
  Mail, 
  Users, 
  GraduationCap
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const navItems = [
  { group: 'MANAGEMENT', items: [
    { name: 'Strategic Dashboard', icon: LayoutDashboard, id: 'dashboard' },
    { name: 'AI Services Portfolio', icon: GraduationCap, id: 'ai-services' },
    { name: 'Executive Logs', icon: Mail, id: 'logs' },
    { name: 'Client Registry', icon: Users, id: 'clients' },
  ]}
];

export default function Sidebar({ activeTab, onTabChange }: { activeTab: string, onTabChange: (id: string) => void }) {
  return (
    <aside className="w-64 bg-bg-sidebar text-gray-400 h-screen flex flex-col fixed left-0 top-0 z-50 border-r border-border-subtle">
      {/* Brand Header */}
      <div className="p-8">
        <h1 className="text-accent-gold font-serif italic text-2xl tracking-tight leading-none">Aurelius</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] opacity-50 mt-1">Management Suite</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-8 space-y-2">
        {navItems.map((group, idx) => (
          <div key={idx} className="mb-8">
            <h3 className="px-4 mb-3 text-[10px] font-bold text-gray-600 tracking-widest uppercase">
              {group.group}
            </h3>
            <div className="space-y-1">
              {group.items.map((item, itemIdx) => {
                const Icon = item.icon;
                const isActive = item.id === activeTab;
                return (
                  <div key={itemIdx}>
                    <button
                      onClick={() => item.id && onTabChange(item.id)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-sm transition-all",
                        isActive ? "bg-card-active text-white border border-border-subtle" : "hover:bg-card-bg text-gray-400 hover:text-white capitalize cursor-pointer",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {isActive && <div className="w-2 h-2 rounded-full bg-accent-gold mr-1" />}
                        {Icon && !isActive && <Icon size={16} className="text-gray-600" />}
                        <span className={cn("text-sm font-medium", isActive && "text-accent-gold")}>
                          {item.name}
                        </span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Branding */}
      <div className="p-6 border-t border-border-subtle text-[8px] uppercase tracking-[0.4em] opacity-20 text-center">
        Secure Terminal Alpha
      </div>
    </aside>
  );
}
