import * as dotenv from 'dotenv';
import { defineConfig } from '@prisma/config';
import fs from 'fs';
import path from 'path';

// Load .env first
dotenv.config();

// Override with .env.local if it exists
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath, override: true });
}

const dbUrl = process.env.DATABASE_URL || '';

// Safety Guard: block remote databases in development
if (
  process.env.APP_ENV === 'development' &&
  !dbUrl.includes('localhost') &&
  !dbUrl.includes('127.0.0.1') &&
  process.env.ALLOW_REMOTE_DEV_DB !== 'true'
) {
  console.error('\n❌ ERROR: Development database must be localhost.');
  console.error('Remote URLs are blocked to prevent accidental data loss in production.');
  console.error('Set ALLOW_REMOTE_DEV_DB="true" if you really want to bypass this.\n');
  process.exit(1);
}

// Print host for visibility
try {
  if (dbUrl) {
    const urlObj = new URL(dbUrl);
    console.log(`🔌 Database Host: ${urlObj.host}`);
  }
} catch (e) {
  // Ignore malformed URL errors here
}

export default defineConfig({
  migrations: {
    seed: 'npx tsx prisma/seed.ts',
  },
  datasource: {
    url: dbUrl,
  },
});
