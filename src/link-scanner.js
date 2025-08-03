const axios = require('axios');
const cheerio = require('cheerio');

async function linkScanner(baseUrl) {
  try {
    const response = await axios.get(baseUrl);
    const $ = cheerio.load(response.data);
    const links = [];
    const broken = [];

    $('a[href]').each((i, el) => {
      const href = $(el).attr('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:')) return;

      const fullUrl = new URL(href, baseUrl).href;
      links.push(fullUrl);
    });

    // Solo revisa enlaces del mismo dominio (opcional)
    const domain = new URL(baseUrl).hostname;
    const internalLinks = links.filter(link => new URL(link).hostname === domain);

    for (const link of internalLinks) {
      try {
        await axios.head(link, { timeout: 5000 });
      } catch {
        broken.push(link);
      }
    }

    return { total: internalLinks.length, broken: broken.length, brokenList: broken };
  } catch (err) {
    return { error: "Could not scan links" };
  }
}

module.exports = linkScanner;