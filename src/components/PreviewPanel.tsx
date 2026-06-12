import type { FC } from 'react';
import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import PreviewToolbar from './PreviewToolbar';

interface PreviewPanelProps {
  markdown: string;
  contentRef?: React.RefObject<HTMLDivElement | null>;
}

const PreviewPanel: FC<PreviewPanelProps> = ({ markdown, contentRef }) => {
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

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Toolbar toggle section */}
      {!isToolbarVisible && (
        <div className="w-full bg-white border-b border-gray-200/30 px-12 py-2 flex-shrink-0">
          <button
            onClick={() => setIsToolbarVisible(true)}
            className="p-1 hover:bg-gray-100 rounded transition-colors duration-150"
            title="Show toolbar"
          >
            <ChevronDown size={18} className="text-gray-500" />
          </button>
        </div>
      )}

      {/* Sticky toolbar section (not part of scroll) */}
      {isToolbarVisible && (
        <div className="w-full bg-white border-b border-gray-200/30 flex-shrink-0">
          <div className="w-full px-12 pt-6 pb-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 max-w-4xl">
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
                className="p-1 hover:bg-gray-100 rounded transition-colors duration-150 flex-shrink-0"
                title="Hide toolbar"
              >
                <ChevronUp size={18} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scrollable content section */}
      <div className="w-full flex-1 overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto px-12 py-12">
          <div className="preview-content" ref={contentRef}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
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
              h2: ({ children }) => (
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
              h3: ({ children }) => (
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
              h4: ({ children }) => (
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
              h5: ({ children }) => (
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
              h6: ({ children }) => (
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
              p: ({ children }) => (
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
              a: ({ href, children }) => (
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
              strong: ({ children }) => (
                <strong
                  className="font-bold"
                  style={{ ...baseTextStyles, fontWeight: 'bold' }}
                >
                  {children}
                </strong>
              ),
              em: ({ children }) => (
                <em
                  className="italic"
                  style={{ ...baseTextStyles, fontStyle: 'italic' }}
                >
                  {children}
                </em>
              ),
              code: ({ children }) => (
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
              pre: ({ children }) => (
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
              blockquote: ({ children }) => (
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
              ul: ({ children }) => (
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
              ol: ({ children }) => (
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
              li: ({ children }) => (
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
              table: ({ children }) => (
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
              thead: ({ children }) => <thead>{children}</thead>,
              tbody: ({ children }) => <tbody>{children}</tbody>,
              tr: ({ children }) => <tr>{children}</tr>,
              th: ({ children }) => (
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
              td: ({ children }) => (
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
              img: ({ src, alt }) => (
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
            }}
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
