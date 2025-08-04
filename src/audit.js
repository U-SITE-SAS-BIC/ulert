const httpCheck = require('./http-check');
const linkScanner = require('./link-scanner');
const securityAudit = require('./security-audit');
const reporter = require('./reporter');

async function audit(url) {
  console.log(`🔍 Auditing ${url}...\n`);

  // Primero ejecutamos las funciones y guardamos los resultados
  const httpResult = await httpCheck(url);
  const linksResult = await linkScanner(url);

  // Ahora construimos el objeto 'result' con todo
  const result = {
    url,
    timestamp: new Date().toISOString(),
    http: httpResult,
    links: linksResult,
    security: securityAudit(url, httpResult.headers), // ✅ Correcto: usamos 'httpResult'
  };

  // Generamos los reportes
  reporter.cli(result);
  reporter.html(result, './reports/report.html');

  return result;
}

module.exports = audit;