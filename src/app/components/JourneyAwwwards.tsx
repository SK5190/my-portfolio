import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Journey {
  year: string;
  title: string;
  organization: string;
  location?: string;
  description: string;
  type: 'development' | 'creative' | 'business';
}

const journeys: Journey[] = [
  {
    year: '2025 - Present',
    title: 'Full Stack Developer',
    organization: 'Freelance / Multiple Projects',
    description: 'Building scalable web applications and APIs for clients worldwide. Specializing in MERN stack development with focus on performance and user experience.',
    type: 'development'
  },
  {
    year: '2024 - Present',
    title: 'Digital Creator & Content Strategist',
    organization: 'Self-Employed',
    description: 'Managing social media growth campaigns, creating engaging video content, and building digital brands. Achieved 300%+ growth for multiple clients.',
    type: 'creative'
  },
  {
    year: '2024 - Present',
    title: 'GeM Tender Executive',
    organization: 'Business Services',
    description: 'Providing expert consultation and management for Government e-Marketplace tenders. Handling documentation, compliance, and bid preparation.',
    type: 'business'
  },
  {
    year: '2023 - Present',
    title: 'Entrepreneur',
    organization: 'Digital Ventures',
    description: 'Founded and scaling digital business ventures. Combining technical skills with business strategy to create sustainable digital products and services.',
    type: 'business'
  },
  {
    year: '2022 - 2026',
    title: 'B.Tech Computer Science',
    organization: 'Bharat Institute of Technology',
    location: 'India',
    description: 'Pursuing Computer Science Engineering with focus on web development, data structures, and software engineering. Final year student graduating in 2026.',
    type: 'development'
  }
];

export const JourneyAwwwards: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

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

      gsap.fromTo(timelineRef.current?.children || [],
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getTypeColor = (type: string) => {
    const colors = {
      development: 'border-blue-500/50 bg-blue-500/5',
      creative: 'border-purple-500/50 bg-purple-500/5',
      business: 'border-green-500/50 bg-green-500/5'
    };
    return colors[type as keyof typeof colors] || colors.development;
  };

  return (
    <section 
      id="journey"
      ref={sectionRef}
      className="relative min-h-screen bg-background py-32 px-6 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent"></div>

      <div className="relative max-w-5xl mx-auto">
        {/* Section header */}
        <div ref={titleRef} className="mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm uppercase tracking-widest text-purple-500">Journey</span>
          </div>
          <h2 className="text-5xl md:text-7xl mb-6 text-foreground max-w-4xl">
            Experience & education
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
        </div>

        {/* Timeline */}
        <div ref={timelineRef} className="relative space-y-8">
          {/* Timeline line */}
          <div className="absolute left-8 top-8 bottom-8 w-px bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 hidden md:block"></div>

          {journeys.map((journey, index) => (
            <div 
              key={index}
              className="relative flex gap-8"
            >
              {/* Timeline dot */}
              <div className="hidden md:flex items-start pt-2">
                <div className={`w-16 h-16 rounded-full ${getTypeColor(journey.type)} border-2 flex items-center justify-center backdrop-blur-sm text-foreground`}>
                  <Calendar className="w-6 h-6" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-border hover:border-foreground/20 transition-all duration-300 hover:shadow-xl">
                <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="text-sm text-blue-500 mb-2">{journey.year}</div>
                    <h3 className="text-2xl text-foreground mb-1">
                      {journey.title}
                    </h3>
                    <p className="text-lg text-muted-foreground">{journey.organization}</p>
                    {journey.location && (
                      <div className="flex items-center gap-2 text-muted-foreground mt-2">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{journey.location}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  {journey.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
