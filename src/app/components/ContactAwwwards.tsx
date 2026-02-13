import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, Github, Linkedin, Send, MessageSquare, ArrowUpRight, Loader2 } from 'lucide-react';
import { submitContact } from '../api/client';

gsap.registerPlugin(ScrollTrigger);

export const ContactAwwwards: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

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

      gsap.fromTo(contentRef.current?.children || [],
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('idle');
    setSubmitting(true);
    try {
      await submitContact(formData);
      setSubmitStatus('success');
      setSubmitMessage('Thank you for reaching out! I will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setSubmitStatus('error');
      setSubmitMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section 
      id="contact"
      ref={sectionRef}
      className="relative min-h-screen bg-muted/30 py-16 sm:py-24 md:py-32 px-4 sm:px-6 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <div ref={titleRef} className="mb-12 sm:mb-20">
          <div className="inline-block mb-4">
            <span className="text-sm uppercase tracking-widest text-blue-500">Contact</span>
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-7xl mb-4 sm:mb-6 text-foreground max-w-4xl">
            Let's work together
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <p className="text-base sm:text-xl text-muted-foreground mt-4 sm:mt-6 max-w-3xl">
            I'm currently available for new projects and opportunities. Whether you need development, 
            digital strategy, or creative solutions, let's connect.
          </p>
        </div>

        <div ref={contentRef} className="grid lg:grid-cols-5 gap-8 sm:gap-12">
          {/* Contact Methods */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <div className="bg-card/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-border hover:border-blue-500/50 transition-all duration-300 group min-w-0">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-white shrink-0">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <a href="mailto:shubhanshukumar3033@gmail.com" className="text-foreground hover:text-blue-500 transition-colors break-all text-sm sm:text-base">
                    shubhanshukumar3033@gmail.com
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-card/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-border hover:border-green-500/50 transition-all duration-300 group min-w-0">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-white shrink-0">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-1">Phone</p>
                  <a href="tel:+919456424212" className="text-foreground hover:text-green-500 transition-colors text-sm sm:text-base">
                    +91 94564 24212
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-card/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-border hover:border-purple-500/50 transition-all duration-300 group min-w-0">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-white shrink-0">
                  <Github className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-1">GitHub</p>
                  <a 
                    href="https://github.com/SK5190" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-purple-500 transition-colors flex items-center gap-1 break-all text-sm sm:text-base"
                  >
                    <span className="break-all">github.com/SK5190</span>
                    <ArrowUpRight className="w-4 h-4 shrink-0" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-card/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl border border-border hover:border-blue-500/50 transition-all duration-300 group min-w-0">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-white shrink-0">
                  <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground mb-1">LinkedIn</p>
                  <a 
                    href="https://linkedin.com/in/shubhanshu-kumar3033" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-blue-500 transition-colors flex items-center gap-1 break-all text-sm sm:text-base"
                  >
                    <span className="break-all">linkedin.com/in/shubhanshu-kumar3033</span>
                    <ArrowUpRight className="w-4 h-4 shrink-0" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3 min-w-0">
            <form onSubmit={handleSubmit} className="bg-card/80 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl border border-border">
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <h3 className="text-xl sm:text-2xl text-foreground">Send a message</h3>
              </div>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-700 dark:text-green-400 text-sm">
                  {submitMessage}
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                  {submitMessage}
                </div>
              )}

              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm text-muted-foreground mb-1.5 sm:mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 sm:py-4 bg-muted/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500 transition-colors min-h-[48px]"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm text-muted-foreground mb-1.5 sm:mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 sm:py-4 bg-muted/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500 transition-colors min-h-[48px]"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm text-muted-foreground mb-1.5 sm:mb-2">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 sm:py-4 bg-muted/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500 transition-colors resize-none min-h-[120px]"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-70 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/30 min-h-[48px]"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative max-w-7xl mx-auto mt-16 sm:mt-24 md:mt-32 pt-8 sm:pt-12 px-4 sm:px-0 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="text-muted-foreground text-sm">
              © 2026 Shubhanshu Kumar. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </section>
  );
};
