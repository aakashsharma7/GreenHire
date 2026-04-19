'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export default function StudioPage() {
  // Suppress layout wrapping for the studio
  return (
    <div className="absolute inset-0 z-[100] bg-black">
      <NextStudio config={config as any} />
    </div>
  )
}
