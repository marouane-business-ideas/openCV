import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseEnv } from 'node:util';
import { clerkSetup } from '@clerk/testing/playwright';

const readEnvFile = (path: string) => {
  const file = resolve(__dirname, '../..', path);
  return existsSync(file) ? parseEnv(readFileSync(file, 'utf8')) : {};
};

// Lets the tests sign in through Clerk's form like a user, without Clerk's bot protection stopping them (it does in the
// CI): gets a testing token from Clerk's development instance, the one the app uses here, which
// setupClerkTestingToken() then adds to the page's requests to Clerk
export const fetchClerkTestingToken = async () => {
  // The backend's: from the CI's environment, or the developer's secrets file
  const secretKey = process.env.CLERK_SECRET_KEY || readEnvFile('backend/.env.development.local').CLERK_SECRET_KEY;
  if (!secretKey) {
    throw new Error('The secret key of Clerk\'s development instance is missing: CLERK_SECRET_KEY in ' +
      'backend/.env.development.local, or the GitHub secret CLERK_DEVELOPMENT_SECRET_KEY in the CI');
  }

  await clerkSetup({
    // The frontend's: the dev server and `npm run preview:local` both use its development settings
    publishableKey: readEnvFile('frontend/.env.development').VITE_CLERK_PUBLISHABLE_KEY,
    secretKey,
    // Both keys are given: no .env file to read
    dotenv: false,
  });
};
