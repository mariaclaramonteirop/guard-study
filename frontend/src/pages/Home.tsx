import { useEffect } from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { Benefits } from '../components/landing/Benefits';
import { Features } from '../components/landing/Features';
import { Differentials } from '../components/landing/Differentials';
import { HowItWorks } from '../components/landing/HowItWorks';
import { CTA } from '../components/landing/CTA';
import { Footer } from '../components/landing/Footer';

export function Home() {
  useEffect(() => {
    document.body.classList.add('landing-page');
    document.title = 'Guardy Study';
    return () => {
      document.body.classList.remove('landing-page');
    };
  }, []);

  return (
    <div className="min-h-screen bg-transparent text-white">
      <Navbar />
      <main>
        <Hero />
        <Benefits />
        <Features />
        <Differentials />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
