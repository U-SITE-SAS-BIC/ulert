// /labs/cosmos/fingerprint.js
const dns = require('dns').promises;
const axios = require('axios');
const tls = require('tls');
const crypto = require('crypto');
const cheerio = require('cheerio');
const whois = require('whois-json');
const dnsPromises = require('dns').promises;
const sslChecker = require('ssl-checker');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');


// Limpieza única del dominio para todo el módulo
function cleanDomain(domain) {
  return domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
}

module.exports.run = async (domain, osintData) => {
  domain = cleanDomain(domain);

  console.log('🧠 Ejecutando fingerprinting para:', domain);
  console.log('--------------------------------------------');

  let ip = null;
  try {
    console.log('🌐 Resolviendo IP...');
    ip = (await dns.lookup(domain)).address;
    console.log(`✔️ Dirección IP encontrada: ${ip}`);
  } catch (err) {
    console.error(`❌ No se pudo resolver el dominio ${domain}: ${err.code}`);
  }

  console.log('\n🌍 Buscando ASN...');
  const asn = await getASN(ip);
  if (asn) console.log('✔️ ASN:', asn.trim());
  else console.log('⚠️ No se pudo obtener ASN.');

  console.log('\n🔐 Obteniendo certificado TLS...');
  const cert = await getCert(domain);
  if (cert) {
    console.log('✔️ Certificado obtenido:');
    console.log(`   CN: ${cert.subject.CN}`);
    console.log(`   Emitido por: ${cert.issuer.CN}`);
    console.log(`   Vigencia: ${cert.valid_from} - ${cert.valid_to}`);
    console.log(`   Fingerprint: ${cert.fingerprint}`);
  } else {
    console.log('⚠️ No se pudo obtener el certificado.');
  }

  console.log('\n🌐 Obteniendo registros DNS...');
  const dnsRecords = await getDNSRecords(domain);
  if (dnsRecords) {
    console.log('✔️ Registros DNS obtenidos:');
    Object.entries(dnsRecords).forEach(([type, records]) => {
      console.log(`   ${type}: ${records.length}`);
    });
  } else {
    console.log('⚠️ No se pudieron obtener registros DNS.');
  }

  console.log('\n📊 Buscando ID de Google Analytics...');
  const ga = await googleAnalyticsId(domain);
  if (ga) console.log(`✔️ Google Analytics ID encontrado: ${ga}`);
  else console.log('⚠️ No se encontró Google Analytics ID.');

  console.log('\n🧬 Analizando HTML para fingerprint...');
  const htmlSig = await htmlFingerprint(domain);
  if (htmlSig) {
    console.log('✔️ HTML fingerprint generado');
    console.log(`   🔖 Título: ${htmlSig.title || 'N/A'}`);
    console.log(`   📄 Descripción: ${htmlSig.description || 'N/A'}`);
    console.log(`   🔐 Cookies: ${htmlSig.cookies.length}`);
    console.log(`   💠 Hash SHA-256: ${htmlSig.hash}`);
    console.log(`   📄 Tamaño HTML: ${htmlSig.html.length} bytes`);
    if (htmlSig.technologies.length > 0) {
      console.log('   🛠️ Tecnologías detectadas:');
      htmlSig.technologies.forEach(technologies => {
        const tecName = technologies.split('=')[0];
        console.log(`     - ${tecName}`);
      });
    }

    // Recursos externos
    console.log(`   📦 Recursos externos: scripts(${htmlSig.scripts.length}), css(${htmlSig.styles.length}), imgs(${htmlSig.images.length})`);

    if (htmlSig.cookies.length > 0) {
      console.log('   🍪 Cookies detalladas:');
      htmlSig.cookies.forEach(cookie => {
        const name = cookie.split('=')[0];
        console.log(`     - ${name}`);
      });
    }

    // Encabezados HTTP relevantes
    console.log('   📰 Encabezados HTTP relevantes:');
    const relevantHeaders = ['server', 'x-powered-by', 'strict-transport-security', 'content-security-policy', 'x-frame-options'];
    relevantHeaders.forEach(hdr => {
      if (htmlSig.headers[hdr]) {
        console.log(`     - ${hdr}: ${htmlSig.headers[hdr]}`);
      }
    });

  } else {
    console.log('⚠️ No se pudo generar fingerprint HTML.');
  }

  console.log('\n🔍 Verificando getwhois...');
  const whoisData = await getWhois(domain);
  if (whoisData) {
    console.log('✔️ WHOIS data:');
    console.log(`   Registrant: ${whoisData.registrant || 'N/A'}`);
    console.log(`   Registrar: ${whoisData.registrar || 'N/A'}`);
    console.log(`   Creation Date: ${whoisData.creationDate || 'N/A'}`);
    console.log(`   Expiry Date: ${whoisData.expiryDate || 'N/A'}`);
    console.log(`   Source: ${whoisData.source || 'N/A'}`);
    console.log(`   Timestamp: ${whoisData.timestamp || 'N/A'}`);
  } else {
    console.log('⚠️ No se pudo obtener información WHOIS.');
  }

  console.log('\n🔗 Verificando puntaje subdominios...');
  const subdomainTakeovers = await Promise.all(
    osintData.subdomains.map(subdomain => checkSubdomainTakeover(subdomain))
  );
  subdomainTakeovers.forEach(result => {
    if (result.vulnerable) {
      console.log(`⚠️ Subdominio vulnerable: ${result.subdomain} (CNAME: ${result.cname})`);
    } else {
      console.log(`✔️ Subdominio seguro: ${result.subdomain}`);
    }
  });
  console.log('\n🔐 Verificando encabezados de seguridad...');
  const securityHeaders = await checkSecurityHeaders(`https://${domain}`);
  console.log('✔️ Encabezados de seguridad:');
  console.log(`   CSP: ${securityHeaders.CSP}`);
  console.log(`   HSTS: ${securityHeaders.HSTS}`);
  console.log(`   X-Frame-Options: ${securityHeaders.XFrameOptions}`);
  console.log(`   X-Content-Type-Options: ${securityHeaders.XContentTypeOptions}`);
  console.log(`   Source: ${securityHeaders.source}`);

  console.log('\n📧 Verificando autenticación de correo electrónico...');
  const emailAuth = await checkEmailAuth(domain);
  console.log('✔️ Autenticación de correo electrónico:');
  console.log(`   DMARC: ${emailAuth.DMARC}`);
  console.log(`   SPF: ${emailAuth.SPF}`);
  console.log(`   DKIM: ${emailAuth.DKIM}`);  
  console.log(`   Source: ${emailAuth.source}`);
  console.log(`   Timestamp: ${emailAuth.timestamp}`);


  console.log('\n📸 Tomando captura de pantalla...');
  const screenshot = await takeScreenshot(`https://${domain}`, `screenshot-${domain}.png`);
  if (screenshot) {
    console.log(`✔️ Captura de pantalla guardada: ${screenshot.file}`);
  } else {
    console.log('⚠️ No se pudo tomar captura de pantalla.');
  }


  console.log('\n✅ Fingerprinting finalizado.\n');

  return { ip, asn, cert, ga, htmlSig, dnsRecords, whoisData, subdomainTakeovers, securityHeaders, emailAuth, screenshot };
};


