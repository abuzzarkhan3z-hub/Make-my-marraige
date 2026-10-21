import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { InvitationForm } from '../features/invitations/InvitationForm';
import { InvitationPreview } from '../features/invitations/InvitationPreview';
import { FormField, inputClasses } from '../components/ui/FormField';
import { UserPlus, Users, Trash2 } from 'lucide-react';

export function Invitations({
  invitation,
  onUpdateInvitation,
  guests = [],
  onAddGuest,
  onDeleteGuest,
}) {
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [isAddingGuest, setIsAddingGuest] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState(false);

  const handleSaveInvitation = (updated) => {
    onUpdateInvitation(updated);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2500);
  };

  const handleAddGuestSubmit = (e) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    onAddGuest({
      id: `g-${Date.now()}`,
      wedding_id: 'wed-001',
      name: newGuestName.trim(),
      phone: newGuestPhone.trim(),
    });
    setNewGuestName('');
    setNewGuestPhone('');
    setIsAddingGuest(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wedding Invitations"
        subtitle="Design your digital wedding invite, preview live changes, and share via WhatsApp"
        badge={saveFeedback ? 'Changes Saved!' : null}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Guests (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card padding="default">
            <CardHeader
              title="Invitation Details"
              subtitle="Customize ceremony wording, venue, date, and personal message"
            />
            <div className="mt-5">
              <InvitationForm
                invitation={invitation}
                onChange={onUpdateInvitation}
                onSave={handleSaveInvitation}
                guests={guests}
              />
            </div>
          </Card>

          {/* Guest List Management for WhatsApp Invites */}
          <Card padding="default">
            <CardHeader
              title="Guest Contacts"
              subtitle="Quick phone numbers to share personalized invitations"
              action={
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsAddingGuest(!isAddingGuest)}
                  icon={UserPlus}
                >
                  {isAddingGuest ? 'Cancel' : 'Add Guest'}
                </Button>
              }
            />

            {/* Quick Add Guest Form */}
            {isAddingGuest && (
              <form onSubmit={handleAddGuestSubmit} className="mt-4 p-4 rounded-xl bg-ivory-50 border border-stone-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <FormField label="Guest / Family Name" id="g_name" required>
                    <input
                      id="g_name"
                      type="text"
                      placeholder="e.g. Ramesh Uncle & Family"
                      value={newGuestName}
                      onChange={(e) => setNewGuestName(e.target.value)}
                      className={inputClasses}
                    />
                  </FormField>
                  <FormField label="WhatsApp Phone Number" id="g_phone">
                    <input
                      id="g_phone"
                      type="tel"
                      placeholder="e.g. +919876543210"
                      value={newGuestPhone}
                      onChange={(e) => setNewGuestPhone(e.target.value)}
                      className={inputClasses}
                    />
                  </FormField>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="submit" size="sm">
                    Save Guest
                  </Button>
                </div>
              </form>
            )}

            {/* Guest List Table */}
            <div className="mt-4 divide-y divide-stone-100">
              {guests.length === 0 ? (
                <p className="text-sm text-stone-400 py-4 text-center">No guests added yet.</p>
              ) : (
                guests.map((guest) => (
                  <div key={guest.id} className="py-2.5 flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium text-stone-900">{guest.name}</span>
                      {guest.phone && (
                        <span className="text-xs text-stone-400 ml-2 font-mono">{guest.phone}</span>
                      )}
                    </div>
                    <button
                      onClick={() => onDeleteGuest(guest.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 rounded transition-colors"
                      title="Remove guest"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Live Invitation Preview (5 cols) */}
        <div className="lg:col-span-5 sticky top-20">
          <div className="mb-3 text-center sm:text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Live Digital Preview
            </span>
          </div>
          <InvitationPreview invitation={invitation} />
        </div>
      </div>
    </div>
  );
}

export default Invitations;
