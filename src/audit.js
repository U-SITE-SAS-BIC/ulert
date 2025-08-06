const httpCheck = require('./http-check');
const linkScanner = require('./link-scanner');
const securityAudit = require('./security-audit');

async function audit(url) {
  //console.log(`🔍 Auditing ${url}...\n`);

  // Analizar el sitio
  const httpResult = await httpCheck(url);
  const linksResult = await linkScanner(url);
  const securityResult = securityAudit(url, httpResult.headers);

  // Devolver datos sin imprimir ni generar reportes
  return {
    url,
    timestamp: new Date().toISOString(),
    http: httpResult,
    links: linksResult,
    security: securityResult,
  };
}

module.exports = audit;
