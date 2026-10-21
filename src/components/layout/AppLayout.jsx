import React from 'react';
import { Sidebar } from './Sidebar';
import { MobileNavigation } from './MobileNavigation';

export function AppLayout({
  children,
  activePage,
  setActivePage,
  wedding,
  onOpenCreateWedding,
}) {
  return (
    <div className="min-h-screen bg-ivory-100 flex flex-col md:flex-row text-stone-800">
      {/* Sidebar for Desktop */}
      <Sidebar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        wedding={wedding}
        onOpenCreateWedding={onOpenCreateWedding}
      />

      {/* Header and bottom bar for Mobile */}
      <MobileNavigation 
        activePage={activePage} 
        setActivePage={setActivePage} 
        wedding={wedding}
        onOpenCreateWedding={onOpenCreateWedding}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-6 sm:px-8 sm:py-8 max-w-7xl mx-auto w-full pb-20 md:pb-8">
        <div className="fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}

export default AppLayout;
