'use client';

import { motion } from 'framer-motion';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import { HoverBorderGradient } from '@/components/ui/HoverBorderGradient';

export function CTABanner() {
  return (
    <section className="py-32 relative z-10 w-full max-w-6xl mx-auto px-6">
      
      <SpotlightCard className="w-full text-center py-24 px-6 md:px-12 relative overflow-hidden group border-border-subtle/50">
        
        {/* Floating Orbs for depth inside CTA */}
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-accent-primary/20 rounded-full blur-[100px] pointer-events-none"
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent-secondary/20 rounded-full blur-[100px] pointer-events-none"
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-extrabold text-5xl md:text-6xl text-white mb-6"
          >
            Ready to hire your next champion?
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-body text-text-secondary text-lg md:text-xl mb-12 max-w-xl mx-auto"
          >
            Join 10,000+ engineering teams already building the future on GreenHire's job matching infrastructure.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button 
              data-cursor="pointer"
              className="px-8 py-4 rounded-xl bg-gradient-to-br from-accent-primary to-indigo-600 font-display font-medium text-base text-white shadow-[0_0_40px_rgba(108,71,255,0.4)] hover:shadow-[0_0_60px_rgba(108,71,255,0.6)] transition-shadow relative z-20"
            >
              Post a Job
            </button>
            
            <div className="relative z-20" data-cursor="pointer">
              <HoverBorderGradient
                containerClassName="rounded-xl w-full"
                className="px-8 py-3.5 bg-bg-surface text-text-primary font-display font-medium text-base"
              >
                Contact Sales
              </HoverBorderGradient>
            </div>
          </motion.div>
        </div>
      </SpotlightCard>
    </section>
  );
}
