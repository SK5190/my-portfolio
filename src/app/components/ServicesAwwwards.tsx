import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code, Video, TrendingUp, Briefcase, Users, Award } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Service {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  gradient: string;
}

const services: Service[] = [
  {
    icon: <Code className="w-7 h-7" />,
    title: 'Full Stack Web Development',
    description: 'End-to-end web application development with modern technologies and best practices.',
    features: ['Custom Web Applications', 'RESTful APIs', 'Database Design', 'Responsive Design', 'Performance Optimization'],
    gradient: 'from-blue-600 to-cyan-600'
  },
  {
    icon: <TrendingUp className="w-7 h-7" />,
    title: 'Social Media Growth & Management',
    description: 'Strategic social media planning and execution to build your brand presence.',
    features: ['Content Strategy', 'Profile Optimization', 'Engagement Growth', 'Analytics & Insights', 'Brand Building'],
    gradient: 'from-purple-600 to-pink-600'
  },
  {
    icon: <Video className="w-7 h-7" />,
    title: 'Video Editing & Content Creation',
    description: 'Professional video editing and compelling digital content for your brand.',
    features: ['Video Editing', 'Motion Graphics', 'Color Grading', 'Content Planning', 'Social Media Content'],
    gradient: 'from-red-600 to-orange-600'
  },
  {
    icon: <Users className="w-7 h-7" />,
    title: 'Digital & Business Consulting',
    description: 'Strategic consulting to help your business thrive in the digital landscape.',
    features: ['Digital Strategy', 'Business Planning', 'Market Analysis', 'Growth Strategy', 'Brand Development'],
    gradient: 'from-green-600 to-emerald-600'
  },
  {
    icon: <Briefcase className="w-7 h-7" />,
    title: 'GeM Tender Services',
    description: 'Expert assistance with Government e-Marketplace tenders and procurement.',
    features: ['Tender Management', 'Bid Preparation', 'Documentation', 'Compliance Support', 'Process Guidance'],
    gradient: 'from-indigo-600 to-blue-600'
  },
  {
    icon: <Award className="w-7 h-7" />,
    title: 'Website & App Solutions',
    description: 'Complete digital solutions tailored to your business needs and goals.',
    features: ['Custom Solutions', 'Mobile Apps', 'E-Commerce', 'CMS Integration', 'Maintenance & Support'],
    gradient: 'from-violet-600 to-purple-600'
  }
];

export const ServicesAwwwards: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
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
      id="services"
      ref={sectionRef}
      className="relative min-h-screen bg-muted/30 py-32 px-6 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-900/10 via-transparent to-transparent"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <div ref={titleRef} className="mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm uppercase tracking-widest text-green-500">Services</span>
          </div>
          <h2 className="text-5xl md:text-7xl mb-6 text-foreground max-w-4xl">
            What I offer
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
          <p className="text-xl text-muted-foreground mt-6 max-w-3xl">
            Comprehensive digital solutions combining technical expertise, creative vision, and business strategy.
          </p>
        </div>

        {/* Services Grid */}
        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group relative bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-border hover:border-foreground/20 transition-all duration-500 hover:shadow-2xl overflow-hidden"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              
              <div className="relative">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 mb-6 rounded-xl bg-gradient-to-br ${service.gradient} text-white group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl mb-3 text-foreground">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-blue-500 mt-0.5">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <p className="text-muted-foreground mb-6 text-lg">
            Ready to start a project or need a custom solution?
          </p>
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/30"
          >
            Let's Talk
          </button>
        </div>
      </div>
    </section>
  );
};
