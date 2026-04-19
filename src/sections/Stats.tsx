'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const STATS = [
  { value: 18, suffix: 'K+', label: 'Active Seekers' },
  { value: 94, suffix: '.2%', label: 'Placement Rate' },
  { value: 500, suffix: '+', label: 'Climate Startups' },
  { value: 10, suffix: 'K+', label: 'Jobs Posted' },
];

function CountUpNumber({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    // Sync the rounded value to React state to render
    return rounded.on("change", (latest) => {
      setDisplay(latest);
    });
  }, [rounded]);

  return (
    <motion.span
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      onViewportEnter={() => {
        animate(count, value, { duration: 2, ease: "easeOut" });
      }}
    >
      {display}
    </motion.span>
  );
}

export function Stats() {
  return (
    <section className="w-full bg-bg-surface border-y border-border-subtle py-20 relative z-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x-0 md:divide-x divide-border-subtle/50">
          {STATS.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="px-4"
            >
              <h4 className="font-display font-extrabold text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-br from-accent-primary to-accent-secondary mb-3">
                <CountUpNumber value={stat.value} />
                {stat.suffix}
              </h4>
              <p className="font-body text-sm font-medium text-text-secondary uppercase tracking-[0.2em]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
