import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface SkillCategory {
  name: string;
  skills: string[];
  color: string;
}

const skillCategories: SkillCategory[] = [
  {
    name: 'Frontend',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind'],
    color: 'blue'
  },
  {
    name: 'Backend',
    skills: ['Node.js', 'Express.js'],
    color: 'green'
  },
  {
    name: 'Database',
    skills: ['MongoDB', 'MySQL'],
    color: 'purple'
  },
  {
    name: 'Tools',
    skills: ['Git', 'Postman', 'Firebase', 'Vercel', 'Netlify'],
    color: 'orange'
  }
];

export const Skills: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

      // Stagger skill cards
      gsap.fromTo(gridRef.current?.children || [],
        { opacity: 0, scale: 0.8, rotateX: -15 },
        {
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'border-blue-500/50 hover:border-blue-500 hover:shadow-blue-500/20 bg-blue-500/5',
      green: 'border-green-500/50 hover:border-green-500 hover:shadow-green-500/20 bg-green-500/5',
      purple: 'border-purple-500/50 hover:border-purple-500 hover:shadow-purple-500/20 bg-purple-500/5',
      orange: 'border-orange-500/50 hover:border-orange-500 hover:shadow-orange-500/20 bg-orange-500/5'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getBadgeColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/20 text-blue-300',
      green: 'bg-green-500/20 text-green-300',
      purple: 'bg-purple-500/20 text-purple-300',
      orange: 'bg-orange-500/20 text-orange-300'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <section id="skills" ref={sectionRef} className="min-h-screen bg-slate-950 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 ref={titleRef} className="text-5xl md:text-6xl mb-6 text-white">
          Skills & Technologies
        </h2>
        
        <div className="w-20 h-1 bg-blue-500 mb-16"></div>

        <div ref={gridRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((category, index) => (
            <div 
              key={index}
              className={`bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl border transition-all duration-300 hover:shadow-xl ${getColorClasses(category.color)}`}
            >
              <h3 className="text-2xl mb-6 text-white">
                {category.name}
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <span 
                    key={skillIndex}
                    className={`px-3 py-1.5 rounded-lg text-sm ${getBadgeColor(category.color)}`}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional highlight section */}
        <div className="mt-16 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-8 border border-slate-700">
          <p className="text-lg text-slate-300 text-center">
            Constantly learning and exploring new technologies to build better solutions. 
            Currently deepening my knowledge in microservices architecture, cloud deployment, 
            and modern DevOps practices.
          </p>
        </div>
      </div>
    </section>
  );
};
