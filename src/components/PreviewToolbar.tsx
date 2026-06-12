import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, RotateCcw, Palette } from 'lucide-react';

interface PreviewToolbarProps {
  onFontFamilyChange: (fontFamily: string) => void;
  onFontSizeChange: (fontSize: number) => void;
  onTextColorChange: (color: string) => void;
  currentFontFamily: string;
  currentFontSize: number;
  currentTextColor: string;
}

const fontFamilies = [
  { name: 'Sans-serif', value: 'system-ui, -apple-system, sans-serif', label: 'Inter' },
  { name: 'Serif', value: 'Georgia, Cambria, serif', label: 'Georgia' },
  { name: 'Monospace', value: '"JetBrains Mono", "Fira Code", monospace', label: 'Fira Code' },
];

const presetColors = [
  '#111827', // Dark gray
  '#374151', // Medium gray
  '#6B7280', // Light gray
  '#000000', // Black
  '#1F2937', // Darker gray
  '#DC2626', // Red
  '#2563EB', // Blue
  '#059669', // Green
];

const PreviewToolbar: FC<PreviewToolbarProps> = ({
  onFontFamilyChange,
  onFontSizeChange,
  onTextColorChange,
  currentFontFamily,
  currentFontSize,
  currentTextColor,
}) => {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isFontPickerOpen, setIsFontPickerOpen] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const fontPickerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setIsColorPickerOpen(false);
      }
      if (fontPickerRef.current && !fontPickerRef.current.contains(event.target as Node)) {
        setIsFontPickerOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentFont = fontFamilies.find(font => font.value === currentFontFamily) || fontFamilies[0];

  // Calculate slider progress percentage for visual fill
  const sliderProgress = ((currentFontSize - 12) / (24 - 12)) * 100;

  const handleReset = () => {
    onFontFamilyChange(fontFamilies[0].value);
    onFontSizeChange(16);
    onTextColorChange('#111827');
  };

  return (
    <div>
      <div className="bg-white/80 backdrop-blur-md border border-gray-200/50 rounded-lg shadow-sm p-3 md:p-4">
        <div className="flex flex-wrap items-end gap-3 md:gap-6">

          {/* Font Family Selector */}
          <div className="relative flex-1 min-w-[9rem] sm:flex-none" ref={fontPickerRef}>
            <label className="block text-xs font-medium text-gray-600 mb-1">Font Family</label>
            <button
              onClick={() => setIsFontPickerOpen(!isFontPickerOpen)}
              className="flex items-center justify-between w-full sm:w-36 h-10 md:h-9 px-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors duration-150"
            >
              <span className="text-sm font-medium truncate" style={{ fontFamily: currentFont.value }}>
                {currentFont.label}
              </span>
              <ChevronDown size={14} className="text-gray-500 flex-shrink-0" />
            </button>

            {isFontPickerOpen && (
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50">
                {fontFamilies.map((font) => (
                  <button
                    key={font.value}
                    onClick={() => {
                      onFontFamilyChange(font.value);
                      setIsFontPickerOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors duration-150 ${
                      currentFont.value === font.value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                    }`}
                    style={{ fontFamily: font.value }}
                  >
                    <div className="font-medium">{font.label}</div>
                    <div className="text-xs text-gray-500">{font.name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Font Size Control */}
          <div className="flex-1 min-w-[11rem] sm:flex-none flex flex-col">
            <label className="block text-xs font-medium text-gray-600 mb-1">Font Size</label>
            <div className="flex items-center gap-2 h-10 md:h-9">
              <input
                type="range"
                min="12"
                max="24"
                value={currentFontSize}
                onChange={(e) => onFontSizeChange(parseInt(e.target.value))}
                className="w-full sm:w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                style={{ '--slider-progress': `${sliderProgress}%` } as React.CSSProperties}
              />
              <span className="text-sm font-medium text-gray-700 w-8 text-center">
                {currentFontSize}
              </span>
              <span className="text-xs text-gray-500">px</span>
            </div>
          </div>

          {/* Text Color Picker */}
          <div className="relative" ref={colorPickerRef}>
            <label className="block text-xs font-medium text-gray-600 mb-1">Text Color</label>
            <button
              onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
              className="flex items-center justify-center w-10 h-10 md:w-9 md:h-9 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors duration-150"
              style={{ backgroundColor: currentTextColor }}
              title="Change text color"
            >
              <Palette size={16} className="text-white mix-blend-difference" />
            </button>

            {isColorPickerOpen && (
              <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-600 mb-2">Preset Colors</label>
                  <div className="grid grid-cols-4 gap-2">
                    {presetColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => {
                          onTextColorChange(color);
                          setIsColorPickerOpen(false);
                        }}
                        className={`w-8 h-8 rounded-lg border-2 hover:scale-110 transition-transform duration-150 ${
                          currentTextColor === color ? 'border-blue-500' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Custom Color</label>
                  <input
                    type="color"
                    value={currentTextColor}
                    onChange={(e) => onTextColorChange(e.target.value)}
                    className="w-full h-8 rounded border border-gray-200 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Reset Button */}
          <div className="flex flex-col items-center">
            <label className="block text-xs font-medium text-gray-600 mb-1">Reset</label>
            <button
              onClick={handleReset}
              className="flex items-center justify-center w-10 h-10 md:w-9 md:h-9 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-150"
              title="Reset to defaults"
            >
              <RotateCcw size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PreviewToolbar;
