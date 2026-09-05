import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ToastContainer } from '../ui/ToastContainer';
import { QuickActionModals } from '../modals/QuickActionModals';
import { useAppContext } from '../../context/AppContext';
import { X } from 'lucide-react';

export const Layout = () => {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useAppContext();

  return (
    <div className="flex h-screen w-screen bg-[#fafafa] overflow-hidden text-neutral-900 font-sans antialiased">
      {/* Desktop Sidebar (hidden on mobile, persistent on desktop) */}
      <div className="hidden md:flex shrink-0">
        <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Mobile Drawer (Slide-out menu for mobile devices) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <div className="absolute top-2 right-2 z-20">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-neutral-500 hover:text-neutral-950 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar */}
        <Navbar />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 sm:p-6 lg:p-8 flex flex-col">
          <div className="max-w-7xl mx-auto w-full space-y-6 flex-1">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <ToastContainer />
      <QuickActionModals />
    </div>
  );
};
