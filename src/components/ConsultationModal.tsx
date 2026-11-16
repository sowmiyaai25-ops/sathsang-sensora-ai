import React, { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Trash2, X } from 'lucide-react';
import { TileProduct } from '../types/sensora';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefill?: {
    world?: string;
    spaceType?: string;
    city?: string;
    budget?: string;
    notes?: string;
  };
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  prefill,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [spaceType, setSpaceType] = useState('Living room / Residence');
  const [preferredWorld, setPreferredWorld] = useState('Forest World');
  const [budget, setBudget] = useState('₹5,00,000 – ₹15,00,000');
  const [preferredDate, setPreferredDate] = useState('');
  const [requirements, setRequirements] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<{
    referenceId: string;
    notice: string;
  } | null>(null);

  useEffect(() => {
    if (prefill) {
      if (prefill.world) setPreferredWorld(prefill.world);
      if (prefill.spaceType) setSpaceType(prefill.spaceType);
      if (prefill.city) setCity(prefill.city);
      if (prefill.budget) setBudget(prefill.budget);
      if (prefill.notes) setRequirements(prefill.notes);
    }
  }, [prefill]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (phone.trim().replace(/\D/g, '').length < 8) {
      setError('Please enter a valid contact phone number.');
      return;
    }
    if (!preferredDate) {
      setError('Please choose a preferred consultation date.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'consultation',
          name,
          email,
          phone,
          city,
          spaceType,
          preferredWorld,
          budget,
          preferredDate,
          requirements,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed.');
      setConfirmation({
        referenceId: data.referenceId,
        notice: data.notice,
      });
    } catch {
      setError('Unable to submit consultation enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Book a Consultation"
    >
      <div className="max-w-2xl w-full rounded-2xl border border-[#D5B77A]/35 bg-[#111515] p-6 sm:p-8 my-8">
        <div className="flex items-start justify-between gap-4 pb-5 border-b border-white/10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#D5B77A]">
              SATHSANG presents SENSORA AI
            </p>
            <h3 className="mt-1 font-display text-3xl text-[#F4EFE5]">Book a Consultation</h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setConfirmation(null);
              onClose();
            }}
            className="p-2 rounded-lg border border-white/15 text-[#F4EFE5]/70 hover:text-[#F4EFE5] cursor-pointer"
            aria-label="Close consultation modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {confirmation ? (
          <div className="py-8 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-[#D5B77A] mx-auto" />
            <h4 className="font-display text-2xl text-[#F4EFE5]">
              Demo Enquiry Captured
            </h4>
            <p className="font-mono-tabular text-xs text-[#D5B77A]">
              Reference: {confirmation.referenceId}
            </p>
            <p className="text-sm text-[#F4EFE5]/75 max-w-md mx-auto leading-relaxed">
              {confirmation.notice}
            </p>
            <button
              type="button"
              onClick={() => {
                setConfirmation(null);
                onClose();
              }}
              className="mt-4 px-6 py-2.5 rounded-md bg-[#D5B77A] text-[#111515] text-xs font-semibold uppercase tracking-[0.14em] cursor-pointer"
            >
              Return to Studio
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="consult-name" className="block text-xs text-[#F4EFE5]/70 mb-1">
                  Full Name *
                </label>
                <input
                  id="consult-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#161D1C] border border-white/15 text-sm text-[#F4EFE5] focus:outline-none focus:border-[#D5B77A]"
                />
              </div>
              <div>
                <label htmlFor="consult-email" className="block text-xs text-[#F4EFE5]/70 mb-1">
                  Email Address *
                </label>
                <input
                  id="consult-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#161D1C] border border-white/15 text-sm text-[#F4EFE5] focus:outline-none focus:border-[#D5B77A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="consult-phone" className="block text-xs text-[#F4EFE5]/70 mb-1">
                  Phone / WhatsApp *
                </label>
                <input
                  id="consult-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 ..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#161D1C] border border-white/15 text-sm text-[#F4EFE5] focus:outline-none focus:border-[#D5B77A]"
                />
              </div>
              <div>
                <label htmlFor="consult-city" className="block text-xs text-[#F4EFE5]/70 mb-1">
                  City
                </label>
                <input
                  id="consult-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#161D1C] border border-white/15 text-sm text-[#F4EFE5] focus:outline-none focus:border-[#D5B77A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="consult-space" className="block text-xs text-[#F4EFE5]/70 mb-1">
                  Type of Space
                </label>
                <select
                  id="consult-space"
                  value={spaceType}
                  onChange={(e) => setSpaceType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#161D1C] border border-white/15 text-sm text-[#F4EFE5]"
                >
                  <option>Living room / Residence</option>
                  <option>Villa / Penthouse</option>
                  <option>Café / Restaurant</option>
                  <option>Hotel / Resort</option>
                  <option>Corporate Office</option>
                  <option>Retail Showroom / Mall</option>
                  <option>Wellness Spa</option>
                </select>
              </div>
              <div>
                <label htmlFor="consult-world" className="block text-xs text-[#F4EFE5]/70 mb-1">
                  Preferred Design World
                </label>
                <select
                  id="consult-world"
                  value={preferredWorld}
                  onChange={(e) => setPreferredWorld(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#161D1C] border border-white/15 text-sm text-[#F4EFE5]"
                >
                  <option>Aqua World</option>
                  <option>Forest World</option>
                  <option>Cosmic World</option>
                  <option>Royal World</option>
                  <option>Desert World</option>
                  <option>Custom / Bespoke Mix</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="consult-budget" className="block text-xs text-[#F4EFE5]/70 mb-1">
                  Approximate Budget (INR)
                </label>
                <select
                  id="consult-budget"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#161D1C] border border-white/15 text-sm text-[#F4EFE5]"
                >
                  <option>₹2,00,000 – ₹5,00,000</option>
                  <option>₹5,00,000 – ₹15,00,000</option>
                  <option>₹15,00,000 – ₹40,00,000</option>
                  <option>₹40,00,000+ Commercial / Estate</option>
                </select>
              </div>
              <div>
                <label htmlFor="consult-date" className="block text-xs text-[#F4EFE5]/70 mb-1">
                  Preferred Consultation Date *
                </label>
                <input
                  id="consult-date"
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#161D1C] border border-white/15 text-sm text-[#F4EFE5]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="consult-req" className="block text-xs text-[#F4EFE5]/70 mb-1">
                Additional Requirements
              </label>
              <textarea
                id="consult-req"
                rows={3}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Dimensions, surfaces of interest, lighting goals, or project timeline..."
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#161D1C] border border-white/15 text-sm text-[#F4EFE5] placeholder:text-[#F4EFE5]/35"
              />
            </div>

            <p className="text-[11px] text-[#F4EFE5]/55 bg-[#161D1C] p-3 rounded-lg border border-white/10">
              Preview Disclosure: Submitting this form records your enquiry in this demo preview
              session only. It is not connected to a live business calendar or inbox until live
              credentials are configured.
            </p>

            {error && (
              <p className="text-xs text-red-300" role="alert">
                {error}
              </p>
            )}

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-md border border-white/15 text-xs text-[#F4EFE5]/80 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#D5B77A] text-[#111515] text-xs font-semibold uppercase tracking-[0.14em] hover:bg-[#e5ca93] cursor-pointer disabled:opacity-60"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Submit Enquiry (Demo)</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

interface SampleRequestModalProps {
  tile: TileProduct | null;
  onClose: () => void;
}

export const SampleRequestModal: React.FC<SampleRequestModalProps> = ({ tile, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [areaSqFt, setAreaSqFt] = useState('250');
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!tile) return null;

  const submitSample = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter your name and a valid email address.');
      return;
    }
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'sample_request',
          tileCode: tile.code,
          tileName: tile.name,
          name,
          email,
          city,
          areaSqFt,
        }),
      });
      const data = await res.json();
      setDone(
        `Sample request (${data.referenceId}) recorded in demo mode for ${tile.code} — ${tile.name}. Not connected to a live dispatch inbox.`
      );
    } catch {
      setError('Unable to submit sample request.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
      role="dialog"
      aria-modal="true"
      aria-label="Request Product Sample"
    >
      <div className="max-w-md w-full rounded-2xl border border-[#D5B77A]/35 bg-[#111515] p-6">
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div>
            <span className="font-mono-tabular text-xs text-[#D5B77A]">{tile.code}</span>
            <h3 className="font-display text-2xl text-[#F4EFE5]">Request Material Sample</h3>
          </div>
          <button
            type="button"
            onClick={() => {
              setDone(null);
              onClose();
            }}
            className="p-1.5 rounded border border-white/15 text-[#F4EFE5]/70 cursor-pointer"
            aria-label="Close sample modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {done ? (
          <div className="py-6 space-y-4 text-center">
            <CheckCircle2 className="w-10 h-10 text-[#D5B77A] mx-auto" />
            <p className="text-xs text-[#F4EFE5]/80 leading-relaxed">{done}</p>
            <button
              type="button"
              onClick={() => {
                setDone(null);
                onClose();
              }}
              className="px-5 py-2 rounded-md bg-[#D5B77A] text-[#111515] text-xs font-semibold cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submitSample} className="mt-5 space-y-4 text-xs">
            <p className="text-[#F4EFE5]/70">
              Surface: <strong className="text-[#F4EFE5]">{tile.name}</strong> ({tile.finish} ·{' '}
              {tile.material})
            </p>
            <input
              type="text"
              required
              placeholder="Your Full Name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#161D1C] border border-white/15 text-sm text-[#F4EFE5]"
            />
            <input
              type="email"
              required
              placeholder="Email Address *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#161D1C] border border-white/15 text-sm text-[#F4EFE5]"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#161D1C] border border-white/15 text-sm text-[#F4EFE5]"
              />
              <input
                type="number"
                placeholder="Approx. Sq.Ft"
                value={areaSqFt}
                onChange={(e) => setAreaSqFt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#161D1C] border border-white/15 text-sm text-[#F4EFE5]"
              />
            </div>
            {error && <p className="text-red-300">{error}</p>}
            <button
              type="submit"
              className="w-full py-3 rounded-md bg-[#D5B77A] text-[#111515] font-semibold uppercase tracking-[0.14em] cursor-pointer"
            >
              Submit Sample Request (Demo)
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

interface EnquiryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  enquiryTiles: TileProduct[];
  wishlistTiles: TileProduct[];
  onRemoveEnquiry: (id: string) => void;
  onProceedToConsultation: (notes: string) => void;
}

export const EnquiryDrawer: React.FC<EnquiryDrawerProps> = ({
  isOpen,
  onClose,
  enquiryTiles,
  wishlistTiles,
  onRemoveEnquiry,
  onProceedToConsultation,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/75"
      role="dialog"
      aria-modal="true"
      aria-label="Saved Surfaces and Enquiry List"
    >
      <div className="w-full max-w-md bg-[#111515] border-l border-white/15 h-full p-6 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <h3 className="font-display text-2xl text-[#F4EFE5]">Enquiry &amp; Wishlist</h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded border border-white/15 text-[#F4EFE5]/70 cursor-pointer"
              aria-label="Close drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-[#D5B77A] mb-3">
                Surface Enquiry List ({enquiryTiles.length})
              </p>
              {enquiryTiles.length === 0 ? (
                <p className="text-xs text-[#F4EFE5]/55">No tiles added to enquiry yet.</p>
              ) : (
                <div className="space-y-2.5">
                  {enquiryTiles.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#151A1A] border border-white/10 text-xs"
                    >
                      <div>
                        <span className="font-mono-tabular text-[#D5B77A]">{t.code}</span>
                        <p className="text-[#F4EFE5] font-medium">{t.name}</p>
                        <p className="font-mono-tabular text-[#F4EFE5]/60">
                          ₹{t.priceInrPerSqFt}/sq.ft (Illustrative)
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveEnquiry(t.id)}
                        className="p-1.5 text-red-300 hover:text-red-200 cursor-pointer"
                        aria-label={`Remove ${t.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10">
              <p className="text-xs uppercase tracking-[0.16em] text-[#D5B77A] mb-3">
                Saved Wishlist ({wishlistTiles.length})
              </p>
              {wishlistTiles.length === 0 ? (
                <p className="text-xs text-[#F4EFE5]/55">No saved wishlist surfaces yet.</p>
              ) : (
                <div className="space-y-2">
                  {wishlistTiles.map((t) => (
                    <div
                      key={t.id}
                      className="p-2.5 rounded-lg bg-[#151A1A] border border-white/10 text-xs flex justify-between"
                    >
                      <span className="text-[#F4EFE5]">{t.name}</span>
                      <span className="font-mono-tabular text-[#D5B77A]">{t.code}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {enquiryTiles.length > 0 && (
          <button
            type="button"
            onClick={() => {
              const summary = enquiryTiles.map((t) => `${t.code} (${t.name})`).join(', ');
              onClose();
              onProceedToConsultation(`Tile Enquiry List: ${summary}`);
            }}
            className="mt-6 w-full py-3 rounded-md bg-[#D5B77A] text-[#111515] text-xs font-semibold uppercase tracking-[0.14em] cursor-pointer"
          >
            Request Consultation for Selected Surfaces
          </button>
        )}
      </div>
    </div>
  );
};
