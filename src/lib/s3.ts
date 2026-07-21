import { S3Client } from '@aws-sdk/client-s3';

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const region = process.env.AWS_REGION || 'us-east-1';
export const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

/**
 * Checks if the AWS S3 environment credentials are fully configured and valid (not placeholders).
 */
export function isS3Configured(): boolean {
  if (!accessKeyId || !secretAccessKey || !region || !BUCKET_NAME) {
    return false;
  }
  // Detect standard placeholder values from env files
  if (
    accessKeyId.includes('xxxx') ||
    secretAccessKey.includes('xxxx') ||
    BUCKET_NAME.includes('xxxx')
  ) {
    return false;
  }
  return true;
}

// Instantiate the S3 client only if credentials are configured
export const s3Client = isS3Configured()
  ? new S3Client({
      region,
      credentials: {
        accessKeyId: accessKeyId!,
        secretAccessKey: secretAccessKey!,
      },
    })
  : null;
