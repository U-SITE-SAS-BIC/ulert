const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'output');

function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
  }
}

function sanitizeId(id) {
  return String(id).replace(/^https?:\/\//, '').replace(/\/$/, '').trim();
}

function getNodeStyle(type) {
  const styles = {
    main: { shape: 'box', color: '#1f77b4' },
    subdomain: { shape: 'dot', color: '#2ca02c' },
    email: { shape: 'dot', color: 'rgba(214, 39, 40, 1)' },
    repo: { shape: 'dot', color: '#9467bd' },
    ip: { shape: 'hexagon', color: '#ff7f0e' },
    tech: { shape: 'dot', color: '#17becf' },
    ga: { shape: 'diamond', color: '#8c564b' },
    cert: { shape: 'diamond', color: '#e377c2' },
    asn: { shape: 'hexagon', color: '#bcbd22' },
    html: { shape: 'triangle', color: '#7f7f7f' },
    dns: { shape: 'star', color: '#ff6347' }, 

    default: { shape: 'dot', color: '#ccc' },

  };

  return styles[type] || styles.default;
}

function generateHTML(output) {
  const nodes = output.nodes.map(n => {
    const style = getNodeStyle(n.type);
    return {
      id: n.id,
      label: n.label,
      shape: style.shape,
      color: style.color
    };
  });

  const edges = output.edges;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Ulert Cosmos™ - Mapa Neuronal</title>
  <style>
    body { margin: 0; font-family: sans-serif; }
    #graph { width: 100vw; height: 100vh; }
    #legend {
      position: absolute;
      top: 10px; left: 10px;
      background: rgba(255,255,255,0.9);
      padding: 10px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10;
    }
    .legend-item {
      margin: 4px 0;
      display: flex;
      align-items: center;
    }
    .legend-color {
      width: 12px; height: 12px; margin-right: 6px;
      border-radius: 50%;
      display: inline-block;
    }
  </style>
  <script src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
</head>
<body>
  <div id="legend"></div>
  <div id="graph"></div>
  <script>
    const nodes = new vis.DataSet(${JSON.stringify(nodes, null, 2)});
    const edges = new vis.DataSet(${JSON.stringify(edges, null, 2)});

    const container = document.getElementById('graph');
    const data = { nodes, edges };
    const options = {
      nodes: {
        font: { size: 12 }
      },
      edges: {
        arrows: 'to',
        color: { color: '#aaa' },
      },
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -20000,
          springLength: 100,
          damping: 0.09
        }
      }
    };
    new vis.Network(container, data, options);

    // Leyenda
    const legend = document.getElementById('legend');
   const nodeStyles = ${JSON.stringify({
    main: { shape: 'box', color: '#1f77b4' },
    subdomain: { shape: 'dot', color: '#2ca02c' },
    email: { shape: 'dot', color: '#d62728' },
    repo: { shape: 'dot', color: '#9467bd' },
    ip: { shape: 'hexagon', color: '#ff7f0e' },
    tech: { shape: 'dot', color: '#17becf' },  
    ga: { shape: 'diamond', color: '#8c564b' },
    cert: { shape: 'diamond', color: '#e377c2' },
    asn: { shape: 'hexagon', color: '#bcbd22' },
    html: { shape: 'triangle', color: '#7f7f7f' },
    dns: { shape: 'star', color: '#ff6347' },
    default: { shape: 'dot', color: '#ccc' }
  })};

    legend.innerHTML = Object.entries(nodeStyles)
      .filter(([type]) => type !== 'default')
      .map(([type, style]) =>
        \`<div class="legend-item"><span class="legend-color" style="background:\${style.color}"></span> \${type}</div>\`
      ).join('');
  </script>
</body>
</html>
`;
}
function generateElegantReportHTML(output) {
  const grouped = {};
  const emojis = {
    'Subdominios': '🌐',
    'Correos': '📧',
    'Repositorios': '📁',
    'Dirección IP': '💻',
    'Google Analytics': '📊',
    'Certificado SSL': '🔒',
    'ASN': '🛰️',
    'Fingerprint HTML': '🖼️',
    'Tecnologías': '🛠️',
    'DNS': '🕸️',
    'whois': '📜',
    'Subdomain Takeovers': '🚨',
    'Security Headers': '🛡️',
    'Email Auth': '✉️',
    'Screenshot': '📸'
  };

  output.edges.forEach(edge => {
    const parentNode = output.nodes.find(n => n.id === edge.from);
    const childNode = output.nodes.find(n => n.id === edge.to);

    if (!parentNode || !childNode || !parentNode.id.startsWith('tipo_')) return;

    const label = parentNode.label;
    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(childNode.label);
  });

  const fechaActual = new Date().toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte Ulert Cosmos™ - ${output.target}</title>
  <style>
    body {
      font-family: sans-serif;
      padding: 40px;
      max-width: 900px;
      margin: 0 auto;
      background-color: #f4f4f9;
      color: #333;
    }
    h1 {
      color: #1f77b4;
      text-align: center;
      margin-bottom: 10px;
    }
    h2 {
      color: #444;
      border-bottom: 2px solid #ddd;
      padding-bottom: 4px;
    }
    ul {
      list-style-type: disc;
      margin-left: 20px;
      padding-left: 10px;
    }
    li {
      margin: 6px 0;
      background: #fff;
      padding: 8px;
      border-radius: 6px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #999;
      margin-top: 40px;
    }
    .badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.85em;
    }
    .success {
      background: #d4edda;
      color: #155724;
    }
    .error {
      background: #f8d7da;
      color: #721c24;
    }
  </style>
