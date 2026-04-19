import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative w-full border-t border-border-subtle bg-bg-base overflow-hidden pt-24 pb-12 z-10">
      
      {/* Subtle Grid Background for Footer */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="inline-block mb-6" data-cursor="pointer">
              <span className="font-display font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-accent-primary to-accent-secondary">
                GreenHire
              </span>
            </Link>
            <p className="font-body text-sm text-text-secondary leading-relaxed max-w-xs">
              The premium job board destination connecting visionary talent with climate tech leaders.
            </p>
            <div className="flex gap-4 mt-8">
              {[...Array(4)].map((_, i) => (
                <a 
                  key={i} 
                  href="#" 
                  data-cursor="pointer"
                  className="w-10 h-10 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center text-text-muted hover:text-accent-primary hover:border-accent-primary hover:scale-110 transition-all duration-300"
                >
                   {/* Dummy Icon Shapes */}
                   <div className="w-4 h-4 bg-current rounded-sm" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-medium text-white mb-6">Product</h4>
            <ul className="space-y-4 font-body text-sm text-text-secondary">
              <li><a href="#" className="hover:text-accent-secondary transition-colors" data-cursor="pointer">Post a Job</a></li>
              <li><a href="#" className="hover:text-accent-secondary transition-colors" data-cursor="pointer">Browse Operations</a></li>
              <li><a href="#" className="hover:text-accent-secondary transition-colors" data-cursor="pointer">Employer Branding</a></li>
              <li><a href="#" className="hover:text-accent-secondary transition-colors" data-cursor="pointer">Success Stories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-medium text-white mb-6">Company</h4>
            <ul className="space-y-4 font-body text-sm text-text-secondary">
              <li><a href="#" className="hover:text-accent-secondary transition-colors" data-cursor="pointer">About GreenHire</a></li>
              <li><a href="#" className="hover:text-accent-secondary transition-colors" data-cursor="pointer">Careers</a></li>
              <li><a href="/blog" className="hover:text-accent-secondary transition-colors" data-cursor="pointer">Blog & Case Studies</a></li>
              <li><a href="#" className="hover:text-accent-secondary transition-colors" data-cursor="pointer">Contact</a></li>
              <li><a href="#" className="hover:text-accent-secondary transition-colors" data-cursor="pointer">Partners</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-medium text-white mb-6">Legal</h4>
            <ul className="space-y-4 font-body text-sm text-text-secondary">
              <li><a href="#" className="hover:text-accent-secondary transition-colors" data-cursor="pointer">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-accent-secondary transition-colors" data-cursor="pointer">Terms of Service</a></li>
              <li><a href="#" className="hover:text-accent-secondary transition-colors" data-cursor="pointer">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-accent-secondary transition-colors" data-cursor="pointer">Security Posture</a></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-border-subtle pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-text-muted">
            © {new Date().getFullYear()} GreenHire Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-secondary animate-pulse" />
            <span className="font-mono text-xs text-text-muted">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
