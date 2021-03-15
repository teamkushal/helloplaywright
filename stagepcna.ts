import { Page } from "playwright";

const { firefox } = require("playwright");

const threshold_in_seconds = 3;

const addresses = [
  "https://stagepcna.znodedev.com/en-us",
  "https://stagepcna.znodedev.com/en-ca",
  "https://stagepcna.znodedev.com/en-us/bags/backpacks",
  "https://stagepcna.znodedev.com/en-ca/bags/backpacks",
  "https://stagepcna.znodedev.com/en-us/drinkware/tumblers",
  "https://stagepcna.znodedev.com/en-ca/drinkware/tumblers",
  "https://stagepcna.znodedev.com/en-us/technology/headphones-earbuds",
  "https://stagepcna.znodedev.com/en-ca/technology/headphones-earbuds",
  "https://stagepcna.znodedev.com/en-us/outdoor-sport/outdoor-blankets",
  "https://stagepcna.znodedev.com/en-ca/outdoor-sport/outdoor-blankets",
  "https://stagepcna.znodedev.com/en-us/apparel/hoodies-sweatshirts",
  "https://stagepcna.znodedev.com/en-ca/apparel/hoodies-sweatshirts",
  "https://stagepcna.znodedev.com/en-us/product/welly-tumbler-traveler-bundle-set-1629-12",
  "https://stagepcna.znodedev.com/en-ca/product/welly-tumbler-traveler-bundle-set-1629-12",
  "https://stagepcna.znodedev.com/en-us/product/denon-ah-gc30-bluetooth-anc-headphones-7197-31",
  "https://stagepcna.znodedev.com/en-ca/product/denon-ah-gc30-bluetooth-anc-headphones-7197-31",
  "https://stagepcna.znodedev.com/en-us/product/high-sierra-roll-up-puffy-sherpa-blanket-8052-84",
  "https://stagepcna.znodedev.com/en-ca/product/high-sierra-roll-up-puffy-sherpa-blanket-8052-84",
  "https://stagepcna.znodedev.com/en-us/product/womens-copperbay-roots73-fz-hoody-tm98734",
  "https://stagepcna.znodedev.com/en-ca/product/womens-copperbay-roots73-fz-hoody-tm98734",
  "https://stagepcna.znodedev.com/tools-services/customizable-ecatalogs",
  "https://stagepcna.znodedev.com/tools-services/build-your-own-flyers",
  "https://stagepcna.znodedev.com/en-us/tools-services/custom-websites",
  "https://stagepcna.znodedev.com/en-us/how-to-order/leeds",
  "https://stagepcna.znodedev.com/blog",
  "https://stagepcna.znodedev.com/en-us/tools-services/why-pcna",
  "https://stagepcna.znodedev.com/en-ca/tools-services/why-pcna",
  "https://stagepcna.znodedev.com/en-us/tools-services/electronic-integration",
  "https://stagepcna.znodedev.com/en-ca/tools-services/electronic-integration",
  "https://stagepcna.znodedev.com/en-us/tools-services/worldsource-custom-sourcing",
  "https://stagepcna.znodedev.com/en-ca/tools-services/worldsource-custom-sourcing",
  "https://stagepcna.znodedev.com/en-us/tools-services/perfectly-packaged",
  "https://stagepcna.znodedev.com/en-ca/tools-services/perfectly-packaged",
  "https://stagepcna.znodedev.com/en-us/brand/leeds/shop-all",
  "https://stagepcna.znodedev.com/en-ca/brand/leeds/shop-all",
  "https://stagepcna.znodedev.com/en-us/brand/bullet/shop-all",
  "https://stagepcna.znodedev.com/en-ca/brand/bullet/shop-all",
  "https://stagepcna.znodedev.com/en-us/brand/bullet/shop-all",
  "https://stagepcna.znodedev.com/en-us/brand/trimark/shop-all",
  "https://stagepcna.znodedev.com/en-ca/brand/trimark/shop-all",
  "https://stagepcna.znodedev.com/en-us/brand/herschel",
  "https://stagepcna.znodedev.com/en-us/brand/skullcandy",
  "https://stagepcna.znodedev.com/en-us/brand/roots-73",
  "https://stagepcna.znodedev.com/en-us/brand/camelbak",
  "https://stagepcna.znodedev.com/en-us/brand/arctic-zone",
  "https://stagepcna.znodedev.com/en-us/brand/moop/shop-all",
  "https://stagepcna.znodedev.com/en-us/brand/rocketbook/shop-all",
  "https://stagepcna.znodedev.com/en-us/new-products",
  "https://stagepcna.znodedev.com/en-us/clearance-products",
  "https://stagepcna.znodedev.com/en-us/deals",
  "https://stagepcna.znodedev.com/en-us/request-samples/leeds",
  "https://stagepcna.znodedev.com/en-us/how-to-order/leeds",
  "https://stagepcna.znodedev.com/en-us/fulfillment-shipping/leeds",
  "https://stagepcna.znodedev.com/en-us/returns-cancellations/leeds",
  "https://stagepcna.znodedev.com/en-us/how-to-order/leeds",
  "https://stagepcna.znodedev.com/en-us/user/sign-up",
  "https://stagepcna.znodedev.com/en-us/site-map",
  "https://stagepcna.znodedev.com/en-us/about",
  "https://stagepcna.znodedev.com/brand/list",
  "https://stagepcna.znodedev.com/en-us/careers",
  "https://stagepcna.znodedev.com/en-us/compliance",
  "https://stagepcna.znodedev.com/en-us/product-recalls",
  "https://stagepcna.znodedev.com/en-us/privacy-policy",
  "https://stagepcna.znodedev.com/en-us/legal",
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
    const load_time = (end_time - start_time) / 1000;
    const metrics = await getMetrics(page);
    if (load_time > threshold_in_seconds) {
      console.log(
        `Total load time for ${address} was ${
          (end_time - start_time) / 1000
        } seconds`
      );
      console.log({ metrics });
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