</head>
<body>
  <h1>Reporte Ulert Cosmos™</h1>
  
  <h3 style="text-align:center;">Sitio: <strong>${output.target}</strong></h3>
  <p style="text-align:center;"><span class="badge ">Fecha de generación: ${fechaActual}</span></p>

  ${Object.entries(grouped).map(([titulo, items]) => {
    const emoji = emojis[titulo] || '📄';
    return `
      <h2>${emoji} ${titulo}</h2>
      <ul>
        ${items.map(i => `<li>${i.replace(/\n/g, '<br>')}</li>`).join('\n')}
      </ul>
    `;
  }).join('')}

  <div class="footer">
    Reporte generado automáticamente por <strong>Ulert Cosmos™</strong> – USITE © ${new Date().getFullYear()}
  </div>
</body>
</html>
`;
}


module.exports.generate = async (target, data) => {
  // Quitar http:// o https:// si viene incluido
  target = target.replace(/^https?:\/\//, '');

  console.log('🌐 Generando mapa neuronal...');
  console.log('--------------------------------------------');

  ensureOutputDir();

  const output = {
    target,
    nodes: [],
    edges: []
  };

  const existingNodeIds = new Set();
  const addedEdges = new Set();

  function addNode(id, type, label) {
    const cleanId = sanitizeId(id);
    if (!existingNodeIds.has(cleanId)) {
      output.nodes.push({ id: cleanId, type, label: label || cleanId });
      existingNodeIds.add(cleanId);
    }
    return cleanId;
  }

  function addEdge(from, to) {
    const edgeKey = `${from}->${to}`;
    if (!addedEdges.has(edgeKey)) {
      output.edges.push({ from, to });
      addedEdges.add(edgeKey);
    }
  }

  const mainId = addNode(target, 'main', target);

  // Definir los tipos y sus datos (en español)
  const tipos = [
    { tipo: 'subdomain', label: 'Subdominios', datos: data.osintData?.subdomains || [] },
    { tipo: 'email', label: 'Correos', datos: data.osintData?.emails || [] },
    { tipo: 'repo', label: 'Repositorios', datos: data.osintData?.publicRepos || [] },
    { tipo: 'ip', label: 'Dirección IP', datos: data.fingerprintData?.ip ? [data.fingerprintData.ip] : [] },
    { tipo: 'ga', label: 'Google Analytics', datos: data.fingerprintData?.ga ? [data.fingerprintData.ga] : [] },
    { tipo: 'asn', label: 'ASN', datos: data.fingerprintData?.asn ? [data.fingerprintData.asn] : [] },
    { tipo: 'cert', label: 'Certificado SSL', datos: data.fingerprintData?.cert ? [data.fingerprintData.cert] : [] },
    { tipo: 'html', label: 'Fingerprint HTML', datos: data.fingerprintData?.htmlSig ? [data.fingerprintData.htmlSig] : [] },
    {
      tipo: 'dns',
      label: 'DNS',
      datos: Object.entries(data.fingerprintData?.dnsRecords || {})
        .flatMap(([tipo, valores]) =>
          valores.map(v => {
            if (typeof v === 'object' && v !== null) {
              if (tipo === 'MX') {
                return `MX → Exchange: ${v.exchange || 'N/A'} (Prioridad: ${v.priority ?? 'N/A'})`;
              }
              return `${tipo}: ${JSON.stringify(v)}`;
            }
            return `${tipo}: ${v}`;
          })
        )
    },
    { tipo: 'tech', label: 'Tecnologías', datos: data.fingerprintData?.htmlSig?.technologies || [] },
    { tipo: 'whois', label: 'WHOIS', datos: data.fingerprintData?.whoisData ? [data.fingerprintData.whoisData] : [] },
    { tipo: 'subdomainTakeovers', label: 'Subdomain Takeovers', datos: (data.fingerprintData?.subdomainTakeovers || []).map(item => ({ ...item, subdomain: item.subdomain?.replace(/\n/g, ', ') })) },
    { tipo: 'securityHeaders', label: 'Security Headers', datos: data.fingerprintData?.securityHeaders ? [data.fingerprintData.securityHeaders] : [] },
    { tipo: 'emailAuth', label: 'Email Auth', datos: data.fingerprintData?.emailAuth ? [data.fingerprintData.emailAuth] : [] },
    { tipo: 'screenshot', label: 'Screenshot', datos: data.fingerprintData?.screenshot ? [data.fingerprintData.screenshot] : [] }
  ];

  // Crear nodos de tipo y enlazarlos a la raíz
  tipos.forEach(({ tipo, label, datos }) => {
    if (datos.length > 0) {
      const tipoId = addNode(`tipo_${tipo}_${target}`, tipo, label);
      addEdge(mainId, tipoId);

      datos.forEach(valor => {
        let displayValue = valor;

        if (typeof valor === 'object' && valor !== null) {
          if (tipo === 'cert') {
            displayValue = `
