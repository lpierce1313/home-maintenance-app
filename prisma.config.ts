import { defineConfig } from '@prisma/config';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Force reload the .env file from disk every single time
dotenv.config({ path: resolve(process.cwd(), '.env'), override: true });

console.log(">>> LIVE RELOAD URL:", process.env.DATABASE_URL);

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    // For CLI operations like "db push", we use the Direct/Session URL
    url: process.env.DIRECT_URL, 
  },
});