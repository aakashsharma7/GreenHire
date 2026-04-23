'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { name: 'Browse Jobs', href: '/jobs' },
  { name: 'Companies', href: '#companies' },
  { name: 'Blog', href: '/blog' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 px-6 pointer-events-none"
    >
      <div 
        className={cn(
          "w-full max-w-5xl flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 pointer-events-auto",
          scrolled 
            ? "bg-bg-base/70 backdrop-blur-[20px] border border-border-subtle shadow-xl" 
            : "bg-transparent border-transparent"
        )}
      >
        <Link href="/" data-cursor="pointer">
          <span className="font-display font-bold text-xl text-transparent bg-clip-text bg-gradient-to-br from-accent-primary to-accent-secondary">
            GreenHire
          </span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              data-cursor="pointer"
              className="group relative font-body text-[14px] text-text-secondary hover:text-text-primary transition-colors py-1"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-accent-primary scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 ease-out" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Sign In */}
          <Link
            href="/auth/login"
            data-cursor="pointer"
            className="hidden md:inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.05] transition-all duration-200"
          >
            Sign in
          </Link>

          {/* Sign Up */}
          <Link
            href="/auth/signup"
            data-cursor="pointer"
            className="hidden sm:inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-black bg-[var(--accent-primary)] hover:bg-[var(--accent-primary)]/90 shadow-lg shadow-[var(--accent-primary)]/20 hover:shadow-[var(--accent-primary)]/40 transition-all duration-200"
          >
            Sign up
          </Link>

          {/* Post a Job */}
          <Link
            href="/post-a-job"
            data-cursor="pointer"
            className="group relative px-5 py-2.5 rounded-lg overflow-hidden font-display text-sm font-medium text-white shadow-[0_0_15px_rgba(108,71,255,0.2)] hover:shadow-[0_0_25px_rgba(108,71,255,0.4)] transition-all"
          >
             {/* Base border background */}
             <div className="absolute inset-0 bg-gradient-to-br from-accent-primary to-accent-secondary opacity-80 z-0" />
             {/* Inner dark background */}
             <div className="absolute inset-[1px] bg-bg-base rounded-[7px] z-10 transition-colors duration-300 group-hover:bg-transparent" />
             {/* Button Text */}
             <span className="relative z-20 transition-colors duration-300">
               Post a Job
             </span>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
