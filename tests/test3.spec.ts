//3. Checks if logout functionality works

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

// Test: Log in, click burger menu, and log out
test("login, open burger menu, and log out", async ({ loggedInPage }) => {
  // Click on the burger menu button
  await loggedInPage.click("#react-burger-menu-btn");

  // Click on the logout button in the sidebar
  await loggedInPage.click("#logout_sidebar_link");

  // Verify that the user is logged out by checking for the login button
  await expect(loggedInPage.locator("#login-button")).toBeVisible();
});
