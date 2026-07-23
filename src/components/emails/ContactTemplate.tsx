import * as React from 'react';
import {
  Html,
  Body,
  Head,
  Heading,
  Hr,
  Container,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components';

interface ContactTemplateProps {
  name?: string | null;
  email: string;
  type: string;
  subject?: string | null;
  message?: string | null;
  phone?: string | null;
  service?: string | null;
  budget?: string | null;
  timeline?: string | null;
  projectDetails?: string | null;
}

export const ContactTemplate: React.FC<Readonly<ContactTemplateProps>> = ({
  name,
  email,
  type,
  subject,
  message,
  phone,
  service,
  budget,
  timeline,
  projectDetails,
}) => {
  return (
    <Html>
      <Head />
      <Preview>New Lead from InGrowwth Innovations: {type}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans my-auto mx-auto px-2">
          <Container className="bg-white border border-gray-200 rounded my-10 p-8 w-[465px]">
            <Heading className="text-xl font-bold text-center p-0 my-8 mx-0 text-gray-800">
              New {type} Inquiry
            </Heading>

            <Section>
              <Text className="text-sm font-semibold text-gray-800">Contact Details:</Text>
              <Text className="text-sm text-gray-700 m-0">Name: {name || 'N/A'}</Text>
              <Text className="text-sm text-gray-700 m-0">Email: {email}</Text>
              {phone && <Text className="text-sm text-gray-700 m-0">Phone: {phone}</Text>}
            </Section>

            <Hr className="border border-gray-200 my-6" />

            <Section>
              <Text className="text-sm font-semibold text-gray-800">Inquiry Details:</Text>
              {service && <Text className="text-sm text-gray-700 m-0">Service: {service}</Text>}
              {budget && <Text className="text-sm text-gray-700 m-0">Budget: {budget}</Text>}
              {timeline && <Text className="text-sm text-gray-700 m-0">Timeline: {timeline}</Text>}
              {subject && (
                <Text className="text-sm text-gray-700 m-0 mt-2">Subject: {subject}</Text>
              )}
              {message && (
                <Text className="text-sm text-gray-700 m-0 mt-2 bg-gray-50 p-4 rounded">
                  {message}
                </Text>
              )}
              {projectDetails && (
                <Text className="text-sm text-gray-700 m-0 mt-2 bg-gray-50 p-4 rounded">
                  {projectDetails}
                </Text>
              )}
            </Section>

            <Hr className="border border-gray-200 my-6" />
            <Text className="text-xs text-center text-gray-500">InGrowwth Innovations System</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default ContactTemplate;
