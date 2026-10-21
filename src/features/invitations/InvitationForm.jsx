import React, { useState } from 'react';
import { FormField, inputClasses } from '../../components/ui/FormField';
import { Button } from '../../components/ui/Button';
import { Copy, Share2, Check, MessageSquare } from 'lucide-react';

export function InvitationForm({
  invitation,
  onChange,
  onSave,
  guests = [],
}) {
  const [copied, setCopied] = useState(false);
  const [selectedGuestPhone, setSelectedGuestPhone] = useState('');

  const generateInvitationText = () => {
    return `🌸 *Wedding Invitation* 🌸\n\n` +
      `${invitation.host_names ? `${invitation.host_names}\n` : ''}` +
      `cordially invite you to celebrate the joyous wedding ceremony of\n\n` +
      `✨ *${invitation.couple_names}* ✨\n\n` +
      `📅 *Event:* ${invitation.function_name}\n` +
      `⏰ *Date & Time:* ${new Date(invitation.starts_at).toLocaleString('en-IN')}\n` +
      `📍 *Venue:* ${invitation.venue}\n` +
      `🗺️ *Address:* ${invitation.address}\n\n` +
      `${invitation.message ? `"${invitation.message}"\n\n` : ''}` +
      `Looking forward to celebrating with you! 🙏`;
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(generateInvitationText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const getWhatsAppShareUrl = () => {
    const text = encodeURIComponent(generateInvitationText());
    if (selectedGuestPhone) {
      const cleanPhone = selectedGuestPhone.replace(/[^0-9]/g, '');
      return `https://wa.me/${cleanPhone}?text=${text}`;
    }
    return `https://api.whatsapp.com/send?text=${text}`;
  };

  return (
    <div className="space-y-6">
      {/* Action Buttons for Sharing */}
      <div className="p-4 bg-sage-50/70 border border-sage-200/80 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-semibold text-stone-900">Share Digital Invitation</h4>
          <p className="text-xs text-stone-500">Copy formatted text or open directly in WhatsApp</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopyText}
            icon={copied ? Check : Copy}
          >
            {copied ? 'Copied!' : 'Copy Text'}
          </Button>

          <a
            href={getWhatsAppShareUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center font-medium rounded-xl text-xs gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp Share</span>
          </a>
        </div>
      </div>

      {/* Guest Quick Selector */}
      {guests.length > 0 && (
        <div className="p-3.5 bg-ivory-50 border border-stone-200/80 rounded-xl">
          <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
            Select Guest for Direct WhatsApp Link
          </label>
          <select
            value={selectedGuestPhone}
            onChange={(e) => setSelectedGuestPhone(e.target.value)}
            className={inputClasses}
          >
            <option value="">General (Open WhatsApp Share Dialog)</option>
            {guests.map((g) => (
              <option key={g.id} value={g.phone}>
                {g.name} ({g.phone})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Edit Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Couple Names" id="couple_names" required>
            <input
              id="couple_names"
              type="text"
              value={invitation.couple_names || ''}
              onChange={(e) => onChange({ ...invitation, couple_names: e.target.value })}
              className={inputClasses}
            />
          </FormField>

          <FormField label="Host / Family Names" id="host_names">
            <input
              id="host_names"
              type="text"
              placeholder="e.g. Sharma & Verma Families"
              value={invitation.host_names || ''}
              onChange={(e) => onChange({ ...invitation, host_names: e.target.value })}
              className={inputClasses}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Function Name" id="function_name" required>
            <input
              id="function_name"
              type="text"
              value={invitation.function_name || ''}
              onChange={(e) => onChange({ ...invitation, function_name: e.target.value })}
              className={inputClasses}
            />
          </FormField>

          <FormField label="Date & Time" id="starts_at" required>
            <input
              id="starts_at"
              type="datetime-local"
              value={invitation.starts_at || ''}
              onChange={(e) => onChange({ ...invitation, starts_at: e.target.value })}
              className={inputClasses}
            />
          </FormField>
        </div>

        <FormField label="Venue Name" id="venue" required>
          <input
            id="venue"
            type="text"
            value={invitation.venue || ''}
            onChange={(e) => onChange({ ...invitation, venue: e.target.value })}
            className={inputClasses}
          />
        </FormField>

        <FormField label="Full Address / Directions" id="address">
          <textarea
            id="address"
            rows={2}
            value={invitation.address || ''}
            onChange={(e) => onChange({ ...invitation, address: e.target.value })}
            className={inputClasses}
          />
        </FormField>

        <FormField label="Warm Invitation Message" id="message">
          <textarea
            id="message"
            rows={3}
            value={invitation.message || ''}
            onChange={(e) => onChange({ ...invitation, message: e.target.value })}
            className={inputClasses}
          />
        </FormField>

        {onSave && (
          <div className="flex justify-end pt-2">
            <Button onClick={() => onSave(invitation)}>
              Save Invitation Details
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default InvitationForm;
