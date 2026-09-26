import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { TechStack } from '@/components/TechStack';
import { Projects } from '@/components/Projects';
import { Services } from '@/components/Services';
import { WhyWorkWithMe } from '@/components/WhyWorkWithMe';
import { Process } from '@/components/Process';
import { About } from '@/components/About';
import { Testimonials } from '@/components/Testimonials';
import { ClosingCTA } from '@/components/ClosingCTA';
import { Footer } from '@/components/Footer';
import { LoadingScreen } from '@/components/LoadingScreen';
import { PageTransition } from '@/components/PageTransition';
import { EmailGate } from '@/components/EmailGate';
import { ContactModal } from '@/components/ContactModal';
import { TestimonialModal } from '@/components/TestimonialModal';

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <EmailGate>
        <a href="#main" className="skip-link">Skip to content</a>
        <Navbar />
        <PageTransition>
          <main id="main">
            <Hero />
            <TechStack />
            <Projects />
            <Services />
            <WhyWorkWithMe />
            <Process />
            <About />
            <Testimonials />
            <ClosingCTA />
          </main>
        </PageTransition>
        <Footer />
      </EmailGate>
      <ContactModal />
      <TestimonialModal />
    </>
  );
}
