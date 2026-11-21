
import { useEffect, useRef, useState } from "react";
import soccerImage from "../../assets/stuff/ball/soccer.png";
import bowlingImage from "../../assets/stuff/ball/bowling.png";
import volleyImage from "../../assets/stuff/ball/volley.png";
import beachImage from "../../assets/stuff/ball/beach.png";
import eightImage from "../../assets/stuff/ball/eight.png";
import paperImage from "../../assets/stuff/ball/paper.png";
import pinImage from "../../assets/stuff/ball/pin.png";
import bouncyImage from "../../assets/stuff/ball/bouncy.png";
import baseImage from "../../assets/stuff/ball/base.png";
import janzenImage from "../../assets/stuff/ball/janzen.png";
import fatzenImage from "../../assets/stuff/ball/fatzen.png";

/* =====================================
   GLOBAL PHYSICS SETTINGS
===================================== */

const GLOBAL = {
  releaseDamping: 0.25,
  frameMs: 16.6667,
  stopThreshold: 0.015,
  mobileScale: 2 / 3,
};

/* =====================================
   BALL TYPES
===================================== */

const BALL_TYPES = [
  { name: "Soccer",     image: soccerImage,  size: 120, spawnWeight: 10, weight: 1,    gravity: 0.5,  airFriction: 0.995,  groundFriction: 0.92,   bounce: 0.75, spin: 0.5,  wallBounce: 0.75 },
  { name: "Bowling",    image: bowlingImage, size: 120, spawnWeight: 10, weight: 4,    gravity: 0.9,  airFriction: 0.999,  groundFriction: 0.9999, bounce: 0.6,  spin: 0.7,  wallBounce: 0.6 },
  { name: "Volley",     image: volleyImage,  size: 120, spawnWeight: 10, weight: 0.8,  gravity: 0.5,  airFriction: 0.995,  groundFriction: 0.96,   bounce: 0.8,  spin: 0.5,  wallBounce: 0.8 },
  { name: "Beach",      image: beachImage,   size: 240, spawnWeight: 10, weight: 0.1,  gravity: 0.25, airFriction: 0.995,  groundFriction: 0.92,   bounce: 0.7,  spin: 0.5,  wallBounce: 0.7 },
  { name: "Eight",      image: eightImage,   size: 90,  spawnWeight: 10, weight: 0.5,  gravity: 0.5,  airFriction: 0.995,  groundFriction: 0.995,  bounce: 0.5,  spin: 1.0,  wallBounce: 0.7 },
  { name: "Pin",        image: pinImage,     size: 80,  spawnWeight: 10, weight: 1,    gravity: 0.5,  airFriction: 0.9999, groundFriction: 0.9999, bounce: 0.6,  spin: 0,    wallBounce: 0.6 },
  { name: "Bouncy",     image: bouncyImage,  size: 160, spawnWeight: 10, weight: 0.8,  gravity: 0.5,  airFriction: 0.995,  groundFriction: 0.92,   bounce: 0.9,  spin: 0.5,  wallBounce: 0.9 },
  { name: "Base",       image: baseImage,    size: 100, spawnWeight: 10, weight: 0.8,  gravity: 0.4,  airFriction: 0.999,  groundFriction: 0.95,   bounce: 0.6,  spin: 0.5,  wallBounce: 0.9 },
  { name: "Paper",      image: paperImage,   size: 100, spawnWeight: 5,  weight: 0.5,  gravity: 0.5,  airFriction: 0.995,  groundFriction: 0.5,    bounce: 0.1,  spin: 0.8,  wallBounce: 0.1 },
  { name: "Janzen",     image: janzenImage,  size: 180, spawnWeight: 5,  weight: 1.0,  gravity: 0.35, airFriction: 0.999,  groundFriction: 0.95,   bounce: 0.6,  spin: 0.25, wallBounce: 0.9 },
  { name: "Fat Janzen", image: fatzenImage,  size: 120, spawnWeight: 1,  weight: 1.0,  gravity: 0.5,  airFriction: 0.995,  groundFriction: 0.95,   bounce: 0.6,  spin: 0.2,  wallBounce: 0.6 },
];

/* =====================================
   WEIGHTED RANDOM SELECTION
===================================== */

const getRandomBall = () => {
  const totalWeight = BALL_TYPES.reduce(
    (total, ball) => total + Math.max(0, ball.spawnWeight),
    0
  );

  if (totalWeight <= 0) {
    throw new Error("At least one ball must have a spawnWeight above 0.");
  }

  let random = Math.random() * totalWeight;

  for (const ball of BALL_TYPES) {
    random -= Math.max(0, ball.spawnWeight);

    if (random < 0) {
      return ball;
    }
  }

  return BALL_TYPES[BALL_TYPES.length - 1];
};

/* =====================================
   RANDOM BALL COMPONENT
===================================== */

