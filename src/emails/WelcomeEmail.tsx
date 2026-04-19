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

interface WelcomeEmailProps {
  confirmUrl: string
}

export const WelcomeEmail = ({ confirmUrl }: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Confirm your GreenHire job alerts</Preview>
      <Tailwind>
        <Body className="bg-slate-50 font-sans my-auto mx-auto pt-10 px-2">
          <Container className="bg-white border border-slate-200 rounded-xl my-[40px] mx-auto p-[20px] max-w-[465px]">
            <Section className="mt-[24px] text-center">
              <Text className="text-xl font-bold text-green-700 m-0">GreenHire</Text>
            </Section>
            <Heading className="text-slate-900 text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Confirm your subscription
            </Heading>
            <Text className="text-slate-600 text-[14px] leading-[24px]">
              Hi there,
            </Text>
            <Text className="text-slate-600 text-[14px] leading-[24px]">
              Thanks for subscribing to GreenHire! Click the button below to confirm your subscription and start receiving the best climate tech job alerts.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="bg-green-700 rounded-lg text-white text-[14px] font-semibold no-underline text-center px-6 py-3"
                href={confirmUrl}
              >
                Confirm Subscription
              </Button>
            </Section>
            <Text className="text-slate-600 text-[14px] leading-[24px]">
              Once confirmed, you'll receive weekly job alerts every Tuesday.
            </Text>
            <Text className="text-slate-400 text-[12px] leading-[24px] mt-[48px]">
              If you didn't request this email, there's nothing to worry about, you can safely ignore it.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}

WelcomeEmail.PreviewProps = {
  confirmUrl: 'https://greenhire.com/api/subscribe/confirm?token=preview',
} as WelcomeEmailProps

export default WelcomeEmail
