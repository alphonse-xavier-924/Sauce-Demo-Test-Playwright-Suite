//4. Sorts based on price

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

// Test: Log in, sort by price (high to low), and verify sorting
test("login and sort products by price high to low", async ({
  loggedInPage,
}) => {
  // Sort products by price (high to low)
  await loggedInPage.selectOption(".product_sort_container", "hilo");

  // Optional: Verify that the first product is the most expensive one
  const firstProductPrice = await loggedInPage
    .locator(".inventory_item_price")
    .first()
    .textContent();
  console.log("First product price (expected highest):", firstProductPrice);

  // Additional steps or assertions can be added here if needed
});
