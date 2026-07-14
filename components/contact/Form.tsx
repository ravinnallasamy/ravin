'use client';

import { useState, useEffect } from 'react';

export function Form() {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', message: '', utmSource: 'direct' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Extract UTM Source safely on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const source = params.get('utm_source') || 'direct';
      setForm((prev) => ({ ...prev, utmSource: source }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message.');
      }

      setSuccess(true);
      // Reset input fields but preserve the UTM source
      setForm({ name: '', email: '', mobile: '', message: '', utmSource: form.utmSource });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-12">
      <div className="flex flex-col gap-8">
        <label htmlFor="name" className="text-mono-label font-mono text-ink-muted">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          disabled={loading}
          value={form.name}
          onChange={handleChange}
          className="rounded-lg border-none bg-surface px-16 py-8 text-body text-ink shadow-neu-inset outline-none transition-shadow focus:shadow-neu-inset focus:ring-1 focus:ring-accent/40 disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-8">
        <label htmlFor="email" className="text-mono-label font-mono text-ink-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          disabled={loading}
          value={form.email}
          onChange={handleChange}
          className="rounded-lg border-none bg-surface px-16 py-8 text-body text-ink shadow-neu-inset outline-none transition-shadow focus:shadow-neu-inset focus:ring-1 focus:ring-accent/40 disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-8">
        <label htmlFor="mobile" className="text-mono-label font-mono text-ink-muted">
          Mobile Number
        </label>
        <input
          id="mobile"
          name="mobile"
          type="tel"
          required
          disabled={loading}
          value={form.mobile}
          onChange={handleChange}
          className="rounded-lg border-none bg-surface px-16 py-8 text-body text-ink shadow-neu-inset outline-none transition-shadow focus:shadow-neu-inset focus:ring-1 focus:ring-accent/40 disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-8">
        <label htmlFor="message" className="text-mono-label font-mono text-ink-muted">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          required
          disabled={loading}
          value={form.message}
          onChange={handleChange}
          className="resize-none rounded-lg border-none bg-surface px-16 py-8 text-body text-ink shadow-neu-inset outline-none transition-shadow focus:shadow-neu-inset focus:ring-1 focus:ring-accent/40 disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-fit rounded-full bg-accent px-24 py-8 text-body text-paper shadow-glass hover:bg-accent-hover disabled:opacity-50"
      >
        {loading ? 'Sending...' : 'Send message'}
      </button>
    </form>
  );
}
