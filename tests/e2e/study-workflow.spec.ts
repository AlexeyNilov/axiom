import { expect, test } from "@playwright/test";

test("studies the seeded artwork through the traceable workflow", async ({ page }) => {
  await page.setViewportSize({ width: 1680, height: 980 });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Composition VIII" })).toBeVisible();
  await page.getByRole("button", { name: "Start study" }).click();
  await expect(page).toHaveURL(/\/studies\/.+/);

  await page.getByLabel("Observation").fill(
    "Several circles and lines overlap without a single central object.",
  );
  await page.getByRole("button", { name: "Record observation" }).click();
  await expect(
    page.getByRole("article").filter({ hasText: "Several circles and lines overlap" }),
  ).toBeVisible();

  await page.getByLabel(/Several circles and lines overlap/).check();
  await page.getByRole("textbox", { name: "Principle" }).fill(
    "A system can stay coherent without a single dominant center.",
  );
  await page.getByRole("button", { name: "Derive principle" }).click();
  await expect(
    page.getByRole("article").filter({ hasText: "A system can stay coherent" }),
  ).toBeVisible();

  await page.getByLabel("Software concept").fill("Distributed Systems");
  await page.getByLabel("Rationale").fill(
    "Distributed systems need local relationships that remain understandable without one controlling module.",
  );
  await page.getByRole("button", { name: "Create mapping" }).click();
  await expect(
    page.getByRole("heading", { name: "Distributed Systems" }),
  ).toBeVisible();

  await page.getByLabel("Hypothesis").fill(
    "If service boundaries expose local responsibilities clearly, a central orchestration layer becomes less necessary.",
  );
  await page.getByLabel("Task").fill(
    "Move one orchestration decision into an explicit service contract.",
  );
  await page.getByLabel("Expected outcome").fill(
    "The dependency direction is easier to explain from the service boundary.",
  );
  await page.getByRole("button", { name: "Create experiment" }).click();
  await expect(
    page.getByRole("article").filter({ hasText: "central orchestration layer" }),
  ).toBeVisible();

  await page.getByLabel("Actual outcome").fill(
    "The service boundary became clearer, but cross-service naming still needed review.",
  );
  await page.getByLabel("Reflection").fill(
    "Decentralized coherence depends on local naming as much as structural separation.",
  );
  await page.getByRole("button", { name: "Record outcome" }).click();
  await expect(
    page.getByRole("article").filter({ hasText: "Decentralized coherence" }),
  ).toBeVisible();

  await page.getByRole("heading", { name: "Reflections" }).scrollIntoViewIfNeeded();
  await expect(page.getByTestId("artwork-reference")).toBeInViewport();
  await expect(page.getByRole("heading", { name: "Composition VIII" })).toBeInViewport();
});
