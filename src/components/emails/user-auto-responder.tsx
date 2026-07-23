import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface UserAutoResponderEmailProps {
  leadType: 'CONTACT' | 'QUOTE' | 'NEWSLETTER';
  name?: string | null;
}

export const UserAutoResponderEmail = ({
  leadType = 'CONTACT',
  name,
}: UserAutoResponderEmailProps) => {
  const isNewsletter = leadType === 'NEWSLETTER';
  const isQuote = leadType === 'QUOTE';

  const recipientName = name || 'there';
  const previewText = isNewsletter
    ? 'Welcome to the InGrowwth Innovations Newsletter!'
    : 'We have received your request - InGrowwth Innovations';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logoText}>InGrowwth Innovations</Text>
          </Section>

          <Section style={content}>
            <Heading style={h1}>Hi {recipientName},</Heading>

            {isNewsletter ? (
              <>
                <Text style={bodyText}>
                  Thank you for subscribing to the InGrowwth Innovations newsletter! We are thrilled
                  to have you join our community.
                </Text>
                <Text style={bodyText}>
                  You&apos;ll now be the first to receive updates on our latest projects, tech
                  insights, industry trends, and announcements.
                </Text>
              </>
            ) : (
              <>
                <Text style={bodyText}>
                  Thank you for contacting InGrowwth Innovations. We have received your{' '}
                  {isQuote ? 'quote request' : 'inquiry'}.
                </Text>
                <Text style={bodyText}>
                  Our dedicated team is already reviewing the details you provided. We aim to
                  respond to all inquiries within 24-48 business hours. If we need any additional
                  information to process your request, one of our representatives will reach out to
                  you directly.
                </Text>
              </>
            )}

            <Section style={ctaContainer}>
              <Link href="https://ingrowwth.com" style={button}>
                Visit Our Website
              </Link>
            </Section>

            <Text style={bodyText}>
              In the meantime, feel free to explore our services and read about our recent work on
              our blog.
            </Text>

            <Text style={signatureText}>
              Best regards,
              <br />
              <strong>The InGrowwth Innovations Team</strong>
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} InGrowwth Innovations. All rights reserved.
            </Text>
            <Text style={footerSubtext}>
              You are receiving this email because you submitted a form on our website.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default UserAutoResponderEmail;

// --- Styles ---

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0 0 40px',
  marginBottom: '64px',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  maxWidth: '580px',
};

const header = {
  backgroundColor: '#0f172a',
  padding: '24px 32px',
  textAlign: 'center' as const,
};

const logoText = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: 'bold',
  letterSpacing: '0.5px',
  margin: '0',
};

const content = {
  padding: '32px 32px 10px 32px',
};

const h1 = {
  color: '#1e293b',
  fontSize: '20px',
  fontWeight: '700',
  lineHeight: '1.3',
  margin: '0 0 18px',
};

const bodyText = {
  color: '#475569',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0 0 20px',
};

const ctaContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#4f46e5',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '15px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const signatureText = {
  color: '#475569',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '24px 0 0',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '20px 32px 0 32px',
};

const footer = {
  padding: '24px 32px 0 32px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#94a3b8',
  fontSize: '13px',
  margin: '0 0 8px',
};

const footerSubtext = {
  color: '#cbd5e1',
  fontSize: '11px',
  margin: '0',
};
