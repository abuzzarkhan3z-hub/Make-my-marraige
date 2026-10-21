import React from 'react';
import { Calendar, MapPin, Sparkles, Heart } from 'lucide-react';

export function InvitationPreview({ invitation }) {
  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return 'Date to be announced';
    try {
      const d = new Date(dateTimeStr);
      return d.toLocaleDateString('en-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateTimeStr;
    }
  };

  return (
    <div className="relative mx-auto max-w-md w-full bg-[#FCFAF6] rounded-3xl p-6 sm:p-8 shadow-card border-2 border-gold-300/60 overflow-hidden text-center text-stone-800">
      {/* Decorative Traditional Corner Motifs */}
      <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-gold-400/70 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-gold-400/70 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-gold-400/70 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-gold-400/70 rounded-br-lg pointer-events-none" />

      {/* Inner Decorative Border */}
      <div className="border border-gold-200/60 rounded-2xl p-6 relative">
        <div className="flex justify-center mb-3">
          <div className="w-10 h-10 rounded-full bg-gold-100/70 flex items-center justify-center text-gold-600">
            <Heart className="w-5 h-5 fill-gold-500 text-gold-600 animate-pulse" />
          </div>
        </div>

        {/* Host Names */}
        {invitation?.host_names && (
          <p className="text-xs uppercase tracking-widest text-sage-800 font-semibold mb-2">
            {invitation.host_names}
          </p>
        )}

        <p className="text-xs text-stone-500 italic mb-3">
          Cordially invite you to celebrate the wedding ceremony of
        </p>

        {/* Couple Names */}
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mb-2 text-sage-900">
          {invitation?.couple_names || 'The Couple'}
        </h3>

        {/* Function Name */}
        <div className="inline-block px-3 py-1 my-2 rounded-full bg-sage-100/80 text-sage-800 text-xs font-semibold tracking-wide">
          {invitation?.function_name || 'Wedding Celebration'}
        </div>

        {/* Date & Time */}
        <div className="my-5 py-3 border-y border-gold-200/50 flex flex-col items-center gap-1.5 text-stone-700 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-medium">
            <Calendar className="w-4 h-4 text-gold-600" />
            <span>{formatDateTime(invitation?.starts_at)}</span>
          </div>
        </div>

        {/* Venue & Address */}
        <div className="space-y-1 mb-5">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-stone-800 uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-sage-700" />
            <span>{invitation?.venue || 'Venue Name'}</span>
          </div>
          {invitation?.address && (
            <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
              {invitation.address}
            </p>
          )}
        </div>

        {/* Warm Custom Message */}
        {invitation?.message && (
          <p className="text-xs text-stone-600 italic bg-ivory-100/80 p-3 rounded-xl border border-stone-100">
            "{invitation.message}"
          </p>
        )}

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-gold-700 font-medium">
          <Sparkles className="w-3 h-3 text-gold-500" />
          <span>Blessings & Warm Wishes Awaited</span>
          <Sparkles className="w-3 h-3 text-gold-500" />
        </div>
      </div>
    </div>
  );
}

export default InvitationPreview;
