import { useState, useRef } from 'react';
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
  const editorRef = useRef<any>(null);

  const handleResize = (percentage: number) => {
    setLeftFlexBasis(percentage);
  };

  const handleExport = () => {
    // This will be implemented in Phase 2
    alert('PDF export coming in Phase 2!');
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <TopBar onExport={handleExport} />

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
                <PreviewPanel markdown={markdown} />
              </div>
            )}
          </ScrollSync>
        </div>
      </div>
    </div>
  );
}

export default App;
