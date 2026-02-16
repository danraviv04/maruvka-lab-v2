'use client';

import { useState, useEffect } from 'react';
import Container from '@/components/Container';
import SectionHeader from '@/components/SectionHeader';
import { membersContent } from '@/content/members';

const LAB_PASSWORD = process.env.NEXT_PUBLIC_LAB_PASSWORD || 'maruvka2026';

export default function MembersPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated in this session
    const auth = sessionStorage.getItem('lab_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === LAB_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('lab_authenticated', 'true');
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('lab_authenticated');
    setPassword('');
  };

  if (isLoading) {
    return (
      <Container className="py-16">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-muted">Loading...</div>
        </div>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container className="py-16">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-full max-w-md">
            <div className="rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8 shadow-xl">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-text mb-2">Lab Members Area</h1>
                <p className="text-muted">Enter the lab password to access internal resources</p>
              </div>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-text focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter password"
                    autoFocus
                  />
                </div>
                
                {error && (
                  <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">
                    {error}
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                >
                  Access Members Area
                </button>
              </form>
              
              <div className="mt-6 text-center text-sm text-muted">
                <p>Only for Maruvka Lab members</p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <>
      <SectionHeader
        eyebrow="Internal"
        title={membersContent.title}
        description={membersContent.description}
      />
      
      <Container className="py-12">
        <div className="mb-8 flex justify-end">
          <button
            onClick={handleLogout}
            className="text-sm text-muted hover:text-primary transition"
          >
            Logout
          </button>
        </div>

        {/* Quick Links */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-text mb-6">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {membersContent.quickLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                className="flex flex-col items-center justify-center p-6 rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-primary hover:shadow-lg transition-all group"
              >
                <span className="text-4xl mb-2">{link.icon}</span>
                <span className="text-sm font-semibold text-center text-text group-hover:text-primary transition">
                  {link.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Recent Updates */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-text mb-6">Recent Updates</h2>
          <div className="space-y-4">
            {membersContent.updates.map((update) => (
              <div
                key={update.id}
                className="rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-text">{update.title}</h3>
                  <span className="text-sm text-muted">{update.date}</span>
                </div>
                <p className="text-muted mb-2">{update.content}</p>
                <p className="text-sm text-muted italic">— {update.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Links */}
        <div>
          <h2 className="text-2xl font-bold text-text mb-6">Resources & Links</h2>
          <div className="space-y-8">
            {membersContent.links.map((section) => (
              <div key={section.category}>
                <h3 className="text-xl font-semibold text-text mb-4">{section.category}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {section.items.map((item) => (
                    <a
                      key={item.name}
                      href={item.url}
                      className="block p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-primary hover:shadow-md transition-all group"
                    >
                      <h4 className="font-semibold text-text group-hover:text-primary transition mb-1">
                        {item.name}
                      </h4>
                      <p className="text-sm text-muted">{item.description}</p>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Note */}
        <div className="mt-12 p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700">
          <p className="text-sm text-muted text-center">
            💡 <strong>Note:</strong> To update links and content, edit the{' '}
            <code className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded">content/members.ts</code> file
          </p>
        </div>
      </Container>
    </>
  );
}
