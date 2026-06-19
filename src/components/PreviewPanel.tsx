import type { FC, ReactNode } from 'react';
import { Children, isValidElement, useCallback, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import PreviewToolbar from './PreviewToolbar';
import CodeBlock from './CodeBlock';
import MermaidDiagram from './MermaidDiagram';
import { DEFAULT_PREVIEW_THEME } from '../types/previewTheme';

interface PreviewPanelProps {
  markdown: string;
  contentRef?: React.RefObject<HTMLDivElement | null>;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}

interface MarkdownRendererProps {
  children?: ReactNode;
  className?: string;
  href?: string;
  height?: number | string;
  src?: string;
  alt?: string;
  title?: string;
  width?: number | string;
}

const isMermaidDiagramElement = (children: ReactNode) => {
  const childArray = Children.toArray(children);

  return childArray.length === 1
    && isValidElement(childArray[0])
    && childArray[0].type === MermaidDiagram;
};

const getMermaidChartFromPre = (children: ReactNode): string | null => {
  const childArray = Children.toArray(children);

  if (childArray.length !== 1 || !isValidElement<{ className?: string; children?: ReactNode }>(childArray[0])) {
    return null;
  }

  const codeElement = childArray[0];
  const className = codeElement.props.className || '';
  const languageMatch = /language-(\w+)/.exec(className);
  const language = languageMatch?.[1]?.toLowerCase();

  if (language !== 'mermaid') {
    return null;
  }

  return String(codeElement.props.children).replace(/\n$/, '');
};

const PreviewPanel: FC<PreviewPanelProps> = ({
  markdown,
  contentRef,
  scrollContainerRef,
}) => {
  const [theme, setTheme] = useState(DEFAULT_PREVIEW_THEME);
  const [isToolbarExpanded, setIsToolbarExpanded] = useState(true);
  const isToolbarManuallyCollapsedRef = useRef(false);
  const isToolbarManuallyExpandedRef = useRef(false);

  const { fontFamily, fontSize, colors } = theme;
  const textAlignStyles = useMemo(() => ({
    textAlign: theme.textAlign,
  }), [theme.textAlign]);

  // Base typography styles that will be applied to all text elements
  const baseTextStyles = useMemo(() => ({
    fontFamily,
    fontSize: `${fontSize}px`,
    color: colors.body,
  }), [colors.body, fontFamily, fontSize]);

  const headingTextStyles = useMemo(() => ({
    ...baseTextStyles,
    color: colors.heading,
  }), [baseTextStyles, colors.heading]);

  const tableTextStyles = useMemo(() => ({
    ...baseTextStyles,
    color: colors.table,
  }), [baseTextStyles, colors.table]);

  const handlePreviewScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = event.currentTarget.scrollTop;

    if (isToolbarManuallyExpandedRef.current) {
      return;
    }

    if (scrollTop > 96) {
      setIsToolbarExpanded(false);
    } else if (scrollTop < 8 && !isToolbarManuallyCollapsedRef.current) {
      setIsToolbarExpanded(true);
    }
  };

  const handlePreviewWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    if (isToolbarManuallyExpandedRef.current) {
      return;
    }

    if (event.deltaY > 0) {
      setIsToolbarExpanded(false);
    }
  };

  const handleToolbarExpandedChange = (nextIsExpanded: boolean) => {
    isToolbarManuallyCollapsedRef.current = !nextIsExpanded;
    isToolbarManuallyExpandedRef.current = nextIsExpanded;
    setIsToolbarExpanded(nextIsExpanded);
  };

  // Scale factors for different heading levels
  const getHeadingSize = useCallback((level: number) => {
    const scales = { 1: 2.5, 2: 2, 3: 1.5, 4: 1.25, 5: 1.125, 6: 1 };
    return `${fontSize * scales[level as keyof typeof scales]}px`;
  }, [fontSize]);

  const markdownComponents = useMemo(() => ({
    h1: ({ children }: MarkdownRendererProps) => (
      <h1
        className="font-bold mt-8 mb-4"
        style={{
          ...headingTextStyles,
          ...textAlignStyles,
          fontSize: getHeadingSize(1),
          fontWeight: 'bold',
          marginTop: `${fontSize * 2}px`,
          marginBottom: `${fontSize}px`,
        }}
      >
        {children}
      </h1>
    ),
    h2: ({ children }: MarkdownRendererProps) => (
      <h2
        className="font-bold mt-6 mb-3"
        style={{
          ...headingTextStyles,
          ...textAlignStyles,
          fontSize: getHeadingSize(2),
          fontWeight: 'bold',
          marginTop: `${fontSize * 1.5}px`,
          marginBottom: `${fontSize * 0.75}px`,
        }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }: MarkdownRendererProps) => (
      <h3
        className="font-bold mt-5 mb-2"
        style={{
          ...headingTextStyles,
          ...textAlignStyles,
          fontSize: getHeadingSize(3),
          fontWeight: 'bold',
          marginTop: `${fontSize * 1.25}px`,
          marginBottom: `${fontSize * 0.5}px`,
        }}
      >
        {children}
      </h3>
    ),
    h4: ({ children }: MarkdownRendererProps) => (
      <h4
        className="font-bold mt-4 mb-2"
        style={{
          ...headingTextStyles,
          ...textAlignStyles,
          fontSize: getHeadingSize(4),
          fontWeight: 'bold',
          marginTop: `${fontSize}px`,
          marginBottom: `${fontSize * 0.5}px`,
        }}
      >
        {children}
      </h4>
    ),
    h5: ({ children }: MarkdownRendererProps) => (
      <h5
        className="font-bold mt-3 mb-1"
        style={{
          ...headingTextStyles,
          ...textAlignStyles,
          fontSize: getHeadingSize(5),
          fontWeight: 'bold',
          marginTop: `${fontSize * 0.75}px`,
          marginBottom: `${fontSize * 0.25}px`,
        }}
      >
        {children}
      </h5>
    ),
    h6: ({ children }: MarkdownRendererProps) => (
      <h6
        className="font-bold mt-3 mb-1"
        style={{
          ...headingTextStyles,
          ...textAlignStyles,
          fontSize: getHeadingSize(6),
          fontWeight: 'bold',
          marginTop: `${fontSize * 0.75}px`,
          marginBottom: `${fontSize * 0.25}px`,
        }}
      >
        {children}
      </h6>
    ),
    p: ({ children }: MarkdownRendererProps) => (
      <p
        className="leading-relaxed"
        style={{
          ...baseTextStyles,
          ...textAlignStyles,
          lineHeight: 1.75,
          marginTop: `${fontSize * 0.75}px`,
          marginBottom: `${fontSize * 0.75}px`,
        }}
      >
        {children}
      </p>
    ),
    a: ({ href, children }: MarkdownRendererProps) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline"
        style={{ fontFamily, fontSize: `${fontSize}px` }}
      >
        {children}
      </a>
    ),
    strong: ({ children }: MarkdownRendererProps) => (
      <strong
        className="font-bold"
        style={{ ...baseTextStyles, fontWeight: 'bold' }}
      >
        {children}
      </strong>
    ),
    em: ({ children }: MarkdownRendererProps) => (
      <em
        className="italic"
        style={{ ...baseTextStyles, fontStyle: 'italic' }}
      >
        {children}
      </em>
    ),
    code: ({ children, className }: MarkdownRendererProps) => {
      const isCodeBlock = className?.startsWith('language-');

      if (isCodeBlock) {
        return (
          <CodeBlock
            className={className}
            fontSize={fontSize}
          >
            {String(children)}
          </CodeBlock>
        );
      }

      return (
        <code
          className={`${className || ''} font-mono bg-gray-100 text-red-600 rounded border border-gray-200`.trim()}
          style={{
            fontFamily: '"JetBrains Mono", "Fira Code", monospace',
            fontSize: `${fontSize * 0.875}px`,
            padding: `${fontSize * 0.09375}px ${fontSize * 0.15625}px`,
          }}
        >
          {children}
        </code>
      );
    },
    pre: ({ children }: MarkdownRendererProps) => {
      const mermaidChart = getMermaidChartFromPre(children);

      if (mermaidChart) {
        return (
          <MermaidDiagram
            chart={mermaidChart}
            fontSize={fontSize}
          />
        );
      }

      if (isMermaidDiagramElement(children)) {
        return <>{children}</>;
      }

      return (
        <pre
          className="bg-gray-900 text-gray-100 rounded-lg overflow-x-auto border border-gray-700"
          style={{
            padding: `${fontSize}px`,
            marginTop: `${fontSize}px`,
            marginBottom: `${fontSize}px`,
          }}
        >
          {children}
        </pre>
      );
    },
    blockquote: ({ children }: MarkdownRendererProps) => (
      <blockquote
        className="border-l-4 border-blue-500 italic"
        style={{
          ...baseTextStyles,
          ...textAlignStyles,
          paddingLeft: `${fontSize}px`,
          marginTop: `${fontSize}px`,
          marginBottom: `${fontSize}px`,
          paddingTop: `${fontSize * 0.25}px`,
          paddingBottom: `${fontSize * 0.25}px`,
          opacity: 0.8,
        }}
      >
        {children}
      </blockquote>
    ),
    ul: ({ children }: MarkdownRendererProps) => (
      <ul
        className="list-disc list-inside"
        style={{
          ...baseTextStyles,
          ...textAlignStyles,
          marginTop: `${fontSize * 0.75}px`,
          marginBottom: `${fontSize * 0.75}px`,
          marginLeft: `${fontSize * 1.5}px`,
        }}
      >
        {children}
      </ul>
    ),
    ol: ({ children }: MarkdownRendererProps) => (
      <ol
        className="list-decimal list-inside"
        style={{
          ...baseTextStyles,
          ...textAlignStyles,
          marginTop: `${fontSize * 0.75}px`,
          marginBottom: `${fontSize * 0.75}px`,
          marginLeft: `${fontSize * 1.5}px`,
        }}
      >
        {children}
      </ol>
    ),
    li: ({ children }: MarkdownRendererProps) => (
      <li
        className="leading-relaxed"
        style={{
          ...baseTextStyles,
          ...textAlignStyles,
          marginBottom: `${fontSize * 0.5}px`,
          lineHeight: 1.75,
        }}
      >
        {children}
      </li>
    ),
    table: ({ children }: MarkdownRendererProps) => (
      <table
        className="w-full border-collapse border border-gray-300"
        style={{
          color: colors.table,
          ...textAlignStyles,
          marginTop: `${fontSize}px`,
          marginBottom: `${fontSize}px`,
        }}
      >
        {children}
      </table>
    ),
    thead: ({ children }: MarkdownRendererProps) => <thead>{children}</thead>,
    tbody: ({ children }: MarkdownRendererProps) => <tbody>{children}</tbody>,
    tr: ({ children }: MarkdownRendererProps) => <tr>{children}</tr>,
    th: ({ children }: MarkdownRendererProps) => (
      <th
        className="bg-gray-200 text-left font-semibold border border-gray-300"
        style={{
          ...tableTextStyles,
          ...textAlignStyles,
          fontWeight: '600',
          padding: `${fontSize * 0.5}px ${fontSize}px`,
        }}
      >
        {children}
      </th>
    ),
    td: ({ children }: MarkdownRendererProps) => (
      <td
        className="border border-gray-300"
        style={{
          ...tableTextStyles,
          ...textAlignStyles,
          padding: `${fontSize * 0.5}px ${fontSize}px`,
        }}
      >
        {children}
      </td>
    ),
    hr: () => (
      <hr
        className="border-none border-t-2 border-gray-300"
        style={{
          marginTop: `${fontSize * 1.5}px`,
          marginBottom: `${fontSize * 1.5}px`,
        }}
      />
    ),
    img: ({ src, alt, className, title, width, height }: MarkdownRendererProps) => (
      <img
        src={src}
        alt={alt}
        title={title}
        width={width}
        height={height}
        className={`preview-image ${className || ''}`.trim()}
        style={{
          marginTop: `${fontSize}px`,
          marginBottom: `${fontSize}px`,
        }}
      />
    ),
  }), [
    baseTextStyles,
    colors.table,
    fontFamily,
    fontSize,
    getHeadingSize,
    headingTextStyles,
    tableTextStyles,
    textAlignStyles,
  ]);

  return (
    <div className="w-full h-full min-h-0 flex flex-col overflow-hidden bg-white">
      <PreviewToolbar
        theme={theme}
        isExpanded={isToolbarExpanded}
        onThemeChange={setTheme}
        onExpandedChange={handleToolbarExpandedChange}
      />

      {/* Scrollable content section */}
      <div
        ref={scrollContainerRef}
        onScroll={handlePreviewScroll}
        onWheel={handlePreviewWheel}
        className="w-full min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-12 py-6 md:py-12">
          <div className="preview-content" ref={contentRef}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={markdownComponents}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
