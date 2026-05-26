import React, { useState } from 'react';
import { LogIn, AlertCircle } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Valid credentials
  const VALID_EMAIL = 'joshuamicheal@gmail.com';
  const VALID_PASSWORD = 'Clown123$$';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate auth delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      onLogin(email);
    } else {
      setError('Invalid email or password');
      setPassword('');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg-main flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif italic text-white tracking-widest mb-2">JTECHADMIN</h1>
          <p className="text-[10px] uppercase tracking-widest text-accent-gold font-mono">Administrative Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-card-bg border border-border-subtle p-8 space-y-8">
          <div className="space-y-1">
            <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-white">Secure Access</h2>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Authenticate to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 bg-red-900/20 border border-red-700/50 rounded p-3">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-card-active border border-border-subtle p-3 text-white text-sm focus:border-accent-gold/50 outline-none transition-colors font-mono"
                required
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-card-active border border-border-subtle p-3 text-white text-sm focus:border-accent-gold/50 outline-none transition-colors font-mono"
                required
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full bg-accent-gold text-bg-main p-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-accent-gold/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin">⟳</div>
                  Authenticating...
                </>
              ) : (
                <>
                  <LogIn size={14} />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-[10px] uppercase tracking-widest text-gray-600 font-mono">
            Secure Authentication Portal • May 24, 2026
          </p>
        </div>
      </div>
    </div>
  );
}
