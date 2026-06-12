import { useState, useRef } from 'react';
import type { CSSProperties } from 'react';
import type { editor } from 'monaco-editor';
import './App.css';
import TopBar from './components/TopBar';
import EditorPanel from './components/EditorPanel';
import PreviewPanel from './components/PreviewPanel';
import DraggableDivider from './components/DraggableDivider';
import ScrollSync from './components/ScrollSync';
import { usePdfExport } from './hooks/usePdfExport';
import { DEFAULT_MARKDOWN } from './constants/defaultMarkdown';

type PanelStyle = CSSProperties & {
  '--panel-width'?: string;
};

function App() {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
  const [leftFlexBasis, setLeftFlexBasis] = useState<number>(50);
  const [isEditorVisible, setIsEditorVisible] = useState<boolean>(true);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
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
        mobileView={mobileView}
        onMobileViewChange={setMobileView}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {isEditorVisible && (
          <>
            <div
              style={{ '--panel-width': `${leftFlexBasis}%` } as PanelStyle}
              className={`${mobileView === 'editor' ? 'flex' : 'hidden'} md:flex overflow-hidden responsive-editor-pane`}
            >
              <EditorPanel value={markdown} onChange={setMarkdown} editorRef={editorRef} />
            </div>

            <div className="hidden md:block">
              <DraggableDivider onResize={handleResize} />
            </div>
          </>
        )}

        <div
          style={{ '--panel-width': isEditorVisible ? `${100 - leftFlexBasis}%` : '100%' } as PanelStyle}
          className={`${mobileView === 'preview' || !isEditorVisible ? 'flex' : 'hidden'} md:flex flex-col min-h-0 responsive-preview-pane`}
        >
          <ScrollSync editorRef={editorRef}>
            {(previewRef) => (
              <div
                ref={previewRef}
                className="flex-1 min-h-0 overflow-y-auto bg-white"
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
