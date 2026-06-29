const cheerio = require('cheerio');

async function testScrape() {
  const url = 'https://in.pinterest.com/pin/623115110967069123/';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'
    }
  });
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const ogImage = $('meta[property="og:image"]').attr('content') || $('meta[name="og:image"]').attr('content');
  console.log("Found OG image:", ogImage);
}

testScrape();
