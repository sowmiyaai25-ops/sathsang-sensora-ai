import React, { useState } from 'react';
import { CheckCircle2, Edit3, Loader2, Mail, MapPin, Phone } from 'lucide-react';
import { BusinessContactConfig } from '../types/sensora';

interface ContactSectionProps {
  contactConfig: BusinessContactConfig;
  onUpdateContactConfig: (next: BusinessContactConfig) => void;
  onOpenConsultation: () => void;
  onOpenLegal: (tab: 'privacy' | 'terms') => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  contactConfig,
  onUpdateContactConfig,
  onOpenConsultation,
  onOpenLegal,
}) => {
  const [enquiryType, setEnquiryType] = useState<'contact' | 'project'>('contact');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedNotice, setSubmittedNotice] = useState<string | null>(null);
  const [editingPlaceholders, setEditingPlaceholders] = useState(false);

  const isPlaceholder = (val: string) => val.trim().startsWith('[');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmittedNotice(null);

    if (name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (message.trim().length < 10) {
      setError('Please provide at least a brief description of your enquiry.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: enquiryType,
          name,
          email,
          phone,
          subject,
          message,
        }),
      });
      const data = await res.json();
      setSubmittedNotice(
        `${data.referenceId}: ${data.notice}`
      );
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch {
      setError('Unable to send enquiry right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#111515] border-t border-white/10">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-white/10">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[#D5B77A]">
              Contact &amp; Studio Details
            </p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl text-[#F4EFE5]">
              Connect With SENSORA AI
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setEditingPlaceholders((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-white/15 bg-[#151A1A] text-xs text-[#F4EFE5]/80 hover:border-[#D5B77A] cursor-pointer w-fit"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#D5B77A]" />
            <span>
              {editingPlaceholders
                ? 'Done Editing Contact Placeholders'
                : 'Configure Official Contact Fields'}
            </span>
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details & Editable Placeholders + Map Placeholder */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#151A1A] space-y-5">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[#D5B77A]">
                  SATHSANG presents SENSORA AI
                </p>
                <p className="mt-1 text-sm text-[#F4EFE5]/75">
                  AI-Powered Interior Design &amp; Architectural Experiences
                </p>
                <p className="mt-1 text-xs text-[#F4EFE5]/55">Bengaluru, Karnataka, India</p>
              </div>

              {editingPlaceholders ? (
                <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
                  <p className="text-[#D5B77A]">
                    Edit placeholder fields below to preview your official business details across
                    the site:
                  </p>
                  <label className="block">
                    <span className="text-[#F4EFE5]/60">Official Address</span>
                    <input
                      type="text"
                      value={contactConfig.address}
                      onChange={(e) =>
                        onUpdateContactConfig({ ...contactConfig, address: e.target.value })
                      }
                      className="mt-1 w-full px-3 py-2 rounded bg-[#111515] border border-white/15 text-[#F4EFE5]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[#F4EFE5]/60">Business Email</span>
                    <input
                      type="text"
                      value={contactConfig.email}
                      onChange={(e) =>
                        onUpdateContactConfig({ ...contactConfig, email: e.target.value })
                      }
                      className="mt-1 w-full px-3 py-2 rounded bg-[#111515] border border-white/15 text-[#F4EFE5]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[#F4EFE5]/60">Business Phone</span>
                    <input
                      type="text"
                      value={contactConfig.phone}
                      onChange={(e) =>
                        onUpdateContactConfig({ ...contactConfig, phone: e.target.value })
                      }
                      className="mt-1 w-full px-3 py-2 rounded bg-[#111515] border border-white/15 text-[#F4EFE5]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[#F4EFE5]/60">Official WhatsApp</span>
                    <input
                      type="text"
                      value={contactConfig.whatsapp}
                      onChange={(e) =>
                        onUpdateContactConfig({ ...contactConfig, whatsapp: e.target.value })
                      }
                      className="mt-1 w-full px-3 py-2 rounded bg-[#111515] border border-white/15 text-[#F4EFE5]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[#F4EFE5]/60">Weekday Business Hours</span>
                    <input
                      type="text"
                      value={contactConfig.hoursWeekday}
                      onChange={(e) =>
                        onUpdateContactConfig({ ...contactConfig, hoursWeekday: e.target.value })
                      }
                      className="mt-1 w-full px-3 py-2 rounded bg-[#111515] border border-white/15 text-[#F4EFE5]"
                    />
                  </label>
                </div>
              ) : (
                <div className="space-y-4 pt-4 border-t border-white/10 text-xs sm:text-sm">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-[#D5B77A] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[#F4EFE5]/55 text-xs">Studio Address</p>
                      <p className="text-[#F4EFE5]">{contactConfig.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-4 h-4 text-[#D5B77A] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[#F4EFE5]/55 text-xs">Official Email</p>
                      {isPlaceholder(contactConfig.email) ? (
                        <p className="text-[#F4EFE5]/75">{contactConfig.email}</p>
                      ) : (
                        <a
                          href={`mailto:${contactConfig.email}`}
                          className="text-[#D5B77A] hover:underline"
                        >
                          {contactConfig.email}
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-4 h-4 text-[#D5B77A] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[#F4EFE5]/55 text-xs">Phone &amp; WhatsApp</p>
                      {isPlaceholder(contactConfig.phone) ? (
                        <p className="text-[#F4EFE5]/75">{contactConfig.phone}</p>
                      ) : (
                        <a
                          href={`tel:${contactConfig.phone}`}
                          className="text-[#D5B77A] hover:underline block"
                        >
                          {contactConfig.phone}
                        </a>
                      )}
                      <p className="text-[#F4EFE5]/60 text-xs mt-0.5">
                        WhatsApp: {contactConfig.whatsapp}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 text-xs space-y-1">
                    <p className="text-[#D5B77A] uppercase tracking-[0.14em]">Business Hours</p>
                    <p className="text-[#F4EFE5]/75">{contactConfig.hoursWeekday}</p>
                    <p className="text-[#F4EFE5]/55">{contactConfig.hoursWeekend}</p>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-3 text-xs">
                <button
                  type="button"
                  onClick={onOpenConsultation}
                  className="px-4 py-2 rounded-md bg-[#D5B77A] text-[#111515] font-semibold cursor-pointer"
                >
                  Open Consultation Scheduler
                </button>
                <button
                  type="button"
                  onClick={() => onOpenLegal('privacy')}
                  className="text-[#F4EFE5]/65 hover:text-[#D5B77A] cursor-pointer"
                >
                  Privacy Policy
                </button>
                <button
                  type="button"
                  onClick={() => onOpenLegal('terms')}
                  className="text-[#F4EFE5]/65 hover:text-[#D5B77A] cursor-pointer"
                >
                  Terms &amp; Conditions
                </button>
              </div>
            </div>

            {/* Bengaluru Architectural Studio Locator */}
            <div className="p-6 rounded-2xl border border-[#D5B77A]/25 bg-gradient-to-br from-[#0E1615] via-[#102B28]/45 to-[#111515] flex flex-col justify-between min-h-[210px] relative overflow-hidden">
              <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'linear-gradient(to right, rgba(213,183,122,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(213,183,122,0.22) 1px, transparent 1px)',
                  backgroundSize: '36px 36px',
                }}
              />
              <div className="relative z-10 flex items-center justify-between text-xs text-[#D5B77A]">
                <span className="uppercase tracking-[0.16em]">Bengaluru Experience Studio</span>
                <span className="font-mono-tabular text-[#F4EFE5]/70">12.9784° N · 77.6408° E</span>
              </div>
              <div className="relative z-10 my-4 p-4 rounded-xl bg-[#111515]/85 border border-[#D5B77A]/30 flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-full bg-[#102B28] border border-[#D5B77A] flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#D5B77A]" />
                </div>
                <div className="text-xs">
                  <p className="font-medium text-[#F4EFE5]">
                    Indiranagar Design District · Conceptual Studio Pin
                  </p>
                  <p className="text-[#F4EFE5]/70 mt-0.5">{contactConfig.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact & Project Enquiry Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl border border-white/10 bg-[#151A1A]">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="inline-flex p-1 rounded-lg bg-[#111515] border border-white/10">
                <button
                  type="button"
                  onClick={() => setEnquiryType('contact')}
                  className={`px-4 py-2 rounded-md text-xs uppercase tracking-[0.12em] cursor-pointer ${
                    enquiryType === 'contact'
                      ? 'bg-[#D5B77A] text-[#111515] font-semibold'
                      : 'text-[#F4EFE5]/70'
                  }`}
                >
                  General Contact
                </button>
                <button
                  type="button"
                  onClick={() => setEnquiryType('project')}
                  className={`px-4 py-2 rounded-md text-xs uppercase tracking-[0.12em] cursor-pointer ${
                    enquiryType === 'project'
                      ? 'bg-[#D5B77A] text-[#111515] font-semibold'
                      : 'text-[#F4EFE5]/70'
                  }`}
                >
                  Project Enquiry
                </button>
              </div>
              <span className="text-xs text-[#F4EFE5]/50">Demo Preview Form</span>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs text-[#F4EFE5]/70 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#111515] border border-white/15 text-sm text-[#F4EFE5] focus:outline-none focus:border-[#D5B77A]"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs text-[#F4EFE5]/70 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#111515] border border-white/15 text-sm text-[#F4EFE5] focus:outline-none focus:border-[#D5B77A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-phone" className="block text-xs text-[#F4EFE5]/70 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#111515] border border-white/15 text-sm text-[#F4EFE5] focus:outline-none focus:border-[#D5B77A]"
                  />
                </div>
                <div>
                  <label htmlFor="contact-subject" className="block text-xs text-[#F4EFE5]/70 mb-1.5">
                    {enquiryType === 'project' ? 'Project Scope / City' : 'Subject'}
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={
                      enquiryType === 'project'
                        ? 'e.g., Boutique Café · Bengaluru'
                        : 'e.g., Tile Sample Box / Press'
                    }
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#111515] border border-white/15 text-sm text-[#F4EFE5] focus:outline-none focus:border-[#D5B77A]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs text-[#F4EFE5]/70 mb-1.5">
                  Message &amp; Architectural Requirements *
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your space type, desired SENSORA World, surface interests, or timeline..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#111515] border border-white/15 text-sm text-[#F4EFE5] placeholder:text-[#F4EFE5]/35 focus:outline-none focus:border-[#D5B77A]"
                />
              </div>

              {error && (
                <p className="text-xs text-red-300" role="alert">
                  {error}
                </p>
              )}

              {submittedNotice && (
                <div className="p-4 rounded-lg bg-[#102B28]/80 border border-[#D5B77A]/40 flex items-start gap-2.5 text-xs text-[#F4EFE5]">
                  <CheckCircle2 className="w-4 h-4 text-[#D5B77A] shrink-0 mt-0.5" />
                  <span>{submittedNotice}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md bg-[#D5B77A] text-[#111515] text-xs font-semibold uppercase tracking-[0.16em] hover:bg-[#e5ca93] cursor-pointer disabled:opacity-60"
              >
                {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>
                  {enquiryType === 'project'
                    ? 'Submit Project Enquiry (Demo)'
                    : 'Send Message (Demo)'}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
