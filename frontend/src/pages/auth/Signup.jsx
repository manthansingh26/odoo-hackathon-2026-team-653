import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Building, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { Input, Select } from '../../components/ui/Input';

export const Signup = () => {
  const { signup, isAuthenticated } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: 'Urban Furniture Client',
    password: '',
    role: 'Admin'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
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
            Create an Account
          </h1>
          <p className="text-xs text-neutral-500">
            Join the Urban Furniture Enterprise Accounting network
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-neutral-700 block mb-1">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <Input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="pl-9"
                  placeholder="e.g. Apex Living Pvt Ltd"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-neutral-700 block mb-1">Assign User Role *</label>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="pl-9"
                  placeholder="Min 6 characters"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full mt-2 gap-2">
              <span>Register & Launch Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-neutral-100 text-center text-xs text-neutral-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-neutral-950 hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
