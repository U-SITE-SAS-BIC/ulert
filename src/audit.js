const httpCheck = require('./http-check');
const linkScanner = require('./link-scanner');
const securityAudit = require('./security-audit');
const reporter = require('./reporter');

async function audit(url) {
  console.log(`🔍 Auditing ${url}...\n`);

  const result = {
    url,
    timestamp: new Date().toISOString(),
    http: await httpCheck(url),
    links: await linkScanner(url),
    security: securityAudit(url, await httpCheck.headers),
  };

  reporter.cli(result);
  reporter.html(result, './reports/report.html');

  return result;
}

module.exports = audit;