import { 
  Mail, 
  Calendar, 
  User, 
  CheckSquare, 
  Star, 
  Search, 
  ChevronDown,
  LayoutGrid,
  LogIn,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/src/components/FirebaseProvider';
import { loginWithGoogle, logout } from '@/src/lib/firebase';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-bg-main border-b border-border-subtle flex items-center justify-between px-10 sticky top-0 z-40">
      <div>
        <h2 className="text-white text-xl font-serif italic tracking-wide">Strategic Dashboard</h2>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="text-right hidden sm:block">
          <p className="text-[10px] uppercase tracking-widest opacity-40">Current Market</p>
          <p className="text-sm text-accent-gold font-mono font-medium">+1.24% BULLISH</p>
        </div>
        
        <div className="h-8 w-px bg-border-subtle" />
        
        <div className="flex items-center gap-6">
          <button className="text-gray-600 hover:text-accent-gold transition-colors">
            <Search size={18} />
          </button>
          
          <div className="flex items-center gap-3 px-4 py-2 border border-border-subtle rounded-sm text-[10px] uppercase tracking-widest text-white cursor-pointer hover:bg-card-bg transition-colors">
             Q3 REPORT
          </div>

          {user ? (
            <div className="flex items-center gap-4 group relative">
              <div className="flex items-center gap-3 cursor-pointer">
                <img 
                  src={user.photoURL || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=40&h=40&auto=format&fit=crop"} 
                  alt={user.displayName || "User"} 
                  className="w-8 h-8 rounded-full border border-border-subtle group-hover:border-accent-gold transition-colors"
                  referrerPolicy="no-referrer"
                />
                <div className="flex flex-col items-start leading-none">
                  <span className="text-xs font-medium text-white group-hover:text-accent-gold transition-colors">{user.displayName || 'Access Granted'}</span>
                  <span className="text-[9px] opacity-40 uppercase tracking-widest mt-1">Admin</span>
                </div>
              </div>
              <button 
                onClick={() => logout()}
                className="text-gray-600 hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => loginWithGoogle()}
              className="flex items-center gap-2 text-accent-gold hover:text-white border border-accent-gold/30 hover:bg-accent-gold/10 px-4 py-2 rounded-sm transition-all text-[10px] uppercase tracking-widest"
            >
              <LogIn size={14} />
              Authenticate
            </button>
          )}
          
          <button className="text-gray-600 hover:text-accent-gold transition-colors">
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
