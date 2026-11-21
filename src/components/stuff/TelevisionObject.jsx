import { useEffect, useRef, useState } from "react";
import tvOn from "../../assets/stuff/tv/tv_on.png";
import tvOff from "../../assets/stuff/tv/tv_off.png";
import tvBuzz from "../../assets/stuff/tv/tv_buzz.png";
import tvAntenna from "../../assets/stuff/tv/tv_antenna.png";
import ch1 from "../../assets/stuff/tv/simpsons.mp4";
import ch2 from "../../assets/stuff/tv/butter.mp4";
import ch3 from "../../assets/stuff/tv/comedy.mp4";
import ch4 from "../../assets/stuff/tv/surfer.mp4";
import ch5 from "../../assets/stuff/tv/bean.mp4";

const CHANNELS = [
  { src: ch1, frame: { x: 0, y: 7, w: 110, h: 100 }, crop: { x: 0, y: 0, scale: 0.85 } },
  { src: ch2, frame: { x: -15, y: 7, w: 150, h: 105 }, crop: { x: 0, y: 0, scale: 0.80 } },
  { src: ch3, frame: { x: -15, y: 5, w: 155, h: 115 }, crop: { x: 0, y: 0, scale: 0.75 } },
  { src: ch4, frame: { x: -20, y: 5, w: 180, h: 115 }, crop: { x: 0, y: 0, scale: 0.75 } },
  { src: ch5, frame: { x: -10, y: 5, w: 180, h: 115 }, crop: { x: 0, y: 0, scale: 0.75 } },
];

const shuffle = (arr) => {
  const next = [...arr];

  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }

  return next;
};

// Size of the TV
const TV_WIDTH_MOBILE = "48vw";
const TV_WIDTH_DESKTOP = "16vw";

// Centre of mass as a fraction of the TV image (0,0 = top-left, 1,1 = bottom-right).
// The TV rotates about this point. Lower values of y make it heavier at the bottom.
const COM = { x: 0.5, y: 0.55 };

// Physics tuning (units are pixels and seconds)
const GRAVITY = 2400;          // px/s^2
const RESTITUTION = 0.35;      // bounciness of impacts (0 = dead, 1 = perfectly bouncy)
const FRICTION = 0.5;          // sliding friction against the floor and walls
const REST_SPEED = 60;         // impacts slower than this (px/s) don't bounce
const IMPACT_SPEED = 150;      // a collision faster than this (px/s) counts as a hit
const CHANNEL_COOLDOWN = 3000; // ms that must pass between hits that change the channel
const REARM_AIR_TIME = 0.1;    // seconds off every wall before the TV can register another hit
const LINEAR_DAMPING = 0.15;   // air resistance (per second)
const ANGULAR_DAMPING = 0.8;   // spin resistance (per second)
const DRAG_STIFFNESS = 220;    // how strongly the pointer pulls on the grabbed point
const DRAG_DAMPING = 32;       // stops the grabbed TV from swinging forever
const MAX_FRAME = 1 / 30;      // longest time step simulated per frame
const SUB_STEP = 1 / 120;      // physics sub-step size

// ---- PHYSICS START ----

// Moment of inertia about the centre of mass (mass = 1)
const getInertia = (w, h) =>
  (w * w + h * h) / 12 +
  ((COM.x - 0.5) * w) ** 2 +
  ((COM.y - 0.5) * h) ** 2;

// Corner positions relative to the centre of mass, rotated into the world orientation
const getCorners = (angle, w, h) => {
  const ox = COM.x * w;
  const oy = COM.y * h;
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  return [[-ox, -oy], [w - ox, -oy], [w - ox, h - oy], [-ox, h - oy]].map(([lx, ly]) => ({
    rx: lx * c - ly * s,
    ry: lx * s + ly * c,
  }));
};

// Lowest point of the TV in screen coordinates
const getLowestY = (b, w, h) =>
  Math.max(...getCorners(b.angle, w, h).map(({ ry }) => b.y + ry));

