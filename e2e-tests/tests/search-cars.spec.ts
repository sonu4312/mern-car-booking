import { test, expect } from "@playwright/test";

const UI_URL = "http://localhost:5173";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  // get the sign in button
  await page.getByRole("link", { name: "Sign In" }).click();

  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

  await page.locator("[name=email]").fill("123@c.com");
  await page.locator("[name=password]").fill("123456");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Sign in Successfull")).toBeVisible();
});

test("should show car search results", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Enter your Destination").fill("mumbai");
  await page.getByRole("button", { name: "Search" }).click();

  await expect(page.getByText("Car found in mumbai")).toBeVisible();
  await expect(page.getByText("test car").first()).toBeVisible();
});

test("should show car detail", async ({ page }) => {
  await page.goto(UI_URL);

  await page.getByPlaceholder("Enter your Destination").fill("mumbai");
  await page.getByRole("button", { name: "Search" }).click();

  await page.getByText("test car").click();
  await expect(page).toHaveURL(/detail/);
  await expect(page.getByRole("button", { name: "Book now" })).toBeVisible();

});
