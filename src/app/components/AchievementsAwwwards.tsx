import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TrendingUp, Users, Award, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface Achievement {
  icon: React.ReactNode;
  value: string;
  label: string;
  gradient: string;
}

const achievements: Achievement[] = [
  {
    icon: <Award className="w-8 h-8" />,
    value: '20+',
    label: 'Projects Completed',
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    icon: <Users className="w-8 h-8" />,
    value: '15+',
    label: 'Happy Clients',
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    value: '500%',
    label: 'Average Growth',
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    icon: <Zap className="w-8 h-8" />,
    value: '4+',
    label: 'Years Experience',
    gradient: 'from-orange-500 to-red-500'
  }
];

export const AchievementsAwwwards: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(gridRef.current?.children || [],
        { opacity: 0, scale: 0.8, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative bg-muted/30 py-20 px-6 overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto">
        {/* Achievements Grid */}
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {achievements.map((achievement, index) => (
            <div 
              key={index}
              className="group relative bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-border hover:border-foreground/20 transition-all duration-500 text-center"
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${achievement.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}></div>
              
              <div className="relative">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-gradient-to-br ${achievement.gradient} text-white group-hover:scale-110 transition-transform duration-300`}>
                  {achievement.icon}
                </div>

                {/* Value */}
                <div className="text-4xl mb-2 text-foreground">
                  {achievement.value}
                </div>

                {/* Label */}
                <div className="text-sm text-muted-foreground">
                  {achievement.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
