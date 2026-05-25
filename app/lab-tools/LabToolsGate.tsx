'use client';

import { useState, useEffect, useRef } from 'react';
import { FlaskConical, Lock, LogOut, Eye, EyeOff } from 'lucide-react';

interface AuthState {
  checked: boolean;
  authorized: boolean;
  configured: boolean;
}

export default function LabToolsGate({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ checked: false, authorized: false, configured: true });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/lab-tools/auth')
      .then(r => r.json())
      .then((data: { authorized: boolean; configured: boolean }) => {
        setAuth({ checked: true, authorized: data.authorized, configured: data.configured });
      })
      .catch(() => setAuth({ checked: true, authorized: false, configured: true }));
  }, []);

  useEffect(() => {
    if (auth.checked && !auth.authorized && auth.configured) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [auth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/lab-tools/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok) {
        setAuth(a => ({ ...a, authorized: true }));
        setPassword('');
      } else {
        setError('Incorrect password. Please try again.');
        setPassword('');
        inputRef.current?.focus();
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/lab-tools/auth', { method: 'DELETE' });
    setAuth(a => ({ ...a, authorized: false }));
    setPassword('');
    setError('');
  };

  if (!auth.checked) {
    return (
      <div className="lab-tools-scope fixed inset-0 flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!auth.configured || auth.authorized) {
    return (
      <>
        {auth.authorized && auth.configured && (
          <div className="fixed bottom-4 right-4 z-50">
            <button
              onClick={handleLogout}
              title="Sign out of Lab Tools"
              className="lab-tools-scope flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border shadow-sm text-xs text-muted-foreground hover:text-foreground hover:shadow-md transition-all"
            >
              <LogOut size={12} /> Sign out
            </button>
          </div>
        )}
        {children}
      </>
    );
  }

  return (
    <div className="lab-tools-scope fixed inset-0 flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-24 gap-3">
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <FlaskConical size={32} className="text-primary-foreground" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 border-2 border-background flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-base font-semibold text-foreground">Lab Tools</p>
            <p className="text-sm text-muted-foreground mt-0.5">Maruvka Lab · Internal Access</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Lock size={16} className="text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Password required</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center h-10 rounded-lg border border-border bg-muted/40 px-3 gap-2">
              <input
                ref={inputRef}
                type={showPw ? 'text' : 'password'}
                placeholder="Enter password…"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                tabIndex={-1}
                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {error && (
              <p className="text-xs text-destructive font-medium">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Checking…
                </span>
              ) : 'Enter'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          For lab members only ·{' '}
          <a href="/" className="underline underline-offset-2 hover:text-foreground transition-colors">
            Back to main site
          </a>
        </p>

      </div>
    </div>
  );
}
