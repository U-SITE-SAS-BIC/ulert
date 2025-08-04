# 🚀 Guía de Lanzamiento – Ulert

Este documento describe el proceso para crear una nueva versión estable de **Ulert**, asegurando consistencia, calidad y alineación con los valores de [u-site.app](https://u-site.app).

## 📅 Frecuencia de lanzamiento
- **Versión 0.x**: Lanzamientos frecuentes (cada 2-4 semanas) durante desarrollo activo.
- **Versión 1.0+**: Lanzamientos mensuales con cambios significativos o nuevas funciones.

## 🧭 Antes de lanzar

Asegúrate de que:
- ✅ Todos los tests pasan.
- ✅ El `README.md` está actualizado.
- ✅ Los cambios están documentados en `CHANGELOG.md` (próximamente).
- ✅ Se han revisado y cerrado los issues relacionados con la versión.
- ✅ El código está en `main` y tiene CI/CD verde.

## 🏷 Pasos para crear un lanzamiento

1. **Actualiza la versión en `package.json`**
   ```bash
   npm version patch|minor|major
 
    patch: correcciones de bugs (0.1.1)
    minor: nuevas funciones (0.2.0)
    major: cambios rotos (1.0.0)
     
2. **Haz commit y push**

    ```bash
    git push origin main
    git push origin --tags
 

3. **Publica en npm**

    ```bash
    npm publish

4. **Crea un Release en GitHub**

    - Ve a: github.com/U-SITE-SAS-BIC/ulert/releases/new 
    - Usa el tag creado (ej: v0.1.0)
    - Título: Ulert v0.1.0 - Website Guardian
    - Descripción: Resume los cambios clave.
            

5. **Anuncia el lanzamiento**
    - En redes: LinkedIn, X (Twitter)
    - En comunidades: Dev.to, Reddit, grupos de Devs
    - En el sitio: u-site.app (sección de noticias o recursos)
         
     

🏁 Ejemplo de anuncio 

    🚀 ¡Nuevo lanzamiento de Ulert!
    v0.1.0 ya está disponible:   

        Detecta enlaces rotos  
        Audita headers de seguridad  
        Genera reportes HTML
         

    Descárgalo ahora:
    npx ulert audit u-site.app   

    Hecho con ❤️ por u-site.app  
     
