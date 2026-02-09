import React, { useState } from 'react';
import { Award, X, Loader2, Upload } from 'lucide-react';
import { createCertificate } from '../api/client';

/** Shown only when running locally (import.meta.env.DEV). Upload certificates to the gallery. */
export const AddCertificate: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    orientation: 'portrait' as 'portrait' | 'landscape',
    image: null as File | null
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'orientation' ? (value as 'portrait' | 'landscape') : value
    }));
    setStatus('idle');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setForm((prev) => ({ ...prev, image: file || null }));
    setStatus('idle');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image) {
      setStatus('error');
      setMessage('Please select a certificate image.');
      return;
    }
    setSubmitting(true);
    setStatus('idle');
    try {
      const fd = new FormData();
      fd.append('image', form.image);
      fd.append('title', form.title.trim() || 'Certificate');
      fd.append('orientation', form.orientation);
      if (form.description.trim()) fd.append('description', form.description.trim());
      await createCertificate(fd);
      setStatus('success');
      setMessage('Certificate added. Scroll to Certificates to see it.');
      setForm({ title: '', description: '', orientation: 'portrait', image: null });
      const input = document.getElementById('add-certificate-image') as HTMLInputElement;
      if (input) input.value = '';
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Failed to add certificate');
    } finally {
      setSubmitting(false);
    }
  };

  if (!import.meta.env.DEV) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        title="Add certificate (local only)"
      >
        <Award className="w-5 h-5" />
        <span className="font-medium">Add Certificate</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-md bg-background border-l border-border shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Add certificate</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {status === 'success' && (
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 text-sm">
                  {message}
                </div>
              )}
              {status === 'error' && (
                <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                  {message}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Display as</label>
                <select
                  name="orientation"
                  value={form.orientation}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-amber-500"
                >
                  <option value="portrait">Portrait (tall)</option>
                  <option value="landscape">Landscape (wide)</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1">Choose how the certificate appears in the gallery.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Title (optional)</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-amber-500"
                  placeholder="e.g. AWS Certified"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description (optional)</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-amber-500 resize-none"
                  placeholder="Issuer or short note"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Certificate image *</label>
                <label className="flex items-center gap-2 px-3 py-3 bg-muted/50 border border-border rounded-lg cursor-pointer hover:bg-muted/80 transition-colors">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{form.image ? form.image.name : 'Choose image'}</span>
                  <input
                    id="add-certificate-image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="hidden"
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Award className="w-5 h-5" />
                    Add certificate
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
