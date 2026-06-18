import type { FC } from 'react';
import { Download, Loader2, PanelLeftClose, PanelLeftOpen, Pencil, Eye } from 'lucide-react';

interface TopBarProps {
  onExport?: () => void;
  isExporting?: boolean;
  onToggleEditor?: () => void;
  isEditorVisible?: boolean;
  mobileView?: 'editor' | 'preview';
  onMobileViewChange?: (view: 'editor' | 'preview') => void;
}

const TopBar: FC<TopBarProps> = ({
  onExport,
  isExporting = false,
  onToggleEditor,
  isEditorVisible = true,
  mobileView = 'editor',
  onMobileViewChange,
}) => {
  return (
    <header className="bg-white border-b border-gray-200/60 sticky top-0 z-30 shadow-sm/30">
      <div className="h-14 md:h-16 px-4 md:px-6 flex items-center justify-between gap-3">

        {/* Left Section - Brand */}
        <div className="flex items-center gap-2 md:gap-3 min-w-0">
          <img
            src="/logo-dark.webp"
            alt="Markdown Preview"
            className="w-10 h-10 md:w-7 md:h-10 object-cover flex-shrink-0"
          />
          <h1 className="text-base md:text-lg font-medium text-gray-900 truncate">Markdown to PDF</h1>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
          {onToggleEditor && (
            <button
              onClick={onToggleEditor}
              className="hidden md:flex p-2 hover:bg-gray-100 rounded-lg transition-colors duration-150"
              title={isEditorVisible ? 'Hide editor' : 'Show editor'}
            >
              {isEditorVisible ? (
                <PanelLeftClose size={18} className="text-gray-600" />
              ) : (
                <PanelLeftOpen size={18} className="text-gray-600" />
              )}
            </button>
          )}

          {onExport && (
            <button
              onClick={onExport}
              disabled={isExporting}
              className={`flex items-center gap-2 px-4 py-2 ${
                isExporting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gray-900 hover:bg-gray-800'
              } text-white rounded-lg transition-colors duration-150 text-sm font-medium`}
              title={isExporting ? 'Exporting...' : 'Export to PDF'}
            >
              {isExporting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span className="hidden sm:inline">Exporting...</span>
                </>
              ) : (
                <>
                  <Download size={16} />
                  <span className="hidden sm:inline">Export PDF</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {onMobileViewChange && (
        <div className="md:hidden px-4 pb-3">
          <div className="grid grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => onMobileViewChange('editor')}
              className={`h-10 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                mobileView === 'editor'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Pencil size={16} />
              Editor
            </button>
            <button
              type="button"
              onClick={() => onMobileViewChange('preview')}
              className={`h-10 rounded-md flex items-center justify-center gap-2 text-sm font-medium transition-colors ${
                mobileView === 'preview'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye size={16} />
              Vista previa
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default TopBar;
