import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { TechStack } from '@/components/TechStack';
import { About } from '@/components/About';
import { Experience } from '@/components/Experience';
import { Projects } from '@/components/Projects';
import { WhyWorkWithMe } from '@/components/WhyWorkWithMe';
import { Services } from '@/components/Services';
import { Process } from '@/components/Process';
import { Testimonials } from '@/components/Testimonials';
import { FAQ } from '@/components/FAQ';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';
import { CursorGlow } from '@/components/CursorGlow';
import { FloatingBackground } from '@/components/FloatingBackground';
import { LoadingScreen } from '@/components/LoadingScreen';
import { PageTransition } from '@/components/PageTransition';
import { EmailGate } from '@/components/EmailGate';

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <FloatingBackground />
      <EmailGate>
        <a href="#main" className="skip-link">Skip to content</a>
        <CursorGlow />
        <Navbar />
        <PageTransition>
          <main id="main">
            <Hero />
            <TechStack />
            <Projects />
            <WhyWorkWithMe />
            <Services />
            <Process />
            <About />
            <Experience />
            <Testimonials />
            <FAQ />
            <Contact />
          </main>
        </PageTransition>
        <Footer />
        <BackToTop />
      </EmailGate>
    </>
  );
}