// === Funciones auxiliares ===

async function getASN(ip) {
  if (!ip) {
    console.warn('⚠️ IP no disponible para búsqueda ASN.');
    return null;
  }
  // 1. Intentar hackertarget
  try {
    const res = await axios.get(`https://api.hackertarget.com/aslookup/?q=${ip}`);
    if (
      typeof res.data === 'string' &&
      res.data.includes('API count exceeded')
    ) {
      console.warn('⚠️ Límite de hackertarget.com alcanzado, probando ipinfo.io...');
      // 2. Intentar ipinfo.io
      try {
        const infoRes = await axios.get(`https://ipinfo.io/${ip}/json`);
        if (infoRes.data && infoRes.data.org) {
          return infoRes.data.org; // Ejemplo: "AS12345 ExampleOrg"
        } else {
          // 3. Intentar ip-api.com
          console.warn('⚠️ ipinfo.io no devolvió ASN, probando ip-api.com...');
          try {
            const apiRes = await axios.get(`http://ip-api.com/json/${ip}`);
            if (apiRes.data && apiRes.data.as) {
              return apiRes.data.as; // Ejemplo: "AS12345 ExampleOrg"
            }
            return null;
          } catch (e3) {
            console.error('❌ Error obteniendo ASN en ip-api.com:', e3.message);
            return null;
          }
        }
      } catch (e2) {
        console.error('❌ Error obteniendo ASN en ipinfo.io:', e2.message);
        // 3. Intentar ip-api.com si ipinfo.io falla
        try {
          const apiRes = await axios.get(`http://ip-api.com/json/${ip}`);
          if (apiRes.data && apiRes.data.as) {
            return apiRes.data.as;
          }
          return null;
        } catch (e3) {
          console.error('❌ Error obteniendo ASN en ip-api.com:', e3.message);
          return null;
        }
      }
    }
    return res.data;
  } catch (e) {
    console.error('❌ Error obteniendo ASN:', e.message);
    // Si hackertarget falla, intenta ipinfo.io y luego ip-api.com
    try {
      const infoRes = await axios.get(`https://ipinfo.io/${ip}/json`);
      if (infoRes.data && infoRes.data.org) {
        return infoRes.data.org;
      } else {
        try {
          const apiRes = await axios.get(`http://ip-api.com/json/${ip}`);
          if (apiRes.data && apiRes.data.as) {
            return apiRes.data.as;
          }
          return null;
        } catch (e3) {
          console.error('❌ Error obteniendo ASN en ip-api.com:', e3.message);
          return null;
        }
      }
    } catch (e2) {
      console.error('❌ Error obteniendo ASN en ipinfo.io:', e2.message);
      try {
        const apiRes = await axios.get(`http://ip-api.com/json/${ip}`);
        if (apiRes.data && apiRes.data.as) {
          return apiRes.data.as;
        }
        return null;
      } catch (e3) {
        console.error('❌ Error obteniendo ASN en ip-api.com:', e3.message);
        return null;
      }
    }
  }
}

