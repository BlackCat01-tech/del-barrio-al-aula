# Del barrio al aula

Presentación web para la exposición de **Ciencia y sociedad**: desigualdad, educación y ciencia en los barrios populares de Medellín.

## Estructura

```
del-barrio-al-aula/
├── index.html      # Contenido de las 13 diapositivas
├── css/
│   └── styles.css  # Estilos, paleta y tema claro/oscuro
├── js/
│   └── main.js     # Navegación, notas, ladera animada y gráfica de onda
├── .nojekyll
└── README.md
```

## Controles

- Flechas, Espacio, Re Pág y Av Pág: cambiar de diapositiva
- **N**: notas del orador
- **F**: pantalla completa
- Botón **Tema**: claro u oscuro
- En celular: deslizar con el dedo

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub (por ejemplo `del-barrio-al-aula`).
2. Sube estos archivos a la raíz del repositorio.
3. Ve a **Settings > Pages**.
4. En **Build and deployment**, elige **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
5. Guarda. En uno o dos minutos la página quedará en:
   `https://TU-USUARIO.github.io/del-barrio-al-aula/`

## Notas

- Las tipografías (Anton, Archivo, Permanent Marker) se cargan desde Google Fonts, así que se necesita conexión a internet. Si no hay conexión, se usan tipografías de respaldo.
- Para editar el texto, cambia el contenido de cada `<section class="slide">` en `index.html`. Las notas del orador están en el `<aside class="notes">` de cada diapositiva.
