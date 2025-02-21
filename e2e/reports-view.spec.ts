// import { test, expect, type Page } from '@playwright/test';

// test.beforeEach(async ({ page }) => {
//   await page.goto('http://localhost:3039/results');
// });

// test.describe('Filters menu', () => {
//   test('Verifica o filtro de ferramenta', async ({ page }) => {
//     await page.getByRole('combobox', { name: 'Ferramenta' }).click();
//     await page.getByRole('combobox', { name: 'Ferramenta' }).fill('PER039');
//     await page.getByRole('option', { name: 'PER039' }).click();
//     await expect(page.locator('[data-testid="meu-select"]').toHaveValue('PER039');
//     await page.getByRole('button', { name: 'Pesquisar' }).click();

//     const rowCount = await page.locator('table tbody tr').count();
//     expect(rowCount).toBeGreaterThan(0);

//     await page.waitForResponse(
//       (response) => response.url().includes('results?&identifier=7') && response.status() === 200
//     );
//   });
// });
