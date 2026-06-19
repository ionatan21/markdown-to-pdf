import { useCallback, useState } from 'react';
import html2pdf from 'html2pdf.js';
import {
  getPdfExportConfig,
  generatePdfFilename,
} from '../utils/pdfExportConfig';
import {
  addSmartPageBreaks,
  createSimplifiedCloneForPdf,
} from '../utils/htmlSanitizer';

interface UsePdfExportOptions {
  markdown: string;
  previewContentRef: React.RefObject<HTMLDivElement | null>;
}

interface UsePdfExportReturn {
  isExporting: boolean;
  handleExport: () => Promise<void>;
}

const MERMAID_RENDER_TIMEOUT_MS = 5000;

function getPendingMermaidDiagrams(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>('.mermaid-diagram[data-mermaid-status="loading"]')
  );
}

function hasRenderedMermaidCodeFallback(container: HTMLElement): boolean {
  return container.querySelectorAll('pre code.language-mermaid').length > 0;
}

async function waitForMermaidDiagrams(container: HTMLElement): Promise<void> {
  if (!container.querySelector('.mermaid-diagram')) {
    return;
  }

  const startedAt = Date.now();

  while (getPendingMermaidDiagrams(container).length > 0) {
    if (Date.now() - startedAt > MERMAID_RENDER_TIMEOUT_MS) {
      throw new Error('Mermaid diagrams are still rendering');
    }

    await new Promise((resolve) => window.setTimeout(resolve, 100));
  }

  if (hasRenderedMermaidCodeFallback(container)) {
    throw new Error('Mermaid code block was not converted before export');
  }
}

export function usePdfExport({
  markdown,
  previewContentRef,
}: UsePdfExportOptions): UsePdfExportReturn {
  const [isExporting, setIsExporting] = useState(false);

  const validateMarkdown = useCallback((): boolean => {
    if (!markdown.trim() || markdown.trim().length < 10) {
      alert('Please add some content before exporting to PDF.');
      return false;
    }
    return true;
  }, [markdown]);

  const validatePreviewReady = useCallback((): boolean => {
    if (!previewContentRef.current) {
      alert('Preview not ready. Please try again.');
      return false;
    }
    return true;
  }, [previewContentRef]);

  const handleExport = useCallback(async (): Promise<void> => {
    if (!validateMarkdown() || !validatePreviewReady()) {
      return;
    }

    try {
      setIsExporting(true);

      const previewContent = previewContentRef.current;
      if (!previewContent) {
        throw new Error('Preview content not found');
      }

      await waitForMermaidDiagrams(previewContent);

      const sanitizedClone = createSimplifiedCloneForPdf(previewContent);
      document.body.appendChild(sanitizedClone);
      addSmartPageBreaks(sanitizedClone);

      try {
        const filename = generatePdfFilename();
        const options = getPdfExportConfig(sanitizedClone, filename);

        await html2pdf().set(options).from(sanitizedClone).save();

        console.log('PDF exported successfully');
      } finally {
        // Remover el clon del DOM
        document.body.removeChild(sanitizedClone);
      }
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  }, [validateMarkdown, validatePreviewReady, previewContentRef]);

  return {
    isExporting,
    handleExport,
  };
}
