import React from 'react';
import { NAV_ITEMS } from './Sidebar';
import { CalendarHeart, LogIn, LogOut, PlusCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function MobileNavigation({
  activePage,
  setActivePage,
  wedding,
  onOpenCreateWedding,
}) {
  const { user, profile, openAuthModal, signOut } = useAuth();

  return (
    <>
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sage-700 text-white flex items-center justify-center">
            <CalendarHeart className="w-4 h-4 text-gold-200" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-sm text-stone-900 leading-tight">
              Make My Marriage
            </h1>
            <p className="text-[10px] text-stone-500 truncate max-w-[160px]">
              {wedding?.couple_names || 'Wedding Celebration'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onOpenCreateWedding && (
            <button
              onClick={onOpenCreateWedding}
              title="Create wedding"
              className="p-1.5 rounded-lg text-stone-500 hover:text-sage-700 hover:bg-stone-50"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-stone-700 truncate max-w-[70px]">
                {profile?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
              </span>
              <button
                onClick={signOut}
                title="Sign Out"
                className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('login')}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-sage-800 bg-sage-50 rounded-lg border border-sage-200"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200/80 px-2 py-1.5 flex justify-around items-center shadow-lg">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] transition-colors ${
                isActive ? 'text-sage-700 font-semibold' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-sage-700' : 'text-stone-400'}`} />
              <span className="truncate max-w-[64px]">{item.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}

export default MobileNavigation;
