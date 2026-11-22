import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Immersion } from "./Immersion";
import { Joystick } from "../../../components/activities/human/Joystick";
import janzen_0 from "../../../assets/activities/snake/head/janzen_0.png";
import janzen_1 from "../../../assets/activities/snake/head/janzen_1.png";
import janzen_2 from "../../../assets/activities/snake/head/janzen_2.png";
import janzen_3 from "../../../assets/activities/snake/head/janzen_3.png";
import janzen_4 from "../../../assets/activities/snake/head/janzen_4.png";
import janzen_5 from "../../../assets/activities/snake/head/janzen_5.png";
import janzen_5b from "../../../assets/activities/snake/head/janzen_5b.png";
import janzen_6 from "../../../assets/activities/snake/head/janzen_6.png";
import janzen_7 from "../../../assets/activities/snake/head/janzen_7.png";
import janzen_8 from "../../../assets/activities/snake/head/janzen_8.png";
import janzen_9 from "../../../assets/activities/snake/head/janzen_9.png";

import icon_cross_light from "../../../assets/activities/symbols/cross_light.png";
import icon_cross_dark from "../../../assets/activities/symbols/cross_dark.png";
import icon_gamemode_light from "../../../assets/activities/symbols/gamemode_light.png";
import icon_gamemode_dark from "../../../assets/activities/symbols/gamemode_dark.png";
import icon_joystick_light from "../../../assets/activities/symbols/joystick_light.png";
import icon_joystick_dark from "../../../assets/activities/symbols/joystick_dark.png";
import icon_keypad_light from "../../../assets/activities/symbols/keypad_light.png";
import icon_keypad_dark from "../../../assets/activities/symbols/keypad_dark.png";
import icon_restart_light from "../../../assets/activities/symbols/restart_light.png";
import icon_restart_dark from "../../../assets/activities/symbols/restart_dark.png";

const THEME_ICONS = {
  light: {
    cross: icon_cross_light,
    gamemode: icon_gamemode_light,
    joystick: icon_joystick_light,
    keypad: icon_keypad_light,
    restart: icon_restart_light,
  },
  dark: {
    cross: icon_cross_dark,
    gamemode: icon_gamemode_dark,
    joystick: icon_joystick_dark,
    keypad: icon_keypad_dark,
    restart: icon_restart_dark,
  },
};