async function getCert(domain) {
  domain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  return new Promise((resolve) => {
    const socket = tls.connect(443, domain, { servername: domain, timeout: 7000 }, () => {
      const cert = socket.getPeerCertificate();
      socket.end();
      if (cert && cert.subject) {
        resolve({
          subject: cert.subject,
          issuer: cert.issuer,
          valid_from: cert.valid_from,
          valid_to: cert.valid_to,
          fingerprint: cert.fingerprint,
        });
      } else {
        resolve(null);
      }
    });

    socket.on('error', (err) => {
      console.warn(`⚠️ Error TLS para ${domain}: ${err.message}`);
      resolve(null);
    });

    socket.on('timeout', () => {
      console.warn(`⚠️ Timeout TLS para ${domain}`);
      socket.destroy();
      resolve(null);
    });
  });
}

async function googleAnalyticsId(domain) {
  domain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  try {
    const res = await axios.get(`https://${domain}`, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        'Connection': 'keep-alive',
        // Puedes agregar más headers si lo deseas
      }
    });
    const html = res.data;

    // Buscar UA-XXXXXX-X (Universal Analytics)
    const uaMatch = html.match(/UA-\d{4,10}-\d{1,4}/i);

    // Buscar G-XXXXXXXXXX (GA4)
    const gMatch = html.match(/G-[A-Z0-9]{8,12}/i);

    // Buscar GTM-XXXXXXX (Google Tag Manager)
    const gtmMatch = html.match(/GTM-[A-Z0-9]{6,8}/i);

    // Devolver todos los IDs encontrados, separados por coma
    const ids = [uaMatch, gMatch, gtmMatch].filter(Boolean).map(m => m[0]);
    return ids.length > 0 ? ids.join(', ') : null;
  } catch (error) {
    console.error(`❌ Error obteniendo GA ID para ${domain}:`, error.code || error.message);
    return null;
  }
}

