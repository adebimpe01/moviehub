import { NavLink } from 'react-router-dom';
import { Home, Star, TrendingUp, Calendar, Clapperboard } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Popular', icon: Star, path: '/popular' },
  { label: 'Top Rated', icon: TrendingUp, path: '/top-rated' },
  { label: 'Upcoming', icon: Calendar, path: '/upcoming' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={onClose} />
      )}

      <aside
        className={`w-60 h-screen bg-white border-r border-gray-100 fixed left-0 top-0 flex flex-col py-6 px-4 z-50 transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex items-center gap-2 px-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
            <Clapperboard size={18} className="text-white" />
          </div>
          <span className="text-gray-900 font-semibold text-lg">MovieHub</span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map(({ label, icon: Icon, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent text-white'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }: { isActive: boolean }) => (
                <>
                  <Icon size={18} className={isActive ? 'text-white' : 'text-accent'} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}