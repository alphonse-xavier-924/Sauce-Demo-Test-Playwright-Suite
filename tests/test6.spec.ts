//6. Clicking on cart icon

import { test, expect, Page } from "@playwright/test";
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

// Helper function to log in to Sauce Demo
async function loginToSauceDemo(page: Page): Promise<void> {
  // Navigate to the Sauce Demo login page
  await page.goto("https://www.saucedemo.com/");

  // Fill in username and password from environment variables
  await page.fill("#user-name", username);
  await page.fill("#password", password);

  // Click the login button
  await page.click("#login-button");

  // Verify login by checking for a specific element on the landing page
  await expect(page.locator(".inventory_list")).toBeVisible();
}

// Test 1: Verify login functionality
test("sauce demo login", async ({ page }) => {
  await loginToSauceDemo(page);
});

// Test 2: Log in, add the first item to the cart, and click on the cart icon
test("add first item to cart and go to cart", async ({ page }) => {
  await loginToSauceDemo(page);

  // Click on the first "Add to cart" button
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');

  // Verify item has been added to cart by checking the cart icon's badge
  await expect(page.locator(".shopping_cart_badge")).toBeVisible();

  // Click on the shopping cart icon
  await page.click('[data-test="shopping-cart-link"]');

  // Verify the cart page is displayed by checking for a specific cart element
  await expect(page.locator(".cart_list")).toBeVisible();
});
