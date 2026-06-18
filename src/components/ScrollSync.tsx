import type { FC, ReactNode } from 'react';
import type { editor } from 'monaco-editor';
import { useRef } from 'react';
import { useScrollSync } from '../hooks/useScrollSync';

interface ScrollSyncProps {
  editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
  syncKey?: number;
  children: (previewRef: React.MutableRefObject<HTMLDivElement | null>) => ReactNode;
}

const ScrollSync: FC<ScrollSyncProps> = ({ editorRef, syncKey, children }) => {
  const previewRef = useRef<HTMLDivElement>(null);

  useScrollSync({ editorRef, previewRef, syncKey });

  return <>{children(previewRef)}</>;
};

export default ScrollSync;
