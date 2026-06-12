/**
 * Sanitiza el HTML antes de exportar a PDF
 * Remueve estilos complejos que causan problemas de renderizado
 */



const A4_PRINTABLE_WIDTH_PX = 680; // 180mm at 96dpi, matching A4 with 15mm side margins.
const A4_PRINTABLE_HEIGHT_PX = 1009; // 267mm at 96dpi, matching A4 with 15mm top/bottom margins.
const HEADING_KEEP_WITH_NEXT_PX = 150;
const MAX_BLOCK_TO_KEEP_TOGETHER_PX = 260;
const PAGE_BREAK_SPACER_CLASS = 'pdf-page-break-spacer';

/**
 * Crea un clon HTML simplificado con mejor manejo de page breaks
 */
export function createSimplifiedCloneForPdf(container: HTMLElement): HTMLElement {
  const clone = document.createElement('div');
  clone.style.cssText = `
    width: ${A4_PRINTABLE_WIDTH_PX}px;
    max-width: ${A4_PRINTABLE_WIDTH_PX}px;
    padding: 20px;
    box-sizing: border-box;
    overflow: visible;
    background-color: white;
    color: #111827;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    overflow-wrap: anywhere;
    word-break: normal;
  `;

  // Copiar contenido recursivamente con estilos simplificados
  const copyWithSimplifiedStyles = (source: Element, target: Element) => {
    source.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        target.appendChild(node.cloneNode(true));
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const sourceEl = node as Element;
        const targetEl = document.createElement(sourceEl.tagName);

        // Copiar solo atributos críticos
        if (sourceEl.hasAttribute('id')) {
          targetEl.setAttribute('id', sourceEl.getAttribute('id') || '');
        }

        // Aplicar estilos base según el tipo de elemento
        const tagName = sourceEl.tagName.toLowerCase();

        if (tagName === 'pre') {
          // Incrementar espacio disponible para page breaks
          targetEl.style.cssText = `
            background-color: #f3f4f6;
            color: #1f2937;
            padding: 12px;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            overflow: visible;
            margin: 16px 0;
            font-family: 'JetBrains Mono', 'Fira Code', monospace;
            font-size: 13px;
            line-height: 1.5;
            break-inside: auto;
            page-break-inside: auto;
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow-wrap: break-word;
          `;
        } else if (tagName === 'code' && sourceEl.parentElement?.tagName.toLowerCase() === 'pre') {
          targetEl.style.cssText = `
            background: transparent;
            color: inherit;
            padding: 0;
            border: none;
            white-space: inherit;
            font-family: inherit;
          `;
        } else if (tagName === 'code') {
          targetEl.style.cssText = `
            background-color: #f3f4f6;
            color: #dc2626;
            padding: 2px 4px;
            border-radius: 2px;
            font-size: 13px;
            font-family: 'JetBrains Mono', monospace;
            white-space: normal;
            overflow-wrap: anywhere;
          `;
        } else if (tagName === 'h1') {
          targetEl.style.cssText = `
            font-size: 28px;
            font-weight: bold;
            margin: 24px 0 12px 0;
            page-break-after: avoid;
            break-after: avoid;
          `;
        } else if (tagName === 'h2') {
          targetEl.style.cssText = `
            font-size: 24px;
            font-weight: bold;
            margin: 18px 0 9px 0;
            page-break-after: avoid;
            break-after: avoid;
          `;
        } else if (tagName === 'h3') {
          targetEl.style.cssText = `
            font-size: 20px;
            font-weight: bold;
            margin: 15px 0 6px 0;
            page-break-after: avoid;
            break-after: avoid;
          `;
        } else if (['h4', 'h5', 'h6'].includes(tagName)) {
          targetEl.style.cssText = `
            font-weight: bold;
            margin: 12px 0 6px 0;
            page-break-after: avoid;
            break-after: avoid;
          `;
        } else if (tagName === 'p') {
          targetEl.style.cssText = `
            margin: 9px 0;
            line-height: 1.75;
            page-break-inside: auto;
            break-inside: auto;
            white-space: normal;
            overflow-wrap: anywhere;
          `;
        } else if (tagName === 'blockquote') {
          targetEl.style.cssText = `
            border-left: 4px solid #3b82f6;
            padding-left: 12px;
            margin: 12px 0;
            width: 100%;
            box-sizing: border-box;
            color: #6b7280;
            font-style: italic;
            page-break-inside: auto;
            break-inside: auto;
            overflow: visible;
            overflow-wrap: anywhere;
          `;
        } else if (tagName === 'ul' || tagName === 'ol') {
          targetEl.style.cssText = `
            margin: 9px 0 9px 32px;
            page-break-inside: auto;
            break-inside: auto;
          `;
        } else if (tagName === 'li') {
          targetEl.style.cssText = `
            margin: 6px 0;
            line-height: 1.75;
            page-break-inside: auto;
            break-inside: auto;
          `;
        } else if (tagName === 'table') {
          targetEl.style.cssText = `
            border-collapse: collapse;
            margin: 12px 0;
            width: 100%;
            page-break-inside: avoid;
            break-inside: avoid;
          `;
        } else if (tagName === 'tr') {
          targetEl.style.cssText = `
            border-bottom: 1px solid #e5e7eb;
            page-break-inside: avoid;
            break-inside: avoid;
          `;
        } else if (tagName === 'th') {
          targetEl.style.cssText = `
            background-color: #f3f4f6;
            padding: 8px 12px;
            text-align: left;
            font-weight: 600;
            border: 1px solid #e5e7eb;
          `;
        } else if (tagName === 'td') {
          targetEl.style.cssText = `
            padding: 8px 12px;
            border: 1px solid #e5e7eb;
          `;
        } else if (tagName === 'hr') {
          targetEl.style.cssText = `
            border: none;
            border-top: 2px solid #e5e7eb;
            margin: 18px 0;
          `;
        }

        const targetHtmlElement = targetEl as HTMLElement;
        targetHtmlElement.style.maxWidth = '100%';
        targetHtmlElement.style.boxSizing = 'border-box';
        targetHtmlElement.style.overflowWrap = 'anywhere';

        copyWithSimplifiedStyles(sourceEl, targetEl);
        target.appendChild(targetEl);
      }
    });
  };

  copyWithSimplifiedStyles(container, clone);

  return clone;
}

