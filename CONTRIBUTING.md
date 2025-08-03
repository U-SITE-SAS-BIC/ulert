# 🤝 Contribuir a Ulert

¡Gracias por considerar contribuir a **Ulert**!  
Este proyecto es parte de la iniciativa open source de [u-site.app](https://u-site.app), y tu ayuda es bienvenida para hacer de Ulert una herramienta más poderosa, segura y útil para la comunidad.

Ya sea que quieras reportar un bug, proponer una mejora o desarrollar una nueva función, este documento te guiará paso a paso.

---

## 📌 ¿Cómo puedes contribuir?

### 1. Reportar un bug o sugerir una mejora
- Usa la pestaña **[Issues](https://github.com/U-SITE-SAS-BIC/ulert/issues)** en GitHub.
- Busca primero si ya existe un issue similar.
- Si no existe, crea uno nuevo con:
  - Un título claro
  - Una descripción detallada del problema o idea
  - Pasos para reproducir (si es un bug)
  - Tu entorno (Node.js v23, macOS, etc.)

📌 Usa etiquetas sugeridas:
- `bug` – Para errores
- `enhancement` – Para nuevas funciones
- `help wanted` – Si necesitas ayuda
- `good first issue` – Para tareas simples (ideal para nuevos contribuidores)

---

### 2. Proponer o desarrollar una nueva función
1. **Abre un issue** describiendo la función (ej: "Agregar soporte para reporte JSON").
2. Comenta: _"Me gustaría trabajar en esto"_.
3. Un mantenedor (de u-site.app) te asignará el issue.
4. Haz un fork del repositorio y crea una rama:
   ```bash
   git checkout -b feat/json-report
   ```
5. Implementa tu cambio.
6. Asegúrate de que todo funcione:
   ```bash
   npx ulert audit u-site.app
   ```
7. Haz commit con un mensaje claro:
   ```bash
   git commit -m "feat: add JSON report output"
   ```
8. Haz push y abre un **Pull Request (PR)**.

---

### 3. Abrir un Pull Request (PR)
- Asegúrate de que tu código sigue el estilo del proyecto.
- Incluye pruebas si es posible.
- Describe claramente qué hace tu PR.
- Sé respetuoso y abierto a feedback.

📌 Ejemplo de buen PR:
> **Título**: `feat: add --output option for custom report path`  
> **Cuerpo**:  
> Este PR añade la opción `--output` para guardar el reporte en una ruta personalizada.  
> Ejemplo: `ulert audit u-site.app --output ./custom/report.html`  
> - Se añadió soporte en el CLI  
> - Se actualizó el reporter  
> - Se añadió prueba básica

---

## 🧱 Tecnologías utilizadas
- **Node.js** – Entorno principal
- **npm** – Gestión de paquetes
- **Axios** – Peticiones HTTP
- **Cheerio** – Parsing de HTML
- **Commander** – CLI
- **HTML/CSS** – Reporte visual

---

## 🧪 Pruebas
Actualmente estamos construyendo la suite de pruebas.  
Si agregas una función nueva, por favor incluye pruebas unitarias usando `Jest` o `Mocha`.

Ejemplo de prueba básica:
```js
test('should detect broken links', async () => {
  const result = await linkScanner('https://example.com');
  expect(result.broken).toBeGreaterThanOrEqual(0);
});
```

---

## 📜 Normas de conducta
Este proyecto sigue un entorno de respeto y colaboración.  
Por favor, revisa nuestro [Código de Conducta](CODE_OF_CONDUCT.md).

---

## 🙌 Agradecimientos
Todos los contribuidores serán reconocidos:
- En el `README.md` (opcional)
- En el historial de commits
- En anuncios oficiales de u-site.app

---

## 📬 ¿Tienes dudas?
Envía un mensaje a: **info@u-site.app**  
O comenta en cualquier issue con `@lizandrogd`.

¡Tu contribución hace de Ulert una herramienta mejor para todos!

---

> **Ulert** — Hecho con ❤️ por [u-site.app](https://u-site.app)  
> Software ético, open source y centrado en la privacidad.
```
