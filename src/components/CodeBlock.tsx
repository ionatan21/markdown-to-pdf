import hljs from 'highlight.js/lib/common';
import 'highlight.js/styles/github-dark.css';

interface CodeBlockProps {
  children: string;
  className?: string;
  fontSize: number;
}

const getLanguageFromClassName = (className?: string) => {
  const languageMatch = /language-(\w+)/.exec(className || '');
  return languageMatch?.[1]?.toLowerCase();
};

export default function CodeBlock({ children, className, fontSize }: CodeBlockProps) {
  const language = getLanguageFromClassName(className);
  const code = children.replace(/\n$/, '');
  const highlightedCode = language && hljs.getLanguage(language)
    ? hljs.highlight(code, { language }).value
    : hljs.highlightAuto(code).value;

  return (
    <code
      className={`hljs ${className || ''}`.trim()}
      style={{
        fontFamily: '"JetBrains Mono", "Fira Code", monospace',
        fontSize: `${fontSize * 0.875}px`,
        lineHeight: 1.6,
        padding: 0,
      }}
      dangerouslySetInnerHTML={{ __html: highlightedCode }}
    />
  );
}