CN: ${valor.subject?.CN || 'N/A'}
Emitido por: ${valor.issuer?.CN || 'N/A'} (${valor.issuer?.O || ''})
Desde: ${valor.valid_from}
Hasta: ${valor.valid_to}
Fingerprint: ${valor.fingerprint}
`.trim();
          } else if (tipo === 'html') {
            const descripcionCorta = valor.description
              ? valor.description.length > 25
                ? valor.description.slice(0, 25) + '...'
                : valor.description
              : 'N/A';

            const techs = Array.isArray(valor.technologies) ? valor.technologies.join(', ') : 'Ninguna';

            const relevantHeaders = [
              'server',
              'x-powered-by',
              'strict-transport-security',
              'content-security-policy',
              'x-frame-options'
            ];

            let cookiesDetalle = 'N/A';
            if (valor.cookies?.length > 0) {
              cookiesDetalle = valor.cookies.map(cookie => `     - ${cookie.split('=')[0]}`).join('\n');
            }

            let headersDetalle = 'N/A';
            if (valor.headers) {
              const encontrados = relevantHeaders
                .filter(hdr => valor.headers[hdr])
                .map(hdr => `     - ${hdr}: ${valor.headers[hdr]}`);
              if (encontrados.length > 0) {
                headersDetalle = encontrados.join('\n');
              }
            }

            displayValue = `
