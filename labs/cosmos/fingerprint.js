// /labs/cosmos/fingerprint.js
const dns = require('dns').promises;
const axios = require('axios');
const tls = require('tls');
const crypto = require('crypto');
const cheerio = require('cheerio');

module.exports.run = async (domain, osintData) => {
  // Quitar http:// o https:// si viene incluido
  domain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

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
  } else {
    console.log('⚠️ No se pudo generar fingerprint HTML.');
  }

  console.log('\n✅ Fingerprinting finalizado.\n');

  return { ip, asn, cert, ga, htmlSig };
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
    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content') || '';
    const hash = crypto.createHash('sha256').update(html).digest('hex');
    const cookies = res.headers['set-cookie'] || [];
    const techs = []; // Puedes implementar lógica con Wappalyzer o heurísticas

    return {
      html,
      hash,
      headers: res.headers,
      title,
      description,
      cookies,
      technologies: techs
    };
  } catch (error) {
    console.error(`❌ Error generando HTML fingerprint:`, error.code || error.message);
    return null;
  }
}
