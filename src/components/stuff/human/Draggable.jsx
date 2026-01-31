import React, { useRef, useState, useEffect } from "react";

export const Draggable = ({ children, initialX = 0, initialY = 0 }) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [dragging, setDragging] = useState(false);

  const offset = useRef({ x: 0, y: 0 });

  // Helper to get coordinates from mouse or touch
  const getEventPosition = (e) => {
    if (e.touches) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else {
      return { x: e.clientX, y: e.clientY };
    }
  };

  const handleDragStart = (e) => {
    const { x, y } = getEventPosition(e);
    setDragging(true);
    offset.current = { x: x - position.x, y: y - position.y };
    e.preventDefault();
  };

  const handleDragMove = (e) => {
    if (!dragging) return;
    const { x, y } = getEventPosition(e);
    setPosition({
      x: x - offset.current.x,
      y: y - offset.current.y,
    });
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  useEffect(() => {
    // Listen for both mouse and touch events
    document.addEventListener("mousemove", handleDragMove);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchmove", handleDragMove, { passive: false });
    document.addEventListener("touchend", handleDragEnd);

    return () => {
      document.removeEventListener("mousemove", handleDragMove);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchmove", handleDragMove);
      document.removeEventListener("touchend", handleDragEnd);
    };
  }, [dragging]);

  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none", // prevents touch scrolling
      }}
      onMouseDown={handleDragStart}
      onTouchStart={handleDragStart}
    >
      {children}
    </div>
  );
};
