'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, FilePlus, LogOut, Newspaper } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'admin') {
      router.push('/');
    }
  }, [status, session, router]);

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm font-mono">Verifying access…</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/posts/new', label: 'New Article', icon: FilePlus },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <Link href="/" className="flex items-center gap-2 group">
            <Newspaper className="w-5 h-5 text-red-500" />
            <span className="font-serif text-lg font-black tracking-tight group-hover:text-red-400 transition-colors">
              The Indian Berg
            </span>
          </Link>
          <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest mt-1">Admin CMS</p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-red-700 text-white'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="mb-3 px-3">
            <p className="text-white text-xs font-bold truncate">{session.user?.name}</p>
            <p className="text-zinc-500 text-[10px] truncate">{session.user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-semibold text-zinc-400 hover:bg-zinc-800 hover:text-red-400 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
