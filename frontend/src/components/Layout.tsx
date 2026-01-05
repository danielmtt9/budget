import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { usePrivacy } from '../contexts/PrivacyContext';

import InstallPWA from './InstallPWA';
import OfflineIndicator from './OfflineIndicator';

const SideNavLink = ({ to, icon, label, isActive, mobile }: { to: string, icon: string, label: string, isActive?: boolean, mobile?: boolean }) => {
  const location = useLocation();
  const active = isActive || location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  // Desktop: Flex Row (Icon | Label)
  // Mobile: Flex Col (Icon / Label)

  return (
    <Link
      to={to}
      className={`flex items-center transition-colors ${mobile
        ? "flex-col gap-1 p-1 justify-center rounded-xl min-w-[64px]"
        : "gap-3 rounded-lg px-3 py-2"
        } ${active
          ? mobile ? "text-primary" : "bg-primary/20 text-primary"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        }`}
    >
      <span
        className="material-symbols-outlined transition-all"
        style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
      >
        {icon}
      </span>
      <p className={`${mobile ? "text-[10px]" : "text-sm"} font-medium leading-none`}>{label}</p>
    </Link>
  );
};

const Layout = () => {
  const { isPrivacyMode, togglePrivacyMode } = usePrivacy();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
  const closeDrawer = () => setIsDrawerOpen(false);

  // Close drawer on route change
  useEffect(() => {
    closeDrawer();
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 bg-background-light p-4 dark:border-slate-800 dark:bg-background-dark justify-between">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between px-3">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
                <span className="material-symbols-outlined text-xl">savings</span>
              </div>
              <h2 className="text-lg font-bold">Budget App</h2>
            </div>
            <button
              onClick={togglePrivacyMode}
              className={`flex size-8 items-center justify-center rounded-lg transition-colors ${isPrivacyMode ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
              title={isPrivacyMode ? 'Disable Privacy Mode' : 'Enable Privacy Mode'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPrivacyMode ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <SideNavLink to="/" icon="dashboard" label="Dashboard" />
            <SideNavLink to="/budget" icon="account_balance_wallet" label="Budget" />
            <SideNavLink to="/transactions" icon="receipt_long" label="Transactions" />
            <SideNavLink to="/settings" icon="settings" label="Settings" />
            <SideNavLink to="/profile" icon="person" label="Profile" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <SideNavLink to="/login" icon="logout" label="Logout" />
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-background-light dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 flex items-center px-4 z-50 justify-between safe-top" style={{ paddingTop: `calc(1rem + env(safe-area-inset-top))` }}>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDrawer}
            className="flex size-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined">{isDrawerOpen ? 'close' : 'menu'}</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">savings</span>
            <span className="font-bold text-lg">BudgetWise</span>
          </div>
        </div>
        <button
          onClick={togglePrivacyMode}
          className={`flex size-10 items-center justify-center rounded-xl transition-colors ${isPrivacyMode ? 'bg-primary text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <span className="material-symbols-outlined">
            {isPrivacyMode ? 'visibility_off' : 'visibility'}
          </span>
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeDrawer}
      >
        <div
          className={`absolute left-0 top-0 bottom-0 w-[280px] bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ease-out border-r border-white/5 flex flex-col p-6 gap-8 ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/5 pb-6">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
              <span className="material-symbols-outlined text-2xl">savings</span>
            </div>
            <div>
              <h2 className="text-xl font-black">BudgetWise</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Version 1.0.2</p>
            </div>
          </div>

          <nav className="flex flex-col gap-2 flex-1">
            <SideNavLink to="/" icon="dashboard" label="Home" />
            <SideNavLink to="/budget" icon="account_balance_wallet" label="Budget" />
            <SideNavLink to="/transactions" icon="receipt_long" label="Transactions" />
            <SideNavLink to="/settings" icon="settings" label="Settings" />
            <div className="h-px bg-slate-100 dark:bg-white/5 my-2"></div>
            <SideNavLink to="/profile" icon="person" label="Profile" />
          </nav>

          <Link
            to="/login"
            className="flex items-center gap-4 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-black transition-all active:scale-95"
          >
            <span className="material-symbols-outlined">logout</span>
            <span>Sign Out</span>
          </Link>
        </div>
      </div>

      <InstallPWA />
      <OfflineIndicator />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:p-0 h-full" style={{ paddingTop: 'calc(4rem + env(safe-area-inset-top))', paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))' }}>
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 flex justify-around items-center px-2 z-40" style={{ paddingBottom: `calc(1rem + env(safe-area-inset-bottom))`, height: `calc(4rem + env(safe-area-inset-bottom))` }}>
        <SideNavLink to="/" icon="dashboard" label="Home" mobile />
        <SideNavLink to="/budget" icon="account_balance_wallet" label="Budget" mobile />
        <SideNavLink to="/transactions" icon="receipt_long" label="Txns" mobile />
        <SideNavLink to="/settings" icon="settings" label="Settings" mobile />
        <SideNavLink to="/profile" icon="person" label="Profile" mobile />
      </div>
    </div>
  );
};

export default Layout;