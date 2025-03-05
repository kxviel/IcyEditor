import { useCallback, useEffect, useRef, useState } from "react";

export const useZoomPan = () => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const minScale = 0.2;
  const maxScale = 3;
  const scaleStep = 0.1;
  const scrollStep = 20;
  const parentRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();

        if (event.deltaY < 0) {
          setScale((prevScale) => Math.min(prevScale + scaleStep, maxScale));
        } else {
          setScale((prevScale) => Math.max(prevScale - scaleStep, minScale));
        }
      } else if (event.shiftKey) {
        event.preventDefault();
        const newX = position.x + (event.deltaY > 0 ? -scrollStep : scrollStep);
        setPosition((prev) => ({ ...prev, x: newX }));
      }
    },
    [position],
  );

  useEffect(() => {
    if (parentRef.current) {
      const element = parentRef.current;
      if (element) {
        parentRef.current.addEventListener(
          "wheel",
          handleWheel as EventListener,
          { passive: false },
        );
      }

      return () => {
        element.removeEventListener("wheel", handleWheel as EventListener);
      };
    }
  }, [handleWheel, position]);

  return {
    scale,
    position,
    parentRef,
  };
};
