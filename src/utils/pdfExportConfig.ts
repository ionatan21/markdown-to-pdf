export function getPdfExportConfig(
  htmlElement: HTMLElement,
  filename: string
): Record<string, unknown> {
  return {
    margin: [15, 15, 15, 15],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      letterRendering: true,
      scrollY: 0,
      scrollX: 0,
      windowHeight: htmlElement.scrollHeight,
      allowTaint: true,
      foreignObjectRendering: false,
      removeContainer: true,
      backgroundColor: '#ffffff',
      imageTimeout: 0,
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      compress: true,
    },
    pagebreak: {
      mode: ['css', 'legacy'] as const,
      avoid: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'tr', 'figure', '.mermaid-diagram'],
      before: undefined,
      after: undefined,
    },
  };
}

export function generatePdfFilename(): string {
  const timestamp = new Date().toISOString().split('T')[0];
  return `markdown-export-${timestamp}.pdf`;
}
