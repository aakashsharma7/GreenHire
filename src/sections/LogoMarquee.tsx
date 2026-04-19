'use client';

import { motion } from 'framer-motion';

const LOGOS = [
  { name: 'SolarCity', symbol: '☀' },
  { name: 'WindPower', symbol: '⎈' },
  { name: 'TerraForm', symbol: '⌖' },
  { name: 'CarbonX', symbol: '⎊' },
  { name: 'EcoGrid', symbol: '⍟' },
  { name: 'ApexGreen', symbol: '⎋' },
];

export function LogoMarquee() {
  return (
    <section className="py-12 border-y border-border-subtle bg-bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <p className="font-mono text-sm text-text-muted uppercase tracking-widest">
          Trusted by pioneering teams at
        </p>
      </div>

      <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)] group">
        <motion.div
          className="flex whitespace-nowrap min-w-full group-hover:[animation-play-state:paused]"
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 30 }}
        >
          {/* Double the logos to make it truly infinite visual loop */}
          {[...LOGOS, ...LOGOS, ...LOGOS].map((logo, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-3 px-12 opacity-30 hover:opacity-70 transition-opacity duration-300 grayscale"
            >
              <span className="text-3xl text-white">{logo.symbol}</span>
              <span className="font-display font-bold text-xl text-white">{logo.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
