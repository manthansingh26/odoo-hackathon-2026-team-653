import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, UserCheck, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';

export const Login = () => {
  const { login, demoUsers } = useAppContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@urbanfurniture.in');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState('Admin');

  // Quick 1-click demo login
  const handleQuickDemo = (roleKey) => {
    const demo = demoUsers[roleKey];
    setEmail(demo.email);
    setSelectedRole(roleKey);
    login(demo.email, 'password123', roleKey);
    if (roleKey === 'Contact User') {
      navigate('/dashboard');
    } else {
      navigate('/dashboard');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password, selectedRole);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-screen bg-[#fafafa] flex flex-col justify-center items-center p-4 sm:p-6">
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
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
                  onChange={(e) => setEmail(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
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

        <div className="text-center text-[11px] text-neutral-400">
          Urban Furniture Pvt. Ltd. &copy; 2026. All rights reserved.
        </div>
      </div>
    </div>
  );
};
