export const DEFAULT_MARKDOWN = `

<img src="logo-dark.webp" class="left" width="100" alt="Logo de Markdown to PDF">

# Welcome to Markdown to PDF!

## Why this project exists

I created this tool because I needed a faster way to produce reports, documentation, and deliverables as polished PDF files.

Most of the information I worked with already started in Markdown: notes, technical reports, project documentation, and structured drafts. Markdown is excellent for writing quickly, but not everyone can read, interpret, or visualize it with the same clarity as a finished PDF document.

Markdown to PDF helps bridge that gap. It lets you write in Markdown, preview the final document in real time, adjust the visual style, and export a PDF that is easier to share with clients, teams, or anyone who simply needs the final result.

## Features

- Real-time preview with live rendering
- Monaco editor with syntax highlighting
- Scroll sync between editor and preview
- Resizable panels with draggable divider
- Formatting toolbar for quick markdown insertion
- Document style controls for typography, sizing, and colors
- Mermaid diagrams in preview and PDF export
- HTML images with custom size and positioning classes: \`left\`, \`center\`, and \`right\`
- Export to PDF

## Try it out

### Headings

Use headings to structure reports and documentation.

#### Smaller heading

Headings create a clear hierarchy in both preview and PDF.

### Paragraphs and line breaks

Paragraphs are written as plain text separated by blank lines.

This sentence ends with two spaces.  
This sentence starts on the next line.

### Emphasis and inline code

You can use **bold text**, *italic text*, and \`inline code\` inside a paragraph.

### Links

Visit [Jonatan Barrios' portfolio](https://portfolio-jonatan-barrios.vercel.app) to see a real link example.

### Images

Markdown images are supported:

![Markdown to PDF logo](ejemplo.webp)

HTML images are also supported when you need custom size or positioning:

<img src="logo-dark.webp" class="center" width="200" alt="Logo de Markdown to PDF">

Available image positioning classes: \`left\`, \`center\`, and \`right\`.

### Code blocks

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

### Mermaid diagrams

\`\`\`mermaid
flowchart TD
    A[Start] --> B{Need a diagram?}
    B -- Yes --> C[Write Mermaid]
    B -- No --> D[Keep writing]
    C --> E[Export polished PDF]
    D --> E
\`\`\`

### Ordered lists

1. Draft the content
2. Preview the document
3. Export the polished PDF

### Unordered lists

- Item 1
- Item 2
- Item 3

### Tables

| Feature | Support |
|---------|---------|
| Headers | Yes |
| Lists | Yes |
| Code | Yes |
| Images | Yes |
| Mermaid | Yes |
| PDF export | Yes |

### Blockquotes

> Markdown is fast for writing. PDF is clear for sharing.

### Horizontal rules

---

Start editing on the left to see the preview update in real time.
`;
