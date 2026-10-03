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

interface CareerApplicationAdminEmailProps {
  applicationId: string;
  candidateName: string;
  email: string;
  phone?: string | null;
  roleAppliedFor: string;
  coverLetter?: string | null;
  resumeUrl?: string | null;
  createdAt: string;
}

export const CareerApplicationAdminEmail = ({
  applicationId,
  candidateName,
  email,
  phone,
  roleAppliedFor,
  coverLetter,
  resumeUrl,
  createdAt,
}: CareerApplicationAdminEmailProps) => {
  const previewText = `New Job Application: ${candidateName} for ${roleAppliedFor}`;

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
            <Heading style={h1}>New Job Application</Heading>
            <Text style={introText}>
              A new candidate has submitted an application. Here are the details:
            </Text>

            <Section style={tableContainer}>
              <table style={table}>
                <tbody>
                  <tr>
                    <td style={tdLabel}>App ID</td>
                    <td style={tdValue}>{applicationId}</td>
                  </tr>
                  <tr>
                    <td style={tdLabel}>Role Applied For</td>
                    <td style={tdValue}>
                      <span style={badge}>{roleAppliedFor}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style={tdLabel}>Name</td>
                    <td style={tdValue}>{candidateName}</td>
                  </tr>
                  <tr>
                    <td style={tdLabel}>Email</td>
                    <td style={tdValue}>
                      <Link href={`mailto:${email}`} style={link}>
                        {email}
                      </Link>
                    </td>
                  </tr>
                  {phone && (
                    <tr>
                      <td style={tdLabel}>Phone</td>
                      <td style={tdValue}>{phone}</td>
                    </tr>
                  )}
                  {resumeUrl && (
                    <tr>
                      <td style={tdLabel}>Resume</td>
                      <td style={tdValue}>
                        <Link href={resumeUrl} style={link} target="_blank" rel="noopener noreferrer">
                          View Resume
                        </Link>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td style={tdLabel}>Submitted At</td>
                    <td style={tdValue}>{new Date(createdAt).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {coverLetter && (
              <Section style={detailsContainer}>
                <Text style={sectionTitle}>Cover Letter</Text>
                <Text style={detailsText}>{coverLetter}</Text>
              </Section>
            )}
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              &copy; {new Date().getFullYear()} InGrowwth Innovations. All rights reserved.
            </Text>
            <Text style={footerSubtext}>
              Automated notification from the InGrowwth Innovations career portal.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default CareerApplicationAdminEmail;

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
  fontSize: '24px',
  fontWeight: '700',
  lineHeight: '1.25',
  margin: '0 0 16px',
};

const introText = {
  color: '#475569',
  fontSize: '15px',
  lineHeight: '1.5',
  margin: '0 0 24px',
};

const tableContainer = {
  backgroundColor: '#f8fafc',
  borderRadius: '6px',
  padding: '16px 20px',
  margin: '0 0 24px',
  border: '1px solid #e2e8f0',
};

const table = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const tdLabel = {
  padding: '8px 0',
  color: '#64748b',
  fontSize: '14px',
  fontWeight: '500',
  width: '140px',
  verticalAlign: 'top',
};

const tdValue = {
  padding: '8px 0',
  color: '#0f172a',
  fontSize: '14px',
  fontWeight: '400',
  verticalAlign: 'top',
};

const badge = {
  display: 'inline-block',
  padding: '2px 8px',
  fontSize: '12px',
  fontWeight: '600',
  borderRadius: '4px',
  backgroundColor: '#e0e7ff',
  color: '#4338ca',
  textTransform: 'uppercase' as const,
};

const link = {
  color: '#4f46e5',
  textDecoration: 'underline',
};

const detailsContainer = {
  backgroundColor: '#f8fafc',
  borderRadius: '6px',
  padding: '16px 20px',
  margin: '0 0 24px',
  border: '1px solid #e2e8f0',
};

const sectionTitle = {
  color: '#1e293b',
  fontSize: '14px',
  fontWeight: '600',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 8px 0',
};

const detailsText = {
  color: '#334155',
  fontSize: '14px',
  lineHeight: '1.6',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
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
