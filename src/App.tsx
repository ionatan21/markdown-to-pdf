import { useState, useRef } from 'react';
import type { editor } from 'monaco-editor';
import html2pdf from 'html2pdf.js';
import './App.css';
import TopBar from './components/TopBar';
import EditorPanel from './components/EditorPanel';
import PreviewPanel from './components/PreviewPanel';
import DraggableDivider from './components/DraggableDivider';
import ScrollSync from './components/ScrollSync';

function App() {
  const [markdown, setMarkdown] = useState<string>(
    `# Welcome to Markdown Preview

## Features
- 🎨 **Real-time preview** with live rendering
- ✏️ **Monaco editor** with syntax highlighting
- 🔄 **Scroll sync** between editor and preview
- 📐 **Resizable panels** with draggable divider
- 🎯 **Formatting toolbar** for quick markdown insertion
- 📥 **Export to PDF** (upcoming)

## Try it out

### Write some markdown here!

You can use **bold**, *italic*, \`code\`, and more.

### Code blocks

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

### Lists and tables

- Item 1
- Item 2
- Item 3

| Feature | Support |
|---------|---------|
| Headers | ✅ |
| Lists | ✅ |
| Code | ✅ |

### Blockquotes

> This is a blockquote. You can include quotes from other sources.

---

Start editing on the left to see the preview update in real-time!
`
  );

  const [leftFlexBasis, setLeftFlexBasis] = useState<number>(50);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const previewContentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleResize = (percentage: number) => {
    setLeftFlexBasis(percentage);
  };

  const handleExport = async () => {
    if (!markdown.trim() || markdown.trim().length < 10) {
      alert('Please add some content before exporting to PDF.');
      return;
    }

    if (!previewContentRef.current) {
      alert('Preview not ready. Please try again.');
      return;
    }

    try {
      setIsExporting(true);

      const previewContent = previewContentRef.current;

      if (!previewContent) {
        throw new Error('Preview content not found');
      }

      const timestamp = new Date().toISOString().split('T')[0];
      const options = {
        margin: [15, 15, 15, 15], // Increased margins to compensate for removed padding
        filename: `markdown-export-${timestamp}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          letterRendering: true,
          scrollY: 0,
          scrollX: 0,
          windowHeight: previewContent.scrollHeight, // Capture full height
        },
        jsPDF: {
          unit: 'mm' as const,
          format: 'a4' as const,
          orientation: 'portrait' as const,
          compress: true,
        },
        pagebreak: {
          mode: ['avoid-all', 'css', 'legacy'],
          avoid: ['img', 'pre', 'table'],
        },
      };

      await html2pdf().set(options).from(previewContent).save();

      console.log('PDF exported successfully');
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <TopBar onExport={handleExport} isExporting={isExporting} />

      <div className="flex flex-1 overflow-hidden">
        <div style={{ width: `${leftFlexBasis}%`, flexShrink: 0 }} className="overflow-hidden">
          <EditorPanel value={markdown} onChange={setMarkdown} editorRef={editorRef} />
        </div>

        <DraggableDivider onResize={handleResize} />

        <div style={{ width: `${100 - leftFlexBasis}%`, flexShrink: 0 }} className="flex flex-col">
          <ScrollSync editorRef={editorRef}>
            {(previewRef) => (
              <div
                ref={previewRef}
                className="flex-1 overflow-y-auto bg-white"
                style={{ height: 'calc(100vh - 5rem)' }}
              >
                <PreviewPanel markdown={markdown} contentRef={previewContentRef} />
              </div>
            )}
          </ScrollSync>
        </div>
      </div>
    </div>
  );
}

export default App;