async function htmlFingerprint(domain) {
  domain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');
  try {
    const res = await axios.get(`https://${domain}`, { timeout: 10000 });
    const html = res.data.slice(0, 10000);
    const $ = cheerio.load(html);

    // Extraer recursos externos
    const scripts = $('script[src]').map((i, el) => $(el).attr('src')).get();
    const styles = $('link[rel="stylesheet"]').map((i, el) => $(el).attr('href')).get();
    const images = $('img[src]').map((i, el) => $(el).attr('src')).get();

    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content') || '';
    const hash = crypto.createHash('sha256').update(html).digest('hex');
    const cookies = res.headers['set-cookie'] || [];

    // ✅ Esperar la detección de tecnologías
    const techs = await detectTechnologiesFromHTML($, scripts, styles, html);

    return {
      html,
      hash,
      headers: res.headers,
      title,
      description,
      cookies,
      technologies: techs,
      scripts,
      styles,
      images
    };
  } catch (error) {
    console.error(`❌ Error generando HTML fingerprint:`, error.code || error.message);
    return null;
  }
}

async function getDNSRecords(domain) {
  const resolver = dns;
  const types = ['MX', 'TXT', 'NS', 'CNAME'];
  const records = {};

  try {
    for (const type of types) {
      try {
        const res = await resolver.resolve(domain, type);
        records[type] = res;
      } catch (e) {
        records[type] = [];
      }
    }
    return records;
  } catch {
    return null;
  }
}

async function detectTechnologiesFromHTML($, scripts, styles, html) {
  const techs = new Set();
  const lowerHTML = html.toLowerCase();

  // === Heurísticas por scripts ===
  scripts.forEach(src => {
    if (!src) return;
    const lowerSrc = src.toLowerCase();

    if (lowerSrc.includes('jquery')) techs.add('jQuery');
    if (lowerSrc.includes('react')) techs.add('React');
    if (lowerSrc.includes('vue')) techs.add('Vue.js');
    if (lowerSrc.includes('angular')) techs.add('Angular');
    if (lowerSrc.includes('bootstrap')) techs.add('Bootstrap');
    if (lowerSrc.includes('tailwind')) techs.add('Tailwind CSS');
    if (lowerSrc.includes('google-analytics')) techs.add('Google Analytics');
    if (lowerSrc.includes('gtm.js')) techs.add('Google Tag Manager');
    if (lowerSrc.includes('hotjar')) techs.add('Hotjar');
  });

  // === Heurísticas por estilos ===
  styles.forEach(href => {
    if (!href) return;
    const lowerHref = href.toLowerCase();

    if (lowerHref.includes('bootstrap')) techs.add('Bootstrap');
    if (lowerHref.includes('tailwind')) techs.add('Tailwind CSS');
    if (lowerHref.includes('font-awesome')) techs.add('Font Awesome');
  });

  // === Meta generator (WordPress, Drupal, Joomla...) ===
  const generator = ($('meta[name="generator"]').attr('content') || '').toLowerCase();
  if (generator.includes('wordpress')) techs.add('WordPress');
  if (generator.includes('drupal')) techs.add('Drupal');
  if (generator.includes('joomla')) techs.add('Joomla');

  // === Patrones en el HTML ===
  if (lowerHTML.includes('wp-content')) techs.add('WordPress');
  if (lowerHTML.includes('woocommerce')) techs.add('WooCommerce');
  if (lowerHTML.includes('wp-admin')) techs.add('WordPress');
  if (lowerHTML.includes('shopify')) techs.add('Shopify');
  if (lowerHTML.includes('magento')) techs.add('Magento');
  if (lowerHTML.includes('angular')) techs.add('Angular');
  if (lowerHTML.includes('gatsby')) techs.add('Gatsby');
  if (lowerHTML.includes('next.js')) techs.add('Next.js');
  if (lowerHTML.includes('nuxt.js')) techs.add('Nuxt.js');

  // === Detección por comentarios HTML ===
  const commentMatches = html.match(/<!--(.*?)-->/gs) || [];
  commentMatches.forEach(comment => {
    const lowerComment = comment.toLowerCase();
    if (lowerComment.includes('wordpress')) techs.add('WordPress');
    if (lowerComment.includes('drupal')) techs.add('Drupal');
    if (lowerComment.includes('joomla')) techs.add('Joomla');
  });


  const techArray = Array.from(techs);

  return techArray;
}