// Every image in the food folder (webpack / Create React App). Each new piece of food picks one at random.
const foodContext = require.context(
  "../../../assets/activities/snake/food",
  false,
  /\.(png|jpe?g|webp|gif|svg)$/
);
const FOODS = foodContext.keys().map((key) => {
  const m = foodContext(key);
  return {
    // "./apple.png" -> "apple"
    name: key.replace(/^\.\//, "").replace(/\.[^.]+$/, "").toLowerCase(),
    image: typeof m === "string" ? m : m.default,
  };
});
const FOOD_IMAGES = FOODS.map((f) => f.image);

/* =====================================
   SETTINGS: ARENA AND BASE SPEED
===================================== */
const ARENA_COLS = 15;
const ARENA_ROWS = 15;
const CELL_SIZE = 40;
const BASE_TICK_MS = 130; // Normal-mode time per move. Each difficulty scales it with speedMult.
const START_LENGTH = 3;

/* =====================================
   SETTINGS: DIFFICULTIES
   Every number you are likely to tweak lives here.
===================================== */
const DEFAULT_DIFFICULTY = "normal"; // Settings used for the board behind the "choose game mode" prompt.

const DIFFICULTIES = {
  normal: {
    label: "NORMAL",
    emoji: "🙂", // Button on the start prompt, and shown on the game over prompt.
    speedMult: 1.0, // 1.1 = 10% faster, 1.2 = 20% faster.
    hungerMult: 1.0, // 1.2 = hunger bar empties 20% faster.
    foodCount: 3, // How many foods are on the board at once (a new one spawns when one is eaten).
    straightWalls: 0, // Number of straight walls placed at the start of each game.
    cornerWalls: 0, // Number of L-shaped (corner) walls placed at the start of each game.
    straightLength: [2, 4], // Min / max length of a straight wall, in cells.
    cornerArm: [2, 3], // Min / max length of each arm of an L wall, in cells.
    borderTouchChance: 0.4, // Chance a straight wall is pushed against the arena edge.
  },
  hard: {
    label: "HARD",
    emoji: "☹️",
    speedMult: 1.1,
    hungerMult: 1.2,
    foodCount: 3,
    straightWalls: 4,
    cornerWalls: 2,
    straightLength: [2, 4],
    cornerArm: [2, 3],
    borderTouchChance: 0.4,
  },
  veryHard: {
    label: "VERY HARD",
    emoji: "😩",
    speedMult: 1.2,
    hungerMult: 1.4,
    foodCount: 3,
    straightWalls: 7,
    cornerWalls: 4,
    straightLength: [2, 5],
    cornerArm: [2, 4],
    borderTouchChance: 0.4,
  },
};

/* =====================================
   SETTINGS: HUNGER
===================================== */
const BASE_HUNGER_DRAIN_MS = 15000; // Normal-mode time for a full bar to empty (scaled by hungerMult).
const TEXT_PX_MOBILE = 21.76; // 1.36rem: SCORE and popup text (mobile).
const TEXT_PX_DESKTOP = 25.6; // 1.6rem: the same on desktop.
// Per-food settings. Keys are the food image file names (without extensions).
// `growth` is both the number of body segments added and the points awarded.
// `spawnWeight` controls relative spawn frequency: 2 is twice as likely as 1; 0 disables that food.
const FOOD_CONFIG = {
  apple:  { satiation: 0.3, growth: 2, spawnWeight: 1 },
  sushi:  { satiation: 0.2, growth: 1, spawnWeight: 1 },
  burger: { satiation: 0.6, growth: 1, spawnWeight: 1 },
  cake:   { satiation: 0.6, growth: 1, spawnWeight: 1 },
};
const DEFAULT_FOOD_SATIATION = 0.4; // Hunger refill for foods not listed above.
const DEFAULT_FOOD_GROWTH = 1; // Segments and points for foods not listed above.
const DEFAULT_FOOD_SPAWN_WEIGHT = 1; // Spawn weight for foods not listed above.
const HUNGER_BAR_FRAC = 0.52; // Bar height as a fraction of its rectangle (bigger = less space above/below).
const EAT_FILL_MS = 450; // How long the bar takes to slide up after eating.
const EATEN_FOOD_FADE_MS = 3200; // How long each eaten food stays in the bar (fading out) before it is gone.
const EATEN_FOOD_MAX = 8; // Most eaten foods shown side by side at once.
const SCORE_BONUS_DURATION_MS = 1100; // How long the (+points) indicator stays visible.
const DEATH_REASONS = {
  wall: "hitting a wall",
  self: "running into yourself",
  starved: "starving",
};

/* =====================================
   SETTINGS: SCREEN, PANELS AND JOYSTICK
===================================== */
const JOYSTICK_SIZE = 170;
const JOY_PAD = 16; // Space between the joystick and its rectangle.
const FONT_FAMILY = "'Courier New', Courier, monospace";
const GRID_SCALE = 0.9; // Grid is 10% smaller than the space available.
const OUTER_PAD = 5; // Gap between the outer border and the wall ring around the grid.
const WALL_THICKNESS = OUTER_PAD; // Walls (and the ring) are as thick as that gap.
const RING_EXT = WALL_THICKNESS / 2 + 1; // How far the ring's outline reaches past the arena edge.
const GAP = 6; // Fixed distance between the rectangles in every view.
// Score, hunger and button rectangles all share this height.
const ROW_H_MOBILE = 55;
const ROW_H_DESKTOP = 50; // 0.8x of the previous 62.5.
// Per side: outer border + outer pad + the ring's overhang.
const GRID_CHROME = 2 * (1 + OUTER_PAD + RING_EXT);
const KEY_SIZE_DESKTOP = 49.6; // px (3.1rem). Mobile keys are double this.
const KEY_GAP = 5.6; // px between desktop keys.
const KEYPAD_PAD_DESKTOP = 16; // Space between the keys and their rectangle.
const KEYPAD_PAD_MOBILE = 22;

/* =====================================
   SETTINGS: WALLS
===================================== */
const WALL_FILL = "var(--colour-3)";
const WALL_OUTLINE = "var(--colour-5)";
const WALL_MAX_ATTEMPTS = 200; // Tries per wall before giving up on placing it.
const START_CLEAR_AHEAD = 5; // Cells in front of the starting head kept free of walls.
const START_CLEAR_ROWS = 1; // Rows above and below the starting row kept free of walls.

/* =====================================
   SETTINGS: HEAD
===================================== */
const HEAD_SIZE = 2.2;
const HEAD_OFFSET = { x: 0.3, y: 0 };
const HEAD_ANGLE_OFFSET = 0;
const HEAD_LIFT_ANGLE = 45;
const TURN_MS = 110;

/* =====================================
   SETTINGS: MOUTH ANIMATION
===================================== */
const FRAME_MS = 25;
const LINGER_FRAMES = 2;
const REST_FRAME = 1;
const FULL_OPEN_FRAME = 5;
const OPEN_STEPS = [2, 3, 4, 5];
const CLOSE_STEPS = [6, 7, 8, 9, 0];
// How many cells ahead of a food the mouth starts opening (depends on the tick speed).
const openDistance = (tickMs) =>
  Math.max(1, Math.ceil((OPEN_STEPS.length * FRAME_MS) / tickMs));

/* =====================================
   SETTINGS: LOOK
===================================== */
const FOOD_SIZE = 0.6;
const FOOD_EMOJI = "🍎";
const BODY_WIDTH = 0.8;
const BELLY_WIDTH = 0.3; // Belly occupies exactly 30% of the body's diameter.
const OUTLINE_COLOUR = "#000000";
const OUTLINE_WIDTH = 0.01;
const EDGE_WOBBLE = 1;
const BELLY_COLOUR = "#D7AFA8";
const BELLY_LIGHTNESS_RANGE = 10;
const BELLY_HUE_RANGE = 5;
const BELLY_SAT_RANGE = 6;
const BELLY_GRADIENT_SEGMENTS = 3;
const BELLY_STRIPE_SPACING = 0.2;
const STRIPE_ANGLE = 0.2;
const STRIPE_JITTER = 0.03;
const STRIPE_DARKEN = 18;
const STRIPE_DARKEN_VARIANCE = 3;
const BODY_PROFILE = [0.8, 1.0, 0.8, 0.6];
const BULGE_RADIUS = 0.5;
const BULGE_EXTRA = 0.22;
const BULGE_MS_PER_CELL = 100;
const BULGE_FADE_LENGTH = 10; // The gulp tapers away within at most 10 body cells.

// Death is intentionally staggered per body segment, rather than spreading one short
// fixed-duration fade over the entire snake. Each segment also emits its own particle burst.
const DEATH_STAGGER_PER_SEGMENT_MS = 115;
const DEATH_FADE_MS = 260;
const DEATH_PARTICLE_COUNT = 7;
const DEATH_PARTICLE_COLOUR = "#8A0303"; // Deep blood red.
const DEATH_PARTICLE_LIFE_MIN = 360;
const DEATH_PARTICLE_LIFE_MAX = 560;

// Spots: each new game picks one hue (each spot gets its own shade of it).
const PATTERN_HUES = [0, 28, 55, 120, 170, 210, 270, 320];
const SPOT_RADIUS = [0.05, 0.18];
const SPOT_SPACING = [0.5, 1.2];
const SPOT_NEIGHBOUR_CHANCE = 0.1;
const SPOT_LIGHTNESS = [18, 34]; // Darker spots (was 28 to 48).

/* =====================================
   FRAMES AND MENU ICONS
===================================== */
const FRAMES = [
  janzen_0,
  janzen_1,
  janzen_2,
  janzen_3,
  janzen_4,
  janzen_5,
  janzen_6,
  janzen_7,
  janzen_8,
  janzen_9,
];
const OVERLAY_IMAGE = janzen_5b;

/* =====================================
   RANDOM SPOTS AND SKIN VARIANCE
===================================== */
const rand = (a, b) => a + Math.random() * (b - a);
const randInt = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

const noiseAt = (arr, x) => {
  const i = Math.floor(x);
  const f = x - i;
  while (arr.length <= i + 1) arr.push(Math.random() * 2 - 1);
  const u = f * f * (3 - 2 * f);
  return arr[i] * (1 - u) + arr[i + 1] * u;
};

const hash = (j) => {
  const x = Math.sin(j * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const hexToHsl = (hex) => {
  const v = parseInt(hex.slice(1), 16);
  const r = ((v >> 16) & 255) / 255;
  const g = ((v >> 8) & 255) / 255;
  const b = (v & 255) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;

  if (d > 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d + 6) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }

  return { h, s: s * 100, l: l * 100 };
};

const BELLY_BASE = hexToHsl(BELLY_COLOUR);

const makeSpot = (q, hue) => {
  const r = SPOT_RADIUS[0] + (SPOT_RADIUS[1] - SPOT_RADIUS[0]) * Math.random() ** 1.5;
  return {
    q,
    r,
    top: rand(r - 0.05, 0.5 - r),
    side: rand(-(0.5 - r), 0.5 - r),
    colour: `hsl(${hue} ${Math.round(rand(45, 70))}% ${Math.round(rand(SPOT_LIGHTNESS[0], SPOT_LIGHTNESS[1]))}%)`,
  };
};

const makePattern = () => ({
  hue: PATTERN_HUES[Math.floor(Math.random() * PATTERN_HUES.length)],
  marks: [],
  q: rand(0.3, 0.8),
  nz: {
    edgeA: [],
    edgeB: [],
    skinH: [],
    skinS: [],
    skinL: [],
    bellyH: [],
    bellyS: [],
    bellyL: [],
  },
});

const extendPattern = (p, qMax) => {
  while (p.q < qMax) {
    p.marks.push(makeSpot(p.q, p.hue));
    if (Math.random() < SPOT_NEIGHBOUR_CHANCE) {
      p.marks.push(makeSpot(p.q + rand(0.03, 0.15), p.hue));
    }
    p.q += rand(SPOT_SPACING[0], SPOT_SPACING[1]);
  }
};

const skinColour = (nz, q) => {
  const h = 225 + 14 * noiseAt(nz.skinH, q / 2);
  const sat = 12 + 5 * noiseAt(nz.skinS, q / 1.3);
  const l = 14 + 5.5 * noiseAt(nz.skinL, q / 1.1);
  return `hsl(${h} ${sat}% ${l}%)`;
};

const bellyColour = (nz, q, dark = 0) => {
  const x = q / BELLY_GRADIENT_SEGMENTS;
  const h = BELLY_BASE.h + BELLY_HUE_RANGE * noiseAt(nz.bellyH, x * 1.3);
  const sat = BELLY_BASE.s + BELLY_SAT_RANGE * noiseAt(nz.bellyS, x * 0.9);
  const l = BELLY_BASE.l + BELLY_LIGHTNESS_RANGE * noiseAt(nz.bellyL, x) - dark;
  return `hsl(${h} ${sat}% ${l}%)`;
};

const stripeQ = (j) => j * BELLY_STRIPE_SPACING + (hash(j + 3) - 0.5) * 2 * STRIPE_JITTER;

const stripeColour = (nz, q, j) =>
  bellyColour(nz, q, STRIPE_DARKEN + (hash(j + 11) - 0.5) * 2 * STRIPE_DARKEN_VARIANCE);

const edgeWander = (nz, q) =>
  EDGE_WOBBLE * (0.16 * noiseAt(nz.edgeA, q / 1.7) + 0.09 * noiseAt(nz.edgeB, q / 0.6));

/* =====================================
   BODY THICKNESS (WITH FOOD BULGES)
===================================== */
const profile = (u) => {
  const k = BODY_PROFILE;
  const m = k.length - 1;
  const x = Math.min(1, Math.max(0, u)) * m;
  const i = Math.min(m - 1, Math.floor(x));
  const f = x - i;
  const p0 = k[Math.max(0, i - 1)];
  const p1 = k[i];
  const p2 = k[i + 1];
  const p3 = k[Math.min(m, i + 2)];

  return 0.5 * (
    2 * p1 +
    (-p0 + p2) * f +
    (2 * p0 - 5 * p1 + 4 * p2 - p3) * f * f +
    (-p0 + 3 * p1 - 3 * p2 + p3) * f * f * f
  );
};

const widthsAt = (q, Leff, n, bulges, now, W, c) => {
  const base = 0.5 * W * profile(q / Leff);
  let full = base;

  for (const b of bulges) {
    const qb = (now - b.t0) / BULGE_MS_PER_CELL;
    const d = (q - qb) / BULGE_RADIUS;
    if (Math.abs(d) >= 1) continue;

    const amp = Math.min(
      1,
      Math.max(0, qb) / 0.6,
      Math.max(0, n - 2 - qb) / 0.8,
      Math.max(0, 1 - Math.max(0, qb) / BULGE_FADE_LENGTH)
    );

    full += amp * BULGE_EXTRA * c * Math.sqrt(1 - d * d);
  }

  return [base, full];
};

// Adds the part of a disc above (bottom=false) or below (bottom=true) a horizontal line.
const discPart = (ctx, x, y, R, cut, bottom) => {
  if (cut >= R) {
    if (!bottom) {
      ctx.moveTo(x + R, y);
      ctx.arc(x, y, R, 0, Math.PI * 2);
    }
    return;
  }

  if (cut <= -R) {
    if (bottom) {
      ctx.moveTo(x + R, y);
      ctx.arc(x, y, R, 0, Math.PI * 2);
    }
    return;
  }

  const a = Math.asin(cut / R);
  const half = Math.sqrt(R * R - cut * cut);

  if (bottom) {
    ctx.moveTo(x + half, y + cut);
    ctx.arc(x, y, R, a, Math.PI - a);
  } else {
    ctx.moveTo(x - half, y + cut);
    ctx.arc(x, y, R, Math.PI - a, a + Math.PI * 2);
  }

  ctx.closePath();
};

/* =====================================
   GAME HELPERS
===================================== */
const UP = { x: 0, y: -1 };
const DOWN = { x: 0, y: 1 };
const LEFT = { x: -1, y: 0 };
const RIGHT = { x: 1, y: 0 };

const KEY_DIRECTIONS = {
  ArrowUp: UP,
  w: UP,
  W: UP,
  ArrowDown: DOWN,
  s: DOWN,
  S: DOWN,
  ArrowLeft: LEFT,
  a: LEFT,
  A: LEFT,
  ArrowRight: RIGHT,
  d: RIGHT,
  D: RIGHT,
};

const isOpposite = (a, b) => a.x === -b.x && a.y === -b.y;

// Hunger drains steadily from the level and time of the last meal.
const hungerLevel = (hunger, now, drainMs) =>
  Math.max(0, hunger.level - (now - hunger.at) / drainMs);

const spawnFood = (snake, foods = []) => {
  const free = [];

  for (let x = 0; x < ARENA_COLS; x++) {
    for (let y = 0; y < ARENA_ROWS; y++) {
      if (
        !snake.some((s) => s.x === x && s.y === y) &&
        !foods.some((f) => f.x === x && f.y === y)
      ) {
        free.push({ x, y });
      }
    }
  }

  if (!free.length) return null;

  const cell = free[Math.floor(Math.random() * free.length)];

  // Choose a food proportionally to its configured spawn weight.
  // Unlisted foods use DEFAULT_FOOD_SPAWN_WEIGHT; a weight of 0 excludes a food.
  let type = FOODS.length ? null : { name: "apple", image: null };

  if (FOODS.length) {
    const weightedFoods = FOODS
      .map((food) => {
        const configuredWeight = FOOD_CONFIG[food.name]?.spawnWeight;
        const weight = configuredWeight == null
          ? DEFAULT_FOOD_SPAWN_WEIGHT
          : Number(configuredWeight);

        return {
          food,
          weight: Number.isFinite(weight) ? Math.max(0, weight) : 0,
        };
      })
      .filter((entry) => entry.weight > 0);

    const totalWeight = weightedFoods.reduce((sum, entry) => sum + entry.weight, 0);

    // No configured food can spawn when every food has a weight of 0 (or an invalid weight).
    if (totalWeight <= 0) return null;

    let roll = Math.random() * totalWeight;
    for (const entry of weightedFoods) {
      roll -= entry.weight;
      if (roll < 0) {
        type = entry.food;
        break;
      }
    }

    // Protect against floating-point edge cases at the end of the weighted range.
    if (!type) type = weightedFoods[weightedFoods.length - 1].food;
  }

  const foodConfig = FOOD_CONFIG[type.name] ?? {};

  return {
    ...cell,
    image: type.image,
    name: type.name,
    satiation: foodConfig.satiation ?? DEFAULT_FOOD_SATIATION,
    growth: Math.max(0, Math.floor(foodConfig.growth ?? DEFAULT_FOOD_GROWTH)),
  };
};

// Tops the board up to `count` foods (fewer if there is no room left).
const refillFoods = (snake, foods, count) => {
  const next = [...foods];

  while (next.length < count) {
    const food = spawnFood(snake, next);
    if (!food) break;
    next.push(food);
  }

  return next;
};

/* =====================================
   WALLS
   Walls sit on the lines BETWEEN cells. Each wall is a list of unit edges:
   "h" edge (x, y): the line above cell (x, y), spanning x to x + 1.
   "v" edge (x, y): the line left of cell (x, y), spanning y to y + 1.
===================================== */
const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];

const wallKey = (o, x, y) => `${o}${x},${y}`;

// Only interior lines can hold a wall (the outer lines are the arena border).
const edgeValid = (o, x, y) =>
  o === "h"
    ? x >= 0 && x < ARENA_COLS && y >= 1 && y < ARENA_ROWS
    : x >= 1 && x < ARENA_COLS && y >= 0 && y < ARENA_ROWS;

// The two cells an edge sits between.
const edgeCells = (o, x, y) =>
  o === "h" ? [{ x, y: y - 1 }, { x, y }] : [{ x: x - 1, y }, { x, y }];

// Is the step from one cell to a neighbouring cell blocked by a wall?
const isWallBetween = (walls, from, to) => {
  if (!walls) return false;
  if (to.x !== from.x) {
    return walls.set.has(wallKey("v", Math.max(from.x, to.x), from.y));
  }
  return walls.set.has(wallKey("h", from.x, Math.max(from.y, to.y)));
};

// The snake's starting spot (and the path ahead of it) must stay free.
const inStartZone = (c) => {
  const cx = Math.floor(ARENA_COLS / 2);
  const cy = Math.floor(ARENA_ROWS / 2);
  return (
    c.x >= cx - START_LENGTH &&
    c.x <= cx + START_CLEAR_AHEAD &&
    Math.abs(c.y - cy) <= START_CLEAR_ROWS
  );
};

// Rejects layouts that cut the arena in two or leave a cell boxed in on 3+ sides.
const wallsAreValid = (set) => {
  const walls = { set };
  const inside = (x, y) => x >= 0 && x < ARENA_COLS && y >= 0 && y < ARENA_ROWS;

  for (let x = 0; x < ARENA_COLS; x++) {
    for (let y = 0; y < ARENA_ROWS; y++) {
      let closed = 0;
      for (const [dx, dy] of DIRS) {
        const nx = x + dx;
        const ny = y + dy;
        if (!inside(nx, ny) || isWallBetween(walls, { x, y }, { x: nx, y: ny })) closed++;
      }
      if (closed >= 3) return false;
    }
  }

  const seen = new Set(["0,0"]);
  const stack = [{ x: 0, y: 0 }];

  while (stack.length) {
    const c = stack.pop();
    for (const [dx, dy] of DIRS) {
      const nx = c.x + dx;
      const ny = c.y + dy;
      if (!inside(nx, ny) || seen.has(`${nx},${ny}`)) continue;
      if (isWallBetween(walls, c, { x: nx, y: ny })) continue;
      seen.add(`${nx},${ny}`);
      stack.push({ x: nx, y: ny });
    }
  }

  return seen.size === ARENA_COLS * ARENA_ROWS;
};

const straightWallEdges = (cfg) => {
  const o = Math.random() < 0.5 ? "h" : "v";
  const len = randInt(cfg.straightLength[0], cfg.straightLength[1]);
  const lineMax = o === "h" ? ARENA_ROWS - 1 : ARENA_COLS - 1;
  const runMax = (o === "h" ? ARENA_COLS : ARENA_ROWS) - len;
  const line = randInt(1, lineMax);
  let start = randInt(0, runMax);

  // Sometimes push the wall against the arena edge so it connects to the border.
  if (Math.random() < cfg.borderTouchChance) start = Math.random() < 0.5 ? 0 : runMax;

  const edges = [];
  for (let i = 0; i < len; i++) {
    edges.push(o === "h" ? { o, x: start + i, y: line } : { o, x: line, y: start + i });
  }
  return edges;
};

// An L shape: two arms meeting at one corner point.
const cornerWallEdges = (cfg) => {
  const vx = randInt(1, ARENA_COLS - 1);
  const vy = randInt(1, ARENA_ROWS - 1);
  const dx = Math.random() < 0.5 ? 1 : -1;
  const dy = Math.random() < 0.5 ? 1 : -1;
  const a = randInt(cfg.cornerArm[0], cfg.cornerArm[1]);
  const b = randInt(cfg.cornerArm[0], cfg.cornerArm[1]);
  const edges = [];

  for (let i = 0; i < a; i++) edges.push({ o: "h", x: dx > 0 ? vx + i : vx - 1 - i, y: vy });
  for (let i = 0; i < b; i++) edges.push({ o: "v", x: vx, y: dy > 0 ? vy + i : vy - 1 - i });

  return edges;
};

const generateWalls = (cfg) => {
  const set = new Set();
  const segs = [];
  const plan = [
    ...Array.from({ length: cfg.straightWalls }, () => straightWallEdges),
    ...Array.from({ length: cfg.cornerWalls }, () => cornerWallEdges),
  ];

  for (const make of plan) {
    for (let attempt = 0; attempt < WALL_MAX_ATTEMPTS; attempt++) {
      const edges = make(cfg);

      if (!edges.every((e) => edgeValid(e.o, e.x, e.y))) continue;
      if (edges.some((e) => set.has(wallKey(e.o, e.x, e.y)))) continue;
      if (edges.some((e) => edgeCells(e.o, e.x, e.y).some(inStartZone))) continue;

      const trial = new Set(set);
      edges.forEach((e) => trial.add(wallKey(e.o, e.x, e.y)));
      if (!wallsAreValid(trial)) continue;

      edges.forEach((e) => {
        set.add(wallKey(e.o, e.x, e.y));
        segs.push(e);
      });
      break;
    }
  }

  return { set, segs };
};

// The "choose" state (start prompt) deliberately contains no snake and no food.
const createGame = (cfg) => ({
  snake: [],
  prev: [],
  movedAt: 0,
  dir: RIGHT,
  facing: "right",
  foods: [],
  swallowing: null,
  growthRemaining: 0,
  score: 0,
  status: "choose",
  deathAt: null,
  pattern: makePattern(),
  bulges: [],
  reason: null,
  hunger: { level: 1, at: 0 },
  walls: generateWalls(cfg),
});

const activateGame = (g, cfg) => {
  const cx = Math.floor(ARENA_COLS / 2);
  const cy = Math.floor(ARENA_ROWS / 2);
  const snake = Array.from({ length: START_LENGTH }, (_, i) => ({ x: cx - i, y: cy }));

  return {
    ...g,
    snake,
    prev: snake,
    movedAt: performance.now(),
    dir: RIGHT,
    facing: "right",
    foods: refillFoods(snake, [], cfg.foodCount),
    swallowing: null,
    growthRemaining: 0,
    score: 0,
    status: "playing",
    deathAt: null,
    bulges: [],
    reason: null,
    hunger: { level: 1, at: performance.now() },
  };
};

const shouldOpen = (g, openDist) => {
  if (g.status !== "playing" || !g.snake.length) return false;
  if (g.swallowing) return true;

  const head = g.snake[0];

  return g.foods.some((food) => {
    const dx = food.x - head.x;
    const dy = food.y - head.y;
    const dist = g.dir.x !== 0
      ? (dy === 0 ? dx * g.dir.x : -1)
      : (dx === 0 ? dy * g.dir.y : -1);

    return dist > 0 && dist <= openDist;
  });
};

/* =====================================
   MOUTH STATE MACHINE
===================================== */
const stepOpening = (m) => {
  m.frame = OPEN_STEPS[m.i];
  if (m.i >= OPEN_STEPS.length - 1) m.phase = "open";
};

const stepClosing = (m) => {
  m.frame = CLOSE_STEPS[m.i];
  if (m.i >= CLOSE_STEPS.length - 1) {
    m.phase = "linger";
    m.linger = LINGER_FRAMES;
  }
};

const advanceMouth = (m, wantOpen) => {
  switch (m.phase) {
    case "closed":
      if (wantOpen) {
        m.phase = "opening";
        m.i = 0;
        stepOpening(m);
      }
      break;
    case "opening":
      m.i += 1;
      stepOpening(m);
      break;
    case "open":
      if (!wantOpen) {
        m.phase = "closing";
        m.i = 0;
        stepClosing(m);
      }
      break;
    case "closing":
      m.i += 1;
      stepClosing(m);
      break;
    case "linger":
      m.linger -= 1;
      if (m.linger <= 0) {
        m.phase = "closed";
        m.frame = REST_FRAME;
      }
      break;
    default:
      break;
  }
};

const newMouth = () => ({ phase: "closed", i: 0, linger: 0, frame: REST_FRAME });

const useWindowSize = () => {
  const [size, setSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    const onResize = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return size;
};

/* =====================================
   SNAKE IMMERSION
===================================== */
export const SnakeImmersion = ({ mobileMode, darkMode, leaveActivities }) => {
  const outerContainer = {
    position: "relative",
    width: "100%",
    height: "100vh",
    boxSizing: "border-box",
    padding: "2rem",
    fontFamily: FONT_FAMILY,
  };

  // No title page: the game opens straight onto the "choose game mode" prompt.
  return (
    <Immersion mobileMode={mobileMode} darkMode={darkMode} leaveActivities={leaveActivities}>
      <div style={outerContainer}>
        <SnakeGame
          mobileMode={mobileMode}
          darkMode={darkMode}
          leaveActivities={leaveActivities}
        />
      </div>
    </Immersion>
  );
};

/* =====================================
   SNAKE GAME SCREEN
===================================== */
const SnakeGame = ({ mobileMode, darkMode, leaveActivities }) => {
  const icons = darkMode ? THEME_ICONS.dark : THEME_ICONS.light;
  const renderIcon = (src, scale = 1) => (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      style={{
        display: "block",
        width: `${scale * 100}%`,
        height: `${scale * 100}%`,
        objectFit: "contain",
        pointerEvents: "none",
      }}
    />
  );

  // Everything that depends on the chosen difficulty (null until one is chosen).
  const [difficulty, setDifficulty] = useState(null);
  const cfg = DIFFICULTIES[difficulty ?? DEFAULT_DIFFICULTY];
  const tickMs = Math.round(BASE_TICK_MS / cfg.speedMult);
  const drainMs = BASE_HUNGER_DRAIN_MS / cfg.hungerMult;
  const openDist = openDistance(tickMs);

  // Timers and the draw loop read the current settings from here, so they follow the chosen mode.
  const paramsRef = useRef(null);
  paramsRef.current = { cfg, tickMs, drainMs, openDist };

  const gameRef = useRef(null);
  if (gameRef.current === null) gameRef.current = createGame(DIFFICULTIES[DEFAULT_DIFFICULTY]);

  const [game, setGame] = useState(() => gameRef.current);
  const [frame, setFrame] = useState(REST_FRAME);
  const [runId, setRunId] = useState(0);
  const [popupHidden, setPopupHidden] = useState(false);
  const [popupClosing, setPopupClosing] = useState(false);
  const [deathElapsed, setDeathElapsed] = useState(0);
  const [measuredBox, setMeasuredBox] = useState(null);
  const [activeDirection, setActiveDirection] = useState(null);
  const [mobileControlMode, setMobileControlMode] = useState("joystick");
  const [joyPos, setJoyPos] = useState(null);
  const [hungerShown, setHungerShown] = useState(1);
  const [pageBg, setPageBg] = useState(null);
  const [eatenFoods, setEatenFoods] = useState([]);
  const [scoreBonus, setScoreBonus] = useState(null);

  const popupTimeoutRef = useRef(null);
  const scoreBonusTimeoutRef = useRef(null);
  const colContainerRef = useRef(null);
  const dirQueueRef = useRef([]);
  const mouthRef = useRef(newMouth());
  const wantOpenRef = useRef(false);
  const touchRef = useRef(null);
  const popupInfoRef = useRef({ status: "choose", reason: null, score: 0 });

  const canvasRef = useRef(null);
  const cellRef = useRef(0);
  const dprRef = useRef(1);

  const overlayRef = useRef(null);
  const spacerRef = useRef(null);
  const joyDirRef = useRef(null);

  const eatenTimeoutsRef = useRef([]);
  const fillAnimRef = useRef(null);
  const hungerShownRef = useRef(1);

  const deathParticlesRef = useRef([]);
  const deathEmittedRef = useRef(new Set());

  const { w, h } = useWindowSize();

  const commit = (next) => {
    const previousStatus = gameRef.current?.status;

    if (next.status === "dead" || next.status === "won" || next.status === "choose") {
      clearTimeout(popupTimeoutRef.current);
      setPopupHidden(false);
      setPopupClosing(false);
      if (next.status === "dead") {
        setDeathElapsed(0);
      }
    }

    if (next.status === "dead" && previousStatus !== "dead") {
      deathParticlesRef.current = [];
      deathEmittedRef.current = new Set();
    } else if (next.status !== "dead") {
      deathParticlesRef.current = [];
      deathEmittedRef.current = new Set();
    }

    gameRef.current = next;
    wantOpenRef.current = shouldOpen(next, paramsRef.current.openDist);
    setGame(next);
  };

  useEffect(
    () => () => {
      clearTimeout(popupTimeoutRef.current);
      clearTimeout(scoreBonusTimeoutRef.current);
      eatenTimeoutsRef.current.forEach(clearTimeout);
    },
    []
  );

  // Preload every head frame and food image so sprites do not flicker.
  useEffect(() => {
    [...FRAMES, OVERLAY_IMAGE, ...FOOD_IMAGES].forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  // Move the snake one cell every tickMs.
  useEffect(() => {
    const step = () => {
      const g = gameRef.current;
      if (g.status !== "playing" || !g.snake.length) return;

      const now = performance.now();
      const { cfg, tickMs, drainMs } = paramsRef.current;

      // The snake starves if the hunger bar empties before it eats.
      if (hungerLevel(g.hunger, now, drainMs) <= 0) {
        commit({
          ...g,
          swallowing: null,
          status: "dead",
          reason: "starved",
          deathAt: now,
        });
        return;
      }

      let dir = g.dir;
      const queued = dirQueueRef.current.shift();
      if (queued && !isOpposite(queued, dir)) dir = queued;

      const facing = dir.x !== 0 ? (dir.x > 0 ? "right" : "left") : g.facing;
      const head = g.snake[0];
      const newHead = { x: head.x + dir.x, y: head.y + dir.y };
      const eatenFood = g.foods.find((f) => f.x === newHead.x && f.y === newHead.y);
      const eating = !!eatenFood;

      const outOfBounds =
        newHead.x < 0 ||
        newHead.x >= ARENA_COLS ||
        newHead.y < 0 ||
        newHead.y >= ARENA_ROWS;

      const foodGrowth = eating
        ? Math.max(0, Math.floor(eatenFood.growth ?? DEFAULT_FOOD_GROWTH))
        : 0;
      const willGrow = (g.growthRemaining ?? 0) + foodGrowth > 0;
      const solid = willGrow ? g.snake : g.snake.slice(0, -1);
      const hitSelf = solid.some((s) => s.x === newHead.x && s.y === newHead.y);
      const hitWall = outOfBounds || isWallBetween(g.walls, head, newHead);

      if (hitWall || hitSelf) {
        commit({
          ...g,
          dir,
          facing,
          swallowing: null,
          status: "dead",
          reason: hitWall ? "wall" : "self",
          deathAt: now,
        });
        return;
      }

      let growthRemaining = g.growthRemaining ?? 0;
      if (eating) growthRemaining += foodGrowth;

      const snake = [newHead, ...g.snake];
      if (growthRemaining > 0) growthRemaining -= 1;
      else snake.pop();

      let foods = g.foods;
      let swallowing = null;
      let score = g.score;
      let status = "playing";
      let hunger = g.hunger;

      if (eating) {
        swallowing = eatenFood;
        score += foodGrowth;
        if (foodGrowth > 0) {
          clearTimeout(scoreBonusTimeoutRef.current);
          setScoreBonus({ id: now, amount: foodGrowth });
          scoreBonusTimeoutRef.current = setTimeout(() => setScoreBonus(null), SCORE_BONUS_DURATION_MS);
        }
        fillAnimRef.current = { from: hungerShownRef.current, start: now };
        // Show the eaten food in the hunger bar; each one fades on its own, side by side.
        setEatenFoods((prev) => [...prev, { image: eatenFood.image, key: now }].slice(-EATEN_FOOD_MAX));
        eatenTimeoutsRef.current.push(
          setTimeout(() => {
            setEatenFoods((prev) => prev.filter((f) => f.key !== now));
          }, EATEN_FOOD_FADE_MS)
        );
        hunger = {
          level: Math.min(
            1,
            hungerLevel(g.hunger, now, drainMs) + (eatenFood.satiation ?? DEFAULT_FOOD_SATIATION)
          ),
          at: now,
        };
        foods = refillFoods(
          snake,
          g.foods.filter((f) => f !== eatenFood),
          cfg.foodCount
        );
        if (!foods.length) status = "won";
      }

      commit({
        snake,
        prev: g.snake,
        movedAt: now,
        dir,
        facing,
        foods,
        swallowing,
        growthRemaining,
        score,
        status,
        deathAt: null,
        reason: null,
        hunger,
        pattern: g.pattern,
        walls: g.walls,
        bulges: eating ? [...g.bulges, { t0: now + tickMs }] : g.bulges,
      });
    };

    const id = setInterval(step, tickMs);
    return () => clearInterval(id);
  }, [tickMs]);

  // Advance the mouth animation.
  useEffect(() => {
    const id = setInterval(() => {
      advanceMouth(mouthRef.current, wantOpenRef.current);
      setFrame(mouthRef.current.frame);
    }, FRAME_MS);

    return () => clearInterval(id);
  }, []);

  // Update the hunger bar. After eating, the bar slides up to its new level.
  useEffect(() => {
    const id = setInterval(() => {
      const g = gameRef.current;
      const now = performance.now();
      let level = null;

      if (g.status === "choose") level = 1;
      else if (g.status === "playing") level = hungerLevel(g.hunger, now, paramsRef.current.drainMs);
      else if (g.status === "dead" && g.reason === "starved") level = 0;

      if (level == null) return;

      let shown = level;
      const anim = fillAnimRef.current;

      if (anim && g.status === "playing") {
        const p = Math.min(1, (now - anim.start) / EAT_FILL_MS);
        const eased = 1 - Math.pow(1 - p, 3);
        shown = anim.from + (level - anim.from) * eased;
        if (p >= 1) fillAnimRef.current = null;
      } else if (anim) {
        fillAnimRef.current = null;
      }

      hungerShownRef.current = shown;
      setHungerShown((prev) => (Math.abs(prev - shown) > 0.002 ? shown : prev));
    }, 33);

    return () => clearInterval(id);
  }, []);

  // Draw the snake, belly, pattern, stripes and death particles.
  useEffect(() => {
    let raf;
    let lastFrameAt = performance.now();

    const draw = () => {
      raf = requestAnimationFrame(draw);

      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      const g = gameRef.current;
      const c = cellRef.current;
      const dpr = dprRef.current;
      const now = performance.now();
      const deltaMs = Math.min(40, Math.max(0, now - lastFrameAt));
      lastFrameAt = now;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, ARENA_COLS * c, ARENA_ROWS * c);

      // The ready screen has an empty grid, so there is nothing to draw yet.
      if (!g.snake.length) return;

      const nz = g.pattern.nz;
      const headFlip = g.facing === "right" ? -1 : 1;
      const headTurn = g.dir.y !== 0 ? (g.dir.y < 0 ? 90 : -90) * headFlip : 0;
      const headLift = OPEN_STEPS.includes(mouthRef.current.frame)
        ? HEAD_LIFT_ANGLE * headFlip
        : 0;
      const bellyAngle = (headTurn + headLift + HEAD_ANGLE_OFFSET) * Math.PI / 180;

      // The chin establishes which side of the body the belly starts on.
      const chinX = -Math.sin(bellyAngle);
      const chinY = Math.cos(bellyAngle);

      const t = Math.min(1, (now - g.movedAt) / paramsRef.current.tickMs);

      if (g.status === "dead" && g.deathAt != null) {
        const elapsed = Math.min(DEATH_FADE_MS, Math.max(0, now - g.deathAt));
        setDeathElapsed((previous) =>
          Math.abs(previous - elapsed) > 14 ? elapsed : previous
        );
      }

      const W = BODY_WIDTH * c;
      const O = Math.max(1.25, c * OUTLINE_WIDTH);

      const pts = g.snake.map((sn, i) => {
        const p = g.prev[i] ?? sn;
        return [
          (p.x + (sn.x - p.x) * t + 0.5) * c,
          (p.y + (sn.y - p.y) * t + 0.5) * c,
        ];
      });

      const n = pts.length;
      const deathAlpha = (q) => {
        if (g.status !== "dead" || g.deathAt == null) return 1;
        const elapsed = now - g.deathAt;
        const delay = Math.max(0, q) * DEATH_STAGGER_PER_SEGMENT_MS;
        return 1 - Math.max(0, Math.min(1, (elapsed - delay) / DEATH_FADE_MS));
      };

      const Leff = Math.max(1, n - 2 + (g.swallowing ? t : 1));
      g.bulges = g.bulges.filter((b) =>
        (now - b.t0) / BULGE_MS_PER_CELL - BULGE_RADIUS <
        Math.min(n - 2, BULGE_FADE_LENGTH)
      );

      /* =====================================
         CENTRELINE AND LOCAL BELLY ORIENTATION
      ===================================== */
      const SUB = 16;
      const sx = [];
      const sy = [];
      const sQ = [];

      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < SUB; j++) {
          const u = j / SUB;
          sx.push(pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u);
          sy.push(pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u);
          sQ.push(i + u);
        }
      }

      sx.push(pts[n - 1][0]);
      sy.push(pts[n - 1][1]);
      sQ.push(n - 1);

      const last = sx.length - 1;
      const sFull = [];
      const sCut = [];
      const sCutB = [];
      const skinC = [];
      const bellyC = [];
      const sAngle = [];

      // Estimate a smoothed tangent for each sample. Transporting the normal from
      // sample to sample keeps the belly on one continuous side through corners.
      let previousNormal = null;

      for (let i = 0; i <= last; i++) {
        const before = Math.max(0, i - SUB);
        const after = Math.min(last, i + SUB);

        let tx = sx[after] - sx[before];
        let ty = sy[after] - sy[before];
        let tangentLength = Math.hypot(tx, ty);

        if (tangentLength < 1e-6) {
          tx = -g.dir.x;
          ty = -g.dir.y;
          tangentLength = 1;
        }

        tx /= tangentLength;
        ty /= tangentLength;

        // Left-hand normal of the head-to-tail tangent.
        let nx = -ty;
        let ny = tx;
        const reference = previousNormal ?? { x: chinX, y: chinY };

        // Avoid a 180-degree flip when the snake turns.
        if (nx * reference.x + ny * reference.y < 0) {
          nx = -nx;
          ny = -ny;
        }

        previousNormal = { x: nx, y: ny };

        // Local positive Y points towards the belly.
        const angle = Math.atan2(-nx, ny);
        sAngle.push(angle);

        const q = sQ[i];
        const [, full] = widthsAt(q, Leff, n, g.bulges, now, W, c);
        const bellyDepth = (2 * full) * BELLY_WIDTH;
        const cut = full - bellyDepth;

        sFull.push(full);
        sCut.push(cut);
        sCutB.push(cut);
        skinC.push(skinColour(nz, q));
        bellyC.push(bellyColour(nz, q));
      }

      /* =====================================
         TAIL FRAME
      ===================================== */
      let k = n - 2;
      while (
        k > 0 &&
        Math.hypot(pts[n - 1][0] - pts[k][0], pts[n - 1][1] - pts[k][1]) < 1e-3
      ) {
        k--;
      }

      const tdx = pts[n - 1][0] - pts[k][0];
      const tdy = pts[n - 1][1] - pts[k][1];
      const tlen = Math.hypot(tdx, tdy) || 1;
      const ex0 = tdx / tlen;
      const ex1 = tdy / tlen;

      // The tail frame's vertical axis uses the final transported belly normal.
      const ey0 = -Math.sin(sAngle[last]);
      const ey1 = Math.cos(sAngle[last]);

      const hwT = sFull[last];
      const R = 2 * hwT;
      const Tt = hwT - sCutB[last];
      const tailBelly = true;

      const inTailFrame = (fn) => {
        ctx.save();
        ctx.translate(pts[n - 1][0], pts[n - 1][1]);
        ctx.transform(ex0, ex1, ey0, ey1, 0, 0);
        fn();
        ctx.restore();
      };

      const tailShape = () => {
        ctx.beginPath();
        ctx.moveTo(-1, hwT);
        ctx.lineTo(R, hwT);
        ctx.arc(0, hwT, R, 0, -Math.PI / 2, true);
        ctx.lineTo(-1, -hwT);
        ctx.closePath();
      };

      const cutAt = (n - 2) * SUB;
      const everything = (fn) => {
        fn(0, cutAt - 1);
        ctx.save();
        ctx.translate(pts[n - 1][0], pts[n - 1][1]);
        ctx.transform(ex0, ex1, ey0, ey1, 0, 0);
        ctx.beginPath();
        ctx.rect(-1e4, -1e4, 1e4, 2e4);
        ctx.clip();
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        fn(cutAt, last);
        ctx.restore();
      };

      /* =====================================
         1. BODY OUTLINE
      ===================================== */
      everything((from, to) => {
        for (let i = from; i <= to; i++) {
          ctx.globalAlpha = deathAlpha(sQ[i]);
          ctx.beginPath();
          ctx.arc(sx[i], sy[i], sFull[i] + O, 0, Math.PI * 2);
          ctx.fillStyle = OUTLINE_COLOUR;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      });

      inTailFrame(() => {
        ctx.globalAlpha = deathAlpha(n - 1);
        tailShape();
        ctx.lineWidth = 2 * O;
        ctx.lineJoin = "round";
        ctx.strokeStyle = OUTLINE_COLOUR;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      /* =====================================
         2. SKIN
      ===================================== */
      everything((from, to) => {
        for (let i = from; i <= to; i++) {
          ctx.globalAlpha = deathAlpha(sQ[i]);
          ctx.beginPath();
          discPart(ctx, sx[i], sy[i], sFull[i], sCut[i], false);
          ctx.fillStyle = skinC[i];
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      });

      inTailFrame(() => {
        ctx.globalAlpha = deathAlpha(n - 1);
        tailShape();
        ctx.fillStyle = skinC[last];
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      /* =====================================
         3. SKIN SPOTS
      ===================================== */
      extendPattern(g.pattern, n);

      for (const m of g.pattern.marks) {
        if (m.q >= n - 1) break;

        const i = Math.floor(m.q);
        const f = m.q - i;
        const dx = pts[i + 1][0] - pts[i][0];
        const dy = pts[i + 1][1] - pts[i][1];
        const len = Math.hypot(dx, dy);
        if (len < 1e-3) continue;

        const w = 2 * widthsAt(m.q, Leff, n, g.bulges, now, W, c)[1];
        const x = pts[i][0] + dx * f + m.side * w * (Math.abs(dy) / len);
        const y = pts[i][1] + dy * f - m.top * w * (Math.abs(dx) / len);

        ctx.globalAlpha = deathAlpha(m.q);
        ctx.beginPath();
        ctx.arc(x, y, m.r * w, 0, Math.PI * 2);
        ctx.fillStyle = m.colour;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      /* =====================================
         4. BELLY (no dividing line between belly and skin)
      ===================================== */
      // Each belly cap is clipped to its own body disc and rotated to the local
      // body normal. This keeps the belly at 30% of the diameter, including turns.
      everything((from, to) => {
        for (let i = from; i <= to; i++) {
          if (sCut[i] >= sFull[i] - 0.01) continue;

          ctx.save();
          ctx.globalAlpha = deathAlpha(sQ[i]);
          ctx.translate(sx[i], sy[i]);
          ctx.rotate(sAngle[i]);
          ctx.beginPath();
          discPart(ctx, 0, 0, sFull[i], sCut[i], true);
          ctx.fillStyle = bellyC[i];
          ctx.fill();

          const headShade = Math.max(0, 1 - sQ[i] / 3);
          if (headShade > 0) {
            ctx.fillStyle = `rgba(0, 0, 0, ${0.25 * headShade})`;
            ctx.fill();
          }

          ctx.restore();
        }
      });

      // Belly on the tail, clipped to the tail silhouette.
      if (tailBelly) {
        const cutY = hwT - Tt;

        inTailFrame(() => {
          ctx.save();
          tailShape();
          ctx.clip();
          ctx.globalAlpha = deathAlpha(n - 1);
          ctx.fillStyle = bellyC[last];
          ctx.fillRect(-1, cutY, R + 2, hwT + 1 - cutY);

          ctx.lineWidth = Math.max(1, c * 0.035);
          ctx.lineCap = "butt";

          for (let j = Math.floor((n - 1) / BELLY_STRIPE_SPACING); ; j++) {
            const s = (stripeQ(j) - (n - 1)) * c;
            if (s >= R) break;
            if (s < 1) continue;

            const lean = Math.tan((hash(j) - 0.5) * 2 * STRIPE_ANGLE) * ((hwT - cutY) / 2);
            ctx.strokeStyle = stripeColour(nz, n - 1, j);
            ctx.beginPath();
            ctx.moveTo(s - lean, hwT);
            ctx.lineTo(s + lean, cutY);
            ctx.stroke();
          }

          ctx.restore();
        });

        ctx.globalAlpha = 1;
      }

      /* =====================================
         5. BELLY STRIPES ALONG THE BODY
      ===================================== */
      ctx.lineWidth = Math.max(1, c * 0.035);

      for (let j = 1; stripeQ(j) < n - 1; j++) {
        const q = stripeQ(j);
        const i = Math.floor(q);
        const f = q - i;
        const dx = pts[i + 1][0] - pts[i][0];
        const dy = pts[i + 1][1] - pts[i][1];
        const len = Math.hypot(dx, dy);
        if (len < 1e-3) continue;

        const [, full] = widthsAt(q, Leff, n, g.bulges, now, W, c);
        const bellyDepth = (2 * full) * BELLY_WIDTH;
        const cut = full - bellyDepth;
        if (bellyDepth < 1) continue;

        const x = pts[i][0] + dx * f;
        const y = pts[i][1] + dy * f;
        const lean = Math.tan((hash(j) - 0.5) * 2 * STRIPE_ANGLE);
        const half = bellyDepth * 0.92;
        const sampleIndex = Math.min(last, Math.round(q * SUB));

        ctx.save();
        ctx.globalAlpha = deathAlpha(q);
        ctx.translate(x, y);
        ctx.rotate(sAngle[sampleIndex]);
        ctx.strokeStyle = stripeColour(nz, q, j);
        ctx.beginPath();
        ctx.moveTo(lean * half, cut);
        ctx.lineTo(-lean * half, full);
        ctx.stroke();
        ctx.restore();
      }

      /* =====================================
         6. DEATH PARTICLES
      ===================================== */
      if (g.status === "dead" && g.deathAt != null) {
        const elapsed = now - g.deathAt;

        // Emit one burst when each body segment begins disappearing.
        for (let segment = 0; segment < n; segment++) {
          const segmentDelay = segment * DEATH_STAGGER_PER_SEGMENT_MS;
          if (elapsed < segmentDelay || deathEmittedRef.current.has(segment)) continue;

          deathEmittedRef.current.add(segment);

          const sampleIndex = segment === n - 1
            ? last
            : Math.min(last, segment * SUB + (segment === 0 ? 0 : Math.floor(SUB * 0.5)));

          const originX = sx[sampleIndex];
          const originY = sy[sampleIndex];
          const radius = sFull[sampleIndex];
          const colours = [DEATH_PARTICLE_COLOUR];

          for (let p = 0; p < DEATH_PARTICLE_COUNT; p++) {
            const angle = rand(0, Math.PI * 2);
            const speed = rand(28, 105);
            const life = rand(DEATH_PARTICLE_LIFE_MIN, DEATH_PARTICLE_LIFE_MAX);
            const offset = rand(0, radius * 0.45);

            deathParticlesRef.current.push({
              x: originX + Math.cos(angle) * offset,
              y: originY + Math.sin(angle) * offset,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - rand(8, 28),
              gravity: rand(65, 135),
              size: rand(1.2, Math.max(2, c * 0.075)),
              bornAt: now,
              life,
              colour: colours[Math.floor(Math.random() * colours.length)],
            });
          }
        }

        // Draw particles using their age, then discard expired particles.
        const aliveParticles = [];
        ctx.save();

        for (const particle of deathParticlesRef.current) {
          const age = now - particle.bornAt;
          if (age >= particle.life) continue;

          aliveParticles.push(particle);
          const seconds = age / 1000;
          const px = particle.x + particle.vx * seconds;
          const py = particle.y + particle.vy * seconds + 0.5 * particle.gravity * seconds * seconds;
          const alpha = Math.max(0, 1 - age / particle.life);
          const size = particle.size * (1 - 0.25 * (age / particle.life));

          ctx.globalAlpha = alpha;
          ctx.fillStyle = particle.colour;
          ctx.beginPath();
          ctx.arc(px, py, size, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
        ctx.globalAlpha = 1;
        deathParticlesRef.current = aliveParticles;
      }
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const dismissStartPopup = () => {
    clearTimeout(popupTimeoutRef.current);
    setPopupClosing(true);
    popupTimeoutRef.current = setTimeout(() => {
      setPopupHidden(true);
      setPopupClosing(false);
    }, 260);
  };

  // Clears everything left over from the previous run.
  const resetRun = () => {
    dirQueueRef.current = [];
    mouthRef.current = newMouth();
    deathParticlesRef.current = [];
    deathEmittedRef.current = new Set();

    fillAnimRef.current = null;
    hungerShownRef.current = 1;
    eatenTimeoutsRef.current.forEach(clearTimeout);
    eatenTimeoutsRef.current = [];
    setEatenFoods([]);
    clearTimeout(scoreBonusTimeoutRef.current);
    setScoreBonus(null);
    setFrame(REST_FRAME);
    setDeathElapsed(0);
    setActiveDirection(null);
    setRunId((r) => r + 1);
  };

  // A mode button on the start prompt: start a fresh game in that mode.
  const chooseMode = (key) => {
    const next = DIFFICULTIES[key];
    resetRun();
    setDifficulty(key);
    dismissStartPopup();
    commit(activateGame(createGame(next), next));
  };

  // Playing again builds a brand-new game in the same mode, with a fresh set of walls.
  const playAgain = () => {
    resetRun();
    dismissStartPopup();
    commit(activateGame(createGame(cfg), cfg));
  };

  // Quit goes straight back to the "choose game mode" prompt.
  const quitToStart = () => {
    resetRun();
    setDifficulty(null);
    commit(createGame(DIFFICULTIES[DEFAULT_DIFFICULTY]));
  };

  // Turns are queued while a game is being played.
  const handleDirection = (d) => {
    const g = gameRef.current;
    if (g.status !== "playing") return;

    const queue = dirQueueRef.current;
    const last = queue.length ? queue[queue.length - 1] : g.dir;

    if (isOpposite(d, last)) return;
    if (d.x === last.x && d.y === last.y) return;
    if (queue.length < 2) queue.push(d);
  };

  // Arrow keys and WASD.
  useEffect(() => {
    const onKeyDown = (e) => {
      const d = KEY_DIRECTIONS[e.key];
      if (!d) return;
      e.preventDefault();
      setActiveDirection(d);
      if (!e.repeat) handleDirection(d);
    };

    const onKeyUp = (e) => {
      if (KEY_DIRECTIONS[e.key]) setActiveDirection(null);
    };

    const onBlur = () => setActiveDirection(null);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, []);

  // Swipe controls.
  const onTouchStart = (e) => {
    const touch = e.touches[0];
    touchRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const onTouchEnd = (e) => {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start) return;

    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;

    if (Math.abs(dx) > Math.abs(dy)) {
      handleDirection(dx > 0 ? RIGHT : LEFT);
    } else {
      handleDirection(dy > 0 ? DOWN : UP);
    }
  };

  // Convert the joystick's eight directions to the four directions used by the snake.
  const handleJoystick = ({ x, y, dir }) => {
    if (dir === "center") {
      joyDirRef.current = null;
      return;
    }

    const d = Math.abs(x) > Math.abs(y)
      ? (x > 0 ? RIGHT : LEFT)
      : (y > 0 ? UP : DOWN);

    if (d !== joyDirRef.current) {
      joyDirRef.current = d;
      handleDirection(d);
    }
  };


  const toggleMobileControls = () => {
    setMobileControlMode((mode) => mode === "joystick" ? "arrows" : "joystick");
    setActiveDirection(null);
    joyDirRef.current = null;
  };

  /* =====================================
     SIZES
  ===================================== */
  const joystickMode = mobileMode && mobileControlMode === "joystick";
  const rowH = mobileMode ? ROW_H_MOBILE : ROW_H_DESKTOP;
  const hungerH = rowH; // Hunger, score and buttons all share one height.
  const textPx = mobileMode ? TEXT_PX_MOBILE : TEXT_PX_DESKTOP;

  // The stack fills the immersion area. Every rectangle is full width and only the
  // grid's rectangle changes size, taking whatever height is left. In joystick mode
  // the joystick rectangle ends at the same distance from the edge as the others.
  const boxW = Math.max(1, measuredBox?.w ?? w - 64);
  const boxH = Math.max(1, measuredBox?.h ?? h - 104);

  // Mobile keys are double the desktop size (only shrunk if the screen is too narrow).
  const keypadPad = mobileMode ? KEYPAD_PAD_MOBILE : KEYPAD_PAD_DESKTOP;
  const keyGap = mobileMode ? 8 : KEY_GAP;
  const keySize = mobileMode
    ? Math.floor(
        Math.min(2 * KEY_SIZE_DESKTOP, (boxW - 2 * keypadPad - 2 - 2 * keyGap) / 3)
      )
    : KEY_SIZE_DESKTOP;
  const keypadH = 2 * keySize + keyGap + 2 * keypadPad + 2;
  

  // Score text is doubled but shrinks if the narrower score rectangle needs it.
  const scoreW = boxW - (mobileMode ? 3 : 2) * (rowH + GAP);
  const scoreFontPx = Math.floor(Math.min(textPx, (scoreW - 16) / 6));
  const joystickH = JOYSTICK_SIZE + 2 * JOY_PAD + 2;
  const controlsH = joystickMode ? joystickH : keypadH;

  const gridRectH = Math.max(
    GRID_CHROME + 60,
    boxH - rowH - hungerH - controlsH - 2 * GAP
  );

  // The grid keeps at least OUTER_PAD between its border and the grid rectangle.
  const cell = Math.max(
    4,
    Math.floor(
      GRID_SCALE *
        Math.min(
          CELL_SIZE,
          (boxW - GRID_CHROME) / ARENA_COLS,
          (gridRectH - GRID_CHROME) / ARENA_ROWS
        )
    )
  );

  cellRef.current = cell;
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  dprRef.current = dpr;

  // Measure the immersion area (the parent box), not the whole screen.
  useLayoutEffect(() => {
    const container = colContainerRef.current;
    const outer = container?.parentElement;
    if (!outer) return;

    const cs = window.getComputedStyle(outer);
    const padX = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
    const padY = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
    const rect = outer.getBoundingClientRect();
    const innerW = outer.clientWidth - padX;
    const innerH = outer.clientHeight - padY;
    const visibleH = window.innerHeight - rect.top - padY;

    setMeasuredBox({
      w: Math.max(1, innerW),
      h: Math.max(150, Math.min(innerH, visibleH)),
    });
  }, [mobileMode, w, h]);

  // Find the page background so the popup buttons match the page.
  useLayoutEffect(() => {
    let el = colContainerRef.current;
    let bg = null;

    while (el) {
      const colour = window.getComputedStyle(el).backgroundColor;
      if (
        colour &&
        colour !== "transparent" &&
        !/^rgba\(\s*0,\s*0,\s*0,\s*0\s*\)$/.test(colour)
      ) {
        bg = colour;
        break;
      }
      el = el.parentElement;
    }

    setPageBg((prev) => (prev === bg ? prev : bg));
  }, [mobileMode, w, h, game.status]);

  // Position the floating joystick under the controls panel.
  useLayoutEffect(() => {
    if (!joystickMode || !spacerRef.current || !overlayRef.current) {
      setJoyPos(null);
      return;
    }

    const spacer = spacerRef.current.getBoundingClientRect();
    const overlay = overlayRef.current.getBoundingClientRect();

    setJoyPos({
      x: Math.round(spacer.left - overlay.left + (spacer.width - JOYSTICK_SIZE) / 2),
      y: Math.round(spacer.top - overlay.top),
    });
  }, [joystickMode, w, h, cell, measuredBox]);

  const headSize = HEAD_SIZE * cell;
  const foodSize = FOOD_SIZE * cell;
  const head = game.snake[0] ?? { x: 0, y: 0 };

  // The head artwork faces left. Mirroring makes it face right; vertical movement
  // rotates the artwork while retaining its last horizontal facing direction.
  const flip = game.facing === "right" ? -1 : 1;
  const rotation = game.dir.y !== 0 ? (game.dir.y < 0 ? 90 : -90) * flip : 0;
  const mouthOpen = OPEN_STEPS.includes(frame);
  const lift = mouthOpen ? HEAD_LIFT_ANGLE * flip : 0;

  /* =====================================
     STYLES
  ===================================== */
  const colContainer = {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: GAP,
    width: "100%",
    height: measuredBox ? boxH : "100%",
    boxSizing: "border-box",
    touchAction: "none",
    userSelect: "none",
    fontFamily: FONT_FAMILY,
  };

  const sectionStyle = {
    width: "100%",
    maxWidth: "100%",
    boxSizing: "border-box",
    alignSelf: "stretch",
    marginLeft: 0,
    border: "1px solid var(--colour-5)",
    borderRadius: "7px",
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.22)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  };

  // The score rectangle holds the score and the home / controls buttons.
  const topRowStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    gap: GAP,
    width: "100%",
    height: rowH,
    alignSelf: "stretch",
    flexShrink: 0,
  };

  // Narrower score rectangle: the buttons take the space on its right.
  const scoreSectionStyle = {
    ...sectionStyle,
    width: "auto",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minWidth: 0,
    alignSelf: "stretch",
    height: rowH,
    padding: "0 0.5rem",
  };

  const scoreStyle = {
    fontFamily: FONT_FAMILY,
    fontWeight: 700,
    fontSize: scoreFontPx,
    whiteSpace: "nowrap",
    color: "var(--colour-6)",
    textAlign: "center",
  };

  // Absolutely positioned so the temporary bonus never changes the score label's width or centre.
  const scoreBonusStyle = {
    position: "absolute",
    left: "calc(100% + 0.35em)",
    top: "50%",
    whiteSpace: "nowrap",
    color: "var(--colour-6)",
    fontSize: "0.82em",
    fontWeight: 700,
    pointerEvents: "none",
    animation: `scoreBonusFade ${SCORE_BONUS_DURATION_MS}ms ease-out forwards`,
  };

  // Hunger rectangle: just the outlined bar (the last-eaten food shows inside it).
  const hungerSectionStyle = {
    ...sectionStyle,
    height: hungerH,
    padding: "0 0.72rem", // Space left and right of the bar.
    gap: "0.35rem",
  };

  const hungerTrackStyle = {
    position: "relative",
    flex: 1,
    height: `${HUNGER_BAR_FRAC * 100}%`,
    boxSizing: "border-box",
    border: "1px solid var(--colour-5)",
    borderRadius: "6px",
    overflow: "hidden",
    backgroundColor: "var(--colour-2)",
  };

  const hungerIcon = Math.round(hungerH * HUNGER_BAR_FRAC * 0.75);
  const eatenSlot = hungerIcon + 4; // Icon plus a small gap to the next food.

  const hungerFillStyle = {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: `${hungerShown * 100}%`,
    borderRadius: "5px",
    backgroundColor: "var(--colour-4)",
  };

  // Outer border: same look (and shadow) as the score and keypad rectangles.
  // It stretches to fill the remaining space; the grid inside keeps its own size.
  const gridSectionStyle = {
    ...sectionStyle,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minHeight: 0,
    padding: OUTER_PAD,
    // Join the controls panel below the grid and use its top border as the divider.
    borderBottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  };

  // Holds the arena and the wall ring around it: no border, no shadow.
  const gridInnerStyle = {
    boxSizing: "border-box",
    backgroundColor: "transparent",
    padding: RING_EXT, // Room for the wall ring, which is drawn around the arena.
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    boxShadow: "none",
  };

  const arenaStyle = {
    position: "relative",
    isolation: "isolate",
    width: ARENA_COLS * cell,
    height: ARENA_ROWS * cell,
    flexShrink: 0,
    boxSizing: "content-box",
    backgroundColor: "var(--colour-2)",
    backgroundImage:
      "linear-gradient(var(--colour-3) 1px, transparent 1px), linear-gradient(90deg, var(--colour-3) 1px, transparent 1px)",
    backgroundSize: `${cell}px ${cell}px`,
    boxShadow: "none",
  };

  const controlsSectionStyle = {
    ...sectionStyle,
    minHeight: controlsH,
    padding: joystickMode ? JOY_PAD : keypadPad,
    position: "relative",
    // Pull the panel up to meet the grid; this top border is the single divider line.
    marginTop: -GAP,
    borderTop: "1px solid var(--colour-5)",
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  };

  const directionGridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(3, ${keySize}px)`,
    gridTemplateRows: `repeat(2, ${keySize}px)`,
    gap: `${keyGap}px`,
    justifyContent: "center",
    alignContent: "center",
  };

  const directionButtonStyle = (direction, fontSize = "1.35rem") => {
    const isSnakeDirection =
      game.status === "playing" &&
      game.dir.x === direction.x &&
      game.dir.y === direction.y;
    const isPressed =
      activeDirection != null &&
      activeDirection.x === direction.x &&
      activeDirection.y === direction.y;

    return {
      fontFamily: FONT_FAMILY,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: `${isSnakeDirection ? 2 : 1}px solid var(--colour-5)`,
      borderRadius: "7px",
      background: isPressed ? "var(--colour-4)" : "var(--colour-3)",
      color: "var(--colour-6)",
      fontSize,
      fontWeight: 800,
      cursor: "pointer",
      touchAction: "manipulation",
      minWidth: 0,
      boxShadow: "none",
      transform: isPressed ? "scale(0.97)" : "none",
      padding: 0,
      lineHeight: 0,
    };
  };

  const makeDirectionButton = (direction, label, ariaLabel, fontSize) => (
    <button
      type="button"
      style={directionButtonStyle(direction, fontSize)}
      onPointerDown={() => setActiveDirection(direction)}
      onPointerUp={() => setActiveDirection(null)}
      onPointerCancel={() => setActiveDirection(null)}
      onPointerLeave={() => setActiveDirection(null)}
      onClick={() => handleDirection(direction)}
      aria-label={ariaLabel}
    >
      {label}
    </button>
  );

  // Compact CSS triangles for the mobile keypad; desktop keeps its WASD labels.
  const directionTriangle = (direction) => {
    const height = Math.max(6, Math.round(keySize * 0.18));
    const halfBase = Math.max(5, Math.round(keySize * 0.16));
    const style = {
      display: "block",
      width: 0,
      height: 0,
      borderStyle: "solid",
    };

    if (direction === UP) {
      return { ...style, borderWidth: `0 ${halfBase}px ${height}px`, borderColor: `transparent transparent var(--colour-5)` };
    }
    if (direction === DOWN) {
      return { ...style, borderWidth: `${height}px ${halfBase}px 0`, borderColor: `var(--colour-5) transparent transparent` };
    }
    if (direction === LEFT) {
      return { ...style, borderWidth: `${halfBase}px ${height}px ${halfBase}px 0`, borderColor: `transparent var(--colour-5) transparent transparent` };
    }
    return { ...style, borderWidth: `${halfBase}px 0 ${halfBase}px ${height}px`, borderColor: `transparent transparent transparent var(--colour-5)` };
  };

  const glassStyle = {
    position: "absolute",
    inset: 0,
    zIndex: 15,
    pointerEvents: "none",
    background:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 40%)",
  };

  // The prompt is a fixed 7 x 7 cells. The title is sized to fit on one line;
  // The prompt occupies 7 x 7 cells on desktop and 9 x 9 cells on mobile.
  // On narrow phones, reduce the horizontal padding and button gap so the three
  // full-size mode buttons still fit within the 9-cell-wide prompt.
  const popupSide = (mobileMode ? 7.8 : 6.8) * cell;
  const popupBtnGap = mobileMode
    ? Math.max(4, Math.min(6, Math.floor((popupSide - 3 * rowH - 2) / 2)))
    : Math.max(6, Math.round(cell * 0.3));
  const popupPadX = mobileMode
    ? Math.max(2, Math.min(8, (popupSide - 3 * rowH - 2 * popupBtnGap - 2) / 2))
    : Math.max(8, cell * 0.4);
  const titleChars = 16; // "CHOOSE GAME MODE"
  const popupFont = Math.max(
    8,
    Math.floor(Math.min(textPx, (popupSide - 2 * Math.max(4, cell * 0.2) - 2) / (titleChars * 0.64)))
  );
  const popupBodyFont = Math.max(7, Math.round(popupFont * 0.85));

  // Popup buttons match the top-right control buttons exactly.
  const popupBtn = rowH;

  const overlayStyle = {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: popupSide,
    height: popupSide,
    boxSizing: "border-box",
    transform: "translate(-50%, -50%)",
    zIndex: 25,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: `${Math.max(2, cell * 0.1)}px`,
    paddingTop: `${Math.max(8, cell * 0.5)}px`,
    paddingLeft: `${popupPadX}px`,
    paddingRight: `${popupPadX}px`,
    paddingBottom: `${Math.max(8, cell * 0.5)}px`,
    overflow: mobileMode ? "visible" : "hidden",
    textAlign: "center",
    color: "var(--colour-6)",
    fontFamily: FONT_FAMILY,
    fontWeight: 700,
    backgroundColor: "var(--colour-3)",
    border: "1px solid var(--colour-5)",
    borderRadius: "10px",
    boxShadow: "0 3px 12px rgba(0, 0, 0, 0.24)",
    opacity: popupClosing ? 0 : 1,
    transition: "opacity 0.26s ease",
    pointerEvents: popupClosing ? "none" : "auto",
  };

  // Fills the space above the buttons and centres the title and body in it.
  const popupTextAreaStyle = {
    flex: 1,
    minHeight: 0,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: `${Math.max(3, cell * 0.2)}px`,
  };

  const popupTitleStyle = {
    fontSize: `${popupFont}px`,
    lineHeight: 1.1,
    fontWeight: 900,
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
  };

  // Slightly smaller than the title, not bold, and in capitals.
  const popupBodyStyle = {
    width: "100%",
    boxSizing: "border-box",
    paddingLeft: `${Math.max(4, cell * 0.35)}px`,
    paddingRight: `${Math.max(4, cell * 0.35)}px`,
    fontSize: `${popupBodyFont}px`,
    lineHeight: 1.2,
    fontWeight: 400,
    textTransform: "uppercase",
  };

  const popupButtonRowStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: popupBtnGap,
    flexShrink: 0,
  };

  const popupButtonStyle = {
    fontFamily: FONT_FAMILY,
    width: popupBtn,
    height: popupBtn,
    minWidth: popupBtn,
    minHeight: popupBtn,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid var(--colour-5)",
    borderRadius: "8px",
    backgroundColor: pageBg ?? "transparent",
    color: "var(--colour-6)",
    fontWeight: 700,
    fontSize: `${Math.round(popupBtn * 0.55)}px`,
    lineHeight: 1,
    cursor: "pointer",
    padding: Math.max(5, Math.round(popupBtn * 0.18)),
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.22)",
  };

  const buttonSize = rowH; // Buttons are as tall as the score rectangle.

  // The buttons sit in a row inside the score rectangle on both mobile and desktop.
  const buttonRowStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: GAP,
    height: rowH,
    flexShrink: 0,
  };

  const iconButtonStyle = {
    fontFamily: FONT_FAMILY,
    width: buttonSize,
    height: buttonSize,
    boxSizing: "border-box",
    borderRadius: "8px",
    border: "1px solid var(--colour-5)",
    backgroundColor: "transparent",
    color: "var(--colour-6)",
    fontSize: `${Math.round(rowH * 0.5)}px`,
    fontWeight: 700,
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: Math.max(5, Math.round(rowH * 0.18)),
    flexShrink: 0,
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.22)",
  };

  /* =====================================
     SNAKE AND FOOD LAYERS
  ===================================== */
  const headLayer = (src, z, visible = true) => (
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: cell,
        height: cell,
        zIndex: z,
        pointerEvents: "none",
        visibility: visible ? "visible" : "hidden",
        opacity:
          game.status === "dead"
            ? Math.max(0, 1 - Math.min(1, deathElapsed / DEATH_FADE_MS))
            : 1,
        transform: `translate(${head.x * cell}px, ${head.y * cell}px)`,
        transition: `transform ${tickMs}ms linear, opacity 0.02s linear`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `rotate(${rotation + lift + HEAD_ANGLE_OFFSET}deg) scaleX(${flip})`,
          transition: `transform ${TURN_MS}ms ease-out`,
        }}
      >
        <img
          src={src}
          alt=""
          draggable={false}
          style={{
            position: "absolute",
            width: headSize,
            height: headSize,
            left: cell / 2 - headSize / 2 - HEAD_OFFSET.x * cell,
            top: cell / 2 - headSize / 2 + HEAD_OFFSET.y * cell,
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );

  const foodZ = frame === FULL_OPEN_FRAME ? 3 : 1;

  const foodLayer = (food, key) => (
    <div
      key={key}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: cell,
        height: cell,
        zIndex: foodZ,
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: foodSize,
        lineHeight: 1,
        transform: `translate(${food.x * cell}px, ${food.y * cell}px)`,
      }}
    >
      {food.image ? (
        <img
          src={food.image}
          alt=""
          draggable={false}
          style={{ width: foodSize, height: foodSize, objectFit: "contain" }}
        />
      ) : (
        FOOD_EMOJI
      )}
    </div>
  );

  /* =====================================
     WALL LAYER
     A wall ring runs around the whole grid (replacing the old arena border), and
     spawned walls are bands of the same thickness. Outlines are drawn first and
     fills second, so everything that touches (ring and walls) merges into one
     continuous shape with no seams.
  ===================================== */
  const wallHalf = WALL_THICKNESS / 2;
  const arenaW = ARENA_COLS * cell;
  const arenaH = ARENA_ROWS * cell;

  const wallRects = [
    // The ring: top, bottom, left, right.
    { x: -wallHalf, y: -wallHalf, w: arenaW + WALL_THICKNESS, h: WALL_THICKNESS },
    { x: -wallHalf, y: arenaH - wallHalf, w: arenaW + WALL_THICKNESS, h: WALL_THICKNESS },
    { x: -wallHalf, y: -wallHalf, w: WALL_THICKNESS, h: arenaH + WALL_THICKNESS },
    { x: arenaW - wallHalf, y: -wallHalf, w: WALL_THICKNESS, h: arenaH + WALL_THICKNESS },
    // Spawned walls. Ends on the arena edge already overlap the ring.
    ...game.walls.segs.map((s) => ({
      x: s.x * cell - wallHalf,
      y: s.y * cell - wallHalf,
      w: s.o === "h" ? cell + WALL_THICKNESS : WALL_THICKNESS,
      h: s.o === "h" ? WALL_THICKNESS : cell + WALL_THICKNESS,
    })),
  ];

  const wallLayer = (
    <svg
      width={arenaW + 2 * RING_EXT}
      height={arenaH + 2 * RING_EXT}
      style={{
        position: "absolute",
        left: -RING_EXT,
        top: -RING_EXT,
        zIndex: 1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <g transform={`translate(${RING_EXT} ${RING_EXT})`}>
        {wallRects.map((r, i) => (
          <rect
            key={`outline-${i}`}
            x={r.x - 1}
            y={r.y - 1}
            width={r.w + 2}
            height={r.h + 2}
            style={{ fill: WALL_OUTLINE }}
          />
        ))}
        {wallRects.map((r, i) => (
          <rect
            key={`fill-${i}`}
            x={r.x}
            y={r.y}
            width={r.w}
            height={r.h}
            style={{ fill: WALL_FILL }}
          />
        ))}
      </g>
    </svg>
  );

  /* =====================================
     RENDER
  ===================================== */
  // Keep what the popup showed while it fades, so the game-over text never
  // appears behind the start popup.
  if (game.status === "choose" || game.status === "dead" || game.status === "won") {
    popupInfoRef.current = { status: game.status, reason: game.reason, score: game.score };
  }
  const popupInfo = popupInfoRef.current;
  const popupTitle =
    popupInfo.status === "choose"
      ? "CHOOSE MODE"
      : popupInfo.status === "won"
        ? `WINNER`
        : `GAME OVER`;
  const popupBody =
    popupInfo.status === "choose"
      ? `FEED THE SNAKE TO STOP HIM FROM GOING HUNGRY`
      : popupInfo.status === "won"
        ? `YOU HAVE EATEN ALL THAT CAN BE EATEN ${cfg.emoji}`
        : `YOU SCORED ${popupInfo.score} ${popupInfo.score === 1 ? "POINT" : "POINTS"} BEFORE ${DEATH_REASONS[popupInfo.reason]} ${cfg.emoji}`;

  return (
    <div
      ref={colContainerRef}
      style={colContainer}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <style>{`@keyframes hungerFoodFade {
        0% { opacity: 1; width: ${eatenSlot}px; }
        55% { opacity: 1; width: ${eatenSlot}px; }
        100% { opacity: 0; width: 0px; }
      }
      @keyframes scoreBonusFade {
        0% { opacity: 0; transform: translateY(-35%); }
        14% { opacity: 1; transform: translateY(-50%); }
        72% { opacity: 1; transform: translateY(-50%); }
        100% { opacity: 0; transform: translateY(-75%); }
      }`}</style>

      <div style={topRowStyle}>
        <div style={scoreSectionStyle}>
          <div style={scoreStyle}>
            <span style={{ position: "relative", display: "inline-block", whiteSpace: "nowrap" }}>
              SCORE: {game.score}
              {scoreBonus && (
                <span key={scoreBonus.id} style={scoreBonusStyle}>
                  (+{scoreBonus.amount})
                </span>
              )}
            </span>
          </div>
        </div>

        <div style={buttonRowStyle}>
          {mobileMode && (
            <button
              type="button"
              style={iconButtonStyle}
              onClick={toggleMobileControls}
              aria-label={mobileControlMode === "joystick" ? "Use arrow keypad" : "Use joystick"}
              title={mobileControlMode === "joystick" ? "Use arrow keypad" : "Use joystick"}
            >
              {renderIcon(mobileControlMode === "joystick" ? icons.keypad : icons.joystick, 0.68)}
            </button>
          )}

          <button
            type="button"
            style={{ ...iconButtonStyle, backgroundColor: "var(--red-0)" }}
            onClick={leaveActivities}
            aria-label="Exit activities"
            title="Exit activities"
          >
            {renderIcon(icons.cross, 0.68)}
          </button>
        </div>
      </div>

      <div style={hungerSectionStyle}>
        <div style={hungerTrackStyle}>
          <div style={hungerFillStyle} />

          {/* Eaten foods appear side by side at the left of the bar; each fades away on its own. */}
          {eatenFoods.length > 0 && (
            <div
              style={{
                position: "absolute",
                left: 6,
                top: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                zIndex: 2,
                pointerEvents: "none",
              }}
            >
              {eatenFoods.map((f) => (
                <div
                  key={f.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexShrink: 0,
                    overflow: "hidden",
                    width: eatenSlot,
                    animation: `hungerFoodFade ${EATEN_FOOD_FADE_MS}ms ease-out forwards`,
                  }}
                >
                  {f.image ? (
                    <img
                      src={f.image}
                      alt=""
                      draggable={false}
                      style={{ width: hungerIcon, height: hungerIcon, objectFit: "contain" }}
                    />
                  ) : (
                    <span style={{ fontSize: hungerIcon, lineHeight: 1 }}>{FOOD_EMOJI}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={gridSectionStyle}>
        <div style={gridInnerStyle}>
        <div key={runId} style={arenaStyle}>
          {wallLayer}

          <canvas
            ref={canvasRef}
            width={Math.round(ARENA_COLS * cell * dpr)}
            height={Math.round(ARENA_ROWS * cell * dpr)}
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: ARENA_COLS * cell,
              height: ARENA_ROWS * cell,
              zIndex: 1,
              pointerEvents: "none",
            }}
          />

          {/* No snake or food is rendered until the game starts. */}
          {game.snake.length > 0 && (
            <>
              {headLayer(FRAMES[frame], 2)}
              {game.foods.map((f) => foodLayer(f, `food-${f.x}-${f.y}`))}
              {game.swallowing && foodLayer(game.swallowing, "swallowing")}
              {headLayer(OVERLAY_IMAGE, 4, frame === FULL_OPEN_FRAME)}
            </>
          )}

          <div style={glassStyle} />

          {!popupHidden &&
            (game.status === "choose" ||
              game.status === "dead" ||
              game.status === "won" ||
              popupClosing) && (
              <div style={overlayStyle}>
                <div style={popupTextAreaStyle}>
                  <div style={popupTitleStyle}>{popupTitle}</div>
                  {popupBody && <div style={popupBodyStyle}>{popupBody}</div>}
                </div>

                {popupInfo.status === "choose" ? (
                  <div style={popupButtonRowStyle}>
                    {Object.entries(DIFFICULTIES).map(([key, d]) => (
                      <button
                        key={key}
                        type="button"
                        style={popupButtonStyle}
                        aria-label={`${d.label} mode`}
                        title={d.label}
                        onClick={() => chooseMode(key)}
                      >
                        {d.emoji}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={popupButtonRowStyle}>
                    <button
                      type="button"
                      style={popupButtonStyle}
                      aria-label="Play again"
                      title="Play again"
                      onClick={playAgain}
                    >
                      {renderIcon(icons.restart, 0.68)}
                    </button>
                    <button
                      type="button"
                      style={popupButtonStyle}
                      aria-label="Choose game mode"
                      title="Choose game mode"
                      onClick={quitToStart}
                    >
                      {renderIcon(icons.gamemode, 0.68)}
                    </button>
                  </div>
                )}
              </div>
            )}
        </div>
        </div>
      </div>

      <div style={controlsSectionStyle}>
        {mobileMode ? (
          mobileControlMode === "joystick" ? (
            <>
              <div
                ref={spacerRef}
                style={{
                  width: JOYSTICK_SIZE,
                  height: JOYSTICK_SIZE,
                  flexShrink: 0,
                }}
              />

              <div
                ref={overlayRef}
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 40,
                  pointerEvents: "none",
                }}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
              >
                {joyPos && (
                  <Joystick
                    size={JOYSTICK_SIZE}
                    initialPosition={joyPos}
                    onChange={handleJoystick}
                    movable={false}
                  />
                )}
              </div>
            </>
          ) : (
            <div style={directionGridStyle} aria-label="Arrow controls">
              <span />
              {makeDirectionButton(UP, <span style={directionTriangle(UP)} />, "Move up")}
              <span />
              {makeDirectionButton(LEFT, <span style={directionTriangle(LEFT)} />, "Move left")}
              {makeDirectionButton(DOWN, <span style={directionTriangle(DOWN)} />, "Move down")}
              {makeDirectionButton(RIGHT, <span style={directionTriangle(RIGHT)} />, "Move right")}
            </div>
          )
        ) : (
          <div style={directionGridStyle} aria-label="WASD controls">
            <span />
            {makeDirectionButton(UP, "W", "Move up")}
            <span />
            {makeDirectionButton(LEFT, "A", "Move left")}
            {makeDirectionButton(DOWN, "S", "Move down")}
            {makeDirectionButton(RIGHT, "D", "Move right")}
          </div>
        )}
      </div>
    </div>
  );
};