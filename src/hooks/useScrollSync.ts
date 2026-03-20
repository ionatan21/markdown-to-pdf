import { useEffect, useRef, useCallback } from 'react';
import type { editor } from 'monaco-editor';

type Timer = ReturnType<typeof setTimeout>;

interface ScrollSync {
  editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
  previewRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const useScrollSync = ({ editorRef, previewRef }: ScrollSync) => {
  const syncingRef = useRef(false);
  const debounceTimerRef = useRef<Timer | null>(null);
  const lastSyncDirectionRef = useRef<'editor' | 'preview' | null>(null);

  const syncPreviewScroll = useCallback(() => {
    if (syncingRef.current || lastSyncDirectionRef.current === 'preview') return;
    if (!editorRef.current || !previewRef.current) return;

    try {
      const editor = editorRef.current;
      const preview = previewRef.current;

      // Get editor scroll info
      const editorScrollTop = editor.getScrollTop();
      const editorScrollHeight = editor.getScrollHeight() - editor.getLayoutInfo().height;

      if (editorScrollHeight <= 0) return;

      // Calculate scroll percentage
      const scrollPercentage = Math.max(0, Math.min(1, editorScrollTop / editorScrollHeight));

      // Apply to preview
      const previewScrollHeight = preview.scrollHeight - preview.clientHeight;
      const previewScrollTop = scrollPercentage * previewScrollHeight;

      syncingRef.current = true;
      lastSyncDirectionRef.current = 'editor';

      preview.scrollTo({
        top: previewScrollTop,
        behavior: 'instant'
      });

      setTimeout(() => {
        syncingRef.current = false;
        lastSyncDirectionRef.current = null;
      }, 100);
    } catch (error) {
      console.warn('Error syncing preview scroll:', error);
      syncingRef.current = false;
      lastSyncDirectionRef.current = null;
    }
  }, [editorRef, previewRef]);

  const syncEditorScroll = useCallback(() => {
    if (syncingRef.current || lastSyncDirectionRef.current === 'editor') return;
    if (!editorRef.current || !previewRef.current) return;

    try {
      const editor = editorRef.current;
      const preview = previewRef.current;

      // Get preview scroll info
      const previewScrollTop = preview.scrollTop;
      const previewScrollHeight = preview.scrollHeight - preview.clientHeight;

      if (previewScrollHeight <= 0) return;

      // Calculate scroll percentage
      const scrollPercentage = Math.max(0, Math.min(1, previewScrollTop / previewScrollHeight));

      // Apply to editor
      const editorScrollHeight = editor.getScrollHeight() - editor.getLayoutInfo().height;
      const editorScrollTop = scrollPercentage * editorScrollHeight;

      syncingRef.current = true;
      lastSyncDirectionRef.current = 'preview';

      editor.setScrollTop(editorScrollTop);

      setTimeout(() => {
        syncingRef.current = false;
        lastSyncDirectionRef.current = null;
      }, 100);
    } catch (error) {
      console.warn('Error syncing editor scroll:', error);
      syncingRef.current = false;
      lastSyncDirectionRef.current = null;
    }
  }, [editorRef, previewRef]);

  useEffect(() => {
    const editor = editorRef.current;
    const preview = previewRef.current;

    if (!editor || !preview) return;

    // Editor scroll listener with improved debouncing
    const editorScrollListener = editor.onDidScrollChange(() => {
      if (syncingRef.current) return;

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        syncPreviewScroll();
      }, 16); // ~60fps for smoother sync
    });

    // Preview scroll listener with improved debouncing
    const handlePreviewScroll = () => {
      if (syncingRef.current) return;

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        syncEditorScroll();
      }, 16); // ~60fps for smoother sync
    };

    preview.addEventListener('scroll', handlePreviewScroll, { passive: true });

    return () => {
      editorScrollListener?.dispose();
      preview.removeEventListener('scroll', handlePreviewScroll);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [syncPreviewScroll, syncEditorScroll]);
};
