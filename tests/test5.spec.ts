//5. Clicks on a particular t-shirt

import { test as base, expect, Page } from "@playwright/test";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Ensure the environment variables are defined with a fallback for TypeScript
const username: string = process.env.SAUCE_USERNAME ?? "";
const password: string = process.env.SAUCE_PASSWORD ?? "";

if (!username || !password) {
  throw new Error(
    "SAUCE_USERNAME or SAUCE_PASSWORD is not defined in the .env file"
  );
}

// Define a custom fixture for login
const test = base.extend<{
  loggedInPage: Page;
}>({
  loggedInPage: async ({ page }, use) => {
    // Navigate to the Sauce Demo login page
    await page.goto("https://www.saucedemo.com/");

    // Fill in username and password from environment variables
    await page.fill("#user-name", username);
    await page.fill("#password", password);

    // Click the login button
    await page.click("#login-button");

    // Verify login by checking for a specific element on the landing page
    await expect(page.locator(".inventory_list")).toBeVisible();

    // Provide the logged-in page to the test
    await use(page);
  },
});

// Test: Log in, sort by price (high to low), and click on a specific item
test("login, sort products by price high to low, and click specific item", async ({
  loggedInPage,
}) => {
  // Sort products by price (high to low)
  await loggedInPage.selectOption(".product_sort_container", "hilo");

  // Click on the "Test.allTheThings() T-Shirt (Red)" item
  await loggedInPage.click(
    'div[data-test="inventory-item-name"]:has-text("Test.allTheThings() T-Shirt (Red)")'
  );

  // Optional: Verify that the correct item page is loaded by checking the page title or another unique identifier
  const itemTitle = await loggedInPage
    .locator(".inventory_details_name")
    .textContent();
  expect(itemTitle).toBe("Test.allTheThings() T-Shirt (Red)");
});
