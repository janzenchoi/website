import { useState, useEffect, useRef } from "react";
import ballImage from "../../assets/stuff/ball.png";

// Constants
const BALL_SIZE = 50;
const GRAVITY = 0.5;
const FRICTION = 0.7; // bounce energy loss
const AIR_FRICTION = 0.995; // horizontal air friction
const GROUND_FRICTION = 0.9; // floor friction
const MAX_VX = 60;
const FRAME_MS = 16.6667; // ~60fps

/**
 * Ball object
 * @returns bouncing ball object with drag + release horizontal velocity
 */
export const Ball = () => {
  // Initialise in center of screen
  const initialX = window.innerWidth / 2 - BALL_SIZE / 2;
  const initialY = window.innerHeight / 2 - BALL_SIZE / 2;
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Physics refs
  const ballRef = useRef({ x: initialX, y: initialY, vx: 0, vy: 0 });
  const animationRef = useRef(null);

  // Track last pointer to compute release velocity
  const lastPointerRef = useRef({ x: initialX, t: performance.now(), vx: 0 });

  // Track pointer type ('mouse' | 'touch') for different behavior
  const pointerTypeRef = useRef(null);

  // Helper for touch/mouse
  const getEventCoords = (e) => {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  };

  // Start dragging (mouse or touch) — remember pointer type
  const handleDown = (e) => {
    const { x, y } = getEventCoords(e);
    pointerTypeRef.current = e.touches && e.touches.length > 0 ? "touch" : "mouse";

    setIsDragging(true);
    setOffset({ x: x - ballRef.current.x, y: y - ballRef.current.y });
    ballRef.current.vy = 0;
    lastPointerRef.current = { x, t: performance.now(), vx: 0 };
    e.preventDefault();
  };

  // Move: only proceed if dragging; for mouse, additionally ensure button is down
  const handleMove = (e) => {
    if (!isDragging) return;

    if (pointerTypeRef.current === "mouse") {
      if ("buttons" in e && e.buttons === 0) return; // mouse not pressed
    }

    const { x, y } = getEventCoords(e);

    const newX = x - offset.x;
    const newY = y - offset.y;

    // calculate horizontal velocity from pointer sampling
    const now = performance.now();
    const dt = now - lastPointerRef.current.t || 1;
    const dx = x - lastPointerRef.current.x;
    const instantVx = (dx / dt) * FRAME_MS;
    const smoothedVx = lastPointerRef.current.vx * 0.3 + instantVx * 0.7;
    lastPointerRef.current = { x, t: now, vx: smoothedVx };

    ballRef.current.x = newX;
    ballRef.current.y = newY;
    setPosition({ x: newX, y: newY });

    e.preventDefault();
  };

  // Stop dragging and apply horizontal velocity
  const handleUp = () => {
    ballRef.current.vx = Math.max(
      -MAX_VX,
      Math.min(MAX_VX, lastPointerRef.current.vx || 0)
    );
    setIsDragging(false);
    pointerTypeRef.current = null;
  };

  // Gravity + horizontal motion animation
  useEffect(() => {
    const animate = () => {
      if (!isDragging) {
        // vertical gravity
        ballRef.current.vy += GRAVITY;
        let newY = ballRef.current.y + ballRef.current.vy;

        // horizontal motion
        let newX = ballRef.current.x + (ballRef.current.vx || 0);

        // floor collision
        const floor = window.innerHeight - BALL_SIZE;
        if (newY > floor) {
          newY = floor;
          ballRef.current.vy = -ballRef.current.vy * FRICTION;
          if (Math.abs(ballRef.current.vy) < 0.5) ballRef.current.vy = 0;
          ballRef.current.vx *= GROUND_FRICTION;
        } else {
          ballRef.current.vx *= AIR_FRICTION;
        }

        // wall collisions
        const rightLimit = window.innerWidth - BALL_SIZE;
        if (newX < 0) {
          newX = 0;
          ballRef.current.vx = -ballRef.current.vx * FRICTION;
        } else if (newX > rightLimit) {
          newX = rightLimit;
          ballRef.current.vx = -ballRef.current.vx * FRICTION;
        }

        if (Math.abs(ballRef.current.vx) < 0.01) ballRef.current.vx = 0;

        ballRef.current.x = newX;
        ballRef.current.y = newY;
        setPosition({ x: newX, y: newY });
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationRef.current);
  }, [isDragging]);

  // Desktop: listen on document to avoid hover-off release issues
  useEffect(() => {
    const handleDocumentMouseMove = (e) => {
      if (!isDragging || pointerTypeRef.current !== "mouse") return;
      handleMove(e);
    };
    const handleDocumentMouseUp = () => {
      if (!isDragging || pointerTypeRef.current !== "mouse") return;
      handleUp();
    };

    document.addEventListener("mousemove", handleDocumentMouseMove);
    document.addEventListener("mouseup", handleDocumentMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleDocumentMouseMove);
      document.removeEventListener("mouseup", handleDocumentMouseUp);
    };
  }, [isDragging]);

  // Ball styles
  const ballStyle = {
    position: "fixed",
    left: position.x,
    top: position.y,
    width: `${BALL_SIZE}px`,
    height: `${BALL_SIZE}px`,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: isDragging ? "grabbing" : "grab",
    zIndex: 1000,
    touchAction: "none",
  };

  // Return the ball object — mouse uses document events, touch uses image events
  return (
    <img
      onMouseDown={handleDown}
      onTouchStart={handleDown}
      onTouchMove={handleMove}
      onTouchEnd={handleUp}
      onTouchCancel={handleUp}
      onDragStart={(e) => e.preventDefault()}
      style={ballStyle}
      src={ballImage}
      alt="bouncy ball"
    />
  );
};
