# Markdown Preview

Aplicacion web para escribir Markdown, previsualizarlo en tiempo real y exportarlo como PDF. Esta pensada para redactar documentos largos con una experiencia simple: editor, vista previa, controles de formato y exportacion en un solo lugar.

## Caracteristicas

- Editor Markdown con Monaco Editor y resaltado de sintaxis.
- Vista previa en tiempo real con soporte para GitHub Flavored Markdown.
- Barra de formato para insertar rapidamente titulos, listas, enlaces, citas, tablas, codigo y separadores.
- Personalizacion visual de la vista previa: fuente, tamano y color del texto.
- Exportacion a PDF con limpieza previa del HTML y reglas de paginacion para reducir cortes visuales.
- Sincronizacion de scroll entre editor y vista previa en escritorio.
- Diseno responsive:
  - En escritorio usa paneles redimensionables.
  - En pantallas pequenas usa pestanas para alternar entre Editor y Vista previa.

## Tecnologias

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Monaco Editor
- react-markdown + remark-gfm
- html2pdf.js, html2canvas y jsPDF
- Lucide React

## Requisitos

- Node.js instalado.
- npm, incluido con Node.js.

El proyecto tambien incluye archivos de pnpm, por lo que puedes usar pnpm si prefieres, pero los scripts documentados abajo usan npm.

## Instalacion

```bash
npm install
```

## Desarrollo

Inicia el servidor local:

```bash
npm run dev
```

Luego abre la URL que muestre Vite, normalmente:

```text
http://localhost:5173
```

## Scripts Disponibles

```bash
npm run dev
```

Ejecuta la aplicacion en modo desarrollo.

```bash
npm run build
```

Compila TypeScript y genera la version de produccion en `dist/`.

```bash
npm run preview
```

Sirve localmente el build de produccion.

```bash
npm run lint
```

Ejecuta ESLint sobre el proyecto.

## Uso Basico

1. Escribe o pega contenido Markdown en el editor.
2. Revisa el resultado en la vista previa.
3. Usa la barra de formato para insertar elementos comunes.
4. Ajusta fuente, tamano o color desde la barra de la vista previa.
5. Presiona `Export PDF` para descargar el documento.

En pantallas pequenas, usa las pestanas superiores para alternar entre `Editor` y `Vista previa`.

## Exportacion a PDF

La exportacion crea un clon simplificado del contenido renderizado antes de enviarlo a `html2pdf.js`. Ese clon aplica reglas especificas para:

- usar un ancho compatible con A4;
- evitar desbordes horizontales;
- conservar mejor titulos con el contenido que les sigue;
- reducir cortes de bloques pequenos entre paginas.

Los ajustes principales viven en:

- `src/hooks/usePdfExport.ts`
- `src/utils/htmlSanitizer.ts`
- `src/utils/pdfExportConfig.ts`

## Estructura Principal

```text
src/
  components/        Componentes de editor, vista previa, toolbar y layout
  constants/         Markdown inicial de ejemplo
  hooks/             Hooks de exportacion PDF y sincronizacion de scroll
  types/             Tipos compartidos
  utils/             Utilidades para sanitizar HTML y configurar PDF
public/
  logo.png           Logo usado en la barra superior
```

## Notas de Desarrollo

- El contenido inicial se define en `src/constants/defaultMarkdown.ts`.
- La barra superior se encuentra en `src/components/TopBar.tsx`.
- El layout responsive principal se controla desde `src/App.tsx` y `src/App.css`.
- Los estilos globales y reglas de Markdown estan en `src/index.css`.
