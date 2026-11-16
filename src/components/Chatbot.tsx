import React, { useEffect, useRef, useState } from 'react';
import { Loader2, MessageSquare, Send, X } from 'lucide-react';
import { BrandEmblem } from './BrandLogo';
import { ChatMessage, NavSection } from '../types/sensora';

interface ChatbotProps {
  onNavigate: (section: NavSection) => void;
  onOpenConsultation: () => void;
}

const STARTER_PROMPTS = [
  'Help me design my living room.',
  'Find tiles for my bedroom.',
  'I want an underwater café.',
  'Suggest lighting for my restaurant.',
  'Book a design consultation.',
  'Show me luxury interior ideas.',
];

export const Chatbot: React.FC<ChatbotProps> = ({
  onNavigate,
  onOpenConsultation,
}) => {
  const [open, setOpen] = useState(false);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHandoffForm, setShowHandoffForm] = useState(false);
  const [handoffName, setHandoffName] = useState('');
  const [handoffEmail, setHandoffEmail] = useState('');
  const [handoffConsent, setHandoffConsent] = useState(false);
  const [handoffStatus, setHandoffStatus] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        "Welcome to SENSORA AI. I'm your personal design assistant. Let's create a space that feels like another world.",
      suggestedActions: [
        { label: 'Explore Five Worlds', target: 'worlds' },
        { label: 'Open AI Designer', target: 'ai-designer' },
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then((d) => setAiConfigured(Boolean(d.aiConfigured)))
      .catch(() => setAiConfigured(false));
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: nextHistory.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'How can I assist with your spatial vision today?',
        source: data.source,
        suggestedActions: data.suggestedActions,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          source: 'demo-assistant',
          content:
            'I am currently operating in offline demo mode. Please use our navigation bar to explore Worlds, AI Designer, Tile Atelier, or Book a Consultation.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (target: NavSection | 'consultation') => {
    if (target === 'consultation') {
      onOpenConsultation();
    } else {
      onNavigate(target);
    }
  };

  const submitHandoff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handoffConsent || !handoffName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(handoffEmail)) {
      setHandoffStatus('Please provide name, valid email, and consent.');
      return;
    }
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'chatbot_handoff',
          name: handoffName,
          email: handoffEmail,
          consent: handoffConsent,
          transcriptSummary: messages.slice(-4).map((m) => m.content).join(' | '),
        }),
      });
      const data = await res.json();
      setHandoffStatus(`Recorded (${data.referenceId}) in preview demo mode.`);
      setShowHandoffForm(false);
    } catch {
      setHandoffStatus('Could not record handoff.');
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group flex items-center gap-3 px-4 py-3 rounded-full bg-[#102B28] border border-[#D5B77A]/60 text-[#F4EFE5] shadow-[0_12px_36px_rgba(0,0,0,0.55)] hover:border-[#D5B77A] transition-all cursor-pointer"
          aria-label="Open SENSORA DESIGN INTELLIGENCE assistant"
        >
          <BrandEmblem className="w-7 h-7" />
          <span className="hidden sm:inline text-xs font-medium uppercase tracking-[0.14em] text-[#D5B77A]">
            Sensora Assistant
          </span>
          <MessageSquare className="w-4 h-4 sm:hidden text-[#D5B77A]" />
        </button>
      ) : (
        <div
          className="w-[min(92vw,400px)] h-[min(78vh,580px)] rounded-2xl border border-[#D5B77A]/40 bg-[#111515] shadow-[0_20px_60px_rgba(0,0,0,0.75)] flex flex-col overflow-hidden"
          role="dialog"
          aria-label="SENSORA DESIGN INTELLIGENCE"
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-[#102B28] border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BrandEmblem className="w-8 h-8" />
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#F4EFE5]">
                  Sensora Design Intelligence
                </h3>
                <p className="text-[11px] text-[#D5B77A]">
                  {aiConfigured ? 'AI Studio Connected' : 'Demo Assistant Mode'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-md border border-white/15 text-[#F4EFE5]/75 hover:text-[#F4EFE5] cursor-pointer"
              aria-label="Close assistant"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#D5B77A] text-[#111515] font-medium'
                      : 'bg-[#161E1D] border border-white/10 text-[#F4EFE5]/90'
                  }`}
                >
                  <p>{m.content}</p>
                  {m.suggestedActions && m.suggestedActions.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-white/10 flex flex-wrap gap-1.5">
                      {m.suggestedActions.map((act) => (
                        <button
                          key={act.label}
                          type="button"
                          onClick={() => handleActionClick(act.target)}
                          className="px-2.5 py-1 rounded bg-[#102B28] border border-[#D5B77A]/40 text-[11px] text-[#D5B77A] hover:bg-[#163b37] cursor-pointer"
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="mt-1 text-[10px] text-[#F4EFE5]/40">
                  {m.timestamp}
                  {m.source ? ` · ${m.source === 'gemini-ai' ? 'AI' : 'Demo'}` : ''}
                </span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-[#D5B77A] text-xs">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Composing response...</span>
              </div>
            )}

            {/* Starter Prompts when chat just opened */}
            {messages.length <= 2 && (
              <div className="pt-2 space-y-1.5">
                <p className="text-[11px] uppercase tracking-[0.14em] text-[#F4EFE5]/50">
                  Suggested Prompts
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {STARTER_PROMPTS.map((sp) => (
                    <button
                      key={sp}
                      type="button"
                      onClick={() => sendMessage(sp)}
                      className="text-left px-2.5 py-1.5 rounded-lg bg-[#151A1A] border border-white/10 text-[11px] text-[#F4EFE5]/80 hover:border-[#D5B77A]/50 cursor-pointer"
                    >
                      {sp}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Lead Handoff Box */}
            {showHandoffForm && (
              <form
                onSubmit={submitHandoff}
                className="p-3 rounded-xl bg-[#151B1A] border border-[#D5B77A]/35 space-y-2.5"
              >
                <p className="font-medium text-[#D5B77A]">Share Contact for Follow-up (Demo)</p>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={handoffName}
                  onChange={(e) => setHandoffName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-[#111515] border border-white/15 text-[#F4EFE5]"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={handoffEmail}
                  onChange={(e) => setHandoffEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded bg-[#111515] border border-white/15 text-[#F4EFE5]"
                />
                <label className="flex items-start gap-2 text-[11px] text-[#F4EFE5]/70">
                  <input
                    type="checkbox"
                    checked={handoffConsent}
                    onChange={(e) => setHandoffConsent(e.target.checked)}
                    className="mt-0.5 accent-[#D5B77A]"
                  />
                  <span>I consent to record these details in this preview session.</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded bg-[#D5B77A] text-[#111515] font-semibold cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowHandoffForm(false)}
                    className="px-3 py-1.5 rounded border border-white/15 text-[#F4EFE5]/70 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {handoffStatus && (
              <p className="text-[11px] text-[#D5B77A] bg-[#102B28]/70 p-2 rounded">
                {handoffStatus}
              </p>
            )}
          </div>

          {/* Input Bar */}
          <div className="p-3 bg-[#151A1A] border-t border-white/10 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-[#F4EFE5]/55 px-1">
              <button
                type="button"
                onClick={() => setShowHandoffForm((v) => !v)}
                className="hover:text-[#D5B77A] cursor-pointer"
              >
                Leave contact details
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onNavigate('contact');
                }}
                className="hover:text-[#D5B77A] cursor-pointer"
              >
                Go to Contact Form
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about worlds, tiles, lighting, or your space..."
                className="flex-1 px-3 py-2 rounded-lg bg-[#111515] border border-white/15 text-xs text-[#F4EFE5] placeholder:text-[#F4EFE5]/40 focus:outline-none focus:border-[#D5B77A]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-3 py-2 rounded-lg bg-[#D5B77A] text-[#111515] hover:bg-[#e5ca93] disabled:opacity-50 cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
