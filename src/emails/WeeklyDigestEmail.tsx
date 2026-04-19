import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Link,
} from '@react-email/components'
import * as React from 'react'
import type { Job } from '@/types'
import { formatSalary } from '@/lib/utils'

interface WeeklyDigestEmailProps {
  jobs: Job[]
  date: string
  unsubscribeUrl: string
}

export const WeeklyDigestEmail = ({ jobs, date, unsubscribeUrl }: WeeklyDigestEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>This week's top climate tech jobs</Preview>
      <Tailwind>
        <Body className="bg-slate-50 font-sans my-auto mx-auto pt-10 px-2 pb-10">
          <Container className="bg-white border border-slate-200 rounded-xl my-[20px] mx-auto p-[20px] max-w-[600px]">
            <Section className="mt-[24px] text-center mb-6">
              <Text className="text-xl font-bold text-green-700 m-0">GreenHire</Text>
            </Section>
            
            <Heading className="text-slate-900 text-[24px] font-normal text-center p-0 mb-[30px] mx-0">
              This week's climate tech jobs
            </Heading>
            
            <Text className="text-slate-600 text-center text-[14px] mb-8">
              Here are {jobs.length} new opportunities in climate tech as of {date}.
            </Text>

            {jobs.map((job) => (
              <Section 
                key={job.id} 
                className={`border border-slate-200 rounded-lg p-5 mb-4 ${job.is_featured ? 'border-l-4 border-l-amber-400 bg-amber-50/10' : ''}`}
              >
                <Text className="text-[18px] font-bold text-slate-900 m-0 mb-1">
                  {job.title}
                </Text>
                <Text className="text-[16px] text-slate-700 m-0 mb-3">
                  {job.company_name}
                </Text>
                <Text className="text-[14px] text-slate-500 m-0 mb-4">
                  📍 {job.location} {job.is_remote ? '(Remote)' : ''} 
                  {(job.salary_min || job.salary_max) && ` • 💰 ${formatSalary(job.salary_min, job.salary_max)}`}
                </Text>
                <Button
                  className="bg-slate-900 rounded-lg text-white text-[14px] font-medium no-underline text-center px-4 py-2"
                  href={job.apply_url}
                >
                  Apply now
                </Button>
              </Section>
            ))}

            <Section className="text-center mt-10 text-slate-400">
              <Text className="text-[12px]">
                You're receiving this because you subscribed to GreenHire job alerts.
              </Text>
              <Link href={unsubscribeUrl} className="text-[12px] text-slate-500 underline">
                Unsubscribe
              </Link>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

WeeklyDigestEmail.PreviewProps = {
  date: 'April 12, 2026',
  unsubscribeUrl: 'https://greenhire.com/unsubscribe?email=test@example.com',
  jobs: [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company_name: 'SolarCity',
      location: 'San Francisco, CA',
      is_remote: true,
      salary_min: 150000,
      salary_max: 200000,
      is_featured: true,
      apply_url: 'https://example.com',
    },
    {
      id: '2',
      title: 'Product Manager',
      company_name: 'WindPower',
      location: 'Austin, TX',
      is_remote: false,
      apply_url: 'https://example.com',
    }
  ] as Job[]
} as WeeklyDigestEmailProps

export default WeeklyDigestEmail
