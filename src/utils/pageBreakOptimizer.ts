/**
 * Detecta y repara elementos que están siendo cortados
 * en los límites de página para evitar cajas negras
 */

const PAGE_HEIGHT_MM = 277; // A4 height - margins
const PIXELS_PER_MM = 3.78; // Conversión estándar

export function detectAndFixPageBreakIssues(
  container: HTMLElement
): void {
  const pageHeightPx = PAGE_HEIGHT_MM * PIXELS_PER_MM;

  // Encontrar todos los elementos que podrían ser problemáticos
  const allElements = container.querySelectorAll('p, div, blockquote, ul, ol, li');

  allElements.forEach((el) => {
    const element = el as HTMLElement;
    const rect = element.getBoundingClientRect();
    const relativeTop = rect.top - container.getBoundingClientRect().top;

    // Si el elemento se acerca al final de una página
    const pageOffset = relativeTop % pageHeightPx;
    const spaceLeftInPage = pageHeightPx - pageOffset;

    // Si el elemento ocupa más del 80% del espacio disponible,
    // pero no cabe completamente, moverlo a la siguiente página
    if (
      spaceLeftInPage > 0 &&
      rect.height > spaceLeftInPage * 0.8 &&
      rect.height < spaceLeftInPage
    ) {
      element.style.pageBreakBefore = 'always';
      element.style.breakBefore = 'page';
    }

    // Asegurar que los elementos próximos a los límites tengan espacios adecuados
    if (spaceLeftInPage < rect.height * 0.3) {
      element.style.pageBreakBefore = 'always';
      element.style.breakBefore = 'page';
    }
  });

  // Asegurar que los blockquote y otros contenedores no tengan overflow oculto
  const containers = container.querySelectorAll('blockquote, table, pre');
  containers.forEach((el) => {
    const element = el as HTMLElement;
    const computedStyle = window.getComputedStyle(element);

    if (computedStyle.overflow === 'hidden') {
      element.style.overflow = 'visible';
    }

    // Prevenir que se peguen al borde de la página
    element.style.minHeight = 'auto';
  });
}

export function cleanupPageBreakFixes(container: HTMLElement): void {
  const allElements = container.querySelectorAll('*');

  allElements.forEach((el) => {
    const element = el as HTMLElement;
    element.style.pageBreakBefore = '';
    element.style.breakBefore = '';
    element.style.overflow = '';
    element.style.minHeight = '';
  });
}
