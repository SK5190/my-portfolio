import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Code2, Rocket, Users } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export const About: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in content
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'top 30%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Stagger cards
      gsap.fromTo(cardsRef.current?.children || [],
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.2,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="min-h-screen bg-slate-900 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div ref={contentRef}>
          <h2 className="text-5xl md:text-6xl mb-6 text-white">
            About Me
          </h2>
          
          <div className="w-20 h-1 bg-blue-500 mb-12"></div>
          
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <p className="text-lg text-slate-300 leading-relaxed mb-6">
                I'm a final-year B.Tech Computer Science student with a passion for building 
                robust, scalable web applications using the MERN stack. My focus is on creating 
                solutions that not only look great but perform exceptionally well.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                With expertise in MongoDB, Express.js, React, and Node.js, I specialize in 
                developing full-stack applications, RESTful APIs, and real-world solutions 
                that solve actual problems. I'm constantly learning and adapting to new 
                technologies to stay ahead in the ever-evolving tech landscape.
              </p>
            </div>
            
            <div>
              <p className="text-lg text-slate-300 leading-relaxed mb-6">
                I believe in writing clean, maintainable code and following best practices 
                in software development. My approach combines technical expertise with 
                creative problem-solving to deliver products that users love.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                Currently seeking opportunities to contribute to innovative projects and 
                work with teams that value quality, collaboration, and continuous improvement.
              </p>
            </div>
          </div>
        </div>

        <div ref={cardsRef} className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
            <div className="w-14 h-14 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
              <Code2 className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl mb-3 text-white">
              Full Stack Development
            </h3>
            <p className="text-slate-400">
              Building complete web applications from database design to user interface, 
              ensuring seamless integration across all layers.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
            <div className="w-14 h-14 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
              <Rocket className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-xl mb-3 text-white">
              Performance Focused
            </h3>
            <p className="text-slate-400">
              Optimizing applications for speed and efficiency, implementing best practices 
              for scalability and user experience.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-xl border border-slate-700 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
            <div className="w-14 h-14 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-7 h-7 text-green-400" />
            </div>
            <h3 className="text-xl mb-3 text-white">
              Problem Solver
            </h3>
            <p className="text-slate-400">
              Tackling complex challenges with creative solutions, always focused on 
              delivering real value to users and businesses.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
