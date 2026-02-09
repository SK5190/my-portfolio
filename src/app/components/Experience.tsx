import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, Calendar } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  description: string[];
  technologies: string[];
}

const experiences: ExperienceItem[] = [
  {
    role: 'Full Stack Developer Intern',
    company: 'Tech Startup',
    period: 'Jun 2025 - Present',
    description: [
      'Developed and maintained RESTful APIs using Node.js and Express.js',
      'Built responsive user interfaces with React and Tailwind CSS',
      'Implemented authentication and authorization using JWT',
      'Collaborated with cross-functional teams using Agile methodologies'
    ],
    technologies: ['React', 'Node.js', 'MongoDB', 'Express', 'Tailwind']
  },
  {
    role: 'Freelance Web Developer',
    company: 'Self-Employed',
    period: 'Jan 2024 - May 2025',
    description: [
      'Delivered custom web solutions for small businesses and startups',
      'Created responsive websites with modern design principles',
      'Implemented database solutions and API integrations',
      'Managed client relationships and project timelines'
    ],
    technologies: ['MERN Stack', 'Firebase', 'Vercel', 'Git']
  },
  {
    role: 'Open Source Contributor',
    company: 'Various Projects',
    period: '2023 - Present',
    description: [
      'Contributed to multiple open-source projects on GitHub',
      'Fixed bugs and implemented new features',
      'Collaborated with developers worldwide',
      'Improved documentation and code quality'
    ],
    technologies: ['JavaScript', 'React', 'Node.js', 'Git']
  }
];

export const Experience: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(titleRef.current,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Timeline items animation
      gsap.fromTo(timelineRef.current?.children || [],
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="min-h-screen bg-slate-950 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 ref={titleRef} className="text-5xl md:text-6xl mb-6 text-white">
          Experience
        </h2>
        
        <div className="w-20 h-1 bg-blue-500 mb-16"></div>

        <div ref={timelineRef} className="space-y-8">
          {experiences.map((exp, index) => (
            <div 
              key={index}
              className="relative bg-slate-900/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
            >
              {/* Timeline dot */}
              <div className="absolute -left-3 top-8 w-6 h-6 bg-blue-500 rounded-full border-4 border-slate-950 hidden md:block"></div>

              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h3 className="text-2xl mb-2 text-white flex items-center gap-2">
                    <Briefcase className="w-6 h-6 text-blue-400" />
                    {exp.role}
                  </h3>
                  <p className="text-lg text-blue-400 mb-2">
                    {exp.company}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-slate-400 mt-2 md:mt-0">
                  <Calendar className="w-5 h-5" />
                  <span>{exp.period}</span>
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {exp.description.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-slate-300 flex items-start gap-2">
                    <span className="text-blue-400 mt-1.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech, techIndex) => (
                  <span 
                    key={techIndex}
                    className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg text-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-16 bg-gradient-to-r from-slate-900/50 to-slate-800/50 rounded-xl p-8 border border-slate-700">
          <p className="text-lg text-slate-300 text-center">
            Currently pursuing B.Tech in Computer Science Engineering • Expected Graduation: 2026
          </p>
        </div>
      </div>
    </section>
  );
};
