import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { WorkGrid } from '@/components/WorkGrid';
import { ContactModal } from '@/components/ContactModal';

export const metadata = {
  title: 'All Projects',
  description: 'Every project I’ve shipped from quick builds to full products.',
};

export default function WorkPage() {
  return (
    <>
      <Navbar />
      <main id="main">
        <WorkGrid />
      </main>
      <Footer />
      <ContactModal />
    </>
  );
}
