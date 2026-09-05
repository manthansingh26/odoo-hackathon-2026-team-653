import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Menu, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/Button';

export const PublicNavbar = ({ onOpenAuth, onOpenDoubleEntry }) => {
  const { isAuthenticated } = useAppContext();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignIn = (e) => {
    if (onOpenAuth) {
      e.preventDefault();
      onOpenAuth('login');
    } else {
      navigate('/login');
    }
  };

  const handleSignUp = (e) => {
    if (onOpenAuth) {
      e.preventDefault();
      onOpenAuth('signup');
    } else {
      navigate('/signup');
    }
  };

  const handleDoubleEntry = (e) => {
    if (onOpenDoubleEntry) {
      e.preventDefault();
      onOpenDoubleEntry();
    } else {
      navigate('/#accounting');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo Branding */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="h-8 w-8 rounded-lg bg-neutral-950 text-white flex items-center justify-center text-sm font-black font-mono shadow-xs group-hover:bg-neutral-800 transition-colors">
            U
          </div>
          <div className="flex flex-col">
            <span className="text-base font-black tracking-widest text-neutral-950 uppercase font-mono">
              URBAN
            </span>
            <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-500 uppercase -mt-1">
              ACCOUNTING SYSTEM
            </span>
          </div>
        </Link>

        {/* Desktop Center Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-neutral-600">
          <a href="/#features" className="hover:text-neutral-950 transition-colors">Features</a>
          <a href="/#metrics" className="hover:text-neutral-950 transition-colors">Metrics</a>
          <a href="/#roles" className="hover:text-neutral-950 transition-colors">Role Architecture</a>
          <a
            href="/#accounting"
            onClick={handleDoubleEntry}
            className="hover:text-neutral-950 transition-colors cursor-pointer"
          >
            Double-Entry
          </a>
        </nav>

        {/* Right Action CTA Buttons (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Link to="/dashboard">
              <Button variant="primary" size="sm" className="gap-1.5 text-xs shadow-xs">
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          ) : (
            <>
              <button
                type="button"
                onClick={handleSignIn}
                className="inline-flex items-center justify-center font-semibold rounded-md transition-colors text-xs text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 px-3 py-1.5 cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={handleSignUp}
                className="inline-flex items-center justify-center font-semibold rounded-md transition-colors gap-1.5 text-xs shadow-xs bg-neutral-950 text-white hover:bg-neutral-800 px-3.5 py-1.5 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Right Controls: Get Started + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {!isAuthenticated ? (
            <button
              type="button"
              onClick={handleSignUp}
              className="inline-flex items-center justify-center font-semibold rounded-md transition-colors text-[11px] px-2.5 py-1 gap-1 bg-neutral-950 text-white hover:bg-neutral-800 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <Link to="/dashboard">
              <Button variant="primary" size="sm" className="text-[11px] px-2.5 py-1 font-semibold">
                Dashboard
              </Button>
            </Link>
          )}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-neutral-200 px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-150 shadow-xl">
          <nav className="flex flex-col space-y-2 text-xs font-semibold text-neutral-700">
            <a
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md hover:bg-neutral-100 hover:text-neutral-950 transition-colors"
            >
              Features
            </a>
            <a
              href="/#metrics"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md hover:bg-neutral-100 hover:text-neutral-950 transition-colors"
            >
              Metrics
            </a>
            <a
              href="/#roles"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-md hover:bg-neutral-100 hover:text-neutral-950 transition-colors"
            >
              Role Architecture
            </a>
            <a
              href="/#accounting"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleDoubleEntry(e);
              }}
              className="p-2 rounded-md hover:bg-neutral-100 hover:text-neutral-950 transition-colors cursor-pointer"
            >
              Double-Entry
            </a>
          </nav>
          <div className="pt-2 border-t border-neutral-100 flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleSignIn(e);
                  }}
                  className="w-full inline-flex items-center justify-center font-semibold text-xs py-2 rounded-md border border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50 cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleSignUp(e);
                  }}
                  className="w-full inline-flex items-center justify-center font-semibold text-xs py-2 rounded-md bg-neutral-950 text-white hover:bg-neutral-800 gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="sm" className="w-full text-xs font-semibold gap-1.5">
                  <span>Open ERP Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
