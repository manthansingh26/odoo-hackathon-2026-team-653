import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { PublicNavbar } from '../../components/layout/PublicNavbar';
import { PublicFooter } from '../../components/layout/PublicFooter';
import { validateEmail } from '../../utils/validation';

export const Login = () => {
  const { login, demoUsers, isAuthenticated, addToast } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();

  const initialRole = location.state?.role && demoUsers[location.state.role] ? location.state.role : 'Admin';
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [email, setEmail] = useState(demoUsers[initialRole]?.email || 'admin@urbanfurniture.in');
  const [password, setPassword] = useState('password123');
  const [errors, setErrors] = useState({});

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Handle route state updates
  useEffect(() => {
    if (location.state?.role && demoUsers[location.state.role]) {
      const role = location.state.role;
      setSelectedRole(role);
      setEmail(demoUsers[role].email);
      setErrors({});
    }
  }, [location.state, demoUsers]);

  // Quick 1-click demo login
  const handleQuickDemo = (roleKey) => {
    setErrors({});
    const demo = demoUsers[roleKey];
    setEmail(demo.email);
    setSelectedRole(roleKey);
    login(demo.email, 'password123', roleKey);
    navigate('/dashboard');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    const emailErr = validateEmail(email, true);
    if (emailErr) newErrors.email = emailErr;
    if (!password || !password.trim()) {
      newErrors.password = 'Password is required.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast({
        type: 'error',
        message: 'Please enter valid login credentials.'
      });
      return;
    }

    setErrors({});
    login(email, password, selectedRole);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between text-neutral-900 font-sans antialiased selection:bg-neutral-900 selection:text-white">
      <PublicNavbar />

      <main className="flex-1 flex flex-col justify-center items-center px-4 pt-24 pb-16 sm:pt-28 sm:pb-20">
        <div className="w-full max-w-md space-y-6">
          {/* Brand Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center p-3 bg-neutral-950 text-white rounded-xl shadow-xs mb-2">
            <span className="text-xl font-black font-mono tracking-widest uppercase">URBAN</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-950">
            URBAN ACCOUNTING SYSTEM
          </h1>
          <p className="text-xs text-neutral-500">
            Professional Enterprise Accounting & ERP Portal
          </p>
        </div>

        {/* Quick Demo Switcher Cards */}
        <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
              One-Click Demo Switcher
            </span>
            <Badge variant="outline" className="text-[10px]">Instant Access</Badge>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickDemo('Admin')}
              className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                selectedRole === 'Admin'
                  ? 'border-neutral-950 bg-neutral-950 text-white shadow-xs'
                  : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              <div className="text-xs font-bold truncate">Admin</div>
              <div className={`text-[10px] truncate ${selectedRole === 'Admin' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                Full ERP
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('Accountant')}
              className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                selectedRole === 'Accountant'
                  ? 'border-neutral-950 bg-neutral-950 text-white shadow-xs'
                  : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              <div className="text-xs font-bold truncate">Accountant</div>
              <div className={`text-[10px] truncate ${selectedRole === 'Accountant' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                Ledgers & P&L
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemo('Contact User')}
              className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                selectedRole === 'Contact User'
                  ? 'border-neutral-950 bg-neutral-950 text-white shadow-xs'
                  : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
              }`}
            >
              <div className="text-xs font-bold truncate">Client User</div>
              <div className={`text-[10px] truncate ${selectedRole === 'Contact User' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                Invoices Only
              </div>
            </button>
          </div>
        </div>

        {/* Credentials Form */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs">
          <form onSubmit={handleSubmit} noValidate className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-neutral-700 block mb-1">Select Access Role *</label>
              <Select
                value={selectedRole}
                onChange={(e) => {
                  const r = e.target.value;
                  setSelectedRole(r);
                  if (demoUsers[r]) setEmail(demoUsers[r].email);
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
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors(prev => ({ ...prev, email: null }));
                  }}
                  error={errors.email}
                  className="pl-9"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-neutral-700">Password *</label>
                <span className="text-[11px] text-neutral-400">Mock demo: any password</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors(prev => ({ ...prev, password: null }));
                  }}
                  error={errors.password}
                  className="pl-9"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full mt-2 gap-2">
              <span>Sign In to ERP</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-neutral-100 text-center text-xs text-neutral-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-bold text-neutral-950 hover:underline">
              Create New Account
            </Link>
          </div>
        </div>
      </div>
    </main>

    <PublicFooter />
    </div>
  );
};
