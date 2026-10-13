import { test, expect, type Locator, type Page } from '@playwright/test';

// The resume form is public: no need to sign in. The app is in French (see playwright.config.ts)

const preview = (page: Page) => page.frameLocator('#pdf-viewer-iframe');

// The editor of a field, with its toolbar
const editorOf = (page: Page, id: string) => {
  const text = page.locator(`#${id}`);
  const field = page.locator('.rich-text-editor').filter({ has: text });
  return { field, text, button: (name: string) => field.getByRole('button', { name, exact: true }) };
};

const clear = async (text: Locator) => {
  await text.click();
  await text.press('ControlOrMeta+a');
  await text.press('Backspace');
};

const paste = (text: Locator, html: string) => text.evaluate((element, html) => {
  const clipboardData = new DataTransfer();
  clipboardData.setData('text/html', html);
  clipboardData.setData('text/plain', element.ownerDocument.createRange().createContextualFragment(html).textContent ?? '');
  element.dispatchEvent(new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true }));
}, html);

test.describe('Summary editor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/resume');
  });

  test('HTML typed by the user is printed as text', async ({ page }) => {
    const { text } = editorOf(page, 'summary');
    await clear(text);
    await text.pressSequentially('I write <b>tags</b> as text.');

    await expect(preview(page).getByText('I write <b>tags</b> as text.')).toBeVisible();
    await expect(preview(page).locator('b', { hasText: 'tags' })).toHaveCount(0);
  });

  test('the toolbar formats the text', async ({ page }) => {
    const { text, button } = editorOf(page, 'summary');
    await clear(text);
    await button('Gras').click();
    await text.pressSequentially('Important');
    await text.press('Enter');
    await button('Gras').click();
    await button('Liste à puces').click();
    await text.pressSequentially('First item');

    await expect(preview(page).locator('strong', { hasText: 'Important' })).toBeVisible();
    await expect(preview(page).locator('ul > li', { hasText: 'First item' })).toBeVisible();
  });

  test('pasted text keeps its bold but not its fonts, sizes and colors', async ({ page }) => {
    const { text } = editorOf(page, 'summary');
    await clear(text);
    await paste(text, '<p><span style="color: red; font-size: 30px; font-family: Comic Sans MS">Red text</span> and ' +
      '<span style="font-weight: bold">bold text</span></p>');

    await expect(preview(page).getByText('Red text and bold text')).toBeVisible();
    await expect(preview(page).locator('strong', { hasText: 'bold text' })).toBeVisible();
    await expect(preview(page).locator('[style*="red"], [style*="Comic"]')).toHaveCount(0);
  });
});

test.describe('Job and school descriptions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/resume');
  });

  test('use the same editor as the summary', async ({ page }) => {
    for (const id of ['job-description-0', 'school-description-0']) {
      const { text, button } = editorOf(page, id);
      await clear(text);
      await button('Liste à puces').click();
      await text.pressSequentially(`${id}: <i>tags</i> as text`);

      await expect(preview(page).locator('ul > li', { hasText: `${id}: <i>tags</i> as text` })).toBeVisible();
    }
  });

  test('offer formatting only, no way to edit the HTML', async ({ page }) => {
    for (const id of ['summary', 'job-description-0', 'school-description-0']) {
      const buttons = editorOf(page, id).field.getByRole('button');
      await expect(buttons).toHaveCount(6);
      expect(await buttons.evaluateAll((elements) => elements.map((element) => element.getAttribute('aria-label'))))
        .toEqual(['Gras', 'Italique', 'Souligné', 'Liste à puces', 'Liste numérotée', 'Lien']);
    }
  });
});
