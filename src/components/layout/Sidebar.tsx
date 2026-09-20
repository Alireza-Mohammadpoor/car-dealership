import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Car, PlusCircle, LogOut, CarFront } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'داشبورد', icon: LayoutDashboard },
  { to: '/cars', label: 'خودروها', icon: Car },
  { to: '/cars/new', label: 'افزودن خودرو', icon: PlusCircle },
];

export function Sidebar() {
  const { user, signOut } = useAuth();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-l border-slate-200 bg-white lg:flex">
      <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 text-white">
          <CarFront className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-navy-900">پنل نمایشگاه</p>
          <p className="text-xs text-navy-400">مدیریت خودروها</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-navy-900 text-white'
                  : 'text-navy-600 hover:bg-slate-100 hover:text-navy-900'
              }`
            }
          >
            <item.icon className="h-[18px] w-[18px]" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-100 px-4 py-4">
        <p className="truncate px-2 text-xs text-navy-400">{user?.email ?? 'نام کاربر'}</p>
        <button
          onClick={signOut}
          className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-[18px] w-[18px]" />
          خروج
        </button>
      </div>
    </aside>
  );
}
