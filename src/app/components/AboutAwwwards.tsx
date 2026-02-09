import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Zap, Target } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const AboutAwwwards: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo(cardsRef.current?.children || [],
        { opacity: 0, y: 40, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="relative min-h-screen bg-background py-32 px-6 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <div ref={titleRef} className="mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm uppercase tracking-widest text-blue-500">About Me</span>
          </div>
          <h2 className="text-5xl md:text-7xl mb-6 text-foreground max-w-4xl">
            Multi-disciplinary digital professional
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        </div>

        {/* Content */}
        <div ref={contentRef} className="grid lg:grid-cols-2 gap-16 mb-20">
          <div className="space-y-6">
            <p className="text-xl text-muted-foreground leading-relaxed">
              I'm a final-year <span className="text-foreground">B.Tech Computer Science</span> student 
              with a unique blend of technical expertise and creative capabilities.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              As a <span className="text-blue-500">MERN stack developer</span>, I specialize in building 
              scalable web applications and robust APIs. My development philosophy centers on writing clean, 
              maintainable code that solves real-world problems.
            </p>
          </div>
          
          <div className="space-y-6">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Beyond development, I'm a <span className="text-purple-500">digital creator</span> and 
              <span className="text-purple-500"> entrepreneur</span>, managing social media growth strategies, 
              creating compelling video content, and building digital brands.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              My experience as a <span className="text-green-500">GeM Tender Executive</span> has sharpened 
              my business acumen, client handling skills, and strategic thinking—making me equally comfortable 
              in technical and business environments.
            </p>
          </div>
        </div>

        {/* Value Cards */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-6">
          <div className="group relative bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-border hover:border-blue-500/50 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-white">
                <Zap className="w-7 h-7" />
              </div>
              <h3 className="text-2xl mb-3 text-foreground">
                Technical Excellence
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Building high-performance applications with modern technologies and best practices.
              </p>
            </div>
          </div>

          <div className="group relative bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-border hover:border-purple-500/50 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-white">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="text-2xl mb-3 text-foreground">
                Creative Vision
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Crafting engaging digital content and experiences that resonate with audiences.
              </p>
            </div>
          </div>

          <div className="group relative bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-border hover:border-green-500/50 transition-all duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-white">
                <Target className="w-7 h-7" />
              </div>
              <h3 className="text-2xl mb-3 text-foreground">
                Business Mindset
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Strategic thinking and entrepreneurial approach to solving business challenges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
