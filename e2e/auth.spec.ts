import { test, expect, type Page } from '@playwright/test';
import { setupClerkTestingToken } from '@clerk/testing/playwright';

import { fetchClerkTestingToken } from './helpers/clerk';
import { openDownloadedPdf, pdfShows } from './helpers/downloadedPdf';

const TEST_USERS = {
  free: {
    email: 'test@clerk.dev',
    password: '1234'
  },
  premium: {
    email: 'premium@clerk.dev',
    password: '1234'
  }
};

const signIn = async (page: Page, user: { email: string, password: string }) => {
  await page.getByTestId('navbar-login-testid').click();
  await expect(page.getByText('S\'identifier')).toBeVisible();
  await page.getByPlaceholder('Adresse e-mail').fill(user.email);
  await page.getByPlaceholder('Mot de passe').fill(user.password);
  await page.getByRole('button', { name: 'Continuer', exact: true }).click();
};

// What the user gets in the end: the resume they downloaded opens as a PDF and shows what they typed, and they find
// it in their dashboard
const downloadResumeAndCheckIt = async (page: Page) => {
  // A name of this run only, to recognize this resume in the PDF and in the dashboard
  const name = `Test PDF ${Date.now()}`;
  await page.locator('#name').fill(name);

  await expect(page.getByTestId('download-pdf-button')).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('download-pdf-button').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('CV.pdf');

  // The file opens in a PDF reader, with the resume in it
  const pdf = await openDownloadedPdf(download);
  expect(pdf.pageCount).toBeGreaterThan(0);
  expect(pdfShows(pdf.text, name), `the PDF should show "${name}"`).toBe(true);

  // The dashboard lists it, without error
  await page.getByRole('link', { name: 'Mon compte' }).click();
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText(name)).toBeVisible();
  await expect(page.getByText('Une erreur est survenue lors de la récupération des PDF')).toHaveCount(0);
};

// @clerk: sign in with Clerk's test accounts, which needs the secret key of Clerk's development instance
test.describe('Authentication Flow', { tag: '@clerk' }, () => {
  test.beforeAll(async () => {
    await fetchClerkTestingToken();
  });

  test.beforeEach(async ({ page }) => {
    await setupClerkTestingToken({ page });
    // Start from the French homepage, like the browser's locale ("/" is the English one)
    await page.goto('/fr');
  });

  test('free user can sign in, download a resume that opens as a PDF, and find it in the dashboard', async ({ page }) => {
    await signIn(page, TEST_USERS.free);

    // Wait for successful authentication and redirect to the resume builder
    await expect(page).toHaveURL('/resume');

    // Verify user is authenticated (sign in button should be gone)
    await expect(page.getByTestId('navbar-login-testid')).not.toBeVisible();

    await downloadResumeAndCheckIt(page);
  });

  test('premium user can sign in, download a resume that opens as a PDF, and find it in the dashboard', async ({ page }) => {
    await signIn(page, TEST_USERS.premium);

    // Wait for successful authentication and redirect to resume page
    await expect(page).toHaveURL('/resume');

    await downloadResumeAndCheckIt(page);
  });

});
