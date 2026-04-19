import Link from 'next/link'
import { Leaf, MessageCircle, Share2, Code } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-700 text-white">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="text-lg font-semibold text-white">
                Green<span className="text-primary-400">Hire</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
              The #1 job board for climate tech professionals. Curated roles at startups, NGOs,
              and companies building a sustainable future.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors duration-150"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors duration-150"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors duration-150"
              >
                <Code className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              For Job Seekers
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Browse All Jobs', href: '/' },
                { label: 'Remote Jobs', href: '/?is_remote=true' },
                { label: 'Climate Tech', href: '/?search=climate' },
                { label: 'Clean Energy', href: '/?search=energy' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              For Employers
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'Post a Job', href: '/post-a-job' },
                { label: 'Pricing', href: '/post-a-job#pricing' },
                { label: 'Admin', href: '/admin' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-150"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {currentYear} GreenHire. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Helping build a sustainable future, one hire at a time. 🌱
          </p>
        </div>
      </div>
    </footer>
  )
}
