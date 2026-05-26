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
  const { user, handleLogout } = useAuth();

  const handleSignOut = async () => {
    await logout();
    handleLogout();
  };

  return (
    <header className="h-20 bg-bg-main border-b border-border-subtle flex items-center justify-between px-10 sticky top-0 z-40">
      <div>
        <h2 className="text-white text-xl font-serif italic tracking-wide">Strategic Dashboard</h2>
      </div>
      
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-6">
          {user ? (
            <button 
              onClick={() => handleSignOut()}
              className="text-gray-600 hover:text-red-400 transition-colors"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          ) : (
            <button 
              onClick={() => loginWithGoogle()}
              className="flex items-center gap-2 text-accent-gold hover:text-white border border-accent-gold/30 hover:bg-accent-gold/10 px-4 py-2 rounded-sm transition-all text-[10px] uppercase tracking-widest"
            >
              <LogIn size={14} />
              Authenticate
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