// Pushes the TV back inside the screen and bounces it. Returns the speed of the hardest hit.
const resolveCollisions = (b, w, h, W, H) => {
  const I = getInertia(w, h);

  // Each plane keeps points where nx*x + ny*y >= d
  const planes = [
    { nx: 0, ny: -1, d: -H },               // floor
    { nx: 1, ny: 0, d: 0 },                 // left wall
    { nx: -1, ny: 0, d: -W },               // right wall
    { nx: 0, ny: 1, d: 0 },                 // ceiling
  ];

  const corners = getCorners(b.angle, w, h);
  let impact = 0;

  for (let iter = 0; iter < 4; iter++) {
    for (const pl of planes) {
      for (const { rx, ry } of corners) {
        const depth = pl.d - (pl.nx * (b.x + rx) + pl.ny * (b.y + ry));
        if (depth <= 0) continue;

        // Move out of the wall
        b.x += pl.nx * depth;
        b.y += pl.ny * depth;

        // Velocity of this corner
        const vx = b.vx - b.omega * ry;
        const vy = b.vy + b.omega * rx;
        const vn = vx * pl.nx + vy * pl.ny;
        if (vn >= 0) continue;

        // Bounce along the normal, which also applies a torque about the centre of mass
        const rn = rx * pl.ny - ry * pl.nx;
        const e = -vn < REST_SPEED ? 0 : RESTITUTION;
        const jn = (-(1 + e) * vn) / (1 + (rn * rn) / I);
        b.vx += jn * pl.nx;
        b.vy += jn * pl.ny;
        b.omega += (jn * rn) / I;

        impact = Math.max(impact, -vn);

        // Friction along the surface
        const tx = -pl.ny;
        const ty = pl.nx;
        const vtx = b.vx - b.omega * ry;
        const vty = b.vy + b.omega * rx;
        const vt = vtx * tx + vty * ty;
        const rt = rx * ty - ry * tx;
        const maxFriction = FRICTION * jn;
        const jt = Math.max(-maxFriction, Math.min(maxFriction, -vt / (1 + (rt * rt) / I)));
        b.vx += jt * tx;
        b.vy += jt * ty;
        b.omega += (jt * rt) / I;
      }
    }
  }

  return impact;
};

// Advances the TV by dt seconds. Returns the speed of the hardest hit (0 if none).
const stepBody = (b, drag, w, h, W, H, dt) => {
  if (!w || !h) return 0;

  const I = getInertia(w, h);
  let ax = 0;
  let ay = GRAVITY;
  let alpha = 0;

  // While held, a spring pulls the grabbed point towards the pointer
  if (drag.active) {
    const c = Math.cos(b.angle);
    const s = Math.sin(b.angle);
    const rx = drag.localX * c - drag.localY * s;
    const ry = drag.localX * s + drag.localY * c;
    const pvx = b.vx - b.omega * ry;
    const pvy = b.vy + b.omega * rx;
    const fx = DRAG_STIFFNESS * (drag.targetX - (b.x + rx)) - DRAG_DAMPING * pvx;
    const fy = DRAG_STIFFNESS * (drag.targetY - (b.y + ry)) - DRAG_DAMPING * pvy;
    ax += fx;
    ay += fy;
    alpha += (rx * fy - ry * fx) / I;
  }

  b.vx += ax * dt;
  b.vy += ay * dt;
  b.omega += alpha * dt;

  b.vx *= Math.exp(-LINEAR_DAMPING * dt);
  b.vy *= Math.exp(-LINEAR_DAMPING * dt);
  b.omega *= Math.exp(-ANGULAR_DAMPING * dt);

  b.x += b.vx * dt;
  b.y += b.vy * dt;
  b.angle += b.omega * dt;

  return resolveCollisions(b, w, h, W, H);
};

// ---- PHYSICS END ----

