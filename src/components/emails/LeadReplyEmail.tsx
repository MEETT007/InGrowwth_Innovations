import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface LeadReplyEmailProps {
  subject: string;
  message: string;
}

export const LeadReplyEmail = ({
  subject,
  message,
}: LeadReplyEmailProps) => {
  const previewText = subject;

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
            <Heading style={h1}>{subject}</Heading>

            <Section style={detailsContainer}>
              <Text style={detailsText}>{message}</Text>
            </Section>

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
              This email was sent in response to your inquiry.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default LeadReplyEmail;

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

const detailsContainer = {
  padding: '10px 0',
};

const detailsText = {
  color: '#334155',
  fontSize: '15px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
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
