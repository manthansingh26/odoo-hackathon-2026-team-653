import React, { useState } from 'react';
import { User, Building2, Mail, Phone, MapPin, Shield, Check } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';

export const ProfilePage = () => {
  const { userRole, data, activeContactId, addToast } = useAppContext();

  const isContact = userRole === 'Contact User';
  const myContact = (data.contacts || []).find(c => c.id === activeContactId) || {
    name: 'Nimesh Pathak',
    email: 'nimesh.pathak@techcraft.io',
    mobile: '+91 98765 43210',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400018',
    address: 'Flat 801, Sea View Towers, Worli'
  };

  const [name, setName] = useState(isContact ? myContact.name : 'Aarav Mehta');
  const [email, setEmail] = useState(isContact ? myContact.email : 'accounts@urbanfurniture.in');
  const [phone, setPhone] = useState(isContact ? myContact.mobile : '+91 98200 12345');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    addToast({
      title: "Profile Updated",
      message: "Your contact coordinates have been refreshed.",
      type: "success"
    });
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-neutral-950">Account Profile</h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          {isContact ? 'Manage your corporate customer profile and billing details.' : 'Administrator security & ERP preferences.'}
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-neutral-950 text-white flex items-center justify-center text-xl font-bold font-mono">
            {name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <CardTitle>{name}</CardTitle>
            <p className="text-xs text-neutral-500 mt-1">Role: {userRole} • Urban Furniture Network</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-neutral-700 block mb-1">Full Name *</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Email Address *</label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Phone Number *</label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </div>
            </div>

            {isContact && (
              <>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Billing Street Address</label>
                  <Input defaultValue={myContact.address} />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">City</label>
                    <Input defaultValue={myContact.city} />
                  </div>
                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">State</label>
                    <Input defaultValue={myContact.state} />
                  </div>
                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">Pincode</label>
                    <Input defaultValue={myContact.pincode} />
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end pt-3 border-t border-neutral-100">
              <Button type="submit" variant="primary" size="sm" className="gap-1.5">
                {saved && <Check className="w-3.5 h-3.5" />}
                {saved ? 'Saved Successfully' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