export const TelevisionObject = ({ mobileMode, onInteract }) => {
  const [dragging, setDragging] = useState(false);
  const [tvState, setTvState] = useState("off");
  const [channel, setChannel] = useState(0);
  const [placed, setPlaced] = useState(false);

  const wrapperRef = useRef(null);
  const containerRef = useRef(null);

  // Physics state lives in refs so the animation loop doesn't re-render React every frame.
  // x, y is the centre of mass in screen pixels; angle is in radians (clockwise).
  const body = useRef({ x: 0, y: 0, vx: 0, vy: 0, angle: 0, omega: 0 });
  const dragRef = useRef({ active: false, localX: 0, localY: 0, targetX: 0, targetY: 0 });
  const placedRef = useRef(false);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const restTimeRef = useRef(0);
  const armedRef = useRef(true);   // a hit only counts once the TV has left the walls since the last one
  const airTimeRef = useRef(0);
  const loopRef = useRef(null);
  const hitRef = useRef(null);
  const tvStateRef = useRef(tvState);
  tvStateRef.current = tvState;

  const queueRef = useRef([]);
  const queueIndexRef = useRef(0);
  const lastChangeRef = useRef(0);

  const current = CHANNELS[channel];
  const tvWidth = mobileMode ? TV_WIDTH_MOBILE : TV_WIDTH_DESKTOP;

  const getCoords = (e) => {
    if (e.touches?.length) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }

    return { x: e.clientX, y: e.clientY };
  };

  const getSize = () => ({
    w: wrapperRef.current?.offsetWidth ?? 0,
    h: wrapperRef.current?.offsetHeight ?? 0,
  });

  // Pointer position relative to the centre of mass, in the TV's own (rotated) frame
  const toBodyFrame = (x, y) => {
    const b = body.current;
    const dx = x - b.x;
    const dy = y - b.y;
    const c = Math.cos(b.angle);
    const s = Math.sin(b.angle);
    const lx = dx * c + dy * s;
    const ly = -dx * s + dy * c;
    return { lx, ly };
  };

  // Draws the TV: rotate about the centre of mass, then move it into place
  const applyTransform = () => {
    const el = wrapperRef.current;
    if (!el) return;

    const { w, h } = getSize();
    const ox = COM.x * w;
    const oy = COM.y * h;
    const b = body.current;

    el.style.transformOrigin = `${ox}px ${oy}px`;
    el.style.transform = `translate(${b.x - ox}px, ${b.y - oy}px) rotate(${b.angle}rad)`;
  };

  // Starts the TV resting on the floor at the left of the screen
  const place = () => {
    const { w, h } = getSize();
    if (placedRef.current || !w || !h) return;

    const b = body.current;
    b.x = 16 + COM.x * w;
    b.y = window.innerHeight - h + COM.y * h;
    b.vx = 0;
    b.vy = 0;
    b.angle = 0;
    b.omega = 0;

    placedRef.current = true;
    applyTransform();
    setPlaced(true);
  };

  const wake = () => {
    restTimeRef.current = 0;
    if (rafRef.current == null && placedRef.current) {
      lastTimeRef.current = null;
      rafRef.current = requestAnimationFrame((t) => loopRef.current(t));
    }
  };

  const loop = (time) => {
    rafRef.current = null;
    if (!wrapperRef.current || !placedRef.current) return;

    const b = body.current;
    const last = lastTimeRef.current ?? time;
    lastTimeRef.current = time;

    const frameDt = Math.min((time - last) / 1000, MAX_FRAME);
    const { w, h } = getSize();
    const W = window.innerWidth;
    const H = window.innerHeight;

    const subSteps = Math.max(1, Math.ceil(frameDt / SUB_STEP));
    const dt = frameDt / subSteps;
    let impact = 0;
    for (let i = 0; i < subSteps; i++) {
      impact = Math.max(impact, stepBody(b, dragRef.current, w, h, W, H, dt));
    }

    applyTransform();

    // Count one hit per collision: pressing the TV against a wall (or resting on the floor)
    // isn't a new collision, so it must be airborne for a moment before it can hit again
    if (impact > 0) {
      airTimeRef.current = 0;
    } else {
      airTimeRef.current += frameDt;
      if (airTimeRef.current > REARM_AIR_TIME) armedRef.current = true;
    }

    if (impact > IMPACT_SPEED && armedRef.current) {
      armedRef.current = false;
      hitRef.current?.();
    }

    // Go to sleep once the TV has been still on the floor for a moment
    const onFloor = getLowestY(b, w, h) >= H - 1;
    const still = Math.hypot(b.vx, b.vy) < 30 && Math.abs(b.omega) < 0.15;
    if (!dragRef.current.active && onFloor && still) {
      restTimeRef.current += frameDt;
    } else {
      restTimeRef.current = 0;
    }

    if (restTimeRef.current > 0.3) {
      b.vx = 0;
      b.vy = 0;
      b.omega = 0;
      lastTimeRef.current = null;
      return;
    }

    rafRef.current = requestAnimationFrame((t) => loopRef.current(t));
  };
  loopRef.current = loop;

  const startNewCycle = () => {
    const nextQueue = shuffle([...Array(CHANNELS.length).keys()]);
    queueRef.current = nextQueue;
    queueIndexRef.current = 0;

    setChannel(nextQueue[0]);
    setTvState("on");
  };

  const advanceChannel = () => {
    const nextIndex = queueIndexRef.current + 1;

    if (nextIndex < queueRef.current.length) {
      queueIndexRef.current = nextIndex;
      setChannel(queueRef.current[nextIndex]);
      return;
    }

    queueRef.current = [];
    queueIndexRef.current = 0;
    setTvState("off");
  };

  // A hard collision turns the TV on, or moves to the next channel, at most once per cooldown
  hitRef.current = () => {
    const now = performance.now();
    if (now - lastChangeRef.current < CHANNEL_COOLDOWN) return;
    lastChangeRef.current = now;

    if (tvStateRef.current === "off" || queueRef.current.length === 0) {
      tvStateRef.current = "on"; // guard against a second hit before React re-renders
      startNewCycle();
    } else {
      advanceChannel();
    }
  };

  // Pressing anywhere on the TV picks it up
  const handleDown = (e) => {
    const { x, y } = getCoords(e);
    const { lx, ly } = toBodyFrame(x, y);

    // Grab the TV at the point that was pressed
    dragRef.current = { active: true, localX: lx, localY: ly, targetX: x, targetY: y };

    setDragging(true);
    wake();
    onInteract?.();
    e.preventDefault();
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e) => {
      const { x, y } = getCoords(e);
      dragRef.current.targetX = x;
      dragRef.current.targetY = y;
      e.preventDefault();
    };

    const handleUp = () => {
      dragRef.current.active = false;
      setDragging(false);
      wake();
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);
    window.addEventListener("touchcancel", handleUp);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("touchend", handleUp);
      window.removeEventListener("touchcancel", handleUp);
    };
  }, [dragging]);

  // Place the TV once its image has loaded, and keep it on screen when the window resizes
  useEffect(() => {
    if (containerRef.current?.complete) place();

    const onResize = () => {
      applyTransform();
      wake();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  // The TV's size can change with its state or the screen mode, so redraw and let it settle
  useEffect(() => {
    applyTransform();
    wake();
  }, [tvState, mobileMode]);

  const wrapperStyle = {
    position: "fixed",
    left: 0,
    top: 0,
    width: tvWidth,
    zIndex: 1000,
    userSelect: "none",
    touchAction: "none",
    visibility: placed ? "visible" : "hidden",
    cursor: dragging ? "grabbing" : "grab"
  };

  const tvImageStyle = {
    width: "100%",
    display: "block",
    position: "relative",
    zIndex: 2
  };

  const screenStyle = {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    zIndex: 1,
    overflow: "hidden",
    pointerEvents: "none"
  };

  const buzzStyle = {
    position: "absolute",
    left: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover",
    zIndex: 0
  };

  const frameStyle = {
    position: "absolute",
    left: `${current.frame.x}%`,
    bottom: `${current.frame.y}%`,
    width: `${current.frame.w}%`,
    height: `${current.frame.h}%`,
    overflow: "hidden",
    zIndex: 1
  };

  const videoStyle = {
    width: "100%",
    height: "100%",
    display: "block",
    objectFit: "cover",
    objectPosition: `${current.crop.x}% ${current.crop.y}%`,
    transform: `scale(${current.crop.scale})`,
    transformOrigin: "bottom left"
  };

  const antennaStyle = {
    position: "absolute",
    left: "50%",
    top: "-28%",
    width: "32%",
    transform: "translateX(-50%)",
    zIndex: 2,
    pointerEvents: "none",
    userSelect: "none"
  };

  return (
    <div ref={wrapperRef} style={wrapperStyle}>
      <div style={screenStyle}>
        <img
          src={tvBuzz}
          alt="tuning"
          style={buzzStyle}
          draggable={false}
        />

        {tvState === "on" && (
          <div style={frameStyle}>
            <video
              key={channel}
              src={current.src}
              autoPlay
              loop
              muted
              playsInline
              style={videoStyle}
            />
          </div>
        )}
      </div>

      <img
        src={tvAntenna}
        alt="antenna"
        style={antennaStyle}
        draggable={false}
      />

      <img
        ref={containerRef}
        src={tvState === "off" ? tvOff : tvOn}
        alt="tv"
        style={tvImageStyle}
        draggable={false}
        onLoad={place}
        onMouseDown={handleDown}
        onTouchStart={handleDown}
      />
    </div>
  );
};