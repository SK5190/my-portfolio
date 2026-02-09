import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CursorFollower } from './components/CursorFollower';
import { ScrollProgress } from './components/ScrollProgress';
import { NavigationAwwwards } from './components/NavigationAwwwards';
import { HeroAwwwards } from './components/HeroAwwwards';
import { AboutAwwwards } from './components/AboutAwwwards';
import { SkillsAwwwards } from './components/SkillsAwwwards';
import { WorkAwwwards } from './components/WorkAwwwards';
import { ServicesAwwwards } from './components/ServicesAwwwards';
import { AchievementsAwwwards } from './components/AchievementsAwwwards';
import { CertificatesGallery } from './components/CertificatesGallery';
import { JourneyAwwwards } from './components/JourneyAwwwards';
import { ContactAwwwards } from './components/ContactAwwwards';
import { AddProject } from './components/AddProject';
import { AddCertificate } from './components/AddCertificate';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

export default function App() {
  useEffect(() => {
    // Smooth scrolling configuration
    document.documentElement.style.scrollBehavior = 'smooth';

    // Configure ScrollTrigger defaults
    ScrollTrigger.defaults({
      markers: false,
      toggleActions: 'play none none reverse'
    });

    // Refresh ScrollTrigger on load
    ScrollTrigger.refresh();

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="bg-background text-foreground overflow-x-hidden min-h-screen">
      <CursorFollower />
      <ScrollProgress />
      <NavigationAwwwards />
      <HeroAwwwards />
      <AboutAwwwards />
      <SkillsAwwwards />
      <WorkAwwwards />
      <AchievementsAwwwards />
      <CertificatesGallery />
      <ServicesAwwwards />
      <JourneyAwwwards />
      <ContactAwwwards />
      <AddProject />
      <AddCertificate />
    </div>
  );
}
