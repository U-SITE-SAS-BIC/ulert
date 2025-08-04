# Ulert 🛡️

> **Guardián open source para sitios web** — audita, monitorea y protege tu sitio.

`ulert` es una herramienta ligera y auto-hospedable que verifica el **uptime**, los **enlaces rotos**, el **tiempo de carga** y los **headers de seguridad** de tu sitio web, todo desde la línea de comandos.

Hecho por [u-site.app](https://u-site.app) — Soluciones de software para el mundo digital.

---

## 📸 Ejemplo de Reporte

![Reporte HTML de Ulert](/_assets/report.png)

_Generado en segundos. Sin rastreo. Sin nube. Solo claridad._

---

## ✅ Características

- 🔍 **Verificación de Uptime**: Detecta si tu sitio está en línea.
- 🔗 **Detección de enlaces rotos**: Escanea enlaces internos rotos.
- ⚡ **Auditoría de rendimiento**: Mide y reporta el tiempo de carga.
- 🔒 **Análisis de headers de seguridad**: Audita headers como CSP, HSTS y X-Frame-Options.
- 📄 **Reportes flexibles**: Genera reportes en formato HTML o JSON.
- 🐳 **Soporte para Docker**: Fácil de auto-hospedar con Docker.
- 📦 **Open source**: Licenciado bajo MIT, gratis para siempre.

---

## 🚀 Inicio rápido

Ejecuta una auditoría rápida a cualquier sitio con un solo comando:

    npx ulert audit u-site.app

### Instalación global 

Para uso regular, instala Ulert globalmente mediante npm: 
  
    npm install -g ulert
    ulert audit https://tu-sitio.com
    
 
### Uso en CI/CD 

Integra Ulert en tu flujo de GitHub Actions para detectar errores antes de desplegar. 

    name: Ejecutar auditoría con Ulert
    run: npx ulert audit https://tu-sitio.com
 
 
### Ver reportes HTML auto-hospedados 

Después de una auditoría, el reporte se guarda localmente. Ábrelo directamente en tu navegador: 

    open reports/report.html
 
---

## 🤝 Contribuir 

¡Nos encantan los contribuidores! Este proyecto es parte de la iniciativa de u-site.app para crear herramientas éticas y centradas en la privacidad. 

Consulta nuestra [📖 Guía de Contribución ](CONTRIBUTING.md) para comenzar. 
Ideas para contribuir: 

- Añadir formato de salida JSON
- Soporte para escaneo de sitemap.xml
- Alertas por correo o Discord
- Interfaz de panel (Dashboard UI) con Svelte o React
- Imagen de Docker oficial
     
---

## [📖 Ver historial de cambios](CHANGELOG.md)

## 🧑‍💻 Mantenedor

- **LizandroGD** – [GitHub @LizandroGD](https://github.com/LizandroGD)  
  Líder técnico y desarrollador principal de Ulert.

¿Quieres colaborar? ¡Abre un issue o PR! Estamos aquí para ayudarte.

## 📜 Licencia 

Ulert está licenciado bajo la Licencia MIT — libre para uso personal y comercial. 

---

**Ulert** — Parte del conjunto de herramientas open source de [u-site.app](https://u-site.app) | [GitHub Organización](https://github.com/U-SITE-SAS-BIC/ulert.git)
     

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)