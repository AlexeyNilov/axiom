import { expect, test } from "@playwright/test";

test("studies a selected artwork through the traceable workflow", async ({ page }) => {
  await page.setViewportSize({ width: 1680, height: 980 });
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { name: "Choose an artwork" })).toBeVisible();
  const selectedArtwork = page.getByTestId("artwork-van-gogh-the-starry-night");
  await expect(selectedArtwork.getByRole("heading", { name: "The Starry Night" })).toBeVisible();
  await selectedArtwork.getByRole("button", { name: "Start study" }).click();
  await expect(page).toHaveURL(/\/studies\/.+/);
  await expect(page.getByRole("heading", { name: "The Starry Night" })).toBeVisible();

  await page.getByLabel("Observation").fill(
    "The sky moves in visible bands while the village remains compact below.",
  );
  await page.getByRole("button", { name: "Record observation" }).click();
  await expect(
    page.getByRole("article").filter({ hasText: "The sky moves in visible bands" }),
  ).toBeVisible();

  await page.getByLabel(/The sky moves in visible bands/).check();
  await page.getByRole("textbox", { name: "Principle" }).fill(
    "A system can separate turbulent activity from stable anchors.",
  );
  await page.getByRole("button", { name: "Derive principle" }).click();
  await expect(
    page.getByRole("article").filter({ hasText: "separate turbulent activity" }),
  ).toBeVisible();

  await page.getByLabel("Software concept").fill("Event-Driven Architecture");
  await page.getByLabel("Rationale").fill(
    "Event-heavy flows need stable boundaries so motion does not erase system legibility.",
  );
  await page.getByRole("button", { name: "Create mapping" }).click();
  await expect(
    page.getByRole("heading", { name: "Event-Driven Architecture" }),
  ).toBeVisible();

  await page.getByLabel("Hypothesis").fill(
    "If event streams are anchored by explicit ownership boundaries, the architecture remains easier to reason about.",
  );
  await page.getByLabel("Task").fill(
    "Move one event handler behind an explicitly owned module boundary.",
  );
  await page.getByLabel("Expected outcome").fill(
    "The event flow is easier to trace without scanning unrelated handlers.",
  );
  await page.getByRole("button", { name: "Create experiment" }).click();
  await expect(
    page.getByRole("article").filter({ hasText: "ownership boundaries" }),
  ).toBeVisible();

  await page.getByLabel("Actual outcome").fill(
    "The owned module made the event flow clearer, but retry behavior still needed a policy.",
  );
  await page.getByLabel("Reflection").fill(
    "High-motion workflows need a stable point of responsibility before optimization.",
  );
  await page.getByRole("button", { name: "Record outcome" }).click();
  await expect(
    page.getByRole("article").filter({ hasText: "High-motion workflows" }),
  ).toBeVisible();

  await page.getByRole("heading", { name: "Reflections" }).scrollIntoViewIfNeeded();
  await expect(page.getByTestId("artwork-reference")).toBeInViewport();
  await expect(page.getByRole("heading", { name: "The Starry Night" })).toBeInViewport();
});
