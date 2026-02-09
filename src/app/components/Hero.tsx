import React, { useEffect, useRef, useId, useState } from 'react';
import { gsap } from 'gsap';
import { ChevronDown, Upload } from 'lucide-react';
import { getResumeDownloadUrl, uploadResume } from '../api/client';

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputId = useId();
  const [resumeUploading, setResumeUploading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate title with split text effect
      if (titleRef.current) {
        const chars = titleRef.current.textContent?.split('') || [];
        titleRef.current.innerHTML = chars.map(char => 
          `<span class="inline-block opacity-0">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');
        
        gsap.to(titleRef.current.children, {
          opacity: 1,
          y: 0,
          duration: 0.05,
          stagger: 0.03,
          ease: 'power2.out',
          delay: 0.3
        });
      }

      // Animate subtitle and tagline
      gsap.fromTo([subtitleRef.current, taglineRef.current], 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, delay: 1, ease: 'power3.out' }
      );

      // Animate buttons
      gsap.fromTo(buttonsRef.current?.children || [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, delay: 1.5, ease: 'power2.out' }
      );

      // Animate scroll indicator
      gsap.fromTo(scrollRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 2, ease: 'power2.out' }
      );

      // Continuous scroll indicator animation
      gsap.to(scrollRef.current, {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: 2.5
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToNext = () => {
    const aboutSection = document.getElementById('about');
    aboutSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUpdateResume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setResumeUploading(true);
    const fd = new FormData();
    fd.append('resume', file);
    uploadResume(fd)
      .then(() => alert('Resume updated successfully.'))
      .catch((err) => alert(err instanceof Error ? err.message : 'Failed to update resume.'))
      .finally(() => setResumeUploading(false));
  };

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
      <div className="absolute top-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <h1 
          ref={titleRef}
          className="text-6xl md:text-7xl lg:text-8xl mb-6 text-white tracking-tight"
        >
          Shubhanshu Kumar
        </h1>
        
        <p ref={subtitleRef} className="text-2xl md:text-3xl mb-6 text-blue-400">
          Full Stack Developer | MERN Stack
        </p>
        
        <p ref={taglineRef} className="text-lg md:text-xl mb-12 text-slate-300 max-w-2xl mx-auto">
          I build fast, scalable, and user-friendly web applications.
        </p>
        
        <div ref={buttonsRef} className="flex flex-wrap gap-4 justify-center">
          <button 
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50"
          >
            View Projects
          </button>
          <button 
            onClick={() => window.open(getResumeDownloadUrl(), '_blank')}
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-all duration-300 hover:scale-105"
          >
            Download Resume
          </button>
          {import.meta.env.DEV && (
            <>
              <input
                id={fileInputId}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={handleUpdateResume}
                disabled={resumeUploading}
              />
              <button 
                type="button"
                onClick={() => document.getElementById(fileInputId)?.click()}
                disabled={resumeUploading}
                className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2 disabled:opacity-60"
              >
                {resumeUploading ? (
                  <>
                    <span className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Updating…
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Update Resume
                  </>
                )}
              </button>
            </>
          )}
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-transparent hover:bg-slate-800 text-white rounded-lg border border-slate-600 transition-all duration-300 hover:scale-105"
          >
            Contact
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        ref={scrollRef}
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer opacity-0"
      >
        <div className="flex flex-col items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
          <span className="text-sm uppercase tracking-wider">Scroll</span>
          <ChevronDown className="w-6 h-6 animate-bounce" />
        </div>
      </div>
    </section>
  );
};
