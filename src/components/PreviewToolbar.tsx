import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Palette, RotateCcw, Settings2, Type, X } from 'lucide-react';
import type { PreviewTheme } from '../types/previewTheme';
import { DEFAULT_PREVIEW_THEME } from '../types/previewTheme';

interface PreviewToolbarProps {
  theme: PreviewTheme;
  isExpanded: boolean;
  onThemeChange: (theme: PreviewTheme) => void;
  onExpandedChange: (isExpanded: boolean) => void;
}

type ColorTarget = keyof PreviewTheme['colors'];

const fontFamilies = [
  { name: 'Inter', value: 'system-ui, -apple-system, sans-serif' },
  { name: 'Georgia', value: 'Georgia, Cambria, serif' },
  { name: 'Fira Code', value: '"JetBrains Mono", "Fira Code", monospace' },
];

const colorControls: Array<{ key: ColorTarget; label: string }> = [
  { key: 'heading', label: 'Titles' },
  { key: 'body', label: 'Body' },
  { key: 'table', label: 'Tables' },
];

const presetColors = [
  { name: 'Ink', value: '#111827' },
  { name: 'Slate', value: '#374151' },
  { name: 'Mist', value: '#6b7280' },
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Green', value: '#059669' },
  { name: 'Violet', value: '#7c3aed' },
];

