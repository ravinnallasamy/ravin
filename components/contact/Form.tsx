'use client';

import { useState } from 'react';
import socialJson from '@/content/social.json';

export function Form() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Message from ${form.name || 'your site'}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${socialJson.email}?subject=${subject}&body=${body}`;
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
          value={form.name}
          onChange={handleChange}
          className="rounded-lg border-none bg-surface px-16 py-8 text-body text-ink shadow-neu-inset outline-none transition-shadow focus:shadow-neu-inset focus:ring-1 focus:ring-accent/40"
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
          value={form.email}
          onChange={handleChange}
          className="rounded-lg border-none bg-surface px-16 py-8 text-body text-ink shadow-neu-inset outline-none transition-shadow focus:shadow-neu-inset focus:ring-1 focus:ring-accent/40"
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
          value={form.message}
          onChange={handleChange}
          className="resize-none rounded-lg border-none bg-surface px-16 py-8 text-body text-ink shadow-neu-inset outline-none transition-shadow focus:shadow-neu-inset focus:ring-1 focus:ring-accent/40"
        />
      </div>

      <button
        type="submit"
        className="w-fit rounded-full bg-accent px-24 py-8 text-body text-paper shadow-glass hover:bg-accent-hover"
      >
        Send message
      </button>
    </form>
  );
}
