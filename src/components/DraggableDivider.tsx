import type { FC } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface DraggableDividerProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  value: number;
  onResize: (leftFlexBasis: number) => void;
  min?: number;
  max?: number;
}

const DraggableDivider: FC<DraggableDividerProps> = ({
  containerRef,
  value,
  onResize,
  min = 20,
  max = 80,
}) => {
  const dividerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const previousCursorRef = useRef('');
  const previousUserSelectRef = useRef('');

  const clamp = useCallback(
    (percentage: number) => Math.max(min, Math.min(max, percentage)),
    [max, min],
  );

  const resizeFromClientX = useCallback(
    (clientX: number) => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const rawPercentage = ((clientX - containerRect.left) / containerRect.width) * 100;

      onResize(clamp(rawPercentage));
    },
    [clamp, containerRef, onResize],
  );

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    dividerRef.current?.setPointerCapture(event.pointerId);
    resizeFromClientX(event.clientX);
    setIsDragging(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 2;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      onResize(clamp(value - step));
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      onResize(clamp(value + step));
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    previousCursorRef.current = document.body.style.cursor;
    previousUserSelectRef.current = document.body.style.userSelect;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handlePointerMove = (event: PointerEvent) => {
      resizeFromClientX(event.clientX);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);

    return () => {
      document.body.style.cursor = previousCursorRef.current;
      document.body.style.userSelect = previousUserSelectRef.current;
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, resizeFromClientX]);

  return (
    <div
      ref={dividerRef}
      role="separator"
      aria-label="Resize editor and preview panels"
      aria-orientation="vertical"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={Math.round(value)}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onKeyDown={handleKeyDown}
      className={`relative h-full w-2 cursor-col-resize bg-gray-200 outline-none transition-colors duration-150 hover:bg-blue-500 focus-visible:bg-blue-500 ${
        isDragging ? 'bg-blue-500' : ''
      }`}
    />
  );
};

export default DraggableDivider;
