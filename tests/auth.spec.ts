import { test, expect } from '@playwright/test';

// Test data using Clerk's test mode
const TEST_USERS = {
  free: {
    email: 'test@clerk.dev',
    password: '1234'
  },
  // premium: {
  //   email: 'premium@clerk.dev'
  // }
};

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the homepage
    await page.goto('/');
  });

  test('existing free user can sign in and be redirected to homepage', async ({ page }) => {
    // Click on "Se connecter" (Sign In) button
    // await page.getByTestId('navbar-login-testid').click();
    await page.getByRole('link', { name: 'Se connecter' }).click();

    // Wait for sign-in form to load
    await expect(page.getByText('S\'identifier')).toBeVisible();

    // Fill in email address
    await page.getByPlaceholder('Adresse e-mail').fill(TEST_USERS.free.email);

    // Fill in password
    await page.getByPlaceholder('Mot de passe').fill(TEST_USERS.free.password);

    // Click Continue button (the primary form button, not Google)
    await page.getByRole('button', { name: 'Continuer', exact: true }).click();

    // Wait for successful authentication and redirect to homepage
    await expect(page).toHaveURL('/');

    // Verify user is authenticated (sign in button should be gone)
    await expect(page.getByText('Se connecter')).not.toBeVisible();
  });
});