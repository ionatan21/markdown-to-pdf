import { useEffect, useRef, useCallback } from 'react';
import type { editor } from 'monaco-editor';

interface ScrollSync {
  editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
  previewRef: React.MutableRefObject<HTMLDivElement | null>;
  syncKey?: number;
}

const clampPercentage = (value: number) => Math.max(0, Math.min(1, value));

export const useScrollSync = ({ editorRef, previewRef, syncKey }: ScrollSync) => {
  const syncingRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  const syncPreviewScroll = useCallback(() => {
    if (syncingRef.current) return;
    if (!editorRef.current || !previewRef.current) return;

    try {
      const editor = editorRef.current;
      const preview = previewRef.current;
      const editorScrollTop = editor.getScrollTop();
      const editorScrollHeight = editor.getScrollHeight() - editor.getLayoutInfo().height;

      if (editorScrollHeight <= 0) return;

      const scrollPercentage = clampPercentage(editorScrollTop / editorScrollHeight);
      const previewScrollHeight = preview.scrollHeight - preview.clientHeight;
      const previewScrollTop = scrollPercentage * previewScrollHeight;

      syncingRef.current = true;
      preview.scrollTop = previewScrollTop;

      requestAnimationFrame(() => {
        syncingRef.current = false;
      });
    } catch (error) {
      console.warn('Error syncing preview scroll:', error);
      syncingRef.current = false;
    }
  }, [editorRef, previewRef]);

  const syncEditorScroll = useCallback(() => {
    if (syncingRef.current) return;
    if (!editorRef.current || !previewRef.current) return;

    try {
      const editor = editorRef.current;
      const preview = previewRef.current;
      const previewScrollTop = preview.scrollTop;
      const previewScrollHeight = preview.scrollHeight - preview.clientHeight;

      if (previewScrollHeight <= 0) return;

      const scrollPercentage = clampPercentage(previewScrollTop / previewScrollHeight);
      const editorScrollHeight = editor.getScrollHeight() - editor.getLayoutInfo().height;

      if (editorScrollHeight <= 0) return;

      const editorScrollTop = scrollPercentage * editorScrollHeight;

      syncingRef.current = true;
      editor.setScrollTop(editorScrollTop);

      requestAnimationFrame(() => {
        syncingRef.current = false;
      });
    } catch (error) {
      console.warn('Error syncing editor scroll:', error);
      syncingRef.current = false;
    }
  }, [editorRef, previewRef]);

  const scheduleSync = useCallback((sync: () => void) => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      animationFrameRef.current = null;
      sync();
    });
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    const preview = previewRef.current;

    if (!editor || !preview) return;

    const editorScrollListener = editor.onDidScrollChange(() => {
      if (syncingRef.current) return;
      scheduleSync(syncPreviewScroll);
    });

    const handlePreviewScroll = () => {
      if (syncingRef.current) return;
      scheduleSync(syncEditorScroll);
    };

    preview.addEventListener('scroll', handlePreviewScroll, { passive: true });

    return () => {
      editorScrollListener?.dispose();
      preview.removeEventListener('scroll', handlePreviewScroll);
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [editorRef, previewRef, scheduleSync, syncEditorScroll, syncKey, syncPreviewScroll]);
};
