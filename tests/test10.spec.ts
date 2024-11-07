//7. Clicking on cart icon, checking out, entering details, continuing, and finishing

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

// Test 2: Log in, add the first item to the cart, go to cart, checkout, fill details, continue, and finish
test("add first item to cart, go to cart, checkout, fill details, continue, and finish", async ({
  page,
}) => {
  await loginToSauceDemo(page);

  // Click on the first "Add to cart" button
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');

  // Verify item has been added to cart by checking the cart icon's badge
  await expect(page.locator(".shopping_cart_badge")).toBeVisible();

  // Click on the shopping cart icon
  await page.click('[data-test="shopping-cart-link"]');

  // Verify the cart page is displayed by checking for a specific cart element
  await expect(page.locator(".cart_list")).toBeVisible();

  // Click on the "Checkout" button
  await page.click('[data-test="checkout"]');

  // Verify the checkout page is displayed by checking for a specific element on the checkout page
  await expect(page.locator(".checkout_info")).toBeVisible();

  // Fill in the checkout form with random values
  await page.fill('[data-test="firstName"]', "John"); // Random first name
  await page.fill('[data-test="lastName"]', "Doe"); // Random last name
  await page.fill('[data-test="postalCode"]', "90210"); // Random zip code

  // Click on the "Continue" button
  await page.click('[data-test="continue"]');

  // Click on the "Finish" button to complete the checkout process
  await page.click('[data-test="finish"]');
});
