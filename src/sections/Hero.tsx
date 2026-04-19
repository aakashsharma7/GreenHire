'use client';

import { motion } from 'framer-motion';
import { TextReveal } from '@/components/ui/TextReveal';
import { HoverBorderGradient } from '@/components/ui/HoverBorderGradient';

export function Hero() {
  return (
    <section className="relative min-h-[100svh] w-full flex flex-col items-center justify-center pt-32 pb-20 overflow-hidden">
      
      {/* Background ambient glow specific to hero */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-primary/20 blur-[120px] rounded-full pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center max-w-5xl px-6 text-center">
        
        {/* Pill Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-border-subtle bg-bg-surface/50 backdrop-blur-md mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-secondary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-secondary"></span>
          </span>
          <span className="font-mono text-xs font-medium text-text-primary tracking-wide uppercase">
            Now in Beta · Join 10,000+ users
          </span>
        </motion.div>

        {/* Headline */}
        <h1 className="font-display font-extrabold text-[clamp(48px,8vw,96px)] leading-[1.05] tracking-tight mb-6">
          <TextReveal 
            text="The luxury job board for climate tech champions" 
            gradientWords={['luxury', 'champions']}
          />
        </h1>

        {/* Sub-headline */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="font-body font-light text-lg md:text-xl text-text-secondary max-w-2xl mb-12"
        >
          Connect with the world's most innovative clean energy and sustainability startups. 
          Build the future, save the planet.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-xl bg-gradient-to-br from-accent-primary to-indigo-600 font-display font-medium text-base text-white shadow-[0_0_40px_rgba(108,71,255,0.4)] hover:shadow-[0_0_60px_rgba(108,71,255,0.6)] transition-shadow"
          >
            Post a Job
          </motion.button>
          
          <HoverBorderGradient
            containerClassName="rounded-xl"
            as="button"
            className="px-8 py-4 bg-bg-base/80 backdrop-blur-xl text-text-primary font-display font-medium text-base"
          >
            Browse Openings
          </HoverBorderGradient>
        </motion.div>
      </div>

      {/* Hero Visual Framework */}
      <motion.div 
        initial={{ opacity: 0, y: 80, rotateX: 0 }}
        animate={{ opacity: 1, y: 0, rotateX: 8 }}
        transition={{ duration: 1, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
        className="relative w-full max-w-5xl mt-24 px-6 z-20"
      >
        <div className="relative rounded-2xl md:rounded-3xl border border-border-subtle bg-[#0a0a0f]/80 backdrop-blur-2xl shadow-2xl overflow-hidden aspect-video">
          
          {/* OS Header bar */}
          <div className="absolute top-0 w-full h-12 border-b border-border-subtle flex items-center px-4 gap-2 bg-[#13131e]/50 backdrop-blur-md z-10">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
          </div>

          {/* Inner Content mock */}
          <div className="w-full h-full pt-12 flex text-left">
            {/* Sidebar */}
            <div className="w-64 border-r border-border-subtle hidden md:flex flex-col gap-2 p-4">
              <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-accent-primary/20 text-accent-primary border border-accent-primary/20">
                <span className="text-lg">📊</span>
                <span className="font-display text-sm font-medium">Dashboard</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg-elevated text-text-secondary transition-colors cursor-pointer">
                <span className="text-lg">💼</span>
                <span className="font-display text-sm font-medium">Job Postings</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg-elevated text-text-secondary transition-colors cursor-pointer">
                <span className="text-lg">👥</span>
                <span className="font-display text-sm font-medium">Candidates</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-bg-elevated text-text-secondary transition-colors cursor-pointer">
                <span className="text-lg">⚙️</span>
                <span className="font-display text-sm font-medium">Settings</span>
              </div>
            </div>
            
            {/* Main view */}
            <div className="flex-1 p-8 flex flex-col gap-6 overflow-hidden">
              {/* Header */}
              <div className="flex justify-between items-center">
                <h3 className="font-display text-xl font-semibold text-white">Overview</h3>
                <button className="px-4 py-2 bg-gradient-to-br from-accent-primary to-indigo-600 text-white text-xs font-bold rounded-lg shadow-[0_0_15px_rgba(108,71,255,0.3)] hover:shadow-[0_0_25px_rgba(108,71,255,0.5)] transition-all">
                  + New Posting
                </button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-4 bg-bg-surface rounded-xl border border-border-subtle flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">👁️</div>
                  <span className="text-text-muted text-[10px] sm:text-xs font-mono uppercase tracking-wider">Total Views</span>
                  <span className="text-white font-display text-2xl sm:text-3xl font-bold">128.4K</span>
                  <span className="text-green-400 text-xs font-mono flex items-center gap-1">↑ 12% this week</span>
                </div>
                <div className="p-4 bg-bg-surface rounded-xl border border-border-subtle flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">👥</div>
                  <span className="text-text-muted text-[10px] sm:text-xs font-mono uppercase tracking-wider">Active Applicants</span>
                  <span className="text-white font-display text-2xl sm:text-3xl font-bold">342</span>
                  <span className="text-green-400 text-xs font-mono flex items-center gap-1">↑ 8% this week</span>
                </div>
                <div className="p-4 bg-bg-surface rounded-xl border border-border-subtle flex flex-col gap-2 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10 text-4xl">📅</div>
                  <span className="text-text-muted text-[10px] sm:text-xs font-mono uppercase tracking-wider">Interviews Setup</span>
                  <span className="text-white font-display text-2xl sm:text-3xl font-bold">24</span>
                  <span className="text-accent-secondary text-xs font-mono flex items-center gap-1">→ Stable</span>
                </div>
              </div>

              {/* Recent Applicants Table */}
              <div className="flex-1 bg-bg-surface rounded-xl border border-border-subtle p-5 flex flex-col gap-4">
                 <h4 className="font-display text-sm font-medium text-text-secondary">Recent Applicants</h4>
                 <div className="flex flex-col gap-3">
                   {[
                     { name: 'Sarah Jenkins', role: 'Battery Engineer', status: 'Interviewing', bg: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
                     { name: 'Michael Chen', role: 'Solar Grid Analyst', status: 'Hired', bg: 'bg-green-500/10 text-green-500 border-green-500/20' },
                     { name: 'Aisha Patel', role: 'Sustainability Lead', status: 'In Review', bg: 'bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20' },
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-bg-elevated border border-border-subtle hover:border-accent-primary/50 transition-colors">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-sm font-bold text-white shadow-inner">
                           {item.name.charAt(0)}
                         </div>
                         <div className="flex flex-col">
                           <span className="text-sm font-medium text-white">{item.name}</span>
                           <span className="text-xs text-text-muted">{item.role}</span>
                         </div>
                       </div>
                       <span className={`px-2 py-1 rounded border text-[10px] font-mono uppercase tracking-wider ${item.bg}`}>
                         {item.status}
                       </span>
                     </div>
                   ))}
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Badges */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute -left-4 md:-left-12 top-1/4 px-4 py-3 rounded-xl border border-border-subtle bg-bg-surface/80 backdrop-blur-xl shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center">
              <span className="text-accent-primary">⚡</span>
            </div>
            <div>
              <p className="font-display font-medium text-sm">Quality Candidates</p>
              <p className="font-mono text-xs text-text-muted">Top 1% talent</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
          className="absolute -right-4 md:-right-12 bottom-1/4 px-4 py-3 rounded-xl border border-border-subtle bg-bg-surface/80 backdrop-blur-xl shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-secondary/20 flex items-center justify-center">
              <span className="text-accent-secondary">🔒</span>
            </div>
            <div>
              <p className="font-display font-medium text-sm">Vetted Startups</p>
              <p className="font-mono text-xs text-text-muted">Mission driven</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

    </section>
  );
}
