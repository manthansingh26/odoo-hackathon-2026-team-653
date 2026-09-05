import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export const PublicFooter = ({ onOpenAuth }) => {
  const { isAuthenticated } = useAppContext();
  const navigate = useNavigate();

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

  return (
    <footer className="bg-white border-t border-neutral-200 py-10 sm:py-12 text-xs text-neutral-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-7 w-7 rounded bg-neutral-950 text-white flex items-center justify-center text-xs font-black font-mono shadow-2xs group-hover:bg-neutral-800 transition-colors">
              U
            </div>
            <span className="font-bold text-neutral-900 font-mono tracking-wider">URBAN ACCOUNTING</span>
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-1.5 font-medium text-neutral-600">
            <span className="hidden sm:inline">•</span>
            <span>Urban Furniture Pvt. Ltd.</span>
            <span className="hidden sm:inline">•</span>
            <span>GSTIN: 27AAACU1234F1Z5</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-medium">
          <a href="/#features" className="hover:text-neutral-950 transition-colors">Features</a>
          <a href="/#metrics" className="hover:text-neutral-950 transition-colors">Metrics</a>
          <a href="/#roles" className="hover:text-neutral-950 transition-colors">Roles</a>
          {!isAuthenticated ? (
            <>
              <button
                type="button"
                onClick={handleSignIn}
                className="hover:text-neutral-950 transition-colors cursor-pointer"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={handleSignUp}
                className="hover:text-neutral-950 transition-colors cursor-pointer"
              >
                Register
              </button>
            </>
          ) : (
            <Link to="/dashboard" className="hover:text-neutral-950 transition-colors">Dashboard</Link>
          )}
          <Link to={isAuthenticated ? "/dashboard" : "/login"} className="hover:text-neutral-950 transition-colors">
            ERP Workspace
          </Link>
        </div>

        <div className="text-center md:text-right text-[11px] text-neutral-400">
          &copy; {new Date().getFullYear()} Urban Accounting System. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
