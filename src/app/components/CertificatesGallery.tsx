import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Loader2, X } from 'lucide-react';
import { fetchCertificates, type CertificateFromAPI } from '../api/client';

gsap.registerPlugin(ScrollTrigger);

export const CertificatesGallery: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [certificates, setCertificates] = useState<CertificateFromAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<CertificateFromAPI | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchCertificates()
      .then((data) => {
        if (!cancelled) setCertificates(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load certificates');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if ((e.ctrlKey || e.metaKey) && ['s', 'c', 'u', 'p'].includes(e.key.toLowerCase())) e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
      gsap.fromTo(gridRef.current?.children || [],
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [certificates.length]);

  const blockContextMenu = (e: React.MouseEvent) => e.preventDefault();

  return (
    <section
      id="certificates"
      ref={sectionRef}
      onContextMenu={blockContextMenu}
      className="relative min-h-screen bg-background py-24 px-6 overflow-hidden select-none"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent" />
      <div className="relative max-w-7xl mx-auto">
        <div ref={titleRef} className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <Award className="w-6 h-6 text-amber-500" />
            <span className="text-sm uppercase tracking-widest text-amber-500">Achievements</span>
          </div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4">
            Certificates & awards
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Credentials and recognitions from courses, competitions, and organizations.
          </p>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
            <p className="text-muted-foreground">Loading certificates...</p>
          </div>
        )}
        {error && !loading && (
          <div className="py-24 text-center">
            <p className="text-destructive mb-2">{error}</p>
            <p className="text-sm text-muted-foreground">Ensure the backend is running.</p>
          </div>
        )}
        {!loading && !error && certificates.length === 0 && (
          <div className="py-24 text-center">
            <Award className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No certificates yet. Add some from the &quot;Add Certificate&quot; button when running locally.</p>
          </div>
        )}
        {!loading && !error && certificates.length > 0 && (
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {certificates.map((cert) => (
              <button
                key={cert._id}
                type="button"
                onClick={() => setLightbox(cert)}
                onContextMenu={blockContextMenu}
                className={`group relative rounded-2xl overflow-hidden border border-border bg-card shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-500/40 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-500/50 ${
                  cert.orientation === 'landscape' ? 'aspect-[4/3]' : 'aspect-[3/4]'
                }`}
              >
                <img
                  src={cert.image}
                  alt={cert.title}
                  draggable={false}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 pointer-events-none select-none"
                  style={{ WebkitUserDrag: 'none', userSelect: 'none' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-left translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-medium drop-shadow-md">{cert.title}</p>
                  {cert.description && (
                    <p className="text-white/90 text-sm line-clamp-2 mt-0.5">{cert.description}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 p-4 select-none"
          onClick={() => setLightbox(null)}
          onContextMenu={blockContextMenu}
          role="dialog"
          aria-modal="true"
          aria-label="Certificate view"
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
            onContextMenu={blockContextMenu}
          >
            <img
              src={lightbox.image}
              alt={lightbox.title}
              draggable={false}
              className="max-w-full max-h-[85vh] w-auto object-contain rounded-lg shadow-2xl pointer-events-none select-none"
              style={{ WebkitUserDrag: 'none', userSelect: 'none' }}
            />
            <div className="mt-4 text-center">
              <p className="text-white text-xl font-medium">{lightbox.title}</p>
              {lightbox.description && (
                <p className="text-white/80 text-sm mt-1 max-w-xl">{lightbox.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
