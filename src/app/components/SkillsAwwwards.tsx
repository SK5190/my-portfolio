import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Palette, Briefcase, Wrench } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface SkillCategory {
  icon: React.ReactNode;
  title: string;
  skills: string[];
  gradient: string;
  border: string;
}

const skillCategories: SkillCategory[] = [
  {
    icon: <Code className="w-6 h-6" />,
    title: 'Development',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind', 'Node.js', 'Express.js', 'MongoDB', 'MySQL', 'REST APIs'],
    gradient: 'from-blue-500 to-cyan-500',
    border: 'hover:border-blue-500/50'
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: 'Creative & Digital',
    skills: ['Video Editing', 'Content Creation', 'Social Media Growth', 'Branding', 'Digital Marketing'],
    gradient: 'from-purple-500 to-pink-500',
    border: 'hover:border-purple-500/50'
  },
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: 'Business & Professional',
    skills: ['Entrepreneurship', 'GeM Tender Management', 'Client Handling', 'Strategic Planning', 'Business Development'],
    gradient: 'from-green-500 to-emerald-500',
    border: 'hover:border-green-500/50'
  },
  {
    icon: <Wrench className="w-6 h-6" />,
    title: 'Tools & Platforms',
    skills: ['Git', 'GitHub', 'Postman', 'Firebase', 'Vercel', 'Netlify', 'Figma', 'Adobe Suite'],
    gradient: 'from-orange-500 to-red-500',
    border: 'hover:border-orange-500/50'
  }
];

export const SkillsAwwwards: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      gsap.fromTo(gridRef.current?.children || [],
        { opacity: 0, y: 50, rotateX: -20 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: gridRef.current,
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
      id="skills"
      ref={sectionRef}
      className="relative min-h-screen bg-muted/30 py-32 px-6 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <div ref={titleRef} className="mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm uppercase tracking-widest text-purple-500">Skills & Expertise</span>
          </div>
          <h2 className="text-5xl md:text-7xl mb-6 text-foreground max-w-4xl">
            Multi-domain capabilities
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
        </div>

        {/* Skills Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 gap-6">
          {skillCategories.map((category, index) => (
            <div 
              key={index}
              onMouseEnter={() => setActiveCategory(index)}
              onMouseLeave={() => setActiveCategory(null)}
              className={`group relative bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-border ${category.border} transition-all duration-500 hover:shadow-2xl`}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
              
              <div className="relative">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-12 h-12 mb-6 rounded-xl bg-gradient-to-br ${category.gradient} text-white group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl mb-6 text-foreground">
                  {category.title}
                </h3>

                {/* Skills */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <span 
                      key={skillIndex}
                      className={`px-4 py-2 bg-muted backdrop-blur-sm text-muted-foreground rounded-lg text-sm border border-border hover:border-foreground/20 transition-all duration-300 hover:scale-105 ${
                        activeCategory === index ? 'animate-pulse' : ''
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom highlight */}
        <div className="mt-20 bg-card/60 backdrop-blur-sm p-10 rounded-2xl border border-border">
          <p className="text-lg text-muted-foreground text-center leading-relaxed">
            Continuously expanding my skillset across technology, creativity, and business. 
            <span className="text-blue-500"> Currently exploring advanced cloud architectures, AI integration, and scaling digital businesses.</span>
          </p>
        </div>
      </div>
    </section>
  );
};
