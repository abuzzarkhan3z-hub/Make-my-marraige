import React from 'react';
import { 
  LayoutDashboard, 
  ReceiptIndianRupee, 
  MailOpen, 
  Users, 
  Settings, 
  Sparkles,
  CalendarHeart,
  LogIn,
  LogOut,
  PlusCircle,
  Database,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'expenses', label: 'Expenses', icon: ReceiptIndianRupee },
  { id: 'invitations', label: 'Invitations', icon: MailOpen },
  { id: 'coordination', label: 'Family Coordination', icon: Users },
  { id: 'settings', label: 'Settings & Admin', icon: Settings },
];

export function Sidebar({
  activePage,
  setActivePage,
  wedding,
  onOpenCreateWedding,
}) {
  const { user, profile, isConfigured, openAuthModal, signOut } = useAuth();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200/80 min-h-screen sticky top-0 h-screen">
      {/* Brand & Logo */}
      <div className="p-6 border-b border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sage-700 to-sage-500 text-white flex items-center justify-center shadow-sm">
            <CalendarHeart className="w-5 h-5 text-gold-200" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-stone-900 leading-tight">
              Make My Marriage
            </h1>
            <p className="text-[11px] text-sage-700 font-medium tracking-wide uppercase">
              Wedding Manager
            </p>
          </div>
        </div>
      </div>

      {/* Database Connection Pill */}
      <div className="px-5 pt-3">
        <div className="flex items-center justify-between text-[11px] px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200/60 text-stone-600">
          <div className="flex items-center gap-1.5 truncate">
            <Database className="w-3 h-3 text-sage-600" />
            <span className="truncate">
              {isConfigured ? 'Supabase Connected' : 'Local Prototype'}
            </span>
          </div>
          <span className={`w-2 h-2 rounded-full ${isConfigured ? 'bg-emerald-500' : 'bg-amber-400'}`} />
        </div>
      </div>

      {/* Wedding Badge & Switcher */}
      <div className="px-5 py-3 mx-4 my-3 rounded-xl bg-ivory-100/90 border border-ivory-300/80">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            <span>Active Wedding</span>
          </div>
          {onOpenCreateWedding && (
            <button
              onClick={onOpenCreateWedding}
              title="Create new wedding"
              className="text-stone-400 hover:text-sage-700 transition-colors p-0.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <p className="text-xs font-serif font-medium text-stone-900 truncate">
          {wedding?.couple_names || wedding?.name || 'Wedding Celebration'}
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-sage-50 text-sage-800 font-semibold shadow-xs border border-sage-200/60'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-sage-700' : 'text-stone-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Auth Footer */}
      <div className="p-4 border-t border-stone-100">
        {user ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-sage-100 text-sage-800 font-semibold text-xs flex items-center justify-center shrink-0 border border-sage-200">
                {(profile?.full_name || user.email || 'U')[0].toUpperCase()}
              </div>
              <div className="min-w-0 truncate">
                <p className="text-xs font-medium text-stone-800 truncate">
                  {profile?.full_name || user.email?.split('@')[0]}
                </p>
                <p className="text-[10px] text-stone-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>
            <button
              onClick={signOut}
              title="Sign Out"
              className="p-1.5 text-stone-400 hover:text-red-600 transition-colors rounded-lg hover:bg-stone-50"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => openAuthModal('login')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-sage-800 bg-sage-50 hover:bg-sage-100 transition-colors border border-sage-200/60"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Register</span>
          </button>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;