async function getWhois(domain) {
  try {
    const data = await whois(domain);
    return {
      registrant: data.registrant || data['Registrant Name'] || null,
      registrar: data.registrar || null,
      creationDate: data.creationDate || null,
      expiryDate: data.registryExpiryDate || null,
      source: 'WHOIS',
      timestamp: new Date().toISOString(),
      confidence: 'high'
    };
  } catch (err) {
    return { error: 'WHOIS lookup failed', domain };
  }
}

async function checkSubdomainTakeover(subdomain) {
  try {
    const cname = await dns.resolveCname(subdomain).catch(() => null);
    if (cname) {
      const res = await axios.get(`http://${subdomain}`, { timeout: 5000 }).catch(e => e.response || {});
      const vulnerablePatterns = [
        'There isn’t a GitHub Pages site here',
        'NoSuchBucket',
        'heroku | no such app'
      ];
      const vulnerable = vulnerablePatterns.some(p =>
        (res.data || '').toLowerCase().includes(p.toLowerCase())
      );
      return { subdomain, cname, vulnerable, source: 'HTTP+CNAME', timestamp: new Date().toISOString() };
    }
  } catch {}
  return { subdomain, vulnerable: false };
}

async function checkSecurityHeaders(url) {
  const res = await axios.get(url, { timeout: 5000 });
  const headers = res.headers;

  return {
    CSP: headers['content-security-policy'] ? 'OK' : 'MISSING',
    HSTS: headers['strict-transport-security'] ? 'OK' : 'MISSING',
    XFrameOptions: headers['x-frame-options'] || 'MISSING',
    XContentTypeOptions: headers['x-content-type-options'] || 'MISSING',
    source: 'HTTP Headers',
    timestamp: new Date().toISOString()
  };
}

async function checkEmailAuth(domain) {
  const dmarc = await dnsPromises.resolveTxt(`_dmarc.${domain}`).catch(() => []);
  const spf = await dnsPromises.resolveTxt(domain).catch(() => []);
  const dkim = await dnsPromises.resolveTxt(`default._domainkey.${domain}`).catch(() => []);

  return {
    DMARC: dmarc.length ? dmarc.flat().join(' ') : 'MISSING',
    SPF: spf.length ? spf.flat().join(' ') : 'MISSING',
    DKIM: dkim.length ? dkim.flat().join(' ') : 'MISSING',
    source: 'DNS TXT',
    timestamp: new Date().toISOString()
  };
}




const OUTPUT_DIR = path.join(__dirname, 'output');

function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

async function takeScreenshot(url, filename) {
  ensureOutputDir(); // Nos aseguramos de que exista la carpeta
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
  
  const filePath = path.join(OUTPUT_DIR, filename); // ruta completa
  await page.screenshot({ path: filePath, fullPage: true });
  
  await browser.close();
  return { 
    url, 
    file: filePath, 
    source: 'Screenshot', 
    timestamp: new Date().toISOString() 
  };
}
