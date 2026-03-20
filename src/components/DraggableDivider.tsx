import type { FC } from 'react';
import { useRef, useEffect, useState } from 'react';

interface DraggableDividerProps {
  onResize: (leftFlexBasis: number) => void;
}

const DraggableDivider: FC<DraggableDividerProps> = ({ onResize }) => {
  const dividerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const handleMouseDown = () => {
      setIsDragging(true);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dividerRef.current) return;

      const container = dividerRef.current.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newLeftWidth = e.clientX - containerRect.left;
      const containerWidth = containerRect.width;
      const percentage = Math.max(20, Math.min(80, (newLeftWidth / containerWidth) * 100));

      onResize(percentage);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    const divider = dividerRef.current;
    if (divider) {
      divider.addEventListener('mousedown', handleMouseDown);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (divider) {
        divider.removeEventListener('mousedown', handleMouseDown);
      }
    };
  }, [isDragging, onResize]);

  return (
    <div
      ref={dividerRef}
      className={`w-1 bg-editor-border hover:bg-blue-500 cursor-col-resize transition-colors duration-150 ${
        isDragging ? 'bg-blue-500' : ''
      }`}
    />
  );
};

export default DraggableDivider;
