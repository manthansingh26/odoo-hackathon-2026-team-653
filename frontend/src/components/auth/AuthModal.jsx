import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User, Building, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../ui/Button';
import { Input, Select } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { validateSignupForm, validateEmail } from '../../utils/validation';

export const AuthModal = ({
  isOpen,
  onClose,
  initialTab = 'login',
  initialRole = 'Admin'
}) => {
  const { login, signup, demoUsers, addToast } = useAppContext();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(initialTab); // 'login' | 'signup'
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [loginEmail, setLoginEmail] = useState(demoUsers[initialRole]?.email || 'admin@urbanfurniture.in');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [errors, setErrors] = useState({});

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    company: 'Urban Furniture Client',
    password: '',
    role: initialRole || 'Admin'
  });

  // Sync initial tab and role when modal is opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setErrors({});
      const role = initialRole && demoUsers[initialRole] ? initialRole : 'Admin';
      setSelectedRole(role);
      setLoginEmail(demoUsers[role]?.email || 'admin@urbanfurniture.in');
      setSignupData(prev => ({ ...prev, role }));
    }
  }, [isOpen, initialTab, initialRole, demoUsers]);

  // Lock scroll when open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleQuickDemo = (roleKey) => {
    const demo = demoUsers[roleKey];
    setSelectedRole(roleKey);
    setLoginEmail(demo.email);
    login(demo.email, 'password123', roleKey);
    onClose();
    navigate('/dashboard');
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const emailErr = validateEmail(loginEmail, true);
    if (emailErr) {
      setErrors({ loginEmail: emailErr });
      addToast({ type: 'error', message: emailErr });
      return;
    }
    setErrors({});
    login(loginEmail, loginPassword, selectedRole);
    onClose();
    navigate('/dashboard');
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const validation = validateSignupForm(signupData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      addToast({
        type: 'error',
        message: 'Please resolve the highlighted validation errors before proceeding.'
      });
      return;
    }
    setErrors({});
    signup(signupData);
    onClose();
    navigate('/dashboard');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dim blurred backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150 my-auto">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-neutral-950 text-white flex items-center justify-center text-xs font-black font-mono shadow-2xs">
              U
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-950 tracking-tight">
                URBAN ACCOUNTING SYSTEM
              </h2>
              <p className="text-[10px] text-neutral-500">
                Enterprise Accounting & ERP Portal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-950 hover:bg-neutral-200/60 rounded-md transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Segmented Control */}
        <div className="px-5 pt-4">
          <div className="grid grid-cols-2 p-1 bg-neutral-100 rounded-lg text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`py-2 rounded-md transition-all cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-white text-neutral-950 shadow-xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className={`py-2 rounded-md transition-all cursor-pointer ${
                activeTab === 'signup'
                  ? 'bg-white text-neutral-950 shadow-xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-950'
              }`}
            >
              Get Started / Register
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6">
          {activeTab === 'login' ? (
            <div className="space-y-4">
              {/* One-click demo roles */}
              <div className="p-3 bg-neutral-50 border border-neutral-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    One-Click Demo Switcher
                  </span>
                  <Badge variant="outline" className="text-[9px] py-0 px-1.5">
                    Instant Access
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('Admin')}
                    className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                      selectedRole === 'Admin'
                        ? 'border-neutral-950 bg-neutral-950 text-white shadow-xs'
                        : 'border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    <div className="text-[11px] font-bold truncate">Admin</div>
                    <div className={`text-[9px] truncate ${selectedRole === 'Admin' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      Full ERP
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('Accountant')}
                    className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                      selectedRole === 'Accountant'
                        ? 'border-neutral-950 bg-neutral-950 text-white shadow-xs'
                        : 'border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    <div className="text-[11px] font-bold truncate">Accountant</div>
                    <div className={`text-[9px] truncate ${selectedRole === 'Accountant' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      Ledgers
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemo('Contact User')}
                    className={`p-1.5 rounded-lg border text-left transition-all cursor-pointer ${
                      selectedRole === 'Contact User'
                        ? 'border-neutral-950 bg-neutral-950 text-white shadow-xs'
                        : 'border-neutral-200 bg-white hover:bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    <div className="text-[11px] font-bold truncate">Client User</div>
                    <div className={`text-[9px] truncate ${selectedRole === 'Contact User' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      Invoices
                    </div>
                  </button>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Select Access Role *</label>
                  <Select
                    value={selectedRole}
                    onChange={(e) => {
                      const r = e.target.value;
                      setSelectedRole(r);
                      if (demoUsers[r]) setLoginEmail(demoUsers[r].email);
                    }}
                  >
                    <option value="Admin">Admin (Full System & Company Config)</option>
                    <option value="Accountant">Accountant (General Ledger, Taxes & Reports)</option>
                    <option value="Contact User">Contact User (Customer / Vendor Portal)</option>
                  </Select>
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                    <Input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        if (errors.loginEmail) setErrors(prev => ({ ...prev, loginEmail: null }));
                      }}
                      error={errors.loginEmail}
                      className="pl-9"
                      placeholder="name@company.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-neutral-700">Password *</label>
                    <span className="text-[10px] text-neutral-400">Mock demo: any password</span>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                    <Input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" size="md" className="w-full mt-2 gap-2 font-bold shadow-xs">
                  <span>Sign In to ERP</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>

              <div className="pt-3 border-t border-neutral-100 text-center text-xs text-neutral-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup');
                    setErrors({});
                  }}
                  className="font-bold text-neutral-950 hover:underline cursor-pointer"
                >
                  Create New Account
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <form onSubmit={handleSignupSubmit} className="space-y-3">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                    <Input
                      required
                      value={signupData.name}
                      onChange={(e) => {
                        setSignupData({ ...signupData, name: e.target.value });
                        if (errors.name) setErrors(prev => ({ ...prev, name: null }));
                      }}
                      error={errors.name}
                      className="pl-9"
                      placeholder="e.g. Vikram Singhania"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Work Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                    <Input
                      type="email"
                      required
                      value={signupData.email}
                      onChange={(e) => {
                        setSignupData({ ...signupData, email: e.target.value });
                        if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                      }}
                      error={errors.email}
                      className="pl-9"
                      placeholder="vikram@domain.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Company / Entity Name</label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                    <Input
                      value={signupData.company}
                      onChange={(e) => setSignupData({ ...signupData, company: e.target.value })}
                      className="pl-9"
                      placeholder="e.g. Apex Living Pvt Ltd"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Assign User Role *</label>
                  <Select
                    value={signupData.role}
                    onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
                  >
                    <option value="Admin">Admin (Full ERP Administration)</option>
                    <option value="Accountant">Accountant (Financial Statements & Ledgers)</option>
                    <option value="Contact User">Contact User (Customer / Vendor Portal Only)</option>
                  </Select>
                </div>

                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Create Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                    <Input
                      type="password"
                      required
                      value={signupData.password}
                      onChange={(e) => {
                        setSignupData({ ...signupData, password: e.target.value });
                        if (errors.password) setErrors(prev => ({ ...prev, password: null }));
                      }}
                      error={errors.password}
                      className="pl-9"
                      placeholder="Min 6 characters"
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" size="md" className="w-full mt-2 gap-2 font-bold shadow-xs">
                  <span>Register & Launch Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>

              <div className="pt-3 border-t border-neutral-100 text-center text-xs text-neutral-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrors({});
                  }}
                  className="font-bold text-neutral-950 hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