export const Ball = ({ mobileMode }) => {
  const [settings] = useState(() => getRandomBall());

  const {
    name,
    image,
    weight,
    gravity,
    airFriction,
    groundFriction,
    bounce,
    spin,
    wallBounce,
  } = settings;

  // Responsive ball size
  const size = settings.size * (
    mobileMode ? GLOBAL.mobileScale : 1
  );

  const mass = Math.max(weight, 0.01);

  // Randomise rotation speed slightly
  const rotationSpeed = useRef(0.8 + Math.random() * 0.4);

  /* =====================================
     INITIAL POSITION
  ===================================== */

  const initial = {
    x: window.innerWidth / 2 - size / 2,
    y: window.innerHeight / 2 - size / 2,
  };

  /* =====================================
     STATE
  ===================================== */

  const [position, setPosition] = useState(initial);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const ball = useRef({
    x: initial.x,
    y: initial.y,
    vx: 0,
    vy: 0,
  });

  const offset = useRef({ x: 0, y: 0 });

  const pointer = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    t: 0,
  });

  const pointerType = useRef(null);

  /* =====================================
     POINTER HELPERS
  ===================================== */

  const getCoords = (e) => {
    if (e.touches?.length) {
      return {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }

    return {
      x: e.clientX,
      y: e.clientY,
    };
  };

  /* =====================================
     DRAG HANDLERS
  ===================================== */

  const handleDown = (e) => {
    const { x, y } = getCoords(e);

    pointerType.current = e.touches ? "touch" : "mouse";

    offset.current = {
      x: x - ball.current.x,
      y: y - ball.current.y,
    };

    ball.current.vx = 0;
    ball.current.vy = 0;

    pointer.current = {
      x,
      y,
      vx: 0,
      vy: 0,
      t: performance.now(),
    };

    setIsDragging(true);

    e.preventDefault();
  };

  const handleMove = (e) => {
    if (!isDragging) return;
    if (pointerType.current === "mouse" && e.buttons === 0) return;

    const { x, y } = getCoords(e);
    const now = performance.now();

    const dx = x - pointer.current.x;
    const dy = y - pointer.current.y;
    const dt = Math.max(now - pointer.current.t, 1);

    const vx = (dx / dt) * GLOBAL.frameMs;
    const vy = (dy / dt) * GLOBAL.frameMs;

    pointer.current = {
      x,
      y,
      vx: pointer.current.vx * 0.3 + vx * 0.7,
      vy: pointer.current.vy * 0.3 + vy * 0.7,
      t: now,
    };

    ball.current.x = x - offset.current.x;
    ball.current.y = y - offset.current.y;

    setPosition({
      x: ball.current.x,
      y: ball.current.y,
    });

    e.preventDefault();
  };

  const handleUp = () => {
    if (!isDragging) return;

    ball.current.vx = pointer.current.vx * GLOBAL.releaseDamping;
    ball.current.vy = pointer.current.vy * GLOBAL.releaseDamping;

    setIsDragging(false);
    pointerType.current = null;
  };

  /* =====================================
     PHYSICS LOOP
  ===================================== */

  useEffect(() => {
    let raf;

    const animate = () => {
      const b = ball.current;

      if (!isDragging) {
        const floor = window.innerHeight - size;
        const right = window.innerWidth - size;

        // Gravity
        b.vy += gravity;

        // Movement
        b.x += b.vx;
        b.y += b.vy;

        // Floor collision
        if (b.y >= floor) {
          b.y = floor;

          b.vy *= -bounce;
          b.vx *= groundFriction;

          if (Math.abs(b.vy) < GLOBAL.stopThreshold) {
            b.vy = 0;
          }
        }

        // Ceiling collision
        else if (b.y <= 0) {
          b.y = 0;
          b.vy *= -wallBounce;
        }

        // Wall collisions
        if (b.x <= 0) {
          b.x = 0;
          b.vx *= -wallBounce;
        } else if (b.x >= right) {
          b.x = right;
          b.vx *= -wallBounce;
        }

        // Air friction
        b.vx *= airFriction;
        b.vy *= airFriction;

        // Mass-dependent damping
        const damping = 1 / (1 + (mass - 1) * 0.001);

        b.vx *= damping;
        b.vy *= damping;

        // Stop tiny remaining movement
        if (Math.abs(b.vx) < GLOBAL.stopThreshold) {
          b.vx = 0;
        }

        if (Math.abs(b.vy) < GLOBAL.stopThreshold) {
          b.vy = 0;
        }

        // Update React state only when moving
        if (b.vx !== 0 || b.vy !== 0 || gravity !== 0) {
          setPosition({ x: b.x, y: b.y });
          setRotation((r) => r + b.vx * spin * rotationSpeed.current);
        }
      }

      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(raf);
  }, [
    isDragging,
    size,
    gravity,
    airFriction,
    groundFriction,
    bounce,
    wallBounce,
    mass,
    spin,
  ]);

  /* =====================================
     MOUSE CAPTURE
  ===================================== */

  useEffect(() => {
    const move = (e) => {
      if (pointerType.current === "mouse") handleMove(e);
    };

    const up = () => {
      if (pointerType.current === "mouse") handleUp();
    };

    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);

    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
  }, [isDragging]);

  /* =====================================
     RENDER
  ===================================== */

  return (
    <div
      onMouseDown={handleDown}
      onTouchStart={handleDown}
      onTouchMove={handleMove}
      onTouchEnd={handleUp}
      onTouchCancel={handleUp}
      style={{
        position: "fixed",
        left: position.x,
        top: position.y,
        width: size,
        height: size,

        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
        userSelect: "none",

        zIndex: 1000,
      }}
    >
      <img
        src={image}
        alt={name}
        draggable={false}
        style={{
          position: "absolute",
          width: size * 3,
          height: size * 3,
          left: -size,
          top: -size,

          objectFit: "contain",
          pointerEvents: "none",

          transform: `rotate(${rotation}deg)`,
          transformOrigin: "center",
        }}
      />
    </div>
  );
};
