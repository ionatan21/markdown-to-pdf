import { useEffect, useId, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
  fontSize: number;
}

let isMermaidInitialized = false;

const sanitizeMermaidId = (id: string) => id.replace(/[^a-zA-Z0-9_-]/g, '');

function withMermaidRenderConfig(chart: string): string {
  const trimmedChart = chart.trimStart();

  if (trimmedChart.startsWith('%%{init:')) {
    return chart;
  }

  return `%%{init: {"flowchart": {"htmlLabels": false}, "themeVariables": {"fontFamily": "Arial, Helvetica, sans-serif"}} }%%\n${chart}`;
}

function normalizeMermaidSvg(svg: string): string {
  const parser = new DOMParser();
  const document = parser.parseFromString(svg, 'image/svg+xml');
  const svgElement = document.querySelector('svg');
  const viewBox = svgElement?.getAttribute('viewBox');

  if (!svgElement || !viewBox) {
    return svg;
  }

  const [, , width, height] = viewBox.split(/\s+/).map(Number);

  if (Number.isFinite(width) && Number.isFinite(height)) {
    svgElement.setAttribute('width', `${Math.ceil(width)}`);
    svgElement.setAttribute('height', `${Math.ceil(height)}`);
  }

  svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

  return new XMLSerializer().serializeToString(svgElement);
}

export default function MermaidDiagram({ chart, fontSize }: MermaidDiagramProps) {
  const reactId = useId();
  const [svg, setSvg] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCurrent = true;

    async function renderDiagram() {
      try {
        const mermaid = (await import('mermaid')).default;

        if (!isMermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'strict',
            theme: 'default',
            flowchart: {
              htmlLabels: false,
            },
            themeVariables: {
              fontFamily: 'Arial, Helvetica, sans-serif',
            },
          });
          isMermaidInitialized = true;
        }

        const diagramId = `mermaid-${sanitizeMermaidId(reactId)}-${Date.now()}`;
        const { svg: renderedSvg } = await mermaid.render(diagramId, withMermaidRenderConfig(chart));

        if (isCurrent) {
          setSvg(normalizeMermaidSvg(renderedSvg));
          setError(null);
        }
      } catch (renderError) {
        if (isCurrent) {
          setSvg('');
          setError(renderError instanceof Error ? renderError.message : 'Invalid Mermaid diagram');
        }
      }
    }

    renderDiagram();

    return () => {
      isCurrent = false;
    };
  }, [chart, reactId]);

  if (error) {
    return (
      <figure
        className="mermaid-diagram mermaid-diagram-error"
        data-mermaid-status="error"
        style={{
          marginTop: `${fontSize}px`,
          marginBottom: `${fontSize}px`,
        }}
      >
        <figcaption>Unable to render Mermaid diagram</figcaption>
        <pre>{chart}</pre>
      </figure>
    );
  }

  return (
    <figure
      className="mermaid-diagram"
      data-mermaid-status={svg ? 'rendered' : 'loading'}
      style={{
        marginTop: `${fontSize}px`,
        marginBottom: `${fontSize}px`,
      }}
      dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
      aria-label="Mermaid diagram"
    />
  );
}
