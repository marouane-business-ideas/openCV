import { test, expect } from '@playwright/test';

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

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the homepage
    await page.goto('/');
  });

  test('free user can sign in and download resume in PDF format', async ({ page }) => {
    // Sign in as free user
    await page.getByTestId('navbar-login-testid').click();
    await expect(page.getByText('S\'identifier')).toBeVisible();
    await page.getByPlaceholder('Adresse e-mail').fill(TEST_USERS.free.email);
    await page.getByPlaceholder('Mot de passe').fill(TEST_USERS.free.password);
    await page.getByRole('button', { name: 'Continuer', exact: true }).click();

    // Wait for successful authentication and redirect to homepage
    await expect(page).toHaveURL('/');

    // Verify user is authenticated (sign in button should be gone)
    await expect(page.getByTestId('navbar-login-testid')).not.toBeVisible();

    // Navigate to resume builder
    await page.getByTestId('home-get-started-button').click();
    await expect(page).toHaveURL('/resume');

    // Wait for the PDF download button to be visible
    await expect(page.getByTestId('download-pdf-button')).toBeVisible();

    // Set up download promise before clicking
    const downloadPromise = page.waitForEvent('download');

    // Click the PDF download button
    await page.getByTestId('download-pdf-button').click();

    // Wait for the download to complete
    const download = await downloadPromise;

    // Verify the download occurred and has the expected filename
    expect(download.suggestedFilename()).toBe('CV.pdf');
  });

  test('premium user can sign in and download resume in PDF format', async ({ page }) => {
    // Sign in as premium user
    await page.getByTestId('navbar-login-testid').click();
    await expect(page.getByText('S\'identifier')).toBeVisible();
    await page.getByPlaceholder('Adresse e-mail').fill(TEST_USERS.premium.email);
    await page.getByPlaceholder('Mot de passe').fill(TEST_USERS.premium.password);
    await page.getByRole('button', { name: 'Continuer', exact: true }).click();

    // Wait for successful authentication and redirect to resume page
    await expect(page).toHaveURL('/resume');

    // Wait for the PDF download button to be visible
    await expect(page.getByTestId('download-pdf-button')).toBeVisible();

    // Set up download promise before clicking
    const downloadPromise = page.waitForEvent('download');

    // Click the PDF download button
    await page.getByTestId('download-pdf-button').click();

    // Wait for the download to complete
    const download = await downloadPromise;

    // Verify the download occurred and has the expected filename
    expect(download.suggestedFilename()).toBe('CV.pdf');
  });

});