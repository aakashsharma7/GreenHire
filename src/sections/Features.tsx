'use client';

import { motion } from 'framer-motion';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

const FEATURES = [
  {
    title: 'Top Climate Talent',
    description: 'Connect with a curated pool of engineers, scientists, and operators dedicated to solving the climate crisis.',
    icon: '🌍',
    span: 'col-span-1 md:col-span-2',
  },
  {
    title: 'Instant Distribution',
    description: 'Post once and reach thousands of climate-focused professionals instantly via our weekly digest.',
    icon: '⚡',
    span: 'col-span-1',
  },
  {
    title: 'Verified Startups',
    description: 'Every employer is manually vetted to ensure legitimate, high-impact climate tech missions.',
    icon: '🛡️',
    span: 'col-span-1',
  },
  {
    title: 'Premium Employer Branding',
    description: 'Showcase your hardware, mission, and culture through deep company profiles built for modern candidates.',
    icon: '✨',
    span: 'col-span-1 md:col-span-2',
  },
];

export function Features() {
  return (
    <section className="py-32 relative z-10 w-full max-w-6xl mx-auto px-6">
      
      {/* Heading */}
      <div className="text-center mb-20">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-display font-bold text-4xl md:text-5xl text-white mb-6"
        >
          Designed for high-impact teams
        </motion.h2>
        <div className="w-24 h-[2px] bg-gradient-to-r from-accent-primary to-accent-secondary mx-auto rounded-full" />
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEATURES.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className={feature.span}
          >
            <SpotlightCard className="h-full group">
              <div className="p-8 h-full flex flex-col transition-transform duration-300 group-hover:-translate-y-1 relative z-20">
                <div className="w-12 h-12 rounded-xl bg-accent-primary/10 flex items-center justify-center text-2xl mb-6 shadow-[0_0_15px_rgba(108,71,255,0.15)] group-hover:shadow-[0_0_30px_rgba(108,71,255,0.3)] transition-shadow">
                  {feature.icon}
                </div>
                <h3 className="font-display font-semibold text-xl text-text-primary mb-3">
                  {feature.title}
                </h3>
                <p className="font-body text-sm text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
                
                {/* Simulated abstract visual at bottom for span-2 cards */}
                {feature.span.includes('col-span-2') && (
                  <div className="mt-8 flex-1 w-full bg-bg-elevated rounded-lg border border-border-subtle p-4 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[150%] animate-[shimmer_3s_infinite]" />
                    {/* Mock Code Lines */}
                    <div className="space-y-2 opacity-50">
                      <div className="h-2 w-1/3 bg-accent-primary/50 rounded" />
                      <div className="h-2 w-1/2 bg-white/20 rounded" />
                      <div className="h-2 w-1/4 bg-white/20 rounded" />
                    </div>
                  </div>
                )}
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
