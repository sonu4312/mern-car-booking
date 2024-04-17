import { test, expect } from "@playwright/test";
import path from "path";

const UI_URL = "http://localhost:5173";

test.beforeEach(async ({ page }) => {
  await page.goto(UI_URL);

  //get the sign in button
  await page.getByRole("link", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
  // check for the locator with name as email and fill it with email id
  await page.locator("[name=email]").fill("123@c.com");
  await page.locator("[name=password]").fill("123456");

  await page.getByRole("button", { name: "Login" }).click();

  await expect(page.getByText("Sign in Successfull")).toBeVisible();
});

test("should allow user to add a car", async ({ page }) => {
  await page.goto(`${UI_URL}/add-car`);

  await page.locator('[name="name"]').fill("test car");
  await page.locator('[name="city"]').fill("test city");
  await page.locator('[name="country"]').fill("test country");
  await page
    .locator('[name="description"]')
    .fill("This is description of test");
  await page.locator('[name="pricePerDay"]').fill("100");
  await page.selectOption('select[name="starRating"]', "3");
  await page.getByText("Economy").click();
  await page.getByLabel("Bluetooth Connectivity").click();
  await page.locator('[name="passengerCount"]').fill("2");

  await page.setInputFiles('[name="imageFiles"]', [
    path.join(__dirname, "files", "1.png"),
    path.join(__dirname, "files", "2.png"),
  ]);

  await page.getByRole("button", { name: "Save" }).click();
  await expect(page.getByText("Car Saved!")).toBeVisible;
});

test("should display cars",async({page})=>{
  await page.goto(`${UI_URL}/my-cars`);

  await expect(page.getByText("test car")).toBeVisible();
  await expect(page.getByText("This is description")).toBeVisible();

  await expect(page.getByText("test city,test country")).toBeVisible();
  await expect(page.getByText("Economy")).toBeVisible();
  await expect(page.getByText("100 per day")).toBeVisible();
  await expect(page.getByText("2 passangers")).toBeVisible();
  await expect(page.getByText("3 Star Rating")).toBeVisible();

  await expect(page.getByRole("link",{name:"View Details"})).toBeVisible();
  await expect(page.getByRole("link",{name:"Add Car"})).toBeVisible();
})