export function addSmartPageBreaks(container: HTMLElement): void {
  const maxPasses = 6;

  removePageBreakSpacers(container);

  for (let pass = 0; pass < maxPasses; pass += 1) {
    const changed = keepHeadingsWithFollowingContent(container)
      || keepShortBlocksInsidePage(container);

    if (!changed) {
      break;
    }
  }
}

function keepHeadingsWithFollowingContent(container: HTMLElement): boolean {
  const headings = Array.from(container.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  const containerTop = container.getBoundingClientRect().top;
  let changed = false;

  headings.forEach((heading) => {
    const headingElement = heading as HTMLElement;
    const headingTop = headingElement.getBoundingClientRect().top - containerTop;
    const pageOffset = positiveModulo(headingTop, A4_PRINTABLE_HEIGHT_PX);
    const spaceLeft = A4_PRINTABLE_HEIGHT_PX - pageOffset;
    const requiredSpace = getRequiredSpaceAfterHeading(headingElement);

    if (spaceLeft < requiredSpace && headingElement.style.pageBreakBefore !== 'always') {
      insertPageBreakSpacerBefore(headingElement, spaceLeft);
      changed = true;
    }
  });

  return changed;
}

function getRequiredSpaceAfterHeading(heading: HTMLElement): number {
  const headingLevel = Number(heading.tagName.slice(1));
  const followingContentHeight = getFollowingContentHeight(heading);
  const minimumSpace = headingLevel <= 2
    ? HEADING_KEEP_WITH_NEXT_PX
    : HEADING_KEEP_WITH_NEXT_PX * 0.8;

  return Math.max(heading.offsetHeight + followingContentHeight + 24, minimumSpace);
}

function getFollowingContentHeight(heading: HTMLElement): number {
  const nextElement = heading.nextElementSibling as HTMLElement | null;

  if (!nextElement || /^h[1-6]$/i.test(nextElement.tagName)) {
    return 0;
  }

  return Math.min(nextElement.offsetHeight, 90);
}

function keepShortBlocksInsidePage(container: HTMLElement): boolean {
  const blocks = Array.from(container.querySelectorAll('p, li, blockquote, pre, table'));
  const containerTop = container.getBoundingClientRect().top;
  let changed = false;

  blocks.forEach((block) => {
    const element = block as HTMLElement;

    if (element.closest(`.${PAGE_BREAK_SPACER_CLASS}`)) {
      return;
    }

    const height = element.offsetHeight;

    if (height <= 0 || height > MAX_BLOCK_TO_KEEP_TOGETHER_PX) {
      return;
    }

    const top = element.getBoundingClientRect().top - containerTop;
    const pageOffset = positiveModulo(top, A4_PRINTABLE_HEIGHT_PX);
    const bottomOffset = pageOffset + height;
    const isAlreadyNearTop = pageOffset < 24;

    if (!isAlreadyNearTop && bottomOffset > A4_PRINTABLE_HEIGHT_PX) {
      const spaceLeft = A4_PRINTABLE_HEIGHT_PX - pageOffset;
      insertPageBreakSpacerBefore(element, spaceLeft);
      changed = true;
    }
  });

  return changed;
}

function insertPageBreakSpacerBefore(element: HTMLElement, spaceLeft: number): void {
  const spacer = document.createElement('div');
  spacer.className = PAGE_BREAK_SPACER_CLASS;
  spacer.style.cssText = `
    display: block;
    height: ${Math.max(Math.ceil(spaceLeft) + 2, 0)}px;
    margin: 0;
    padding: 0;
    border: 0;
    line-height: 0;
  `;

  element.parentElement?.insertBefore(spacer, element);
}

function removePageBreakSpacers(container: HTMLElement): void {
  container.querySelectorAll(`.${PAGE_BREAK_SPACER_CLASS}`).forEach((spacer) => {
    spacer.remove();
  });
}

function positiveModulo(value: number, divisor: number): number {
  return ((value % divisor) + divisor) % divisor;
}
