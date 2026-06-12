import type { CodeBlockState } from '../types/pdfExport';

const LARGE_BLOCK_THRESHOLD = 25;
const TRUNCATE_AT_LINES = 20;

export function preprocessLargeCodeBlocks(
  container: HTMLElement
): CodeBlockState[] {
  const codeBlocks = container.querySelectorAll('pre');
  const originalBlocks: CodeBlockState[] = [];

  console.log(`🔄 Preprocessing ${codeBlocks.length} code blocks...`);

  codeBlocks.forEach((preElement, index) => {
    const codeContent = preElement.textContent || '';
    const lines = codeContent.split('\n');
    const totalLines = lines.length;

    console.log(`📦 Block ${index + 1}: ${totalLines} lines, ${codeContent.length} chars`);

    if (totalLines > LARGE_BLOCK_THRESHOLD) {
      console.log(`   🔧 MODIFYING large block (${totalLines} lines)`);

      originalBlocks.push({
        element: preElement,
        originalContent: codeContent,
        originalStyles: {
          marginBottom: preElement.style.marginBottom,
          paddingBottom: preElement.style.paddingBottom,
        },
      });

      const truncatedLines = lines.slice(0, TRUNCATE_AT_LINES);
      const remainingLines = totalLines - TRUNCATE_AT_LINES;

      truncatedLines.push('', `// ... ${remainingLines} more lines (truncated for PDF)`);

      preElement.textContent = truncatedLines.join('\n');

      preElement.style.marginBottom = '1rem';
      preElement.style.borderBottom = '2px solid #374151';
      preElement.dataset.truncated = 'true';
      preElement.dataset.originalLines = totalLines.toString();

      console.log(`   ✅ Truncated to ${TRUNCATE_AT_LINES} lines (${totalLines} → ${TRUNCATE_AT_LINES + 2} with indicator)`);
    } else {
      console.log(`   ✅ Block size OK (${totalLines} lines) - no modification needed`);
    }
  });

  console.log(`📋 Preprocessing complete. ${originalBlocks.length} blocks were modified.`);
  return originalBlocks;
}

export function restoreOriginalCodeBlocks(
  originalBlocks: CodeBlockState[]
): void {
  console.log(`🔄 Restoring ${originalBlocks.length} original code blocks...`);

  originalBlocks.forEach(({ element, originalContent, originalStyles }, index) => {
    element.textContent = originalContent;

    element.style.marginBottom = originalStyles.marginBottom || '';
    element.style.borderBottom = '';

    delete element.dataset.truncated;
    delete element.dataset.originalLines;

    console.log(`   ✅ Restored block ${index + 1}`);
  });

  console.log('🎯 All original blocks restored successfully');
}

export async function forceContentReflow(container: HTMLElement): Promise<void> {
  console.log('🔄 Forcing content reflow...');

  const codeBlocks = container.querySelectorAll('pre');
  codeBlocks.forEach((pre, index) => {
    const content = pre.textContent || '';
    const isTruncated = pre.dataset.truncated === 'true';
    const originalLines = pre.dataset.originalLines;
    const truncatedInfo = isTruncated ? ` (truncated from ${originalLines} lines)` : '';
    console.log(`   Block ${index + 1}${truncatedInfo}: ${content.length > 0 ? 'OK' : 'EMPTY'} (${content.length} chars)`);

    pre.style.opacity = '0.999999';
    void pre.offsetHeight;
    pre.style.opacity = '';
  });

  console.log('✅ Content reflow complete');
}
