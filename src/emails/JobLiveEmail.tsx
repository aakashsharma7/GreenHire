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
} from '@react-email/components'
import * as React from 'react'

interface JobLiveEmailProps {
  jobTitle: string
  companyName: string
  jobUrl: string
  expiresAt: string
}

export const JobLiveEmail = ({
  jobTitle,
  companyName,
  jobUrl,
  expiresAt,
}: JobLiveEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your job post is live on GreenHire!</Preview>
      <Tailwind>
        <Body className="bg-slate-50 font-sans my-auto mx-auto pt-10 px-2">
          <Container className="bg-white border border-slate-200 rounded-xl my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[24px] text-center">
              <Text className="text-xl font-bold text-green-700 m-0">GreenHire</Text>
            </Section>
            <Heading className="text-slate-900 text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Your job post is live! 🚀
            </Heading>
            <Text className="text-slate-600 text-[14px] leading-[24px]">
              Hi there,
            </Text>
            <Text className="text-slate-600 text-[14px] leading-[24px]">
              Great news! Your job post for <strong>{jobTitle}</strong> at <strong>{companyName}</strong> has been approved and is now live on our board.
            </Text>
            <Section className="bg-slate-50 border border-slate-100 rounded-lg p-4 my-6 text-center">
              <Text className="text-sm font-medium text-slate-800 m-0">
                Expires on: {expiresAt}
              </Text>
            </Section>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-green-700 rounded-lg text-white text-[14px] font-semibold no-underline text-center px-6 py-3"
                href={jobUrl}
              >
                View Job Post
              </Button>
            </Section>
            <Text className="text-slate-600 text-[14px] leading-[24px]">
              Thank you for helping build a sustainable future with GreenHire!
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

JobLiveEmail.PreviewProps = {
  jobTitle: 'Senior React Developer',
  companyName: 'EcoTech',
  jobUrl: 'https://greenhire.com/jobs/123',
  expiresAt: 'May 12, 2026',
} as JobLiveEmailProps

export default JobLiveEmail
