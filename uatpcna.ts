import { Page } from "playwright";

const { firefox } = require("playwright");

const sentinel = "https://uatpcna.znodedev.com";
const visited: string[] = [];
const threshold_in_seconds = 2;
const max_capacity = 6 * 60 * 60 / 30;

(async () => {
  await benchmark(sentinel);
})();

async function benchmark(address: string) {
  try {
    let hrefs: string[];
    const browser = await firefox.launch();
    const page = await browser.newPage();
    const start_time = +new Date();
    await page.goto(address);
    const end_time = +new Date();
    const load_time = (end_time - start_time) / 1000;
    const metrics = await getMetrics(page);
    if (metrics.data.duration > threshold_in_seconds * 1000) {
        console.log(
          `Total load time for ${address} was ${
            (end_time - start_time) / 1000
          } seconds`
        );
        console.log({ metrics });
      }
    hrefs = await page.$$eval("a", (as: any[]) => as.map((a) => a.href));
    await browser.close();
    for (const href of hrefs) {
      const hrefHashPosition = (href.indexOf("#"));
      const recursedUrl = (hrefHashPosition > -1) ? href.substr(0, hrefHashPosition) : href;
      if (!visited.includes(recursedUrl) && href.startsWith(sentinel) && visited.length < max_capacity) {
        visited.push(recursedUrl);
        await benchmark(recursedUrl);
      }
    }
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
