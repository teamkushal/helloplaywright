import { Page } from "playwright";

const { firefox } = require("playwright");

const addresses = [
  "https://www.google.com/",
  "https://maps.google.com/",
  "https://myreactivematerial.web.app/",
  "https://pat.tilde.team/",
  "https://coloradoquiz.web.app/",
  "https://scottkast.github.com/",
];

(async () => {
  for (const address of addresses) {
    await benchmark(address);
  }
})();

async function benchmark(address: string) {
  try {
    const browser = await firefox.launch();
    const page = await browser.newPage();
    const start_time = +new Date();
    await page.goto(address);
    const end_time = +new Date();
    console.log(
      `Total load time for ${address} was ${
        (end_time - start_time) / 1000
      } seconds`
    );
    const metrics = await getMetrics(page);
    console.log({ metrics });
    await browser.close();
  } catch (error) {
    console.log(`Error benchmarking ${address}`);
    console.error({ error });
  }
}

async function getMetrics(
  page: Page
): Promise<{
  format: "PerformanceNavigationTiming";
  data: PerformanceNavigationTiming;
}> {
  return JSON.parse(
    await page.evaluate(() => {
      const [timing] = performance.getEntriesByType("navigation");
      return JSON.stringify({
        data: timing,
      });
    })
  );
}
