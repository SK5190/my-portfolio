import React, { useState } from 'react';
import { Plus, X, Loader2, Upload } from 'lucide-react';
import { createProject } from '../api/client';

/** Shown only when running locally (import.meta.env.DEV). Lets you upload a project with image to the database. */
export const AddProject: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    title: '',
    category: 'Full Stack Development',
    customCategory: '',
    description: '',
    tags: '',
    liveUrl: '',
    githubUrl: '',
    caseStudyUrl: '',
    image: null as File | null
  });

  const categories = [
    'Full Stack Development',
    'Social Media Management',
    'Video Editing',
    'Entrepreneurship',
    'Digital Creation'
  ];
  const isCustomCategory = form.category === '__other__';

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
      setMessage('Please select an image.');
      return;
    }
    const categoryToSend = isCustomCategory ? form.customCategory.trim() : form.category;
    if (!categoryToSend) {
      setStatus('error');
      setMessage('Please enter a category or select one from the list.');
      return;
    }
    setSubmitting(true);
    setStatus('idle');
    try {
      const fd = new FormData();
      fd.append('image', form.image);
      fd.append('title', form.title.trim());
      fd.append('category', categoryToSend);
      fd.append('description', form.description.trim());
      fd.append('tags', form.tags.trim());
      if (form.liveUrl) fd.append('liveUrl', form.liveUrl.trim());
      if (form.githubUrl) fd.append('githubUrl', form.githubUrl.trim());
      if (form.caseStudyUrl) fd.append('caseStudyUrl', form.caseStudyUrl.trim());
      await createProject(fd);
      setStatus('success');
      setMessage('Project added. Refresh or scroll to Featured work to see it.');
      setForm({
        title: '',
        category: 'Full Stack Development',
        customCategory: '',
        description: '',
        tags: '',
        liveUrl: '',
        githubUrl: '',
        caseStudyUrl: '',
        image: null
      });
      const input = document.getElementById('add-project-image') as HTMLInputElement;
      if (input) input.value = '';
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Failed to add project');
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
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        title="Add project (local only)"
      >
        <Plus className="w-5 h-5" />
        <span className="font-medium">Add Project</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg bg-background border-l border-border shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Add project to database</h2>
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
                <label className="block text-sm font-medium text-foreground mb-1">Title *</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500"
                  placeholder="Project name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Category *</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground focus:outline-none focus:border-blue-500"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="__other__">Other (add custom)</option>
                </select>
                {isCustomCategory && (
                  <input
                    name="customCategory"
                    value={form.customCategory}
                    onChange={handleChange}
                    required
                    className="mt-2 w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500"
                    placeholder="Enter category name"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500 resize-none"
                  placeholder="Short description of the project"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Tags (comma-separated)</label>
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Project image *</label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 px-3 py-2 bg-muted/50 border border-border rounded-lg cursor-pointer hover:bg-muted/80 transition-colors">
                    <Upload className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{form.image ? form.image.name : 'Choose image'}</span>
                    <input
                      id="add-project-image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Live URL</label>
                <input
                  name="liveUrl"
                  type="url"
                  value={form.liveUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">GitHub URL</label>
                <input
                  name="githubUrl"
                  type="url"
                  value={form.githubUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500"
                  placeholder="https://github.com/..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Case study URL</label>
                <input
                  name="caseStudyUrl"
                  type="url"
                  value={form.caseStudyUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500"
                  placeholder="https://..."
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium disabled:opacity-70 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add project
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
