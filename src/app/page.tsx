import { Hero } from '@/sections/Hero';
import { LogoMarquee } from '@/sections/LogoMarquee';
import { Features } from '@/sections/Features';
import { Stats } from '@/sections/Stats';
import { Testimonials } from '@/sections/Testimonials';
import { CTABanner } from '@/sections/CTABanner';

export default function Home() {
  return (
    <main className="flex flex-col items-center w-full overflow-hidden">
      <Hero />
      <LogoMarquee />
      <Features />
      <Stats />
      <Testimonials />
      <CTABanner />
    </main>
  );
}
