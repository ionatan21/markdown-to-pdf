import type { FC } from 'react';
import type { LucideProps } from 'lucide-react';
import type { editor } from 'monaco-editor';
import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  Bold,
  Italic,
  Heading,
  List,
  ListOrdered,
  Code,
  FileCode,
  Link,
  Quote,
  Table,
  Minus,
  ChevronDown,
} from 'lucide-react';

interface FormattingToolbarProps {
  editorRef?: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
}

// Toolbar Button Component
const ToolbarButton: FC<{
  icon: React.ComponentType<LucideProps>;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  variant?: 'default' | 'dropdown';
}> = ({ icon: Icon, label, onClick, isActive = false, variant = 'default' }) => (
  <button
    onClick={onClick}
    className={`
      group relative w-9 h-9 rounded-lg transition-colors duration-150 cursor-pointer flex items-center justify-center
      ${isActive
        ? 'bg-gray-200 text-gray-900'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }
      ${variant === 'dropdown' ? 'gap-1 w-auto px-2' : ''}
    `}
    aria-label={label}
    title={label}
  >
    <Icon size={18} />
    {variant === 'dropdown' && <ChevronDown size={14} />}
    <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 delay-200">
      {label}
    </span>
  </button>
);

// Dropdown Component for Headings
const HeadingsDropdown: FC<{
  onSelect: (level: number) => void;
}> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const updateMenuPosition = useCallback(() => {
    if (!dropdownRef.current) return;

    const buttonRect = dropdownRef.current.getBoundingClientRect();
    setMenuPosition({
      top: buttonRect.bottom + 4,
      left: buttonRect.left,
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedTrigger = dropdownRef.current?.contains(target);
      const clickedMenu = menuRef.current?.contains(target);

      if (!clickedTrigger && !clickedMenu) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    updateMenuPosition();

    const handleWindowChange = () => {
      updateMenuPosition();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleWindowChange);
    window.addEventListener('scroll', handleWindowChange, true);
    document.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange, true);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, updateMenuPosition]);

  const headingOptions = [
    { level: 1, label: 'Heading 1', preview: 'text-2xl font-bold' },
    { level: 2, label: 'Heading 2', preview: 'text-xl font-semibold' },
    { level: 3, label: 'Heading 3', preview: 'text-lg font-medium' },
  ];

  const handleSelect = (level: number) => {
    onSelect(level);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => {
          updateMenuPosition();
          setIsOpen(!isOpen);
        }}
        className="group relative w-9 h-9 rounded-lg transition-colors duration-150 cursor-pointer flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        aria-label="Insert heading"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        title="Insert heading"
      >
        <Heading size={18} />
        <ChevronDown size={12} className="absolute -bottom-0.5 -right-0.5" />
        <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50 delay-200">
          Insert heading
        </span>
      </button>

      {isOpen && createPortal(
        <div
          ref={menuRef}
          role="menu"
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-[100] min-w-[140px]"
          style={{
            top: `${menuPosition.top}px`,
            left: `${menuPosition.left}px`,
          }}
        >
          {headingOptions.map(({ level, label, preview }) => (
            <button
              key={level}
              type="button"
              role="menuitem"
              onClick={() => handleSelect(level)}
              className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors duration-150"
            >
              <div className={`${preview} text-gray-900`}>{label}</div>
            </button>
          ))}
        </div>,
        document.body,
      )}
    </div>
  );
};

// Mobile Toolbar Button Component (Larger for thumb-friendly)
const MobileToolbarButton: FC<{
  icon: React.ComponentType<LucideProps>;
  label: string;
  onClick: () => void;
  isActive?: boolean;
}> = ({ icon: Icon, label, onClick, isActive = false }) => (
  <button
    onClick={onClick}
    className={`
      w-12 h-12 rounded-xl transition-colors duration-150 cursor-pointer flex items-center justify-center
      ${isActive
        ? 'bg-gray-200 text-gray-900'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }
    `}
    aria-label={label}
    title={label}
  >
    <Icon size={20} />
  </button>
);

