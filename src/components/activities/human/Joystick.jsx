
import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * 8-direction joystick with:
 * - Mouse + touch (Pointer Events)
 * - Movable joystick (optional)
 * - Burger handle visibility controlled by movable
 * - Directional joystick works regardless of movable
 */
export function Joystick({
  size = 140,
  deadZone = 10,
  initialPosition = { x: 24, y: 24 },
  movable = true,
  onChange,
  onPositionChange
}) {
  /* ---------------- Refs ---------------- */

  const containerRef = useRef(null);
  const baseRef = useRef(null);

  const handlePointerIdRef = useRef(null);
  const stickPointerIdRef = useRef(null);

  const handleDragOffsetRef = useRef({ dx: 0, dy: 0 });

  /* ---------------- Position ---------------- */

  const [pos, setPos] = useState({
    x: initialPosition.x,
    y: initialPosition.y
  });

  useEffect(() => {
    setPos({
      x: initialPosition.x,
      y: initialPosition.y
    });
  }, [initialPosition.x, initialPosition.y]);

  const setPosSafe = (x, y) => {
    const next = { x, y };
    setPos(next);
    onPositionChange?.(next);
  };

  const getParentRect = () => {
    const el = containerRef.current;
    if (!el) return null;

    const parent = el.offsetParent || document.body;
    return parent.getBoundingClientRect();
  };

  /* ---------------- Event handling ---------------- */

  const swallow = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  /* ---------------- Dragging whole joystick ---------------- */

  const onHandlePointerDown = (e) => {
    if (!movable) return;

    const el = containerRef.current;
    if (!el) return;

    if (e.button != null && e.button !== 0) return;

    handlePointerIdRef.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);

    const parentRect = getParentRect();
    if (!parentRect) return;

    handleDragOffsetRef.current = {
      dx: (e.clientX - parentRect.left) - pos.x,
      dy: (e.clientY - parentRect.top) - pos.y
    };

    swallow(e);
  };

  const onHandlePointerMove = (e) => {
    if (!movable) return;
    if (handlePointerIdRef.current == null) return;
    if (e.pointerId !== handlePointerIdRef.current) return;

    const parentRect = getParentRect();
    if (!parentRect) return;

    const { dx, dy } = handleDragOffsetRef.current;

    const x = (e.clientX - parentRect.left) - dx;
    const y = (e.clientY - parentRect.top) - dy;

    setPosSafe(x, y);
    swallow(e);
  };

  const onHandlePointerUpOrCancel = (e) => {
    if (handlePointerIdRef.current == null) return;
    if (e.pointerId !== handlePointerIdRef.current) return;

    handlePointerIdRef.current = null;
    swallow(e);
  };

  /* ---------------- Joystick knob ---------------- */

  const radius = size / 2;
  const knobRadius = Math.max(16, Math.round(size * 0.22));
  const maxKnobDist = radius - knobRadius;

  const [knob, setKnob] = useState({ x: 0, y: 0 });

  const emit = (xPx, yPx) => {
    const x = maxKnobDist === 0 ? 0 : xPx / maxKnobDist;
    const y = maxKnobDist === 0 ? 0 : -yPx / maxKnobDist;

    const magnitude = Math.min(1, Math.hypot(x, y));
    const angleRad = Math.atan2(y, x);

    const magPx = Math.hypot(xPx, yPx);
    const dir = magPx <= deadZone
      ? "center"
      : angleTo8Dir(angleRad);

    onChange?.({
      x,
      y,
      angleRad,
      magnitude,
      dir
    });
  };

  const setFromClientPoint = (clientX, clientY) => {
    const el = baseRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();

    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    let dx = clientX - cx;
    let dy = clientY - cy;

    const dist = Math.hypot(dx, dy);

    if (dist > maxKnobDist && dist > 0) {
      const s = maxKnobDist / dist;
      dx *= s;
      dy *= s;
    }

    setKnob({ x: dx, y: dy });
    emit(dx, dy);
  };

  const resetStick = () => {
    setKnob({ x: 0, y: 0 });
    emit(0, 0);
  };

  /* ---------------- Stick pointer events ---------------- */

  const onStickPointerDown = (e) => {
    // Prevent simultaneous joystick movement and handle dragging.
    if (handlePointerIdRef.current != null) return;

    if (e.button != null && e.button !== 0) return;

    stickPointerIdRef.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);

    setFromClientPoint(e.clientX, e.clientY);
    swallow(e);
  };

  const onStickPointerMove = (e) => {
    if (stickPointerIdRef.current == null) return;
    if (e.pointerId !== stickPointerIdRef.current) return;

    setFromClientPoint(e.clientX, e.clientY);
    swallow(e);
  };

  const onStickPointerUpOrCancel = (e) => {
    if (stickPointerIdRef.current == null) return;
    if (e.pointerId !== stickPointerIdRef.current) return;

    stickPointerIdRef.current = null;
    resetStick();
    swallow(e);
  };

  /* ---------------- Reset when disabled during dragging ---------------- */

  useEffect(() => {
    if (!movable && handlePointerIdRef.current != null) {
      handlePointerIdRef.current = null;
    }
  }, [movable]);

  /* ---------------- Initial joystick state ---------------- */

  useEffect(() => {
    emit(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- Styles ---------------- */

  const styles = useMemo(() => {
    const border = 2;

    const handleSize = Math.max(28, Math.round(size * 0.24));
    const protrude = Math.round(handleSize * 0.45);

    return {
      container: {
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: size,
        height: size,
        pointerEvents: "auto",
        touchAction: "none",
        userSelect: "none",
        zIndex: 10000
      },

      shellWrap: {
        position: "relative",
        width: size,
        height: size
      },

      circle: {
        position: "absolute",
        inset: 0,
        borderRadius: 999,
        background: "var(--colour-3)",
        border: `${border}px solid var(--colour-4)`,
        boxSizing: "border-box",
        boxShadow: "0 0 10px var(--colour-5)",
        zIndex: 1,
        pointerEvents: "none"
      },

      handle: {
        position: "absolute",
        right: -protrude,
        top: -protrude,
        width: handleSize,
        height: handleSize,
        borderRadius: 999,
        background: "var(--colour-3)",
        border: `${border}px solid var(--colour-4)`,
        boxSizing: "border-box",
        boxShadow: "0 0 5px var(--colour-5)",
        cursor: "grab",
        touchAction: "none",
        display: "grid",
        placeItems: "center",
        zIndex: 3,
        pointerEvents: "auto"
      },

      handleIcon: {
        width: Math.round(handleSize * 0.62),
        height: Math.round(handleSize * 0.62),
        display: "block"
      },

      base: {
        position: "absolute",
        inset: 0,
        borderRadius: 999,
        background: "transparent",
        touchAction: "none",
        userSelect: "none",
        boxSizing: "border-box",
        zIndex: 2,
        pointerEvents: "auto"
      },

      ring: {
        position: "absolute",
        inset: Math.round(size * 0.12),
        borderRadius: 999,
        border: "2px dashed var(--colour-5)",
        opacity: 0.55,
        pointerEvents: "none",
        boxSizing: "border-box"
      },

      centerDot: {
        position: "absolute",
        left: "50%",
        top: "50%",
        width: 7,
        height: 7,
        borderRadius: 999,
        transform: "translate(-50%, -50%)",
        background: "var(--colour-6)",
        opacity: 0.7,
        pointerEvents: "none"
      },

      knob: {
        width: knobRadius * 2,
        height: knobRadius * 2,
        borderRadius: 999,
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) translate(${knob.x}px, ${knob.y}px)`,
        background: "var(--colour-5)",
        border: "2px solid var(--colour-5)",
        boxSizing: "border-box",
        pointerEvents: "none"
      }
    };
  }, [pos.x, pos.y, size, knob.x, knob.y, knobRadius]);

  /* ---------------- Render ---------------- */

  return (
    <div ref={containerRef} style={styles.container}>
      <div style={styles.shellWrap}>
        <div style={styles.circle} />

        {/* Burger handle: only visible and draggable when movable */}
        {movable && (
          <div
            style={styles.handle}
            onPointerDown={onHandlePointerDown}
            onPointerMove={onHandlePointerMove}
            onPointerUp={onHandlePointerUpOrCancel}
            onPointerCancel={onHandlePointerUpOrCancel}
            aria-label="Drag joystick"
            title="Drag joystick"
          >
            <ThreeBarsIcon style={styles.handleIcon} />
          </div>
        )}

        {/* Directional joystick: always usable */}
        <div
          ref={baseRef}
          style={styles.base}
          onPointerDown={onStickPointerDown}
          onPointerMove={onStickPointerMove}
          onPointerUp={onStickPointerUpOrCancel}
          onPointerCancel={onStickPointerUpOrCancel}
        >
          <div style={styles.ring} />
          <div style={styles.centerDot} />
          <div style={styles.knob} />
        </div>
      </div>
    </div>
  );
}

/** Three horizontal bars (SVG) */
function ThreeBarsIcon({ style }) {
  return (
    <svg viewBox="0 0 24 24" style={style} aria-hidden="true">
      <g
        fill="none"
        stroke="var(--colour-5)"
        strokeWidth="2.4"
        strokeLinecap="round"
      >
        <path d="M6 8h12" />
        <path d="M6 12h12" />
        <path d="M6 16h12" />
      </g>
    </svg>
  );
}

/** Maps angle (radians) to 8 directions */
function angleTo8Dir(angleRad) {
  const twoPi = Math.PI * 2;
  let a = angleRad % twoPi;

  if (a < 0) a += twoPi;

  const sector = Math.round((a / twoPi) * 8) % 8;

  // 0=E, 1=NE, 2=N, 3=NW, 4=W, 5=SW, 6=S, 7=SE
  switch (sector) {
    case 0: return "e";
    case 1: return "ne";
    case 2: return "n";
    case 3: return "nw";
    case 4: return "w";
    case 5: return "sw";
    case 6: return "s";
    case 7: return "se";
    default: return "center";
  }
}
