//1. Checks if log in works

import { test, expect } from "@playwright/test";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Ensure the environment variables are defined
const username = process.env.SAUCE_USERNAME;
const password = process.env.SAUCE_PASSWORD;

if (!username || !password) {
  throw new Error(
    "SAUCE_USERNAME or SAUCE_PASSWORD is not defined in the .env file"
  );
}

test("sauce demo login", async ({ page }) => {
  // Navigate to the Sauce Demo login page
  await page.goto("https://www.saucedemo.com/");

  // Fill in username and password from environment variables
  await page.fill("#user-name", username);
  await page.fill("#password", password);

  // Click the login button
  await page.click("#login-button");

  // Verify login by checking for a specific element on the landing page
  await expect(page.locator(".inventory_list")).toBeVisible();
});
