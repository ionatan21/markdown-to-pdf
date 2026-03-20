import type { FC, ReactNode } from 'react';
import { useRef } from 'react';
import { useScrollSync } from '../hooks/useScrollSync';

interface ScrollSyncProps {
  editorRef: React.MutableRefObject<any>;
  children: (previewRef: React.MutableRefObject<HTMLDivElement | null>) => ReactNode;
}

const ScrollSync: FC<ScrollSyncProps> = ({ editorRef, children }) => {
  const previewRef = useRef<HTMLDivElement>(null);

  useScrollSync({ editorRef, previewRef });

  return <>{children(previewRef)}</>;
};

export default ScrollSync;
