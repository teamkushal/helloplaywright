const { firefox } = require('playwright');

(async () => {
  await benchmark(`https://maps.google.com`);
  await benchmark(`https://www.google.com`);
  await benchmark(`https://myreactivematerial.web.app/`);
  await benchmark(`https://pat.tilde.team/`);
  await benchmark(`https://coloradoquiz.web.app/`);
  await benchmark(`https://scottkast.github.com`);
})();

async function benchmark(address: string) {
  try {
    const browser = await firefox.launch();
    const page = await browser.newPage();
    const start_time = +new Date();
    await page.goto(address);
    const end_time = +new Date();
    console.log(`Total load time for ${address} was ${(end_time - start_time) / 1000} seconds`);
    await browser.close();
  } catch (error) {
    console.log(`Error benchmarking ${address}`);
    console.error({ error });
  }
}
