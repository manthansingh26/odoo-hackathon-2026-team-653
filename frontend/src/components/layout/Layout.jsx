import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { ToastContainer } from '../ui/ToastContainer';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
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
                className="p-2 text-neutral-500 hover:text-neutral-950 rounded-md"
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
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-3.5 sm:p-6 lg:p-8 flex flex-col justify-between">
          <div className="max-w-7xl mx-auto w-full space-y-6 flex-1">
            <Outlet />
          </div>

          {/* Dashboard Minimal Responsive Footer */}
          <footer className="mt-8 pt-4 pb-2 border-t border-neutral-200 text-[11px] text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-2 max-w-7xl mx-auto w-full text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="font-bold text-neutral-900 font-mono tracking-wider">URBAN ACCOUNTING SYSTEM</span>
              <span className="hidden sm:inline">•</span>
              <span>v2.6 Enterprise</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">GSTIN: 27AAACU1234F1Z5</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-400">
              <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Local State Active
              </span>
              <span>•</span>
              <span>&copy; {new Date().getFullYear()} Urban Furniture Pvt. Ltd.</span>
            </div>
          </footer>
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <ToastContainer />
      <GlobalSearchModal />
      <QuickActionModals />
    </div>
  );
};
