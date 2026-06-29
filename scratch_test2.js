const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');

async function test() {
  const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
  });
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36');
  await page.goto('https://in.pinterest.com/pin/623115110967069123/', { waitUntil: 'networkidle2' });
  const og = await page.evaluate(() => {
    return document.querySelector('meta[property="og:image"]')?.content || document.querySelector('img')?.src;
  });
  console.log("Image:", og);
  await browser.close();
}
test();
