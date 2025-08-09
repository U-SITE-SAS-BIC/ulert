# 📜 CHANGELOG - Ulert

> **Open source website guardian** — Monitorea, audita y protege tu sitio web.

Este archivo registra todos los cambios significativos en las versiones de **Ulert**.  
Sigue el estándar de [Semantic Versioning (SemVer)](https://semver.org): `MAJOR.MINOR.PATCH`  
- `MAJOR`: Cambios **incompatibles** con versiones anteriores  
- `MINOR`: Nuevas funciones con compatibilidad hacia atrás  
- `PATCH`: Correcciones de bugs y mejoras menores  

Desarrollado con ❤️ por [u-site.app](https://u-site.app) — Software ético, funcional y centrado en la excelencia.

---

## 🚀 Próximamente – v1.1.0 (en desarrollo)

- [ ] Opción `--output` para personalizar ruta del reporte
- [ ] Integración con GitHub Actions
- [ ] Dockerfile para auto-hosting
- [ ] Alertas por Discord

---
## 🟢 v1.0.4 - 9 de agosto de 2025

### 🚀 Nuevas funcionalidades
- 🔭 **Ulert Cosmos:** se añadió soporte para el análisis integral de dominios a través del módulo Cosmos, incluyendo escaneo DNS, WHOIS, autenticación de email (DMARC, SPF, DKIM), capturas de pantalla y más.

### 🛠️ Mejoras generales
- Se incorporaron nuevas funcionalidades y mejoras al módulo Ulert Cosmos para un análisis más completo y detallado.
- Se optimizó y mejoró la presentación del log en terminal para una visualización más clara y estilizada.

---
## 🟢 v1.0.3 - 7 de agosto de 2025

### 🚀 Nuevas funcionalidades
- 🔭 **Integración con Ulert Cosmos:** se agregó soporte para analizar dominios usando el módulo Cosmos, permitiendo análisis OSINT más completos.
- 📄 **Licencia incluida:** ahora el repositorio incluye una licencia oficial (`LICENSE`) que define los términos de uso del proyecto.

### 🛠️ Cambios generales
- Refactorización menor de módulos para mejorar la organización del código.
- Se actualizaron las rutas internas para soportar mejor los submódulos.

### 🐛 Correcciones
- Correcciones menores en la visualización de los datos del análisis.

---

## 🟢 v1.0.1 - 5 de agosto de 2025

### ✨ Mejoras

- **Soporte mejorado para reporte JSON**:  
  Ahora genera un **informe completo** con la misma información que el HTML, incluyendo métricas, enlaces rotos y resultados de seguridad.
- **Traducción completa** de la interfaz y reportes (`es` y `en`).
- **Nuevo diseño del reporte HTML**:
  - Tipografía moderna (`Inter`).
  - Estructura en **cards** para cada sección.
  - **Badges** redondeados y con mejor contraste.
  - **Tabla limpia** para enlaces rotos.
  - Diseño **responsive** adaptable a móviles.
- **Unificación de la salida en consola**:  
  Ahora la información mostrada en consola es la misma tanto si se usa `--json` como si no.
- **Normalización de URLs**:  
  Es necesario especificar `http://` o `https://`.
- **Tiempo de carga en español**:  
  El reporte ahora muestra `⚡ Tiempo de carga: X ms` en lugar de `Load Time`.
- **Consistencia en formatos**:  
  Consola, HTML y JSON muestran la misma estructura de datos.
- **Nueva opción de exportación personalizada**:  
  Se añade la opción de **guardar el informe** en una ruta específica con  
  ```bash
  -o, --output <archivo>



## 🟢 v1.0.0 - 3 de agosto de 2025

### 🚀 Lanzamiento oficial

Hoy lanzamos **Ulert v1.0.0**, el primer proyecto open source de **u-site.app**.  
Esta versión marca la estabilidad del núcleo del software y el compromiso con la comunidad de desarrolladores, diseñadores y empresas que necesitan herramientas transparentes, privadas y confiables para mantener sus sitios web saludables.

> ✅ **Ulert es oficialmente 1.0.0**  
> ✅ Listo para producción  
> ✅ Documentación completa  
> ✅ Open source (MIT)

---


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
