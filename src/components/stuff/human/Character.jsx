import React, { useEffect, useRef, useState } from "react";
import { HumanAnimator } from "./HumanAnimator";

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

  // stand jump poses
  standJumpPrime,
  standJumpFly,
  standJumpLand,

  // walk / run jump poses
  walkJumpFly,
  jumpPrime,
  jumpFly,
  jumpPeak,
  jumpFall,
  jumpLand,

  // grab struggle poses
  struggle1,
  struggle2,

  // crouch poses
  crouch,
  crouchWalk1,
  crouchWalk2
} from "./poses";

export const Character = ({ darkMode }) => {
  /* ---------------- Minimal React state ---------------- */
  const [pose, setPose] = useState(standCasual);
  const [duration, setDuration] = useState(140);
  const [facing, setFacing] = useState("left");
  const [isDraggingUi, setIsDraggingUi] = useState(false);

  /* ---------------- DOM refs ---------------- */
  const wrapperRef = useRef(null);

  /* ---------------- World coords ----------------
     xRef: px offset from viewport center
     yAirRef: px offset from "ground" (0 on ground, negative up)
  ------------------------------------------------ */
  const xRef = useRef(0);
  const yAirRef = useRef(0);
  const vyRef = useRef(0); // px/ms (negative up)

  /* ---------------- Drag world anchor (prevents drift) ---------------- */
  const dragWorldRef = useRef({ x: 0, y: 0 }); // offsets from center, px

  /* ---------------- Loop refs ---------------- */
  const lastTsRef = useRef(0);
  const rafRef = useRef(null);
  const animatingRef = useRef(false);

  /* ---------------- Input refs ---------------- */
  const directionRef = useRef(null); // "left" | "right" | null
  const runningRef = useRef(false);

  const sHeldRef = useRef(false);
  const crouchingRef = useRef(false);      // true when S held
  const crouchMovingRef = useRef(false);   // true when S + A/D
  const crouchPhaseRef = useRef(0);        // 0 -> crouchWalk1, 1 -> crouchWalk2
  const crouchTimerRef = useRef(0);

  /* ---------------- Drag refs (pointer events) ---------------- */
  const draggingRef = useRef(false);
  const dragPtrIdRef = useRef(null);
  const dragOffsetRef = useRef({ dx: 0, dy: 0 }); // pointer - wrapperCenter

  /* ---------------- Struggle loop while grabbed ---------------- */
  const strugglePhaseRef = useRef(0);
  const struggleTimerRef = useRef(0);
  const STRUGGLE_FRAME_MS = 200;

  /* ---------------- Stride refs ---------------- */
  const strideIndexRef = useRef(0);
  const strideTimerRef = useRef(0);

  /* ---------------- Jump state ---------------- */
  // "none" | "prime" | "air" | "preland" | "land"
  const jumpStateRef = useRef("none");
  const jumpTimerRef = useRef(0);

  const wHeldRef = useRef(false);
  const jumpHoldStartRef = useRef(0);

  // "stand" | "walk" | "run"
  const jumpModeRef = useRef("stand");

  /* ---------------- Strides ---------------- */
  const walkStrides = [walkStride1, walkStride2, walkStride3, walkStride4, walkStride5, walkStride6];
  const runStrides = [runStride1, runStride2, runStride3, runStride4, runStride5, runStride6];

  /* ---------------- Scale ---------------- */
  const HUMAN_SCALE = 1;

  /* ---------------- Movement tuning ---------------- */
  const WALK_FRAME = 150;
  const RUN_FRAME = 100;

  const WALK_VELOCITY = 0.40*HUMAN_SCALE; // px/ms
  const RUN_VELOCITY = 0.80*HUMAN_SCALE;  // px/ms

  // crouch movement + animation
  const CROUCH_VELOCITY = 0.1*HUMAN_SCALE;   // px/ms (while S + A/D)
  const CROUCH_FRAME_MS = 400;    // swap crouchWalk1/crouchWalk2

  const AIR_CONTROL_MULT = 0.50;
  const WALK_JUMP_BOOST = 0.24*HUMAN_SCALE; // px/ms (air only)
  const RUN_JUMP_BOOST = 0.44*HUMAN_SCALE;  // px/ms (air only)

  const STAND_AIR_CONTROL_MULT = 0.50;
  const STAND_AIR_CONTROL_CAP = 0.10;

  /* ---------------- Gravity / jump tuning ---------------- */
  const GRAVITY_UP = 0.002;
  const GRAVITY_CUT = 0.0040;
  const GRAVITY_DOWN = 0.0052;

  const JUMP_VY_TAP = -0.70;
  const JUMP_VY_HOLD = -0.90;
  const RUN_JUMP_VY_MULT = 1.05;

  const TAP_THRESHOLD = 200;
  const PRIME_MS = 100;

  /* ---------------- Helpers ---------------- */
  const ensureLoop = () => {
    if (animatingRef.current) return;
    animatingRef.current = true;
    lastTsRef.current = 0;
    rafRef.current = requestAnimationFrame(loop);
  };

  const stopLoopIfIdle = () => {
    const hasDir = !!directionRef.current;
    const jumping = jumpStateRef.current !== "none";
    const dragging = draggingRef.current;
    const crouching = crouchingRef.current;

    if (!hasDir && !jumping && !dragging && !crouching) {
      animatingRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;

      strideIndexRef.current = 0;
      strideTimerRef.current = 0;

      setPose(standCasual);
      setDuration(120);
    }
  };

  const getPoseBoundsPx = (p) => {
    const ox = (p.offsetX ?? 0) * HUMAN_SCALE;
    const oy = (p.offsetY ?? 0) * HUMAN_SCALE;

    const bx0 = (p.borderX0 ?? -180) * HUMAN_SCALE + ox;
    const bx1 = (p.borderX1 ?? 180) * HUMAN_SCALE + ox;
    const by0 = (p.borderY0 ?? -180) * HUMAN_SCALE + oy;
    const by1 = (p.borderY1 ?? 180) * HUMAN_SCALE + oy;

    return { bx0, bx1, by0, by1 };
  };

  // Perfect floor alignment when yAir=0:
  const computeGroundYFromPose = (p) => {
    const vh = window.innerHeight;
    const { by1 } = getPoseBoundsPx(p);
    return (vh * 0.5) - by1;
  };

  const applyTransformFromAir = (x, yAir, p) => {
    if (!wrapperRef.current) return;
    const yTotal = computeGroundYFromPose(p) + yAir;
    wrapperRef.current.style.transform =
      `translate3d(-50%, -50%, 0) translate3d(${x}px, ${yTotal}px, 0)`;
  };

  const applyTransformFromWorld = (wx, wy) => {
    if (!wrapperRef.current) return;
    wrapperRef.current.style.transform =
      `translate3d(-50%, -50%, 0) translate3d(${wx}px, ${wy}px, 0)`;
  };

  const clampXToWindow = (x, p) => {
    const vw = window.innerWidth;
    const { bx0, bx1 } = getPoseBoundsPx(p);

    const minX = -vw * 0.5 - bx0;
    const maxX = vw * 0.5 - bx1;

    return Math.max(minX, Math.min(maxX, x));
  };

  const clampYAirToCeiling = (yAir, p) => {
    const vh = window.innerHeight;
    const { by0, by1 } = getPoseBoundsPx(p);
    const minYAir = -vh - (by0 - by1);
    return Math.max(minYAir, yAir);
  };

  const clampWorldYToCeiling = (wy, p) => {
    const vh = window.innerHeight;
    const { by0 } = getPoseBoundsPx(p);
    const minWy = -vh * 0.5 - by0;
    return Math.max(minWy, wy);
  };

  const setPoseNow = (nextPose, nextDuration) => {
    setPose(nextPose);
    setDuration(nextDuration);
  };

  const cancelJumpNow = () => {
    jumpStateRef.current = "none";
    jumpTimerRef.current = 0;
    jumpModeRef.current = "stand";
    wHeldRef.current = false;
    vyRef.current = 0;
    yAirRef.current = 0;
  };

  /* ---------------- Movement control ---------------- */
  const beginMovement = () => {
    // cannot walk/run animation if crouching or dragging
    if (crouchingRef.current || draggingRef.current) return;

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

  /* ---------------- Jump pose selection ---------------- */
  const setJumpPoseForState = (state) => {
    const mode = jumpModeRef.current;

    if (mode === "stand") {
      if (state === "prime") setPoseNow(standJumpPrime, PRIME_MS);
      else if (state === "air") setPoseNow(standJumpFly, 200);
      else if (state === "preland" || state === "land") setPoseNow(standJumpLand, PRIME_MS);
      return;
    }

    if (mode === "walk") {
      if (state === "prime") setPoseNow(jumpPrime, 140);
      else if (state === "air") setPoseNow(walkJumpFly, 180);
      else if (state === "preland" || state === "land") setPoseNow(standJumpLand, PRIME_MS);
      return;
    }

    if (mode === "run") {
      if (state === "prime") setPoseNow(jumpPrime, PRIME_MS);
      else if (state === "air") {
        const vy = vyRef.current;
        if (vy < -0.20) setPoseNow(jumpFly, 140);
        else if (vy < 0.10) setPoseNow(jumpPeak, 140);
        else setPoseNow(jumpFall, 140);
      } else if (state === "preland" || state === "land") {
        setPoseNow(jumpLand, PRIME_MS);
      }
    }
  };

  /* ---------------- Crouch control ---------------- */
  const enterCrouch = () => {
    if (draggingRef.current || yAirRef.current < 0) return;

    sHeldRef.current = true;
    crouchingRef.current = true;

    // cannot run or jump when crouching
    runningRef.current = false;
    cancelJumpNow();

    // choose crouch mode based on whether direction is held
    crouchMovingRef.current = !!directionRef.current;
    crouchPhaseRef.current = 0;
    crouchTimerRef.current = 0;

    if (crouchMovingRef.current) {
      setPoseNow(crouchWalk1, CROUCH_FRAME_MS);
    } else {
      setPoseNow(crouch, 200);
    }

    ensureLoop();
  };

  const exitCrouch = () => {
    sHeldRef.current = false;
    crouchingRef.current = false;
    crouchMovingRef.current = false;
    crouchTimerRef.current = 0;
    crouchPhaseRef.current = 0;

    // back to normal behavior depending on input
    if (directionRef.current) {
      beginMovement();
    } else {
      setPoseNow(standCasual, 120);
      stopLoopIfIdle();
    }
  };

  const updateCrouchModeFromDir = () => {
    if (!crouchingRef.current) return;

    // if S held, crouchMoving is true when A/D held
    const shouldMove = !!directionRef.current;
    if (shouldMove === crouchMovingRef.current) return;

    crouchMovingRef.current = shouldMove;
    crouchTimerRef.current = 0;
    crouchPhaseRef.current = 0;

    if (crouchMovingRef.current) {
      setPoseNow(crouchWalk1, CROUCH_FRAME_MS);
    } else {
      setPoseNow(crouch, 200);
    }

    ensureLoop();
  };

  /* ---------------- Jump control ---------------- */
  const startJump = () => {
    // cannot jump if crouching or dragging
    if (crouchingRef.current) return;
    if (draggingRef.current) return;
    if (jumpStateRef.current !== "none") return;

    const dirAtStart = directionRef.current;
    const isRunning = runningRef.current && !!dirAtStart;

    jumpModeRef.current = dirAtStart ? (isRunning ? "run" : "walk") : "stand";
    jumpStateRef.current = "prime";
    jumpTimerRef.current = 0;

    wHeldRef.current = true;
    jumpHoldStartRef.current = performance.now();

    vyRef.current = JUMP_VY_HOLD * (isRunning ? RUN_JUMP_VY_MULT : 1);
    yAirRef.current = 0;

    setJumpPoseForState("prime");
    ensureLoop();
  };

  const endJumpHold = () => {
    wHeldRef.current = false;

    if (jumpStateRef.current === "prime") {
      const holdMs = performance.now() - jumpHoldStartRef.current;
      if (holdMs < TAP_THRESHOLD) {
        const isRunning = jumpModeRef.current === "run";
        vyRef.current = JUMP_VY_TAP * (isRunning ? RUN_JUMP_VY_MULT : 1);
      }
    }
  };

  /* ---------------- Drag control ---------------- */
  const beginDrag = (e) => {
    if (!wrapperRef.current) return;

    draggingRef.current = true;
    setIsDraggingUi(true);
    dragPtrIdRef.current = e.pointerId;

    // cancel movement + crouch + jump
    directionRef.current = null;
    runningRef.current = false;
    if (crouchingRef.current) exitCrouch();
    cancelJumpNow();

    // world anchor from current visual position
    dragWorldRef.current = {
      x: xRef.current,
      y: computeGroundYFromPose(pose) + yAirRef.current
    };

    // struggle init
    strugglePhaseRef.current = 0;
    struggleTimerRef.current = 0;
    setPoseNow(struggle1, STRUGGLE_FRAME_MS);

    const rect = wrapperRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width * 0.5;
    const cy = rect.top + rect.height * 0.5;

    dragOffsetRef.current = {
      dx: e.clientX - cx,
      dy: e.clientY - cy
    };

    wrapperRef.current.setPointerCapture(e.pointerId);
    ensureLoop();
  };

  const updateDrag = (e) => {
    if (!draggingRef.current) return;
    if (dragPtrIdRef.current !== e.pointerId) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const targetCx = e.clientX - dragOffsetRef.current.dx;
    const targetCy = e.clientY - dragOffsetRef.current.dy;

    let wx = targetCx - vw * 0.5;
    let wy = targetCy - vh * 0.5;

    wy = clampWorldYToCeiling(wy, pose);
    wx = clampXToWindow(wx, pose);

    dragWorldRef.current.x = wx;
    dragWorldRef.current.y = wy;
  };

  const endDrag = (e) => {
    if (!draggingRef.current) return;
    if (dragPtrIdRef.current !== e.pointerId) return;

    draggingRef.current = false;
    setIsDraggingUi(false);
    dragPtrIdRef.current = null;

    // convert world -> air space for physics
    xRef.current = clampXToWindow(dragWorldRef.current.x, pose);
    yAirRef.current = dragWorldRef.current.y - computeGroundYFromPose(pose);

    if (yAirRef.current > 0) yAirRef.current = 0;

    if (yAirRef.current < 0) {
      jumpModeRef.current = "stand";
      jumpStateRef.current = "air";
      wHeldRef.current = false;
      vyRef.current = 0;
      setPoseNow(standJumpFly, 160);
      ensureLoop();
      return;
    }

    yAirRef.current = 0;
    vyRef.current = 0;
    jumpStateRef.current = "none";
    setPoseNow(standCasual, 120);
    stopLoopIfIdle();
  };

  /* ---------------- rAF loop ---------------- */
  const loop = (ts) => {
    if (!lastTsRef.current) lastTsRef.current = ts;
    const rawDt = ts - lastTsRef.current;
    const dt = Math.min(50, rawDt);
    lastTsRef.current = ts;

    /* ---------------- Drag mode: struggle + render from world anchor ---------------- */
    if (draggingRef.current) {
      struggleTimerRef.current += dt;
      if (struggleTimerRef.current >= STRUGGLE_FRAME_MS) {
        struggleTimerRef.current -= STRUGGLE_FRAME_MS;
        strugglePhaseRef.current = 1 - strugglePhaseRef.current;
        setPoseNow(strugglePhaseRef.current === 0 ? struggle1 : struggle2, STRUGGLE_FRAME_MS);
      }

      applyTransformFromWorld(dragWorldRef.current.x, dragWorldRef.current.y);
      rafRef.current = requestAnimationFrame(loop);
      return;
    }

    /* ---------------- Crouch mode ---------------- */
    if (crouchingRef.current) {
      // no jumping/running; ensure velocities are grounded
      runningRef.current = false;
      jumpStateRef.current = "none";
      vyRef.current = 0;

      const dir = directionRef.current;

      // choose whether crouch-moving
      const shouldMove = !!dir;
      if (shouldMove !== crouchMovingRef.current) {
        crouchMovingRef.current = shouldMove;
        crouchTimerRef.current = 0;
        crouchPhaseRef.current = 0;
        if (crouchMovingRef.current) setPoseNow(crouchWalk1, CROUCH_FRAME_MS);
        else setPoseNow(crouch, 200);
      }

      // horizontal movement while crouch-walking
      if (crouchMovingRef.current && dir) {
        xRef.current += (dir === "right" ? 1 : -1) * CROUCH_VELOCITY * dt;
      }

      // animate crouchWalk1/2 at ~600ms when moving
      if (crouchMovingRef.current) {
        crouchTimerRef.current += dt;
        if (crouchTimerRef.current >= CROUCH_FRAME_MS) {
          crouchTimerRef.current -= CROUCH_FRAME_MS;
          crouchPhaseRef.current = 1 - crouchPhaseRef.current;
          setPoseNow(crouchPhaseRef.current === 0 ? crouchWalk1 : crouchWalk2, CROUCH_FRAME_MS);
        }
      }

      // keep on ground (perfect floor)
      yAirRef.current = 0;

      xRef.current = clampXToWindow(xRef.current, pose);
      applyTransformFromAir(xRef.current, yAirRef.current, pose);

      rafRef.current = requestAnimationFrame(loop);
      return;
    }

    /* ---------------- Normal movement + jumping ---------------- */
    const dir = directionRef.current;
    const running = runningRef.current;

    const jumpState = jumpStateRef.current;
    const inAir = jumpState === "air" || jumpState === "preland";
    const primeOrLand = jumpState === "prime" || jumpState === "land";

    // Horizontal
    if (dir) {
      const baseGroundVel = running ? RUN_VELOCITY : WALK_VELOCITY;

      if (inAir) {
        const mode = jumpModeRef.current;

        if (mode === "stand") {
          const standAirVel = Math.min(WALK_VELOCITY * STAND_AIR_CONTROL_MULT, STAND_AIR_CONTROL_CAP);
          xRef.current += (dir === "right" ? 1 : -1) * standAirVel * dt;
        } else {
          const airControlVel = baseGroundVel * AIR_CONTROL_MULT;
          const boost = mode === "run" ? RUN_JUMP_BOOST : WALK_JUMP_BOOST;
          xRef.current += (dir === "right" ? 1 : -1) * (airControlVel + boost) * dt;
        }
      } else if (jumpState === "none" || primeOrLand) {
        xRef.current += (dir === "right" ? 1 : -1) * baseGroundVel * dt;
      }
    }

    // Jump state machine
    if (jumpState === "prime") {
      jumpTimerRef.current += dt;
      if (jumpTimerRef.current >= PRIME_MS) {
        jumpStateRef.current = "air";
        jumpTimerRef.current = 0;
        setJumpPoseForState("air");
      }
    } else if (jumpState === "air" || jumpState === "preland") {
      // drag-drop falling pose lock
      if (jumpModeRef.current === "stand" && vyRef.current >= 0) {
        setPoseNow(standJumpFly, 160);
      }

      const rising = vyRef.current < 0;
      const g = rising
        ? (wHeldRef.current ? GRAVITY_UP : GRAVITY_CUT)
        : GRAVITY_DOWN;

      vyRef.current += g * dt;
      yAirRef.current += vyRef.current * dt;

      // ceiling collision
      const yCeil = clampYAirToCeiling(yAirRef.current, pose);
      if (yCeil !== yAirRef.current) {
        yAirRef.current = yCeil;
        if (vyRef.current < 0) vyRef.current = 0;
      }

      // normal pose selection for real jumps
      if (!(jumpModeRef.current === "stand" && vyRef.current >= 0)) {
        setJumpPoseForState("air");
      }

      // ground collision
      if (vyRef.current > 0 && yAirRef.current >= 0) {
        yAirRef.current = 0;
        vyRef.current = 0;

        jumpStateRef.current = "land";
        jumpTimerRef.current = 0;
        setJumpPoseForState("land");
      }
    } else if (jumpState === "land") {
      jumpTimerRef.current += dt;
      if (jumpTimerRef.current >= PRIME_MS) {
        jumpStateRef.current = "none";
        jumpTimerRef.current = 0;
        jumpModeRef.current = "stand";

        if (directionRef.current) beginMovement();
        else setPoseNow(standCasual, 120);
      }
    } else {
      // Stride animation
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
        strideTimerRef.current = 0;
        strideIndexRef.current = 0;
      }
    }

    // Bounds + render
    xRef.current = clampXToWindow(xRef.current, pose);

    const yCeil = clampYAirToCeiling(yAirRef.current, pose);
    if (yCeil !== yAirRef.current) {
      yAirRef.current = yCeil;
      if (vyRef.current < 0) vyRef.current = 0;
    }

    applyTransformFromAir(xRef.current, yAirRef.current, pose);

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
      if (draggingRef.current) return;

      const k = e.key.toLowerCase();

      // Crouch (S): takes priority over run/jump
      if (k === "s") {
        if (!sHeldRef.current) enterCrouch();
        return;
      }

      // Direction
      let dir = null;
      if (k === "a") dir = "left";
      if (k === "d") dir = "right";

      if (dir) {
        directionRef.current = dir;
        setFacing(dir);

        // If crouching (S held), switch into crouch-move mode instead of walk/run
        if (crouchingRef.current) {
          runningRef.current = false;
          updateCrouchModeFromDir();
          ensureLoop();
          return;
        }

        // Not crouching: allow run based on shift
        runningRef.current = e.shiftKey;
        beginMovement();
        return;
      }

      // Shift: running only if NOT crouching
      if (k === "shift") {
        if (crouchingRef.current) return;
        if (!directionRef.current) return;
        runningRef.current = true;
        beginMovement();
        return;
      }

      // Jump (W): disabled while crouching
      if (k === "w") {
        if (crouchingRef.current) return;
        startJump();
      }
    };

    const onKeyUp = (e) => {
      const k = e.key.toLowerCase();

      if (k === "s") {
        if (sHeldRef.current) exitCrouch();
        return;
      }

      if (
        (k === "a" && directionRef.current === "left") ||
        (k === "d" && directionRef.current === "right")
      ) {
        directionRef.current = null;

        if (crouchingRef.current) {
          updateCrouchModeFromDir();
          ensureLoop();
          return;
        }

        runningRef.current = false;
        stopLoopIfIdle();
        return;
      }

      if (k === "shift") {
        runningRef.current = false;
        return;
      }

      if (k === "w") {
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

  /* ---------------- Init + resize ---------------- */
  useEffect(() => {
    yAirRef.current = 0;
    xRef.current = clampXToWindow(xRef.current, pose);
    yAirRef.current = clampYAirToCeiling(yAirRef.current, pose);
    applyTransformFromAir(xRef.current, yAirRef.current, pose);

    const onResize = () => {
      if (draggingRef.current) {
        dragWorldRef.current.x = clampXToWindow(dragWorldRef.current.x, pose);
        dragWorldRef.current.y = clampWorldYToCeiling(dragWorldRef.current.y, pose);
        applyTransformFromWorld(dragWorldRef.current.x, dragWorldRef.current.y);
      } else {
        xRef.current = clampXToWindow(xRef.current, pose);
        yAirRef.current = clampYAirToCeiling(yAirRef.current, pose);
        applyTransformFromAir(xRef.current, yAirRef.current, pose);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------- Render ---------------- */
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div
        ref={wrapperRef}
        onPointerDown={(e) => {
          if (e.button != null && e.button !== 0) return;
          e.preventDefault();
          beginDrag(e);
        }}
        onPointerMove={(e) => {
          if (!draggingRef.current) return;
          e.preventDefault();
          updateDrag(e);
        }}
        onPointerUp={(e) => {
          e.preventDefault();
          endDrag(e);
        }}
        onPointerCancel={(e) => {
          e.preventDefault();
          endDrag(e);
        }}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          willChange: "transform",
          pointerEvents: "auto",
          touchAction: "none",
          userSelect: "none",
          cursor: isDraggingUi ? "grabbing" : "grab"
        }}
      >
        <div
          style={{
            width: 10,
            height: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scaleX(${facing === "left" ? 1 : -1})`,
            transformOrigin: "50% 50%"
          }}
        >
          <HumanAnimator
            targetPose={pose}
            duration={duration}
            debug={false}
            humanScale={HUMAN_SCALE}
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
};