Título: ${valor.title || 'N/A'}
Descripción: ${descripcionCorta}
Hash: ${valor.hash?.slice(0, 16) || 'N/A'}...
Cookies (${valor.cookies?.length || 0}):
${cookiesDetalle}
Tecnologías: ${techs}
Recursos externos: scripts(${valor.scripts.length}), css(${valor.styles.length}), imgs(${valor.images.length})
Encabezados HTTP relevantes:
${headersDetalle}
`.trim();

          } else if (tipo === 'whois') {
            displayValue = `
Registrante: ${valor.registrant || 'N/A'}
Registrador: ${valor.registrar || 'N/A'}
Creado: ${valor.creationDate || 'N/A'}
Expira: ${valor.expiryDate || 'N/A'}
Fuente: ${valor.source || 'N/A'}
`.trim();

          } else if (tipo === 'subdomainTakeovers') {
            displayValue = `
Subdominio: ${valor.subdomain || 'N/A'}
Vulnerable: ${valor.vulnerable ? '✅ Sí' : '❌ No'}
`.trim();

          } else if (tipo === 'screenshot') {
            const url = valor.url || 'N/A';
            displayValue = `
URL: <a href="${url}" target="_blank">${url}</a>
Archivo: <a href="${valor.file}" target="_blank">${valor.file}</a>
Fuente: ${valor.source || 'N/A'}
`.trim();
          } else if (tipo === 'securityHeaders') {
            const securityHeaders = valor; // si ya lo tienes en valor, no necesitas volver a hacer la petición
            displayValue = `
CSP: ${securityHeaders.CSP || 'N/A'}
HSTS: ${securityHeaders.HSTS || 'N/A'}
X-Frame-Options: ${securityHeaders.XFrameOptions || 'N/A'}
X-Content-Type-Options: ${securityHeaders.XContentTypeOptions || 'N/A'}
Source: ${securityHeaders.source || 'N/A'}
`.trim();
          } else if (tipo === 'emailAuth') {
            const emailAuth = valor;
            displayValue = `
DMARC: ${(emailAuth.DMARC || 'N/A').slice(0, 20)}${(emailAuth.DMARC || '').length > 20 ? '...' : ''}
SPF: ${emailAuth.SPF || 'N/A'}
DKIM: ${(emailAuth.DKIM || 'N/A').slice(0, 20)}${(emailAuth.DKIM || '').length > 20 ? '...' : ''}
Source: ${emailAuth.source || 'N/A'}
Timestamp: ${emailAuth.timestamp || 'N/A'}
`.trim();
          } else if (tipo === 'tech') {
            displayValue = Array.isArray(valor) ? valor.join(', ') : String(valor);
          } else {
            displayValue = JSON.stringify(valor, null, 2);
          }
        }

        const safeValueId = `${tipo}_${typeof valor === 'object'
          ? JSON.stringify(valor).slice(0, 30)
          : valor}`;
        const valorId = addNode(safeValueId, tipo, displayValue);
        addEdge(tipoId, valorId);
      });
    }
  });

  // Guardar JSON
  const jsonPath = path.join(OUTPUT_DIR, `${sanitizeId(target)}_cosmos.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(output, null, 2));

  const htmlPath = path.join(OUTPUT_DIR, `${sanitizeId(target)}_cosmos.html`);
  fs.writeFileSync(htmlPath, generateHTML(output));

  const elegantHTMLPath = path.join(OUTPUT_DIR, `${sanitizeId(target)}_resumen.html`);
  fs.writeFileSync(elegantHTMLPath, generateElegantReportHTML(output));

  console.log(`📄 Resumen HTML guardado en: ${elegantHTMLPath}`);
  console.log(`🧾 Mapa JSON guardado en: ${jsonPath}`);
  console.log(`🌐 Mapa HTML guardado en: ${htmlPath}`);

  console.log('✅ Mapa neuronal generado con éxito.');


};

