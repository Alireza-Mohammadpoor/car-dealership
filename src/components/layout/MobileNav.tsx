import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Car, PlusCircle, LogOut, Menu, X, CarFront } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'داشبورد', icon: LayoutDashboard },
  { to: '/cars', label: 'خودروها', icon: Car },
  { to: '/cars/new', label: 'افزودن خودرو', icon: PlusCircle },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <>
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy-900 text-white">
            <CarFront className="h-4 w-4" />
          </div>
          <p className="text-sm font-bold text-navy-900">پنل نمایشگاه</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="rounded-lg p-2 text-navy-600 hover:bg-slate-100"
          aria-label="باز کردن منو"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-950/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-72 flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <p className="text-sm font-bold text-navy-900">منو</p>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/dashboard'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive ? 'bg-navy-900 text-white' : 'text-navy-600 hover:bg-slate-100'
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
          </div>
        </div>
      )}
    </>
  );
}
