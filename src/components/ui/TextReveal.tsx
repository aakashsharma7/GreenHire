'use client';

import { motion, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

export const TextReveal = ({
  text,
  className,
  gradientWords = [],
}: {
  text: string;
  className?: string;
  gradientWords?: string[];
}) => {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 * i },
    }),
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 40,
    },
  };

  return (
    <motion.div
      className={cn('flex flex-wrap justify-center', className)}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {words.map((word, idx) => {
        // Simple matching for gradient words (ignoring punctuation for match)
        const pureWord = word.replace(/[^a-zA-Z0-9]/g, '');
        const isGradient = gradientWords.includes(pureWord);
        
        return (
          <motion.span
            variants={child}
            key={idx}
            className={cn(
              'mr-[0.25em] inline-block last:mr-0',
              isGradient && 'text-transparent bg-clip-text bg-gradient-to-br from-accent-primary to-accent-secondary drop-shadow-[0_0_15px_rgba(108,71,255,0.4)]'
            )}
          >
            {word}
          </motion.span>
        );
      })}
    </motion.div>
  );
};
