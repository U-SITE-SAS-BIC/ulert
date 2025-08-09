/**
 * Copyright 2025 u-site.app
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


const httpCheck = require('./http-check');
const linkScanner = require('./link-scanner');
const securityAudit = require('./security-audit');

async function audit(url) {

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
