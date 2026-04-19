'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface HoverBorderGradientProps extends React.HTMLAttributes<HTMLElement> {
  as?: any;
  containerClassName?: string;
  className?: string;
  duration?: number;
  clockwise?: boolean;
}

export function HoverBorderGradient({
  children,
  containerClassName,
  className,
  as: Tag = 'button',
  duration = 1,
  clockwise = true,
  ...props
}: HoverBorderGradientProps) {
  const [hovered, setHovered] = useState<boolean>(false);
  const [direction, setDirection] = useState<'TOP' | 'LEFT' | 'BOTTOM' | 'RIGHT'>('TOP');

  const rotateDirection = (currentDirection: typeof direction) => {
    const directions: typeof direction[] = ['TOP', 'LEFT', 'BOTTOM', 'RIGHT'];
    const currentIndex = directions.indexOf(currentDirection);
    const nextIndex = clockwise
      ? (currentIndex - 1 + directions.length) % directions.length
      : (currentIndex + 1) % directions.length;
    return directions[nextIndex];
  };

  const movingMap: Record<typeof direction, string> = {
    TOP: 'radial-gradient(20.7% 50% at 50% 0%, var(--accent-primary) 0%, rgba(255, 255, 255, 0) 100%)',
    LEFT: 'radial-gradient(16.6% 43.1% at 0% 50%, var(--accent-secondary) 0%, rgba(255, 255, 255, 0) 100%)',
    BOTTOM: 'radial-gradient(20.7% 50% at 50% 100%, var(--accent-primary) 0%, rgba(255, 255, 255, 0) 100%)',
    RIGHT: 'radial-gradient(16.2% 41.19% at 100% 50%, var(--accent-secondary) 0%, rgba(255, 255, 255, 0) 100%)',
  };

  const highlight = 'radial-gradient(75% 181.159% at 50% 50%, var(--accent-primary) 0%, rgba(255, 255, 255, 0) 100%)';

  useEffect(() => {
    if (!hovered) {
      const interval = setInterval(() => {
        setDirection((prevState) => rotateDirection(prevState));
      }, duration * 1000);
      return () => clearInterval(interval);
    }
  }, [hovered]);

  return (
    <Tag
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'relative flex rounded-xl border content-center bg-bg-surface hover:bg-bg-elevated transition duration-500 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit',
        containerClassName
      )}
      {...props}
    >
      <div className={cn('w-auto text-text-primary z-10 bg-bg-surface px-6 py-3 rounded-[inherit]', className)}>
        {children}
      </div>
      <motion.div
        className="flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]"
        style={{
          filter: 'blur(2px)',
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
        initial={{ background: movingMap[direction] }}
        animate={{
          background: hovered ? [movingMap[direction], highlight] : movingMap[direction],
        }}
        transition={{ ease: 'linear', duration: duration ?? 1 }}
      />
      <div className="bg-bg-base absolute z-1 flex-none inset-[2px] rounded-[100px]" />
    </Tag>
  );
}
