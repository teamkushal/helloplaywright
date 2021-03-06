import { Page } from "playwright";

const { firefox } = require("playwright");

const sentinel = "https://www.pcna.com";
const visited: string[] = [];
const threshold_in_seconds = 2;
const max_capacity = (6 * 60 * 60) / 30;

(async () => {
  await benchmark(sentinel);
})();

async function benchmark(address: string) {
  try {
    let hrefs: string[];
    const browser = await firefox.launch({
      args: ["-width=1920", "-height=1080"],
    });
    const page = await browser.newPage();
    const start_time = +new Date();
    await page.goto(address);
    const metrics = await getMetrics(page);
    const safeAddress = address.replace(/[^A-Z0-9]/gi, "-");
    console.log({ safeAddress });
    page.screenshot({
      path: `screenshots/pcna-${safeAddress}.png`,
      fullPage: false,
    });
    const end_time = +new Date();
    const load_time = (end_time - start_time) / 1000;
    if (metrics.data.duration > threshold_in_seconds * 1000) {
      console.log({ metrics });
      console.log(`Total load time for ${address} was ${load_time} seconds`);
    }
    hrefs = await page.$$eval("a", (as: any[]) => as.map((a) => a.href));
    for (const href of hrefs) {
      const hrefHashPosition = href.indexOf("#");
      const hrefWithoutHash =
        hrefHashPosition > -1 ? href.substr(0, hrefHashPosition) : href;
      if (
        !visited.includes(hrefWithoutHash) &&
        href.startsWith(sentinel) &&
        visited.length < max_capacity
      ) {
        visited.push(hrefWithoutHash);
        await benchmark(hrefWithoutHash);
      }
    }
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
