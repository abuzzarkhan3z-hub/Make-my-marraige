import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FormField, inputClasses } from '../components/ui/FormField';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { 
  ShieldCheck, 
  UserPlus, 
  Trash2, 
  Save, 
  Info, 
  LogOut, 
  Check, 
  Settings as SettingsIcon,
  Users
} from 'lucide-react';

export function SettingsAdmin({
  wedding,
  onUpdateWedding,
  members = [],
  onAddMember,
  onDeleteMember,
}) {
  const [weddingForm, setWeddingForm] = useState({
    name: wedding?.name || '',
    couple_names: wedding?.couple_names || '',
    budget: wedding?.budget || 2500000,
    currency: wedding?.currency || 'INR',
    main_date: wedding?.main_date || '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  // New member form
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Family Member',
  });

  const [deletingMember, setDeletingMember] = useState(null);

  const handleWeddingSubmit = (e) => {
    e.preventDefault();
    onUpdateWedding({
      ...wedding,
      ...weddingForm,
      budget: Number(weddingForm.budget) || 0,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddMemberSubmit = (e) => {
    e.preventDefault();
    if (!newMember.name.trim()) return;
    onAddMember({
      id: `mem-${Date.now()}`,
      wedding_id: 'wed-001',
      name: newMember.name.trim(),
      email: newMember.email.trim() || `${newMember.name.toLowerCase().replace(/\s+/g, '')}@family.com`,
      role: newMember.role,
    });
    setNewMember({ name: '', email: '', role: 'Family Member' });
    setIsAddingMember(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & Admin"
        subtitle="Manage wedding parameters, budget limit, and family access roles"
        badge={savedSuccess ? 'Settings Saved' : null}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Wedding Core Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card padding="default">
            <CardHeader
              title="Wedding Details & Budget"
              subtitle="Configure couple names, celebration date, and total budget limit"
            />
            <form onSubmit={handleWeddingSubmit} className="mt-5 space-y-4">
              <FormField label="Wedding Celebration Name" id="wed_name" required>
                <input
                  id="wed_name"
                  type="text"
                  value={weddingForm.name}
                  onChange={(e) => setWeddingForm({ ...weddingForm, name: e.target.value })}
                  className={inputClasses}
                />
              </FormField>

              <FormField label="Couple Names" id="couple_names" required>
                <input
                  id="couple_names"
                  type="text"
                  value={weddingForm.couple_names}
                  onChange={(e) => setWeddingForm({ ...weddingForm, couple_names: e.target.value })}
                  className={inputClasses}
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Total Wedding Budget (₹)" id="budget" required>
                  <input
                    id="budget"
                    type="number"
                    min="0"
                    step="50000"
                    value={weddingForm.budget}
                    onChange={(e) => setWeddingForm({ ...weddingForm, budget: e.target.value })}
                    className={inputClasses}
                  />
                </FormField>

                <FormField label="Preferred Currency" id="currency">
                  <select
                    id="currency"
                    value={weddingForm.currency}
                    onChange={(e) => setWeddingForm({ ...weddingForm, currency: e.target.value })}
                    className={inputClasses}
                  >
                    <option value="INR">INR (₹) - Indian Rupee</option>
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="AED">AED (د.إ) - UAE Dirham</option>
                    <option value="GBP">GBP (£) - British Pound</option>
                  </select>
                </FormField>
              </div>

              <FormField label="Main Wedding Ceremony Date" id="main_date">
                <input
                  id="main_date"
                  type="date"
                  value={weddingForm.main_date}
                  onChange={(e) => setWeddingForm({ ...weddingForm, main_date: e.target.value })}
                  className={inputClasses}
                />
              </FormField>

              <div className="flex justify-end pt-2">
                <Button type="submit" icon={savedSuccess ? Check : Save}>
                  {savedSuccess ? 'Changes Saved!' : 'Save Wedding Settings'}
                </Button>
              </div>
            </form>
          </Card>

          {/* Account Profile Card */}
          <Card padding="default">
            <CardHeader
              title="Account & Session"
              subtitle="Your current prototype session credentials"
            />
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-stone-900">Ananya Sharma</p>
                <p className="text-xs text-stone-500">ananya@example.com &bull; Primary Wedding Administrator</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                icon={LogOut}
                onClick={() => alert('Prototype mode: You are signed in as Primary Admin.')}
              >
                Sign Out
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column: Family Access & Roles (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card padding="default">
            <CardHeader
              title="Family Members & Roles"
              subtitle="Manage who has access to coordinate"
              action={
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsAddingMember(!isAddingMember)}
                  icon={UserPlus}
                >
                  {isAddingMember ? 'Cancel' : 'Add'}
                </Button>
              }
            />

            {/* Backend Security Notice per PRD */}
            <div className="my-4 p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 leading-relaxed">
              <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Prototype Note: </span>
                In the production backend phase, permissions and data isolation are strictly enforced via Supabase Row-Level Security (RLS) policies.
              </div>
            </div>

            {/* Add Member Form */}
            {isAddingMember && (
              <form onSubmit={handleAddMemberSubmit} className="p-3.5 bg-ivory-50 border border-stone-200 rounded-xl space-y-3 mb-4">
                <FormField label="Full Name" id="m_name" required>
                  <input
                    id="m_name"
                    type="text"
                    placeholder="e.g. Ramesh Uncle"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                    className={inputClasses}
                  />
                </FormField>

                <FormField label="Email (Optional)" id="m_email">
                  <input
                    id="m_email"
                    type="email"
                    placeholder="ramesh@example.com"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                    className={inputClasses}
                  />
                </FormField>

                <FormField label="Role" id="m_role">
                  <select
                    id="m_role"
                    value={newMember.role}
                    onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                    className={inputClasses}
                  >
                    <option value="Admin">Admin (Full Control)</option>
                    <option value="Family Member">Family Member (Assigned Tasks)</option>
                    <option value="Viewer">Viewer (Read Only)</option>
                  </select>
                </FormField>

                <div className="flex justify-end gap-2">
                  <Button type="submit" size="sm">
                    Add Member
                  </Button>
                </div>
              </form>
            )}

            {/* Member List */}
            <div className="divide-y divide-stone-100">
              {members.map((m) => (
                <div key={m.id} className="py-3 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-semibold text-stone-900">{m.name}</h5>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        m.role === 'Admin'
                          ? 'bg-sage-100 text-sage-800'
                          : m.role === 'Family Member'
                          ? 'bg-stone-100 text-stone-700'
                          : 'bg-ivory-200 text-stone-600'
                      }`}>
                        {m.role}
                      </span>
                      <span className="text-xs text-stone-400">{m.email}</span>
                    </div>
                  </div>

                  {members.length > 1 && (
                    <button
                      onClick={() => setDeletingMember(m)}
                      className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg transition-colors"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deletingMember}
        onClose={() => setDeletingMember(null)}
        onConfirm={() => {
          if (deletingMember) onDeleteMember(deletingMember.id);
        }}
        title="Remove Family Member"
        message={`Are you sure you want to remove "${deletingMember?.name}" from this wedding?`}
      />
    </div>
  );
}

export default SettingsAdmin;
