const API_BASE = typeof import.meta.env.VITE_API_URL === 'string' 
  ? import.meta.env.VITE_API_URL.replace(/\/$/, '') 
  : 'http://localhost:4000';

export type ProjectFromAPI = {
  _id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  caseStudyUrl?: string;
};

export async function fetchProjects(): Promise<ProjectFromAPI[]> {
  const res = await fetch(`${API_BASE}/api/projects`);
  if (!res.ok) throw new Error('Failed to load projects');
  return res.json();
}

export async function submitContact(data: { name: string; email: string; message: string }): Promise<void> {
  const res = await fetch(`${API_BASE}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || 'Failed to send message');
  }
}

/** Create a project (multipart form with image + fields). Only for local/admin use. */
export async function createProject(formData: FormData): Promise<ProjectFromAPI> {
  const res = await fetch(`${API_BASE}/api/projects`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || 'Failed to create project');
  }
  return res.json();
}

export type CertificateFromAPI = {
  _id: string;
  title: string;
  description: string;
  image: string;
  orientation?: 'portrait' | 'landscape';
};

export async function fetchCertificates(): Promise<CertificateFromAPI[]> {
  const res = await fetch(`${API_BASE}/api/certificates`);
  if (!res.ok) throw new Error('Failed to load certificates');
  return res.json();
}

/** Create a certificate (multipart: image + title, description). For local/admin use. */
export async function createCertificate(formData: FormData): Promise<CertificateFromAPI> {
  const res = await fetch(`${API_BASE}/api/certificates`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || 'Failed to add certificate');
  }
  return res.json();
}

/** URL for downloading the current resume. */
export function getResumeDownloadUrl(): string {
  return `${API_BASE}/api/resume`;
}

/** Upload/update resume (multipart with key "resume"). PDF or Word. */
export async function uploadResume(formData: FormData): Promise<void> {
  const res = await fetch(`${API_BASE}/api/resume`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || 'Failed to update resume');
  }
}