// Mobile Headings Button (Simplified)
const MobileHeadingsButton: FC<{
  onSelect: (level: number) => void;
}> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const headingOptions = [
    { level: 1, label: 'H1' },
    { level: 2, label: 'H2' },
    { level: 3, label: 'H3' },
  ];

  const handleSelect = (level: number) => {
    onSelect(level);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-xl transition-colors duration-150 cursor-pointer flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        aria-label="Insert heading"
        title="Heading"
      >
        <Heading size={20} />
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
          {headingOptions.map(({ level, label }) => (
            <button
              key={level}
              onClick={() => handleSelect(level)}
              className="w-16 py-2 text-center hover:bg-gray-50 transition-colors duration-150 text-sm font-medium"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Toolbar Separator
const ToolbarSeparator: FC = () => (
  <div className="w-px h-6 bg-gray-300 mx-2"></div>
);

const FormattingToolbar: FC<FormattingToolbarProps> = ({ editorRef }) => {
  const insertMarkdown = (before: string, after: string = '') => {
    if (!editorRef?.current) return;
    const editor = editorRef.current;

    const model = editor.getModel();
    const selection = editor.getSelection();

    if (selection && model) {
      const selectedText = model.getValueInRange(selection);
      const range = selection;

      const newText = before + selectedText + after;
      model.pushEditOperations(
        [range],
        [
          {
            range: range,
            text: newText,
          },
        ],
        () => []
      );

      // Move cursor after inserted text
      const newPosition = {
        lineNumber: range.startLineNumber,
        column: range.startColumn + before.length + selectedText.length,
      };
      editor.setPosition(newPosition);
      editor.focus();
    }
  };

  const insertHeading = (level: number) => {
    const prefix = '#'.repeat(level) + ' ';
    insertMarkdown(prefix);
  };

  const insertBold = () => {
    insertMarkdown('**', '**');
  };

  const insertItalic = () => {
    insertMarkdown('*', '*');
  };

  const insertCode = () => {
    insertMarkdown('`', '`');
  };

  const insertCodeBlock = () => {
    insertMarkdown('```\n', '\n```');
  };

  const insertList = () => {
    insertMarkdown('- ');
  };

  const insertOrderedList = () => {
    insertMarkdown('1. ');
  };

  const insertLink = () => {
    insertMarkdown('[', '](https://example.com)');
  };

  const insertQuote = () => {
    insertMarkdown('> ');
  };

  const insertTable = () => {
    insertMarkdown('| Header 1 | Header 2 |\n| -------- | -------- |\n| Cell 1   | Cell 2   |\n');
  };

  const insertHorizontalRule = () => {
    insertMarkdown('---\n');
  };

  return (
    <>
      {/* Desktop and Tablet Toolbar */}
      <div className="hidden sm:block h-12 bg-white border-b border-gray-200/60 sticky top-0 z-20">
        <div className="h-full px-4 flex items-center">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">

            {/* Text Formatting Group */}
            <div className="flex items-center gap-1">
              <ToolbarButton icon={Bold} label="Bold (Ctrl+B)" onClick={insertBold} />
              <ToolbarButton icon={Italic} label="Italic (Ctrl+I)" onClick={insertItalic} />
            </div>

            <ToolbarSeparator />

            {/* Headings Group */}
            <div className="flex items-center">
              <HeadingsDropdown onSelect={insertHeading} />
            </div>

            <ToolbarSeparator />

            {/* Lists Group */}
            <div className="flex items-center gap-1">
              <ToolbarButton icon={List} label="Bullet list" onClick={insertList} />
              <ToolbarButton icon={ListOrdered} label="Numbered list" onClick={insertOrderedList} />
            </div>

            <ToolbarSeparator />

            {/* Code Group */}
            <div className="flex items-center gap-1">
              <ToolbarButton icon={Code} label="Inline code" onClick={insertCode} />
              <ToolbarButton icon={FileCode} label="Code block" onClick={insertCodeBlock} />
            </div>

            <ToolbarSeparator />

            {/* Content Group */}
            <div className="flex items-center gap-1">
              <ToolbarButton icon={Link} label="Link" onClick={insertLink} />
              <ToolbarButton icon={Quote} label="Quote" onClick={insertQuote} />
              <ToolbarButton icon={Table} label="Table" onClick={insertTable} />
              <ToolbarButton icon={Minus} label="Horizontal line" onClick={insertHorizontalRule} />
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Toolbar (Bottom) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200/60 z-50 pb-4">
        <div className="h-full px-4 flex items-center justify-center">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">

            {/* Most used actions for mobile */}
            <MobileToolbarButton icon={Bold} label="Bold" onClick={insertBold} />
            <MobileToolbarButton icon={Italic} label="Italic" onClick={insertItalic} />
            <MobileHeadingsButton onSelect={insertHeading} />
            <MobileToolbarButton icon={List} label="List" onClick={insertList} />
            <MobileToolbarButton icon={Code} label="Code" onClick={insertCode} />
            <MobileToolbarButton icon={Link} label="Link" onClick={insertLink} />

          </div>
        </div>
      </div>
    </>
  );
}
export default FormattingToolbar;
