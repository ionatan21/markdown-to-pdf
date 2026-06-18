import { useCallback, useEffect, useRef, useState } from 'react';
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

const PANEL_WIDTH_STORAGE_KEY = 'markdown-preview:left-panel-width';
const DEFAULT_LEFT_PANEL_WIDTH = 50;
const DIVIDER_HALF_WIDTH = '0.25rem';

const getInitialLeftPanelWidth = () => {
  if (typeof window === 'undefined') return DEFAULT_LEFT_PANEL_WIDTH;

  const storedWidth = window.localStorage.getItem(PANEL_WIDTH_STORAGE_KEY);
  const parsedWidth = storedWidth ? Number(storedWidth) : DEFAULT_LEFT_PANEL_WIDTH;

  if (!Number.isFinite(parsedWidth)) return DEFAULT_LEFT_PANEL_WIDTH;

  return Math.max(20, Math.min(80, parsedWidth));
};

function App() {
  const [markdown, setMarkdown] = useState<string>(DEFAULT_MARKDOWN);
  const [leftFlexBasis, setLeftFlexBasis] = useState<number>(getInitialLeftPanelWidth);
  const [isEditorVisible, setIsEditorVisible] = useState<boolean>(true);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [editorReadyKey, setEditorReadyKey] = useState(0);
  const panelsContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const previewContentRef = useRef<HTMLDivElement>(null);

  const { isExporting, handleExport } = usePdfExport({
    markdown,
    previewContentRef,
  });

  const handleResize = useCallback((percentage: number) => {
    setLeftFlexBasis(percentage);
  }, []);

  const handleEditorMount = useCallback(() => {
    setEditorReadyKey((key) => key + 1);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(PANEL_WIDTH_STORAGE_KEY, String(leftFlexBasis));

    const animationFrame = requestAnimationFrame(() => {
      editorRef.current?.layout();
    });

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [leftFlexBasis]);

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

      <div ref={panelsContainerRef} className="flex flex-1 min-h-0 overflow-hidden">
        {isEditorVisible && (
          <>
            <div
              style={{ '--panel-width': `calc(${leftFlexBasis}% - ${DIVIDER_HALF_WIDTH})` } as PanelStyle}
              className={`${mobileView === 'editor' ? 'flex' : 'hidden'} md:flex overflow-hidden responsive-editor-pane`}
            >
              <EditorPanel
                value={markdown}
                onChange={setMarkdown}
                editorRef={editorRef}
                onEditorMount={handleEditorMount}
              />
            </div>

            <div className="hidden md:block">
              <DraggableDivider
                containerRef={panelsContainerRef}
                value={leftFlexBasis}
                onResize={handleResize}
              />
            </div>
          </>
        )}

        <div
          style={{
            '--panel-width': isEditorVisible
              ? `calc(${100 - leftFlexBasis}% - ${DIVIDER_HALF_WIDTH})`
              : '100%',
          } as PanelStyle}
          className={`${mobileView === 'preview' || !isEditorVisible ? 'flex' : 'hidden'} md:flex flex-col min-h-0 responsive-preview-pane`}
        >
          <ScrollSync editorRef={editorRef} syncKey={editorReadyKey}>
            {(previewRef) => (
              <PreviewPanel
                markdown={markdown}
                contentRef={previewContentRef}
                scrollContainerRef={previewRef}
              />
            )}
          </ScrollSync>
        </div>
      </div>
    </div>
  );
}

export default App;
