// /labs/cosmos/osint.js
const fetch = require('node-fetch');

module.exports.run = async (domain) => {
    // Quitar http:// o https:// y cualquier / final
    domain = domain.replace(/^https?:\/\//, '').replace(/\/$/, '');

    console.log('🔍 Ejecutando OSINT para dominio:', domain);
    console.log('--------------------------------------------');

    const data = {
        subdomains: [],
        emails: [],
        publicRepos: [],
        metadata: [],
    };

    // Subdominios
    console.log('🌐 Obteniendo subdominios...');
    try {
        data.subdomains = await getSubdomains(domain);
        if (data.subdomains.length > 0) {
            console.log(`✔️ Subdominios encontrados: ${data.subdomains.length}`);
        } else {
            console.log('⚠️ No se encontraron subdominios.');
        }
    } catch (e) {
        console.error(`❌ Error obteniendo subdominios: ${e.message}`);
    }

    // Emails filtrados
    console.log('\n📧 Buscando emails filtrados...');
    try {
        data.emails = await leakedEmails(domain);
        if (data.emails.length > 0) {
            console.log(`✔️ Emails filtrados encontrados: ${data.emails.length}`);
        } else {
            console.log('⚠️ No se encontraron emails filtrados.');
        }
    } catch (e) {
        console.error(`❌ Error obteniendo emails filtrados: ${e.message}`);
    }

    // Repos públicos
    console.log('\n📂 Buscando repositorios públicos en GitHub...');
    try {
        data.publicRepos = await githubSearch(domain);
        if (data.publicRepos.length > 0) {
            console.log(`✔️ Repositorios encontrados: ${data.publicRepos.length}`);
        } else {
            console.log('⚠️ No se encontraron repositorios públicos.');
        }
    } catch (e) {
        console.error(`❌ Error buscando repositorios públicos: ${e.message}`);
    }

    console.log('\n✅ Finalizado OSINT.\n');

    return data;
};

// === Funciones auxiliares ===

async function getSubdomains(domain) {
    const url = `https://crt.sh/?q=%25.${domain}&output=json`;
    try {
        const res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Ulert CLI)' }
        });

        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await res.text();
            console.warn('⚠️ crt.sh no devolvió JSON válido. Mostrando primeros 500 caracteres:');
            console.warn(text.slice(0, 500));
            return [];
        }

        const json = await res.json();
        const subs = [...new Set(json.map(entry => entry.name_value))];
        return subs;
    } catch (e) {
        console.error(`❌ Error en getSubdomains: ${e.message}`);
        return [];
    }
}

async function leakedEmails(domain) {
    const emails = new Set();

    // Buscar en Pastebin (sin API oficial)
    console.log('🔎 Buscando en Pastebin...');
    try {
        const res = await fetch(`https://pastebin.com/raw/search?q=%40${domain}`);
        const text = await res.text();
        const found = text.match(new RegExp(`[a-zA-Z0-9._%+-]+@${domain.replace('.', '\\.')}`, 'g'));
        if (found) {
            found.forEach(e => emails.add(e));
            console.log(`✔️ Encontrados ${found.length} emails en Pastebin`);
        } else {
            console.log('⚠️ No se encontraron emails en Pastebin');
        }
    } catch (e) {
        console.error(`❌ Error buscando en Pastebin: ${e.message}`);
    }

    // Buscar en GitHub
    console.log('🔎 Buscando en GitHub...');
    try {
        const res = await fetch(`https://api.github.com/search/code?q=%40${domain}+in:file`);
        const json = await res.json();

        if (json.items?.length > 0) {
            for (const item of json.items.slice(0, 5)) {
                try {
                    const rawUrl = item.html_url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
                    const fileRes = await fetch(rawUrl);
                    const fileText = await fileRes.text();

                    const found = fileText.match(new RegExp(`[a-zA-Z0-9._%+-]+@${domain.replace('.', '\\.')}`, 'g'));
                    if (found) {
                        found.forEach(e => emails.add(e));
                        console.log(`✔️ ${found.length} emails encontrados en archivo: ${item.html_url}`);
                    }
                } catch (err) {
                    console.warn(`⚠️ Error leyendo archivo GitHub (${item.html_url}): ${err.message}`);
                }
            }
        } else {
            console.log('⚠️ No se encontraron archivos relacionados en GitHub.');
        }
    } catch (e) {
        console.error(`❌ Error buscando emails en GitHub: ${e.message}`);
    }

    return Array.from(emails);
}

async function githubSearch(domain) {
    try {
        const res = await fetch(`https://api.github.com/search/repositories?q=${domain}`);
        const json = await res.json();
        const repos = json.items?.map(repo => repo.full_name) || [];
        return repos;
    } catch (e) {
        console.error(`❌ Error buscando en GitHub: ${e.message}`);
        return [];
    }
}
