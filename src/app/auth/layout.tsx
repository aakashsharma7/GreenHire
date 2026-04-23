import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Sign In | GreenHire',
    template: '%s | GreenHire',
  },
  robots: { index: false },
}

// Auth pages get their own layout WITHOUT the Navbar and Footer
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
