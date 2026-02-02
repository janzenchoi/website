import React, { useState, useRef, useEffect } from "react";

export const Draggable = ({ children, initialX = 0, initialY = 0, handleSelector }) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  const getEventPosition = (e) => {
    // Handle both mouse and touch events
    if (e.touches) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  const handleStart = (e) => {
    if (handleSelector && !e.target.closest(handleSelector)) return;
    if (["INPUT", "BUTTON", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;

    const pos = getEventPosition(e);
    setDragging(true);
    offset.current = {
      x: pos.x - position.x,
      y: pos.y - position.y,
    };
    e.preventDefault();
  };

  const handleMove = (e) => {
    if (!dragging) return;
    const pos = getEventPosition(e);
    setPosition({
      x: pos.x - offset.current.x,
      y: pos.y - offset.current.y,
    });
  };

  const handleEnd = () => setDragging(false);

  useEffect(() => {
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleMove, { passive: false });
    document.addEventListener("touchend", handleEnd);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleEnd);
      document.removeEventListener("touchmove", handleMove);
      document.removeEventListener("touchend", handleEnd);
    };
  }, [dragging]);

  return (
    <div
      style={{
        position: "absolute",
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none", // prevent default scrolling on touch drag
      }}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    >
      {children}
    </div>
  );
};