const PreviewToolbar: FC<PreviewToolbarProps> = ({
  theme,
  isExpanded,
  onThemeChange,
  onExpandedChange,
}) => {
  const [activeColorTarget, setActiveColorTarget] = useState<ColorTarget | null>(null);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const currentFont = fontFamilies.find((font) => font.value === theme.fontFamily) ?? fontFamilies[0];
  const sliderProgress = ((theme.fontSize - 12) / (24 - 12)) * 100;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!colorPickerRef.current?.contains(event.target as Node)) {
        setActiveColorTarget(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveColorTarget(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const updateTheme = (updates: Partial<PreviewTheme>) => {
    onThemeChange({
      ...theme,
      ...updates,
      colors: {
        ...theme.colors,
        ...updates.colors,
      },
    });
  };

  const updateColor = (target: ColorTarget, color: string) => {
    updateTheme({
      colors: {
        ...theme.colors,
        [target]: color,
      },
    });
  };

  const resetTheme = () => {
    onThemeChange(DEFAULT_PREVIEW_THEME);
    onExpandedChange(true);
  };

  const resetColor = (target: ColorTarget) => {
    updateColor(target, DEFAULT_PREVIEW_THEME.colors[target]);
  };

  return (
    <div className="border-b border-gray-200/70 bg-white">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 md:px-12">
        <div className="flex min-h-12 items-center gap-2 py-2">
          <button
            type="button"
            onClick={() => onExpandedChange(!isExpanded)}
            className="flex h-9 min-w-0 items-center gap-2 rounded border border-gray-200 bg-gray-50 px-3 text-left text-sm font-medium text-gray-700 transition-colors duration-150 hover:bg-gray-100"
            aria-expanded={isExpanded}
            title="Document style"
          >
            <Settings2 size={16} className="shrink-0 text-gray-500" />
            <span className="truncate">{currentFont.name}</span>
            <span className="shrink-0 text-gray-400">{theme.fontSize}px</span>
          </button>

          <div className="flex items-center gap-1">
            {colorControls.map(({ key, label }) => (
              <span
                key={key}
                className="h-5 w-5 rounded-full border border-gray-300"
                style={{ backgroundColor: theme.colors[key] }}
                title={label}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={resetTheme}
            className="ml-auto flex h-9 w-9 items-center justify-center rounded text-gray-500 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900"
            title="Reset document style"
          >
            <RotateCcw size={16} />
          </button>

          <button
            type="button"
            onClick={() => onExpandedChange(false)}
            className={`flex h-9 w-9 items-center justify-center rounded text-gray-500 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900 ${
              isExpanded ? 'visible' : 'invisible pointer-events-none'
            }`}
            title="Collapse document style"
            aria-hidden={!isExpanded}
            tabIndex={isExpanded ? 0 : -1}
          >
            <X size={16} />
          </button>
        </div>

        <div
          className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
            isExpanded ? 'grid-rows-[1fr] overflow-visible opacity-100' : 'grid-rows-[0fr] overflow-hidden opacity-0'
          }`}
          aria-hidden={!isExpanded}
        >
          <div className={`min-h-0 overflow-visible ${isExpanded ? 'pointer-events-auto' : 'pointer-events-none'}`}>
            <div className="grid gap-4 pb-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="grid gap-3 sm:grid-cols-[minmax(10rem,12rem)_minmax(12rem,1fr)]">
              <label className="flex flex-col gap-1 text-xs font-medium text-gray-600">
                <span>Typeface</span>
                <select
                  value={theme.fontFamily}
                  onChange={(event) => updateTheme({ fontFamily: event.target.value })}
                  className="h-9 rounded border border-gray-200 bg-gray-50 px-3 text-sm text-gray-800 outline-none transition-colors duration-150 hover:bg-gray-100 focus:border-blue-500"
                >
                  {fontFamilies.map((font) => (
                    <option key={font.value} value={font.value}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex flex-col gap-1 text-xs font-medium text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Size</span>
                  <span className="text-gray-500">{theme.fontSize}px</span>
                </div>
                <div className="flex h-9 items-center gap-3">
                  <Type size={16} className="text-gray-400" />
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={theme.fontSize}
                    onChange={(event) => updateTheme({ fontSize: Number(event.target.value) })}
                    className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                    style={{ '--slider-progress': `${sliderProgress}%` } as React.CSSProperties}
                  />
                </div>
              </div>
            </div>

            <div ref={colorPickerRef} className="grid gap-3 sm:grid-cols-3">
              {colorControls.map(({ key, label }) => (
                <div key={key} className="relative flex flex-col gap-2">
                  <label className="text-xs font-medium text-gray-600">{label}</label>
                  <button
                    type="button"
                    onClick={() => setActiveColorTarget(activeColorTarget === key ? null : key)}
                    className="flex h-9 items-center justify-between rounded border border-gray-200 bg-gray-50 px-2 text-sm text-gray-700 transition-colors duration-150 hover:bg-gray-100"
                    aria-expanded={activeColorTarget === key}
                    title={`${label} color`}
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className="h-5 w-5 shrink-0 rounded border border-gray-300"
                        style={{ backgroundColor: theme.colors[key] }}
                      />
                      <span className="truncate">{theme.colors[key].toUpperCase()}</span>
                    </span>
                    <Palette size={15} className="text-gray-400" />
                  </button>

                  {activeColorTarget === key && (
                    <div className="absolute left-0 top-full z-50 mt-2 w-56 rounded border border-gray-200 bg-white p-3 shadow-lg">
                      <div className="mb-3 grid grid-cols-4 gap-2">
                        {presetColors.map(({ name, value }) => (
                          <button
                            key={`${key}-${value}`}
                            type="button"
                            onClick={() => updateColor(key, value)}
                            className={`h-8 rounded border transition-transform duration-150 hover:scale-105 ${
                              theme.colors[key].toLowerCase() === value ? 'border-blue-500' : 'border-gray-200'
                            }`}
                            style={{ backgroundColor: value }}
                            title={name}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={theme.colors[key]}
                          onChange={(event) => updateColor(key, event.target.value)}
                          className="h-8 w-10 cursor-pointer rounded border border-gray-200 bg-white"
                          title={`${label} custom color`}
                        />
                        <button
                          type="button"
                          onClick={() => resetColor(key)}
                          className="ml-auto flex h-8 items-center gap-1 rounded px-2 text-xs font-medium text-gray-500 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900"
                        >
                          <RotateCcw size={13} />
                          Default
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewToolbar;
