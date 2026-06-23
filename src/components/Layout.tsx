import { useState } from 'react';
import type { ReactNode } from 'react';
import { Menu, Clapperboard } from 'lucide-react';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
            <Clapperboard size={16} className="text-white" />
          </div>
          <span className="text-gray-900 font-semibold">MovieHub</span>
        </div>
        <button onClick={() => setSidebarOpen(true)} className="text-gray-700 p-1.5" aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="md:ml-60 p-4 sm:p-6 md:p-8">{children}</main>
    </div>
  );
}