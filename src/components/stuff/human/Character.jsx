import React, { useEffect, useRef, useState } from "react";
import { HumanAnimator } from "./HumanAnimator";
import { Draggable } from "./Draggable";

import {
  standCasual,

  walkStride1,
  walkStride2,
  walkStride3,
  walkStride4,
  walkStride5,
  walkStride6,

  runStride1,
  runStride2,
  runStride3,
  runStride4,
  runStride5,
  runStride6,

  // jump poses
  standJumpPrime,
  standJumpFly,
} from "./poses";

export const Character = () => {
  /* ---------------- Pose state ---------------- */
  const [pose, setPose] = useState(standCasual);
  const [duration, setDuration] = useState(140);
  const [facing, setFacing] = useState("left");

  /* ---------------- Animation refs ---------------- */
  const wrapperRef = useRef(null);

  const poseRef = useRef(standCasual);

  const xRef = useRef(0);     // px
  const yRef = useRef(0);     // px (0 = ground, negative = up)
  const vyRef = useRef(0);    // px/ms (negative = up)

  const lastTsRef = useRef(0);
  const rafRef = useRef(null);
  const animatingRef = useRef(false);

  const directionRef = useRef(null); // "left" | "right" | null
  const runningRef = useRef(false);

  const strideIndexRef = useRef(0);
  const strideTimerRef = useRef(0);

  /* ---------------- Strides ---------------- */
  const walkStrides = [
    walkStride1,
    walkStride2,
    walkStride3,
    walkStride4,
    walkStride5,
    walkStride6,
  ];

  const runStrides = [
    runStride1,
    runStride2,
    runStride3,
    runStride4,
    runStride5,
    runStride6,
  ];

  /* ---------------- Movement tuning ---------------- */
  const WALK_FRAME = 150;
  const RUN_FRAME = 100;
  const WALK_VELOCITY = 0.20; // px/ms
  const RUN_VELOCITY = 0.40;  // px/ms

  const VIEW_W = 10;
  const VIEW_H = 10;

  /* ---------------- Jump physics tuning ---------------- */
  const GRAVITY = 0.002;        // px/ms^2
  const JUMP_VY_TAP = -0.45;    // px/ms
  const JUMP_VY_HOLD = -0.68;   // px/ms
  const RUN_JUMP_VY_MULT = 1.05;

  const TAP_THRESHOLD = 160;    // ms < this = tap
  const PRIME_MS = 110;         // how long to *hold* standJumpPrime before takeoff + after landing
  const PRIME_CROUCH_PX = 8;    // visual crouch only during prime

  /* ---------------- Jump refs ---------------- */
  // jumpState: "none" | "prime" | "air" | "land"
  const jumpStateRef = useRef("none");
  const jumpTimerRef = useRef(0);

  const wHeldRef = useRef(false);
  const jumpHoldStartRef = useRef(0);

  /* ---------------- Helpers ---------------- */
  const setPoseNow = (nextPose, nextDuration) => {
    poseRef.current = nextPose;
    setPose(nextPose);
    setDuration(nextDuration);
  };

  const applyTransform = (x, y, primeCrouch) => {
    if (!wrapperRef.current) return;

    const displayY = y + (primeCrouch ? PRIME_CROUCH_PX : 0);

    wrapperRef.current.style.transform =
      `translate3d(-50%, -50%, 0) translate(${x}px, ${displayY}px)`;
  };

  const ensureLoop = () => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    lastTsRef.current = 0;
    rafRef.current = requestAnimationFrame(loop);
  };

  const stopLoopIfIdle = () => {
    const hasDir = !!directionRef.current;
    const jumping = jumpStateRef.current !== "none";

    if (!hasDir && !jumping) {
      animatingRef.current = false;
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      strideIndexRef.current = 0;
      strideTimerRef.current = 0;
      setDuration(120);
      if (jumpStateRef.current === "none") setPoseNow(standCasual, 120);
    }
  };

  /* ---------------- Movement control ---------------- */
  const beginMovement = () => {
    const running = runningRef.current;
    const strides = running ? runStrides : walkStrides;
    const frame = running ? RUN_FRAME : WALK_FRAME;

    strideIndexRef.current = 1;
    strideTimerRef.current = 0;

    if (jumpStateRef.current === "none") {
      setPoseNow(strides[0], frame);
    }

    ensureLoop();
  };

  /* ---------------- Jump control ---------------- */
  const startJump = () => {
    if (jumpStateRef.current !== "none") return;

    // Enter PRIME state immediately and HOLD it for PRIME_MS so it visibly appears.
    jumpStateRef.current = "prime";
    jumpTimerRef.current = 0;

    wHeldRef.current = true;
    jumpHoldStartRef.current = Date.now();

    // Pre-set initial vy to HOLD; can be downgraded on keyup to TAP
    const running = runningRef.current;
    vyRef.current = JUMP_VY_HOLD * (running ? RUN_JUMP_VY_MULT : 1);

    // Grounded at prime
    yRef.current = 0;

    setPoseNow(standJumpPrime, PRIME_MS);
    ensureLoop();
  };

  const endJumpHold = () => {
    wHeldRef.current = false;

    // If we haven't left prime yet, we can still decide tap vs hold cleanly.
    // (We intentionally "take off" only after PRIME_MS.)
    if (jumpStateRef.current === "prime") {
      const holdMs = Date.now() - jumpHoldStartRef.current;
      if (holdMs < TAP_THRESHOLD) {
        vyRef.current = JUMP_VY_TAP * (runningRef.current ? RUN_JUMP_VY_MULT : 1);
      }
      return;
    }

    // If already airborne, do nothing (keeps arc stable, no teleporting).
  };

  /* ---------------- rAF loop ---------------- */
  const loop = (ts) => {
    if (!lastTsRef.current) lastTsRef.current = ts;
    const rawDt = ts - lastTsRef.current;
    const dt = Math.min(50, rawDt);
    lastTsRef.current = ts;

    const dir = directionRef.current;
    const running = runningRef.current;

    /* Horizontal movement (allowed during jump as well) */
    if (dir) {
      const velocity = running ? RUN_VELOCITY : WALK_VELOCITY;
      xRef.current += (dir === "right" ? 1 : -1) * velocity * dt;
    }

    /* Jump state machine */
    const jumpState = jumpStateRef.current;

    if (jumpState === "prime") {
      // Hold prime pose on ground for PRIME_MS, then take off.
      jumpTimerRef.current += dt;

      if (jumpTimerRef.current >= PRIME_MS) {
        jumpStateRef.current = "air";
        jumpTimerRef.current = 0;

        // Switch to fly pose immediately when leaving ground
        setPoseNow(standJumpFly, 220);
      }
    } else if (jumpState === "air") {
      vyRef.current += GRAVITY * dt;
      yRef.current += vyRef.current * dt;

      // Landing detection
      if (vyRef.current > 0 && yRef.current >= 0) {
        yRef.current = 0;
        vyRef.current = 0;

        jumpStateRef.current = "land";
        jumpTimerRef.current = 0;

        // Show prime after landing for PRIME_MS (visibly)
        setPoseNow(standJumpPrime, PRIME_MS);
      }
    } else if (jumpState === "land") {
      jumpTimerRef.current += dt;

      if (jumpTimerRef.current >= PRIME_MS) {
        jumpStateRef.current = "none";
        jumpTimerRef.current = 0;

        if (directionRef.current) {
          beginMovement();
        } else {
          setPoseNow(standCasual, 120);
        }
      }
    } else {
      /* Stride animation (only when not jumping) */
      if (dir) {
        strideTimerRef.current += dt;

        const frame = running ? RUN_FRAME : WALK_FRAME;
        const strides = running ? runStrides : walkStrides;

        if (strideTimerRef.current >= frame) {
          strideTimerRef.current -= frame;
          const i = strideIndexRef.current % strides.length;
          strideIndexRef.current = i + 1;
          setPoseNow(strides[i], frame);
        }
      } else {
        // idle
        strideTimerRef.current = 0;
        strideIndexRef.current = 0;
      }
    }

    // Apply transform: prime crouch only in prime/land states (grounded)
    const primeCrouch =
      jumpStateRef.current === "prime" || jumpStateRef.current === "land";

    applyTransform(xRef.current, yRef.current, primeCrouch);

    // Keep looping while we have movement or any jump state active
    if (animatingRef.current && (directionRef.current || jumpStateRef.current !== "none")) {
      rafRef.current = requestAnimationFrame(loop);
    } else {
      stopLoopIfIdle();
    }
  };

  /* ---------------- Keyboard input ---------------- */
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.repeat) return;

      let dir = null;
      if (e.key === "a" || e.key === "A") dir = "left";
      if (e.key === "d" || e.key === "D") dir = "right";

      if (dir) {
        directionRef.current = dir;
        runningRef.current = e.shiftKey;
        setFacing(dir);
        beginMovement();
      }

      if (e.key === "Shift" && directionRef.current) {
        runningRef.current = true;
        beginMovement();
      }

      // Jump immediately on keydown W
      if (e.key === "w" || e.key === "W") {
        startJump();
      }
    };

    const onKeyUp = (e) => {
      const key = e.key.toLowerCase();

      if (
        (key === "a" && directionRef.current === "left") ||
        (key === "d" && directionRef.current === "right")
      ) {
        directionRef.current = null;
        runningRef.current = false;
        stopLoopIfIdle();
      }

      if (key === "shift") {
        runningRef.current = false;
      }

      if (key === "w") {
        endJumpHold();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ---------------- Init ---------------- */
  useEffect(() => {
    applyTransform(xRef.current, yRef.current, false);
  }, []);

  /* ---------------- Render ---------------- */
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <Draggable>
        <div
          ref={wrapperRef}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            willChange: "transform",
            pointerEvents: "auto",
          }}
        >
          <div
            style={{
              width: VIEW_W,
              height: VIEW_H,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `scaleX(${facing === "left" ? 1 : -1})`,
              transformOrigin: "50% 50%",
            }}
          >
            <HumanAnimator
              targetPose={pose}
              duration={duration}
              debug={false}
              humanScale={0.5}
            />
          </div>
        </div>
      </Draggable>
    </div>
  );
};
