import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { createWedding } from '../../services/weddings';
import { X, CalendarHeart, Sparkles, Building, MapPin, Calendar, IndianRupee, AlertCircle } from 'lucide-react';

export function CreateWeddingModal({ isOpen, onClose, onWeddingCreated }) {
  const [name, setName] = useState('');
  const [coupleNames, setCoupleNames] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide a wedding name.');
      return;
    }

    setLoading(true);
    try {
      const newWedding = await createWedding({
        name: name.trim(),
        couple_names: coupleNames.trim() || name.trim(),
        wedding_date: weddingDate || null,
        venue: venue.trim() || null,
        city: city.trim() || null,
        budget: Number(budget) || 0,
      });

      onWeddingCreated(newWedding);
      onClose();
    } catch (err) {
      console.error('Failed to create wedding:', err);
      setError(err.message || 'Failed to create wedding.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-modal border border-stone-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-sage-800 to-sage-700 px-6 py-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/70 hover:text-white p-1 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-gold-300 text-xs font-medium mb-1">
            <Sparkles className="w-4 h-4" />
            <span>New Wedding Workspace</span>
          </div>
          <h2 className="font-serif text-xl font-bold text-ivory-50">
            Create a Wedding
          </h2>
          <p className="text-xs text-sage-200 mt-1">
            Set up your wedding details. You will automatically be assigned as the wedding Administrator.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Wedding Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ananya & Rohan's Wedding Celebration"
              className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-hidden focus:border-sage-600 focus:ring-1 focus:ring-sage-600 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Couple Names
              </label>
              <input
                type="text"
                value={coupleNames}
                onChange={(e) => setCoupleNames(e.target.value)}
                placeholder="e.g. Ananya & Rohan"
                className="w-full px-3.5 py-2 text-sm border border-stone-200 rounded-xl focus:outline-hidden focus:border-sage-600 focus:ring-1 focus:ring-sage-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Wedding Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="date"
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-hidden focus:border-sage-600 focus:ring-1 focus:ring-sage-600 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Main Venue
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Grand Palace Banquet"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-hidden focus:border-sage-600 focus:ring-1 focus:ring-sage-600 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                City
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Bangalore"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-hidden focus:border-sage-600 focus:ring-1 focus:ring-sage-600 transition-colors"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Planned Total Budget (₹ INR)
            </label>
            <div className="relative">
              <IndianRupee className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              <input
                type="number"
                min="0"
                step="1000"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="e.g. 2500000"
                className="w-full pl-9 pr-3 py-2 text-sm border border-stone-200 rounded-xl focus:outline-hidden focus:border-sage-600 focus:ring-1 focus:ring-sage-600 transition-colors"
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Stored securely in integer paise in database and converted for display.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <Button variant="ghost" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Wedding'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
