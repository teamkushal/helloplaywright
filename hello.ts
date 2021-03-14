const { firefox } = require('playwright');

(async () => {
  hello(`https://maps.google.com`);
})();

async function hello(address: string) {
  const browser = await firefox.launch();
  const page = await browser.newPage();
  const start_time = +new Date();
  await page.goto(address);
  const end_time = +new Date();
  console.log(`Total load time for ${address} was ${(end_time - start_time)/1000} seconds`);
  await browser.close();
} 