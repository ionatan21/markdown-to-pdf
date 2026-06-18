import type { FC } from 'react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import FormattingToolbar from './FormattingToolbar';

interface EditorPanelProps {
  value: string;
  onChange: (value: string) => void;
  editorRef?: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
  onEditorMount?: () => void;
}

const EditorPanel: FC<EditorPanelProps> = ({
  value,
  onChange,
  editorRef,
  onEditorMount,
}) => {
  const handleEditorChange = (newValue: string | undefined) => {
    if (newValue !== undefined) {
      onChange(newValue);
    }
  };

  const handleEditorMount = (editor: editor.IStandaloneCodeEditor) => {
    if (editorRef) {
      editorRef.current = editor;
    }
    onEditorMount?.();
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 border-r border-gray-700">
      <FormattingToolbar editorRef={editorRef} />
      <div className="flex-1 overflow-hidden pb-16 sm:pb-0">
        <Editor
          height="100%"
          language="markdown"
          theme="vs-dark"
          value={value}
          onChange={handleEditorChange}
          onMount={handleEditorMount}
          options={{
            minimap: { enabled: false },
            lineNumbers: 'on',
            wordWrap: 'on',
            folding: true,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            fontSize: 14,
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            lineDecorationsWidth: 0,
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorSmoothCaretAnimation: 'on',
            renderWhitespace: 'none',
            bracketPairColorization: {
              enabled: true,
              independentColorPoolPerBracketType: false,
            },
          }}
        />
      </div>
    </div>
  );
};

export default EditorPanel;
