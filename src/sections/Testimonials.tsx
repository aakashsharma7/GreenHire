'use client';

import { motion } from 'framer-motion';
import { InfiniteMovingCards } from '@/components/ui/InfiniteMovingCards';

const TESTIMONIALS = [
  {
    quote: "GreenHire has completely transformed our hiring pipeline. We found our Lead Battery Engineer within 48 hours of posting.",
    name: "Alex Rivera",
    role: "Founder, TerraForm Energy",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    quote: "The quality of candidates here is unmatched. It's refreshing to see a platform fully dedicated to the climate crisis.",
    name: "Samantha Lee",
    role: "VP Operations, SolarCity",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    quote: "We evaluated 14 different job boards. GreenHire is the only one where every applicant actually understands hardware and sustainability.",
    name: "Marcus Chen",
    role: "Head of Talent, CleanGrid",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
  },
  {
    quote: "Pricing is transparent, distribution is absolute. We finally have a bedrock we can trust to scale our mission-driven team.",
    name: "Elena Rostova",
    role: "CEO, BioCarbon",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
  },
];

export function Testimonials() {
  return (
    <section className="py-32 relative z-10 w-full overflow-hidden">
      <div className="text-center mb-20 max-w-4xl mx-auto px-6">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display font-bold text-4xl md:text-5xl text-white mb-6"
        >
          Loved by industry leaders
        </motion.h2>
        <p className="font-body text-text-secondary text-lg">
          Don't just take our word for it. Here's what the best engineering teams are saying.
        </p>
      </div>

      <div className="flex flex-col items-center justify-center relative w-full mt-4">
        <InfiniteMovingCards
          items={TESTIMONIALS}
          direction="right"
          speed="normal"
        />
      </div>
    </section>
  );
}
