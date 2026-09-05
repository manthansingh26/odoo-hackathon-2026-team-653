import React, { useState } from 'react';
import { Settings as SettingsIcon, Building, Shield, Check } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export const Settings = () => {
  const { data, updateRecord, addToast } = useAppContext();
  const [company, setCompany] = useState(data.company || {});
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    // Persist company details in local state
    if (typeof updateRecord === 'function') {
      try {
        localStorage.setItem('urban_erp_company', JSON.stringify(company));
      } catch (err) {
        // ignore localStorage error if storage is unavailable
      }
    }
    addToast({
      title: "Settings Updated",
      message: "Company profile and statutory parameters updated for current session.",
      type: "success"
    });
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="border-b border-neutral-200 pb-3">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-950">System & ERP Settings</h1>
        <p className="text-xs text-neutral-500 mt-0.5">
          Configure legal entity data, taxation codes, bank details, and prototype environment.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5 text-xs">
        <Card>
          <CardHeader>
            <CardTitle>Company Identity & Brand</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Company Registered Name *</label>
                <Input
                  value={company.name}
                  onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Brand Name *</label>
                <Input
                  value={company.brandName}
                  onChange={(e) => setCompany({ ...company, brandName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-neutral-700 block mb-1">Registered Address</label>
              <Textarea
                rows={2}
                value={company.address}
                onChange={(e) => setCompany({ ...company, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Support Email</label>
                <Input
                  type="email"
                  value={company.email}
                  onChange={(e) => setCompany({ ...company, email: e.target.value })}
                />
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Phone Helpline</label>
                <Input
                  value={company.phone}
                  onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statutory Tax & Bank Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">GSTIN Identification *</label>
                <Input
                  value={company.gstin}
                  onChange={(e) => setCompany({ ...company, gstin: e.target.value })}
                  className="font-mono"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Income Tax PAN *</label>
                <Input
                  value={company.pan}
                  onChange={(e) => setCompany({ ...company, pan: e.target.value })}
                  className="font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="font-semibold text-neutral-700 block mb-1">Bank Name</label>
                <Input
                  value={company.bank}
                  onChange={(e) => setCompany({ ...company, bank: e.target.value })}
                />
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Account Number</label>
                <Input
                  value={company.accountNo}
                  onChange={(e) => setCompany({ ...company, accountNo: e.target.value })}
                  className="font-mono"
                />
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">IFSC Code</label>
                <Input
                  value={company.ifsc}
                  onChange={(e) => setCompany({ ...company, ifsc: e.target.value })}
                  className="font-mono"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-end pt-2">
          <Button type="submit" variant="primary" size="sm" className="gap-1.5">
            {saved && <Check className="w-3.5 h-3.5" />}
            {saved ? 'Saved' : 'Save Configurations'}
          </Button>
        </div>
      </form>
    </div>
  );
};
