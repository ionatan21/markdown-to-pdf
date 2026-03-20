import type { FC } from 'react';
import { FileText, Download } from 'lucide-react';

interface TopBarProps {
  onExport?: () => void;
}

const TopBar: FC<TopBarProps> = ({ onExport }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200/60 sticky top-0 z-30 shadow-sm/30">
      <div className="h-full px-6 flex items-center justify-between">

        {/* Left Section - Brand */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-medium text-gray-900">Markdown Preview</h1>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center">
          {onExport && (
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors duration-150 text-sm font-medium"
              title="Exportar a PDF"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Export PDF</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
