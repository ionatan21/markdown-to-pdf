import type { FC, ReactNode } from 'react';
import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PreviewToolbar from './PreviewToolbar';

interface PreviewPanelProps {
  markdown: string;
  contentRef?: React.RefObject<HTMLDivElement | null>;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}

interface MarkdownRendererProps {
  children?: ReactNode;
  href?: string;
  src?: string;
  alt?: string;
}

const PreviewPanel: FC<PreviewPanelProps> = ({
  markdown,
  contentRef,
  scrollContainerRef,
}) => {
  // Typography customization state
  const [fontFamily, setFontFamily] = useState('system-ui, -apple-system, sans-serif');
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState('#111827');
  const [isToolbarVisible, setIsToolbarVisible] = useState(true);

  // Base typography styles that will be applied to all text elements
  const baseTextStyles = {
    fontFamily,
    fontSize: `${fontSize}px`,
    color: textColor,
  };

  // Scale factors for different heading levels
  const getHeadingSize = (level: number) => {
    const scales = { 1: 2.5, 2: 2, 3: 1.5, 4: 1.25, 5: 1.125, 6: 1 };
    return `${fontSize * scales[level as keyof typeof scales]}px`;
  };

  const markdownComponents = {
    h1: ({ children }: MarkdownRendererProps) => (
      <h1
        className="font-bold mt-8 mb-4"
        style={{
          ...baseTextStyles,
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
          ...baseTextStyles,
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
          ...baseTextStyles,
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
          ...baseTextStyles,
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
          ...baseTextStyles,
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
          ...baseTextStyles,
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
    code: ({ children }: MarkdownRendererProps) => (
      <code
        className="font-mono bg-gray-100 text-red-600 rounded border border-gray-200"
        style={{
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          fontSize: `${fontSize * 0.875}px`,
          padding: `${fontSize * 0.09375}px ${fontSize * 0.15625}px`,
        }}
      >
        {children}
      </code>
    ),
    pre: ({ children }: MarkdownRendererProps) => (
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
    ),
    blockquote: ({ children }: MarkdownRendererProps) => (
      <blockquote
        className="border-l-4 border-blue-500 italic"
        style={{
          ...baseTextStyles,
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
          ...baseTextStyles,
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
          ...baseTextStyles,
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
    img: ({ src, alt }: MarkdownRendererProps) => (
      <img
        src={src}
        alt={alt}
        className="max-w-full h-auto rounded-lg"
        style={{
          marginTop: `${fontSize}px`,
          marginBottom: `${fontSize}px`,
        }}
      />
    ),
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Toolbar toggle section */}
      {!isToolbarVisible && (
        <div className="w-full bg-white border-b border-gray-200/30 px-4 md:px-12 py-2 flex-shrink-0">
          <button
            onClick={() => setIsToolbarVisible(true)}
            className="h-9 w-9 flex items-center justify-center hover:bg-gray-100 rounded transition-colors duration-150"
            title="Show toolbar"
          >
            <ChevronDown size={18} className="text-gray-500" />
          </button>
        </div>
      )}

      {/* Sticky toolbar section (not part of scroll) */}
      {isToolbarVisible && (
        <div className="w-full bg-white border-b border-gray-200/30 flex-shrink-0">
          <div className="w-full px-4 md:px-12 pt-3 md:pt-6 pb-3">
            <div className="flex items-start justify-between gap-2 md:gap-4">
              <div className="flex-1 min-w-0 max-w-4xl">
                <PreviewToolbar
                  onFontFamilyChange={setFontFamily}
                  onFontSizeChange={setFontSize}
                  onTextColorChange={setTextColor}
                  currentFontFamily={fontFamily}
                  currentFontSize={fontSize}
                  currentTextColor={textColor}
                />
              </div>
              <button
                onClick={() => setIsToolbarVisible(false)}
                className="h-9 w-9 flex items-center justify-center hover:bg-gray-100 rounded transition-colors duration-150 flex-shrink-0"
                title="Hide toolbar"
              >
                <ChevronUp size={18} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable content section */}
      <div ref={scrollContainerRef} className="w-full flex-1 overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 md:px-12 py-6 md:py-12">
          <div className="preview-content" ref={contentRef}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
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
