import { useEffect, useRef, useState } from "react";
import tvOn from "../../assets/stuff/tv/tv_on.png";
import tvOff from "../../assets/stuff/tv/tv_off.png";
import tvBuzz from "../../assets/stuff/tv/tv_buzz.png";
import ch1 from "../../assets/stuff/tv/subway.mp4";
import ch2 from "../../assets/stuff/tv/simpsons.mp4";
import ch3 from "../../assets/stuff/tv/butter.mp4";
import ch4 from "../../assets/stuff/tv/robert.mp4";
import ch5 from "../../assets/stuff/tv/rick.mp4";
import ch6 from "../../assets/stuff/tv/comedy.mp4";
import ch7 from "../../assets/stuff/tv/surfer.mp4";
import ch8 from "../../assets/stuff/tv/jerry.mp4";
import ch9 from "../../assets/stuff/tv/bean.mp4";
import ch10 from "../../assets/stuff/tv/meme.mp4";

const CHANNELS = [
  { src: ch1, frame: { x: -20, y: 0, w: 120, h: 100 }, crop: { x: 0, y: 0, scale: 0.8 } },
  { src: ch2, frame: { x: 0, y: 5, w: 110, h: 100 }, crop: { x: 0, y: 0, scale: 0.7 } },
  { src: ch3, frame: { x: -10, y: 7, w: 150, h: 105 }, crop: { x: 0, y: 0, scale: 0.64 } },
  { src: ch4, frame: { x: 0, y: 6, w: 140, h: 115 }, crop: { x: 0, y: 0, scale: 0.61 } },
  { src: ch5, frame: { x: -5, y: 0, w: 115, h: 105 }, crop: { x: 0, y: 0, scale: 0.7 } },
  { src: ch6, frame: { x: -15, y: 5, w: 155, h: 115 }, crop: { x: 0, y: 0, scale: 0.6 } },
  { src: ch7, frame: { x: -20, y: 0, w: 180, h: 130 }, crop: { x: 0, y: 0, scale: 0.6 } },
  { src: ch8, frame: { x: -10, y: 0, w: 145, h: 124 }, crop: { x: 0, y: 0, scale: 0.6 } },
  { src: ch9, frame: { x: -10, y: 6, w: 180, h: 115 }, crop: { x: 0, y: 0, scale: 0.6 } },
  { src: ch10, frame: { x: -22, y: 5, w: 180, h: 100 }, crop: { x: 0, y: 0, scale: 0.7 } }
];

const shuffle = (arr) => {
  const next = [...arr];

  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }

  return next;
};

export const TelevisionObject = ({ mobileMode, onInteract }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [tvState, setTvState] = useState("off");
  const [channel, setChannel] = useState(0);
  const [hoverDragZone, setHoverDragZone] = useState(false);

  const containerRef = useRef(null);
  const offset = useRef({ x: 0, y: 0 });

  const queueRef = useRef([]);
  const queueIndexRef = useRef(0);
  const switchLockRef = useRef(false);
  const switchTimeoutRef = useRef(null);

  const current = CHANNELS[channel];
  const tvWidth = mobileMode ? "50vw" : "20vw";

  const getCoords = (e) => {
    if (e.touches?.length) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }

    return { x: e.clientX, y: e.clientY };
  };

  const getRelativeX = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return 0;
    return getCoords(e).x - rect.left;
  };

  const handleHover = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setHoverDragZone(getRelativeX(e) >= rect.width * 0.8);
  };

  const canSwitch = () => {
    if (switchLockRef.current) return false;

    switchLockRef.current = true;

    if (switchTimeoutRef.current) {
      clearTimeout(switchTimeoutRef.current);
    }

    switchTimeoutRef.current = setTimeout(() => {
      switchLockRef.current = false;
      switchTimeoutRef.current = null;
    }, 500);

    return true;
  };

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

  const handleDown = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const { x, y } = getCoords(e);
    const relativeX = x - rect.left;
    const isDragZone = relativeX >= rect.width * 0.8;

    if (!isDragZone) {
      if (!canSwitch()) return;

      if (tvState === "off" || queueRef.current.length === 0) {
        startNewCycle();
      } else {
        advanceChannel();
      }

      onInteract?.();
      return;
    }

    offset.current = {
      x: x - position.x,
      y: y - position.y
    };

    setDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    if (!dragging) return;

    const handleMove = (e) => {
      const { x, y } = getCoords(e);
      setPosition({
        x: x - offset.current.x,
        y: y - offset.current.y
      });
      e.preventDefault();
    };

    const handleUp = () => setDragging(false);

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

  useEffect(() => {
    return () => {
      if (switchTimeoutRef.current) {
        clearTimeout(switchTimeoutRef.current);
      }
    };
  }, []);

  const wrapperStyle = {
    position: "fixed",
    left: position.x,
    top: position.y,
    width: tvWidth,
    zIndex: 1000,
    userSelect: "none",
    touchAction: "none",
    cursor: dragging ? "grabbing" : hoverDragZone ? "grab" : "pointer"
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

  return (
    <div style={wrapperStyle}>
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
        ref={containerRef}
        src={tvState === "off" ? tvOff : tvOn}
        alt="tv"
        style={tvImageStyle}
        draggable={false}
        onMouseDown={handleDown}
        onTouchStart={handleDown}
        onMouseMove={handleHover}
        onTouchMove={handleHover}
        onMouseLeave={() => setHoverDragZone(false)}
      />
    </div>
  );
};