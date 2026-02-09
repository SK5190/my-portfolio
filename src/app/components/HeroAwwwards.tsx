import React, { useEffect, useRef, useId, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, ChevronDown, Sparkles, Upload } from 'lucide-react';
import { getResumeDownloadUrl, uploadResume } from '../api/client';

export const HeroAwwwards: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const fileInputId = useId();
  const [resumeUploading, setResumeUploading] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main title: animate whole headline for clear visibility (no character split)
      gsap.fromTo(headlineRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, delay: 0.3, ease: 'power3.out' }
      );

      // Subline fade in
      gsap.fromTo(sublineRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, delay: 1.2, ease: 'power3.out' }
      );

      // Label animation
      gsap.fromTo(labelRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, delay: 0.8, ease: 'back.out(1.7)' }
      );

      // Tagline
      gsap.fromTo(taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, delay: 1.6, ease: 'power2.out' }
      );

      // CTA buttons
      gsap.fromTo(ctaRef.current?.children || [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, delay: 1.9, ease: 'power2.out' }
      );

      // Scroll indicator
      gsap.fromTo(scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 2.5 }
      );

      gsap.to(scrollRef.current, {
        y: 8,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
        delay: 3
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToNext = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
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
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/30 to-background"
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,currentColor_70%,transparent_110%)] opacity-20"></div>
      
      {/* Gradient orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        {/* Professional label */}
        <div ref={labelRef} className="inline-flex items-center gap-2 px-4 py-2 mb-8 bg-muted/50 backdrop-blur-sm border border-border rounded-full">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-muted-foreground">Available for opportunities</span>
        </div>

        {/* Main headline - solid, high-contrast, readable in both themes */}
        <h1 
          ref={headlineRef}
          className="text-7xl md:text-8xl lg:text-9xl mb-6 tracking-tight text-foreground font-semibold drop-shadow-[0_2px_20px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_2px_24px_rgba(0,0,0,0.5)]"
        >
          Shubhanshu Kumar
        </h1>

        {/* Subline with gradient */}
        <h2 
          ref={sublineRef}
          className="text-2xl md:text-4xl lg:text-5xl mb-8 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"
        >
          Full Stack Developer | Digital Creator | Entrepreneur
        </h2>

        {/* Tagline */}
        <p 
          ref={taglineRef}
          className="text-lg md:text-xl mb-12 text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          Building scalable web apps, digital experiences, and impactful solutions that drive growth and innovation.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="flex flex-wrap gap-4 justify-center items-center">
          <button 
            onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })}
            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 flex items-center gap-2"
          >
            <span>View Work</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={() => window.open(getResumeDownloadUrl(), '_blank')}
            className="px-8 py-4 bg-muted/50 hover:bg-muted backdrop-blur-sm text-foreground rounded-full border border-border hover:border-foreground/30 transition-all duration-300 hover:scale-105"
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
                className="px-8 py-4 bg-muted/50 hover:bg-muted backdrop-blur-sm text-foreground rounded-full border border-border hover:border-foreground/30 transition-all duration-300 hover:scale-105 inline-flex items-center gap-2 disabled:opacity-60"
              >
                {resumeUploading ? (
                  <>
                    <span className="size-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
            className="px-8 py-4 bg-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground rounded-full border border-border hover:border-blue-500 transition-all duration-300"
          >
            Contact
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        ref={scrollRef}
        onClick={scrollToNext}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 cursor-pointer opacity-0"
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground hover:text-blue-500 transition-colors group">
          <span className="text-xs uppercase tracking-widest">Let's go!</span>
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-muted-foreground to-transparent group-hover:via-blue-500 transition-colors"></div>
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>
    </section>
  );
};
