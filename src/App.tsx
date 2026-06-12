import { useState, useRef } from 'react';
import type { editor } from 'monaco-editor';
import './App.css';
import TopBar from './components/TopBar';
import EditorPanel from './components/EditorPanel';
import PreviewPanel from './components/PreviewPanel';
import DraggableDivider from './components/DraggableDivider';
import ScrollSync from './components/ScrollSync';
import { usePdfExport } from './hooks/usePdfExport';
import { DEFAULT_MARKDOWN } from './constants/defaultMarkdown';

function App() {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
  const [leftFlexBasis, setLeftFlexBasis] = useState<number>(50);
  const [isEditorVisible, setIsEditorVisible] = useState<boolean>(true);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const previewContentRef = useRef<HTMLDivElement>(null);

  const { isExporting, handleExport } = usePdfExport({
    markdown,
    previewContentRef,
  });

  const handleResize = (percentage: number) => {
    setLeftFlexBasis(percentage);
  };

  const toggleEditor = () => {
    setIsEditorVisible(!isEditorVisible);
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <TopBar
        onExport={handleExport}
        isExporting={isExporting}
        onToggleEditor={toggleEditor}
        isEditorVisible={isEditorVisible}
      />

      <div className="flex flex-1 overflow-hidden">
        {isEditorVisible && (
          <>
            <div style={{ width: `${leftFlexBasis}%`, flexShrink: 0 }} className="overflow-hidden">
              <EditorPanel value={markdown} onChange={setMarkdown} editorRef={editorRef} />
            </div>

            <DraggableDivider onResize={handleResize} />
          </>
        )}

        <div style={{ width: isEditorVisible ? `${100 - leftFlexBasis}%` : '100%', flexShrink: 0 }} className="flex flex-col">
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