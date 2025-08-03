# 📜 CHANGELOG - Ulert

> **Open source website guardian** — Monitorea, audita y protege tu sitio web.

Este archivo registra todos los cambios significativos en las versiones de **Ulert**.  
Sigue el estándar de [Semantic Versioning (SemVer)](https://semver.org): `MAJOR.MINOR.PATCH`  
- `MAJOR`: Cambios **incompatibles** con versiones anteriores  
- `MINOR`: Nuevas funciones con compatibilidad hacia atrás  
- `PATCH`: Correcciones de bugs y mejoras menores  

Desarrollado con ❤️ por [u-site.app](https://u-site.app) — Software ético, funcional y centrado en la excelencia.

---

## 🚀 Próximamente – v0.2.0 (en desarrollo)

- [ ] Soporte para reporte en formato JSON
- [ ] Opción `--output` para personalizar ruta del reporte
- [ ] Integración con GitHub Actions
- [ ] Dockerfile para auto-hosting
- [ ] Alertas por Discord (opcional)

---

## 🟢 v0.1.0 - 3 de agosto de 2025

### ✨ Nueva funcionalidad
- ✅ Comando `ulert audit <url>` para auditar sitios web
- ✅ Verificación de estado (uptime)
- ✅ Detección de enlaces rotos (404)
- ✅ Medición de tiempo de carga
- ✅ Auditoría de headers de seguridad:
  - `Strict-Transport-Security`
  - `X-Frame-Options`
  - `X-Content-Type-Options`
  - `Content-Security-Policy`
  - `Permissions-Policy`
- ✅ Generación de reporte HTML
- ✅ Reporte en consola con colores y resumen claro

### 🐞 Correcciones
- ✅ Corrección de acceso a `result` antes de inicialización
- ✅ Manejo seguro de headers `undefined`
- ✅ Mejora en manejo de URLs sin `http://` o `https://`

### 📁 Estructura del proyecto
- ✅ Organización clara: `bin/`, `src/`, `reports/`
- ✅ Archivos de contribución: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`
- ✅ Plantillas para PRs e Issues
- ✅ Licencia MIT

### 📣 Lanzamiento oficial
- Primer proyecto open source de **u-site.app**
- Presentado como herramienta complementaria para [V-Card](https://u-site.app), [Mini-Website](https://u-site.app) y [U-Vot](https://u-site.app)
- Enfocado en **privacidad, simplicidad y salud web**

---

## 🛠️ Cómo usar este CHANGELOG

- Cada nueva versión debe añadirse arriba de "Próximamente".
- Usa secciones claras: `Nueva funcionalidad`, `Correcciones`, `Mejoras`, `Cambio rotos`.
- Mantén el tono profesional, claro y alineado con los valores de **u-site.app**.

---

> Este changelog refleja nuestro compromiso con la **transparencia** y la **excelencia técnica**.  
> En **u-site.app**, creemos que un software bien documentado es un software de calidad.