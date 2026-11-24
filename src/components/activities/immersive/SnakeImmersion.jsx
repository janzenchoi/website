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
import icon_change_light from "../../../assets/activities/symbols/change_light.png";
import icon_change_dark from "../../../assets/activities/symbols/change_dark.png";
import icon_joystick_light from "../../../assets/activities/symbols/joystick_light.png";
import icon_joystick_dark from "../../../assets/activities/symbols/joystick_dark.png";
import icon_dpad_light from "../../../assets/activities/symbols/dpad_light.png";
import icon_dpad_dark from "../../../assets/activities/symbols/dpad_dark.png";
import icon_restart_light from "../../../assets/activities/symbols/restart_light.png";
import icon_restart_dark from "../../../assets/activities/symbols/restart_dark.png";
import icon_normal_light from "../../../assets/activities/symbols/normal_light.png";
import icon_normal_dark from "../../../assets/activities/symbols/normal_dark.png";
import icon_hard_light from "../../../assets/activities/symbols/hard_light.png";
import icon_hard_dark from "../../../assets/activities/symbols/hard_dark.png";
import icon_vhard_light from "../../../assets/activities/symbols/vhard_light.png";
import icon_vhard_dark from "../../../assets/activities/symbols/vhard_dark.png";
import icon_auto_light from "../../../assets/activities/symbols/auto_light.png";
import icon_auto_dark from "../../../assets/activities/symbols/auto_dark.png";
import icon_pause_light from "../../../assets/activities/symbols/pause_light.png";
import icon_pause_dark from "../../../assets/activities/symbols/pause_dark.png";
import icon_play_light from "../../../assets/activities/symbols/play_light.png";
import icon_play_dark from "../../../assets/activities/symbols/play_dark.png";

const THEME_ICONS = {
  light: {
    cross: icon_cross_light,
    change: icon_change_light,
    joystick: icon_joystick_light,
    dpad: icon_dpad_light,
    restart: icon_restart_light,
    normal: icon_normal_light,
    hard: icon_hard_light,
    vhard: icon_vhard_light,
    auto: icon_auto_light,
    pause: icon_pause_light,
    play: icon_play_light,
  },
  dark: {
    cross: icon_cross_dark,
    change: icon_change_dark,
    joystick: icon_joystick_dark,
    dpad: icon_dpad_dark,
    restart: icon_restart_dark,
    normal: icon_normal_dark,
    hard: icon_hard_dark,
    vhard: icon_vhard_dark,
    auto: icon_auto_dark,
    pause: icon_pause_dark,
    play: icon_play_dark,
  },
};

// Every image in the food folder (webpack / Create React App). Each new piece of food picks one at random.
const foodContext = require.context(
  "../../../assets/activities/snake/food",
  false,
  /\.(png|jpe?g|webp|gif|svg)$/
);
const ALL_FOODS = foodContext.keys().map((key) => {
  const m = foodContext(key);
  return {
    // "./apple.png" -> "apple"
    name: key.replace(/^\.\//, "").replace(/\.[^.]+$/, "").toLowerCase(),
    image: typeof m === "string" ? m : m.default,
  };
});
const FOODS = ALL_FOODS.filter((f) => f.name !== "wasabi"); // Wasabi never spawns as normal food.
const WASABI_IMAGE = ALL_FOODS.find((f) => f.name === "wasabi")?.image ?? null;
const FOOD_IMAGES = ALL_FOODS.map((f) => f.image);

/* =====================================
   SETTINGS: ARENA AND BASE SPEED
===================================== */
const ARENA_COLS = 11;
const ARENA_ROWS = 11;
const CELL_SIZE = 50;
const BASE_TICK_MS = 130; // Normal-mode time per move. Each difficulty scales it with speedMult.
const START_LENGTH = 3;

/* =====================================
   SETTINGS: DIFFICULTIES
   Every number you are likely to tweak lives here.
===================================== */
const DEFAULT_DIFFICULTY = "normal"; // Settings used for the board behind the "choose game mode" prompt.

const DIFFICULTIES = {
  normal: {
    label: "EASY",
    icon: "normal", // Key into THEME_ICONS (normal_light / normal_dark). Used on the start prompt and the game over prompt.
    speedMult: 0.5, // 1.1 = 10% faster, 1.2 = 20% faster. (Kept at 1.0 so every difficulty moves at the same speed.)
    hungerMult: 0.8, // 1.2 = hunger bar empties 20% faster.
    scoreMult: 1, // Multiplier applied to calories gained (and lost) in this mode.
    foodCount: 4, // How many GROUPS of food are on the board at once.
    respawnAllAtOnce: false, // false = a new group spawns as soon as one is eaten. true = nothing spawns until EVERY food on the board is eaten, then a full new set appears.
    straightWalls: 0, // Number of straight walls placed at the start of each game.
    cornerWalls: 0, // Number of L-shaped (corner) walls placed at the start of each game.
    straightLength: [2, 4], // Min / max length of a straight wall, in cells.
    cornerArm: [2, 3], // Min / max length of each arm of an L wall, in cells.
    borderTouchChance: 0.4, // Chance a straight wall is pushed against the arena edge.
  },
  hard: {
    label: "NORMAL",
    icon: "hard",
    speedMult: 0.5,
    hungerMult: 0.9,
    scoreMult: 1.2,
    foodCount: 3,
    respawnAllAtOnce: false,
    straightWalls: 3,
    cornerWalls: 1,
    straightLength: [2, 4],
    cornerArm: [2, 3],
    borderTouchChance: 0.3,
  },
  veryHard: {
    label: "HARD",
    icon: "vhard",
    speedMult: 0.5,
    hungerMult: 1.0,
    scoreMult: 1.4,
    foodCount: 3,
    respawnAllAtOnce: true,
    straightWalls: 5,
    cornerWalls: 2,
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
// `length` changes the snake's length; `calories` changes the calorie total.
// These values are independent and may be positive, zero, or negative.
// Fractional length changes accumulate until they add/remove a whole segment.
// `spawnWeight` controls relative spawn frequency: 2 is twice as likely as 1; 0 disables that food.
// `count` is how many pieces of that food appear together, as one cluster of touching cells,
// every time a group of it spawns.
// `size` is the food's image size from 0 to 1, where 1 is the full FOOD_SIZE constant.
// Wasabi is NOT configured here: see SETTINGS: WASABI & MINIMUM LENGTH below.
const FOOD_CONFIG = {
  temaki_1:   { satiation: 0.1, length: 0.4, calories: 35,  spawnWeight: 1, count: 3, size: 0.5 },
  temaki_2:   { satiation: 0.1, length: 0.4, calories: 40,  spawnWeight: 1, count: 3, size: 0.5 },
  nigiri_1:   { satiation: 0.2,  length: 0.6, calories: 55,  spawnWeight: 1, count: 2, size: 0.6 },
  nigiri_2:   { satiation: 0.2,  length: 0.6, calories: 65,  spawnWeight: 1, count: 2, size: 0.6 },
  nigiri_3:   { satiation: 0.2,  length: 0.6, calories: 75,  spawnWeight: 1, count: 2, size: 0.6 },
  futomaki_1: { satiation: 0.3,  length: 1,   calories: 110, spawnWeight: 1, count: 1, size: 0.7 },
  futomaki_2: { satiation: 0.4,  length: 2,   calories: 180, spawnWeight: 1, count: 1, size: 0.8 },
  futomaki_3: { satiation: 0.5,  length: 4,   calories: 260, spawnWeight: 1, count: 1, size: 0.9 },
};
const DEFAULT_FOOD_SATIATION = 0.4; // Hunger refill for foods not listed above.
const DEFAULT_FOOD_LENGTH = 1; // Length change for foods not listed above.
const DEFAULT_FOOD_CALORIES = 100; // Calories for foods not listed above.
const DEFAULT_FOOD_SPAWN_WEIGHT = 1; // Spawn weight for foods not listed above.
const DEFAULT_FOOD_COUNT = 1; // Pieces per group for foods not listed above.
const DEFAULT_FOOD_SIZE = 1; // Size (0 to 1, where 1 = FOOD_SIZE) for foods not listed above.

/* =====================================
   SETTINGS: WASABI & MINIMUM LENGTH
===================================== */
const MIN_SNAKE_LENGTH = 3; // The snake can never shrink below this.
const WASABI_CYCLE_MS = 20000; // One full cycle.
const WASABI_SPAWN_AT_MS = 10000; // Wasabi appears this far into each cycle...
const WASABI_LIFETIME_MS = 10000; // ...and despawns this long after.
const WASABI_LENGTH_LOSS = 100; // Segments lost per wasabi (never below MIN_SNAKE_LENGTH).
const WASABI_SPEED_BOOST = 0.10; // +10% speed per wasabi (permanent for the run).
const WASABI_CALORIE_BOOST = 1; // +100% calorie multiplier per wasabi.
const WASABI_MAX_EATEN = 128; // No more wasabi spawn after this many are eaten.
const WASABI_SIZE = 0.5; // 0 to 1, like food `size`.
const WASABI_GLOW_RGB = "80, 255, 80";
const DARK_MODE_IMAGE_DARKEN = 0.20; // Dark mode only: every image is this much darker (0.15 = 15%, 0 = off).
const WASABI_ARENA_GLOW = 0.4; // Glow of the wasabi on the arena. 1 = previous strength, 0.5 = half (radius and opacity).

// Body lost to wasabi is not removed at once: the tail retracts smoothly over this long.
const WASABI_SHRINK_MS = 1200; // Doubled (was 600): the shrink takes twice as long.
const EATEN_FOOD_VISIBLE_FRAC = 0.65; // Fraction of the move during which an eaten food stays visible (1 = until the move ends).
const EATEN_FOOD_FADE_FRAC = 0.1; // Fraction of the move over which it then fades out.
const WASABI_TEXT_LIGHT_COLOUR = "#11801c"; // Darker green for the "X WASABIS" text on the result prompt.
const WASABI_TEXT_DARK_COLOUR = "#4bcf58"; // Darker green for the "X WASABIS" text on the result prompt.
// On death, each body segment also bursts into green particles: this many per wasabi eaten.
const WASABI_DEATH_PARTICLES_PER_WASABI = 3;
const WASABI_DEATH_PARTICLE_COLOURS = ["#19a419", "#4fb833", "#27bc38"];

// Keep score and growth values precise while avoiding floating-point display artefacts.
const roundPoints = (value) => Math.round((Number(value) + Number.EPSILON) * 10000) / 10000;
const formatPoints = (value) => String(Math.round(roundPoints(value))); // Shown as whole calories; the exact value is kept internally.
const CLUSTER_SEED_ATTEMPTS = 40; // Random starting cells tried to find room for a full cluster.
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
   SETTINGS: SCREEN, PANELS AND CONTROLS
===================================== */
const JOYSTICK_SIZE = 170;
const AUTO_MANUAL_OVERRIDE_MS = 1000; // After a manual turn in auto mode, ignore AI for this long.
const FONT_FAMILY = "'Courier New', Courier, monospace";
const GRID_SCALE = 0.925; // Grid is 7.5% smaller than the space available (was 10%, now 25% less padding).
const OUTER_PAD = 5; // Gap between the outer border and the wall ring around the grid.
const WALL_THICKNESS = OUTER_PAD; // Walls (and the ring) are as thick as that gap.
const RING_EXT = WALL_THICKNESS / 2 + 1; // How far the ring's outline reaches past the arena edge.
const GAP = 6; // Fixed distance between the rectangles in every view.
const MIN_PANEL_SPACE = 9; // Smallest space above / between / below the grid and controller (was 12, now 25% less).
// Calories, hunger and button rectangles all share this height.
const ROW_H_MOBILE = 55;
const ROW_H_DESKTOP = 50; // 0.8x of the previous 62.5.
// Per side: outer pad + the ring's overhang (the shared panel owns the border).
const GRID_CHROME = 2 * (OUTER_PAD + RING_EXT);
const KEY_SIZE_DESKTOP = 49.6; // px (3.1rem).
const KEY_GAP = 5.6; // px between desktop keys.

/* =====================================
   SETTINGS: PROMPT (POPUP)
   The prompt is a square, made as small as it can be while still holding its text
   at full font size (nothing clipped, overflowing or shrunk).
===================================== */
const POPUP_GAP = 10; // Space between the text block and the buttons, in px.
const POPUP_TEXT_GAP = 8; // Space between title, body and icon, in px.
const POPUP_SLACK = 6; // Extra px of room so text never touches an edge.
const MONO_CHAR_EM = 0.62; // Width of one body character, in em (Courier is 0.6; a little slack added).
const TITLE_CHAR_EM = 0.66; // Width of one title character, in em (includes its letter spacing).
const LABEL_FONT_SCALE = 1.13; // Button label text is this much bigger than the base fitted size.
const LABEL_OFFSET_PX = 3; // Button label text sits this many px lower.
const MODE_ICON_SCALE = 1.75; // Difficulty icons are drawn this many times their slot size and overflow the button.

/* =====================================
   SETTINGS: WALLS
===================================== */
const WALL_FILL = "var(--colour-4)";
const WALL_OUTLINE = "var(--colour-4)";
const WALL_MAX_ATTEMPTS = 800; // Tries per wall before giving up on placing it (higher because walls must also leave no 1-wide gaps).
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
const FOOD_SIZE = 1.0; // Food image size in cells. Each food scales this by its own `size` (0 to 1).
const FOOD_EMOJI = "🍎";
const BODY_WIDTH = 0.8;
const BELLY_WIDTH = 0.2; // Belly occupies exactly 20% of the body's diameter.
const BELLY_BLEND = 0.3; // Fade-in band above the belly, as a fraction of the belly's depth (0 = hard edge).
const OUTLINE_LIGHT_COLOUR = "#000000";
const OUTLINE_DARK_COLOUR = "#adadad";
const OUTLINE_WIDTH = 0.02;
const EDGE_WOBBLE = 1;
const BELLY_COLOUR = "#D7AFA8";
const BELLY_LIGHTNESS_RANGE = 10;
const BELLY_HUE_RANGE = 5;
const BELLY_SAT_RANGE = 6;
const BELLY_GRADIENT_SEGMENTS = 3;
const BELLY_STRIPE_SPACING = 0.2;
const TAIL_LENGTH = 0.6; // How far the tapering tail tip reaches past the last body point, in cells.
const TAIL_TAPER = 0.5; // Taper curve: 1 = straight cone, above 1 = sharp whip-like tip, below 1 = softer, rounder tip.
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
const POPUP_AFTER_DEATH_MS = 200; // The game over prompt appears this long after the last segment has disappeared.
const DEATH_PARTICLE_COUNT = 14; // Doubled (was 7).
const DEATH_PARTICLE_COLOUR = "#8A0303"; // Deep blood red.
const DEATH_PARTICLE_LIFE_MIN = 720; // Doubled (was 360).
const DEATH_PARTICLE_LIFE_MAX = 1120; // Doubled (was 560).

// Spots: each new game picks one hue (each spot gets its own shade of it).
const PATTERN_HUES = [0, 28, 55, 120, 170, 210, 270, 320];
const SPOT_RADIUS = [0.05, 0.18];
const SPOT_SPACING = [0.5, 1.2];
const SPOT_NEIGHBOUR_CHANCE = 0.1;
const SPOT_LIGHTNESS = [16, 24]; // Darker spots (was 28 to 48).

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

/* =====================================
   AUTO PLAY (AI)
===================================== */
const MOVES = [UP, RIGHT, DOWN, LEFT];
const AUTO_MAX_TARGETS = 8; // Food pieces checked (nearest first) before giving up on a safe meal.
const AUTO_URGENCY = 1.5; // Stop being picky when the nearest food takes over 1/1.5 of the remaining hunger time.

const cellKey = (c) => `${c.x},${c.y}`;
const inArena = (x, y) => x >= 0 && x < ARENA_COLS && y >= 0 && y < ARENA_ROWS;

// Flood-fills from body[0]. `steps` maps each reachable cell to the moves needed to reach it;
// `parent` rebuilds routes. Body cells are not permanent walls: segment j (head = 0) is free
// once the snake has moved (length - j) times. `firstMoves` limits the first step (no reversing).
const floodFrom = (body, walls, firstMoves = MOVES) => {
  const len = body.length;
  const freeAt = new Map();
  for (let j = 1; j < len; j++) {
    const key = cellKey(body[j]);
    freeAt.set(key, Math.max(freeAt.get(key) ?? 0, len - j));
  }

  const start = body[0];
  const steps = new Map([[cellKey(start), 0]]);
  const parent = new Map();
  const queue = [start];

  for (let i = 0; i < queue.length; i++) {
    const c = queue[i];
    const next = steps.get(cellKey(c)) + 1;
    for (const d of c === start ? firstMoves : MOVES) {
      const n = { x: c.x + d.x, y: c.y + d.y };
      const key = cellKey(n);
      if (!inArena(n.x, n.y) || steps.has(key)) continue;
      if (isWallBetween(walls, c, n)) continue;
      if ((freeAt.get(key) ?? 0) > next) continue;
      steps.set(key, next);
      parent.set(key, c);
      queue.push(n);
    }
  }

  return { steps, parent };
};

const autoDirection = (g, { tickMs = 260, timeLeftMs = Infinity } = {}) => {
  const snake = g?.snake;
  if (!snake?.length) return null;

  const walls = g.walls;
  const head = snake[0];
  const len = snake.length;
  const legal = MOVES.filter((d) => !isOpposite(d, g.dir));

  // Can the head step this way now without dying? (The move vacates the tail cell.)
  const canStep = (d) => {
    const n = { x: head.x + d.x, y: head.y + d.y };
    return (
      inArena(n.x, n.y) &&
      !isWallBetween(walls, head, n) &&
      !snake.slice(0, Math.max(1, len - 1)).some((s) => s.x === n.x && s.y === n.y)
    );
  };

  // A body "has an exit" if its head can still reach its own tail, which keeps moving away.
  const hasExit = (body) => {
    const { steps } = floodFrom(body, walls);
    return steps.has(cellKey(body[body.length - 1]));
  };

  const { steps, parent } = floodFrom(snake, walls, legal);
  const now = performance.now();
  const eta = (f) => (steps.get(cellKey(f)) ?? Infinity) * tickMs;

  const candidates = [
    ...(g.wasabi && now + eta(g.wasabi) < g.wasabi.expiresAt ? [g.wasabi] : []),
    ...[...(g.foods ?? [])]
      .filter((f) => steps.has(cellKey(f)))
      .sort((a, b) => steps.get(cellKey(a)) - steps.get(cellKey(b))),
  ].slice(0, AUTO_MAX_TARGETS);

  const routeTo = (target) => {
    const route = [];
    for (let c = target; c && cellKey(c) !== cellKey(head); c = parent.get(cellKey(c))) route.push(c);
    return route.reverse(); // First step ... target.
  };
  const firstMove = (route) =>
    MOVES.find((d) => head.x + d.x === route[0].x && head.y + d.y === route[0].y) ?? null;

  // 1. Go for the first food (wasabi first) that leaves the snake a way out afterwards.
  for (const target of candidates) {
    if (eta(target) >= timeLeftMs) continue; // Would starve before arriving.
    const route = routeTo(target);
    if (!route.length) continue;

    // Assume the longest growth the food could give, to be on the safe side.
    const growth = target === g.wasabi ? 0 : Math.max(1, Math.ceil(Number(target.length) || 1));
    const future = [...route.slice().reverse(), ...snake].slice(0, len + growth);
    if (hasExit(future)) return firstMove(route);
  }

  // 2. Nothing is safe. If starving is the bigger danger, take the nearest food anyway.
  const nearest = [...candidates].sort(
    (a, b) => steps.get(cellKey(a)) - steps.get(cellKey(b))
  )[0];
  if (nearest && steps.get(cellKey(nearest)) * tickMs * AUTO_URGENCY >= timeLeftMs) {
    const route = routeTo(nearest);
    if (route.length) return firstMove(route);
  }

  // 3. Otherwise keep safe: prefer moves that keep a way out, then the most open space,
  // then carrying straight on.
  const options = legal.filter(canStep).map((d) => {
    const n = { x: head.x + d.x, y: head.y + d.y };
    const body = [n, ...snake.slice(0, -1)];
    const { steps: room } = floodFrom(body, walls);
    return {
      d,
      exit: room.has(cellKey(body[body.length - 1])),
      area: room.size,
      straight: d === g.dir,
    };
  });
  if (!options.length) return null;

  options.sort((a, b) => (b.exit - a.exit) || (b.area - a.area) || (b.straight - a.straight));
  return options[0].d;
};

// Hunger drains steadily from the level and time of the last meal.
const hungerLevel = (hunger, now, drainMs) =>
  Math.max(0, hunger.level - (now - hunger.at) / drainMs);

let nextFoodGroupId = 1;

// Grows a cluster of up to `size` cells outward from `seed`. Every new cell touches
// (up, down, left or right) a cell already in the cluster, is free, and is not
// separated from it by a wall. Returns fewer cells if the seed has no room to grow.
const growCluster = (seed, size, isFree, walls) => {
  const cluster = [seed];
  const taken = new Set([`${seed.x},${seed.y}`]);

  while (cluster.length < size) {
    const options = [];

    for (const c of cluster) {
      for (const [dx, dy] of DIRS) {
        const next = { x: c.x + dx, y: c.y + dy };
        const key = `${next.x},${next.y}`;
        if (taken.has(key) || !isFree(next.x, next.y)) continue;
        if (isWallBetween(walls, c, next)) continue;
        if (!options.some((o) => o.x === next.x && o.y === next.y)) options.push(next);
      }
    }

    if (!options.length) break;

    const pick = options[Math.floor(Math.random() * options.length)];
    taken.add(`${pick.x},${pick.y}`);
    cluster.push(pick);
  }

  return cluster;
};

// Spawns one group: `count` pieces of the same food placed together as a cluster of
// touching cells. This runs every time a group spawns (not just at the start).
// `blocked` lists extra cells (such as the wasabi) that food must not spawn on.
// Returns an array of foods (fewer than `count` only if the board is too full), or null.
const spawnFoodGroup = (snake, foods = [], walls = null, blocked = []) => {
  const occupied = new Set([
    ...snake.map((s) => `${s.x},${s.y}`),
    ...foods.map((f) => `${f.x},${f.y}`),
    ...blocked.map((f) => `${f.x},${f.y}`),
  ]);
  const isFree = (x, y) =>
    x >= 0 && x < ARENA_COLS && y >= 0 && y < ARENA_ROWS && !occupied.has(`${x},${y}`);

  const free = [];

  for (let x = 0; x < ARENA_COLS; x++) {
    for (let y = 0; y < ARENA_ROWS; y++) {
      if (isFree(x, y)) free.push({ x, y });
    }
  }

  if (!free.length) return null;

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
  const wanted = Math.max(1, Math.floor(foodConfig.count ?? DEFAULT_FOOD_COUNT));
  const groupId = nextFoodGroupId++;

  // Try several random starting cells and keep the biggest cluster found,
  // stopping as soon as one has room for every piece.
  let cells = [];
  for (let attempt = 0; attempt < CLUSTER_SEED_ATTEMPTS; attempt++) {
    const seed = free[Math.floor(Math.random() * free.length)];
    const candidate = growCluster(seed, wanted, isFree, walls);
    if (candidate.length > cells.length) cells = candidate;
    if (cells.length >= wanted) break;
  }

  return cells.map((cell) => ({
    ...cell,
    image: type.image,
    name: type.name,
    groupId,
    satiation: foodConfig.satiation ?? DEFAULT_FOOD_SATIATION,
    length: Number.isFinite(Number(foodConfig.length ?? DEFAULT_FOOD_LENGTH))
      ? Number(foodConfig.length ?? DEFAULT_FOOD_LENGTH)
      : DEFAULT_FOOD_LENGTH,
    calories: Number.isFinite(Number(foodConfig.calories ?? DEFAULT_FOOD_CALORIES))
      ? Number(foodConfig.calories ?? DEFAULT_FOOD_CALORIES)
      : DEFAULT_FOOD_CALORIES,
    size: Math.min(1, Math.max(0, Number(foodConfig.size ?? DEFAULT_FOOD_SIZE) || 0)),
  }));
};

// Tops the board up to `count` groups of food (fewer if there is no room left).
// A group stays on the board until every piece of it has been eaten.
const refillFoods = (snake, foods, count, walls = null, blocked = []) => {
  const next = [...foods];

  while (new Set(next.map((f) => f.groupId)).size < count) {
    const group = spawnFoodGroup(snake, next, walls, blocked);
    if (!group || !group.length) break;
    next.push(...group);
  }

  return next;
};

// Spawns the wasabi 20s into each 30s cycle and removes it 10s later. It is independent
// of the food groups. Returns the new { wasabi, wasabiCycle }.
const updateWasabi = (g, wasabi, now, snake, foods, eatenCount) => {
  let wasabiCycle = g.wasabiCycle;
  if (wasabi && now >= wasabi.expiresAt) wasabi = null;
  if (eatenCount >= WASABI_MAX_EATEN) return { wasabi: null, wasabiCycle };

  const elapsed = now - g.wasabiStart;
  const cycle = Math.floor(elapsed / WASABI_CYCLE_MS);
  const phase = elapsed - cycle * WASABI_CYCLE_MS;

  if (
    !wasabi &&
    cycle > wasabiCycle &&
    phase >= WASABI_SPAWN_AT_MS &&
    phase < WASABI_SPAWN_AT_MS + WASABI_LIFETIME_MS
  ) {
    const taken = new Set([
      ...snake.map((s) => `${s.x},${s.y}`),
      ...foods.map((f) => `${f.x},${f.y}`),
    ]);
    const free = [];
    for (let x = 0; x < ARENA_COLS; x++) {
      for (let y = 0; y < ARENA_ROWS; y++) {
        if (!taken.has(`${x},${y}`)) free.push({ x, y });
      }
    }
    if (free.length) {
      const cell = free[Math.floor(Math.random() * free.length)];
      wasabi = {
        ...cell,
        name: "wasabi",
        image: WASABI_IMAGE,
        size: WASABI_SIZE,
        satiation: 1, // Fills the entire hunger meter.
        calories: 0,
        length: -WASABI_LENGTH_LOSS,
        expiresAt: now + WASABI_LIFETIME_MS - (phase - WASABI_SPAWN_AT_MS),
      };
      wasabiCycle = cycle;
    }
  }

  return { wasabi, wasabiCycle };
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
      const blocked = { left: false, right: false, up: false, down: false };
      for (const [dx, dy] of DIRS) {
        const nx = x + dx;
        const ny = y + dy;
        const isBlocked =
          !inside(nx, ny) || isWallBetween(walls, { x, y }, { x: nx, y: ny });
        if (isBlocked) closed++;
        if (dx === -1) blocked.left = isBlocked;
        if (dx === 1) blocked.right = isBlocked;
        if (dy === -1) blocked.up = isBlocked;
        if (dy === 1) blocked.down = isBlocked;
      }
      // Reject any cell trapped in a one-cell-wide passage between opposing walls
      // or between a wall and the arena boundary.
      if ((blocked.left && blocked.right) || (blocked.up && blocked.down)) return false;
      if (closed >= 3) return false;
    }
  }

  // Reject any 1-cell-wide gap or entrance. An open edge on a grid line is such a gap when
  // BOTH of its end points touch something solid (a wall end/corner or the arena border):
  // it is then a doorway exactly one cell wide. Gaps must be at least 2 cells wide.
  const solidPoint = (vx, vy) =>
    vx <= 0 || vy <= 0 || vx >= ARENA_COLS || vy >= ARENA_ROWS ||
    set.has(wallKey("h", vx - 1, vy)) || set.has(wallKey("h", vx, vy)) ||
    set.has(wallKey("v", vx, vy - 1)) || set.has(wallKey("v", vx, vy));

  for (let y = 1; y < ARENA_ROWS; y++) {
    for (let x = 0; x < ARENA_COLS; x++) {
      if (!set.has(wallKey("h", x, y)) && solidPoint(x, y) && solidPoint(x + 1, y)) return false;
    }
  }
  for (let x = 1; x < ARENA_COLS; x++) {
    for (let y = 0; y < ARENA_ROWS; y++) {
      if (!set.has(wallKey("v", x, y)) && solidPoint(x, y) && solidPoint(x, y + 1)) return false;
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
  wasabi: null,
  wasabiEaten: 0,
  wasabiCycle: -1,
  wasabiStart: 0,
  shrinkPending: 0, // Segments still to be removed by earlier wasabis.
  shrinkPerTick: 0,
});

const activateGame = (g, cfg) => {
  const cx = Math.floor(ARENA_COLS / 2);
  const cy = Math.floor(ARENA_ROWS / 2);
  const snake = Array.from({ length: START_LENGTH }, (_, i) => ({
    x: cx - i,
    y: cy,
    bellyFlip: 1, // 1 = belly on the "facing right" side, 0 = "facing left" side
  }));

  return {
    ...g,
    snake,
    prev: snake,
    movedAt: performance.now(),
    dir: RIGHT,
    facing: "right",
    foods: refillFoods(snake, [], cfg.foodCount, g.walls),
    swallowing: null,
    growthRemaining: 0,
    score: 0,
    status: "playing",
    deathAt: null,
    bulges: [],
    reason: null,
    hunger: { level: 1, at: performance.now() },
    wasabi: null,
    wasabiEaten: 0,
    wasabiCycle: -1,
    wasabiStart: performance.now(),
    shrinkPending: 0,
    shrinkPerTick: 0,
  };
};

const shouldOpen = (g, openDist) => {
  if (g.status !== "playing" || !g.snake.length) return false;
  if (g.swallowing) return true;

  const head = g.snake[0];

  return [...g.foods, ...(g.wasabi ? [g.wasabi] : [])].some((food) => {
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
  // On mobile the rectangles nearly fill the whole area: only a GAP-sized margin
  // (the same as the space between the buttons in the top right).
  const outerContainer = {
    position: "relative",
    width: "100%",
    height: "100vh",
    boxSizing: "border-box",
    padding: mobileMode ? GAP : "2rem",
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

  const gameRef = useRef(null);
  if (gameRef.current === null) gameRef.current = createGame(DIFFICULTIES[DEFAULT_DIFFICULTY]);
  const [game, setGame] = useState(() => gameRef.current);

  // Each wasabi eaten permanently adds to the speed for the rest of the run (additive).
  const speedMult = cfg.speedMult * (1 + WASABI_SPEED_BOOST * game.wasabiEaten);
  const tickMs = Math.round(BASE_TICK_MS / speedMult);
  const drainMs = BASE_HUNGER_DRAIN_MS / cfg.hungerMult;
  const openDist = openDistance(tickMs);

  // Timers and the draw loop read the current settings from here, so they follow the chosen mode.
  const paramsRef = useRef(null);
  paramsRef.current = { cfg, tickMs, drainMs, openDist };

  const [frame, setFrame] = useState(REST_FRAME);
  const [runId, setRunId] = useState(0);
  const [popupHidden, setPopupHidden] = useState(false);
  const [popupClosing, setPopupClosing] = useState(false);
  const [deathElapsed, setDeathElapsed] = useState(0);
  const [measuredBox, setMeasuredBox] = useState(null);
  const [activeDirection, setActiveDirection] = useState(null);
  const [mobileControlMode, setMobileControlMode] = useState("arrows");
  const [joyPos, setJoyPos] = useState(null);
  const [hungerShown, setHungerShown] = useState(1);
  const [pageBg, setPageBg] = useState(null);
  const [eatenFoods, setEatenFoods] = useState([]);
  const [scoreBonus, setScoreBonus] = useState(null);
  const [noSushiLosses, setNoSushiLosses] = useState(0);
  const [autoUnlocked, setAutoUnlocked] = useState(false);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const pausedAtRef = useRef(0); // performance.now() when the current pause began
  const autoPlayRef = useRef(false);
  const autoManualUntilRef = useRef(0); // performance.now() until which auto is blocked after manual input
  const runAteSushiRef = useRef(false);

  const popupTimeoutRef = useRef(null);
  const playAgainRef = useRef(null);
  const scoreBonusTimeoutRef = useRef(null);
  const colContainerRef = useRef(null);
  const dirQueueRef = useRef([]);
  const mouthRef = useRef(newMouth());
  const wantOpenRef = useRef(false);
  const touchRef = useRef(null);
  const popupInfoRef = useRef({ status: "choose", reason: null, score: 0, wasabi: 0, botGame: false });

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

    if (next.status === "dead" && previousStatus !== "dead") {
      // Preserve whether this run was controlled by AUTO for the game-over prompt.
      const wasBotGame = autoPlayRef.current;
      next.botGame = wasBotGame;
      if (wasBotGame) setAutoUnlocked(true);
      if (!runAteSushiRef.current) setNoSushiLosses((count) => count + 1);
      autoPlayRef.current = false;
    }
    if (next.status === "dead" || next.status === "won" || next.status === "choose") {
      clearTimeout(popupTimeoutRef.current);
      setPopupClosing(false);
      if (next.status === "dead") {
        setDeathElapsed(0);
        // Hold the prompt back until every segment has faded out, plus a short pause.
        const segments = Math.max(next.snake.length, next.prev.length);
        const delay =
          Math.max(0, segments - 1) * DEATH_STAGGER_PER_SEGMENT_MS +
          DEATH_FADE_MS +
          POPUP_AFTER_DEATH_MS;
        setPopupHidden(true);
        popupTimeoutRef.current = setTimeout(() => setPopupHidden(false), delay);
      } else {
        setPopupHidden(false);
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
      if (g.status !== "playing" || !g.snake.length || pausedRef.current) return;

      const now = performance.now();
      const { cfg, tickMs, drainMs } = paramsRef.current;

      // The snake starves if the hunger bar empties before it eats.
      if (hungerLevel(g.hunger, now, drainMs) <= 0) {
        commit({ ...g, swallowing: null, status: "dead", reason: "starved", deathAt: now });
        return;
      }

      let dir = g.dir;
      // Manual input temporarily overrides auto; AI is blocked for AUTO_MANUAL_OVERRIDE_MS after each turn.
      const queued = dirQueueRef.current.shift();
      if (queued && !isOpposite(queued, dir)) {
        dir = queued;
      } else if (autoPlayRef.current && now >= autoManualUntilRef.current) {
        const planned = autoDirection(g, {
          tickMs,
          timeLeftMs: hungerLevel(g.hunger, now, drainMs) * drainMs,
        });
        if (planned && !isOpposite(planned, dir)) dir = planned;
      }

      const facing = dir.x !== 0 ? (dir.x > 0 ? "right" : "left") : g.facing;
      const head = g.snake[0];
      const newHead = {
        x: head.x + dir.x,
        y: head.y + dir.y,
        bellyFlip: facing === "right" ? 1 : 0,
      };

      const eatenWasabi =
        g.wasabi && g.wasabi.x === newHead.x && g.wasabi.y === newHead.y ? g.wasabi : null;
      const eatenFood = eatenWasabi
        ? null
        : g.foods.find((f) => f.x === newHead.x && f.y === newHead.y);
      const eatenItem = eatenWasabi ?? eatenFood;
      const eating = !!eatenItem;

      const outOfBounds =
        newHead.x < 0 ||
        newHead.x >= ARENA_COLS ||
        newHead.y < 0 ||
        newHead.y >= ARENA_ROWS;

      const foodLength = eating ? Number(eatenItem.length ?? DEFAULT_FOOD_LENGTH) || 0 : 0;
      // Positive fractions accumulate until a full segment can be added.
      // Negative fractions accumulate until a full segment can be removed.
      const availableLengthChange = roundPoints((g.growthRemaining ?? 0) + foodLength);
      const wantedShrink = Math.max(0, Math.floor(-availableLengthChange));
      const willGrow = availableLengthChange >= 1;
      // Wasabi shrink is queued and then removed a few cells per tick, so the tail retracts
      // smoothly over WASABI_SHRINK_MS. Never shrink below MIN_SNAKE_LENGTH.
      const pendingBefore = g.shrinkPending ?? 0;
      const newShrink = Math.min(
        wantedShrink,
        Math.max(0, g.snake.length - MIN_SNAKE_LENGTH - pendingBefore)
      );
      const pendingTotal = pendingBefore + newShrink;
      const shrinkPerTick = newShrink > 0
        ? Math.max(1, Math.ceil(pendingTotal / Math.max(1, Math.round(WASABI_SHRINK_MS / tickMs))))
        : (g.shrinkPerTick ?? 0);
      const lengthAfterMove = g.snake.length + (willGrow ? 1 : 0);
      const removeNow = Math.min(
        pendingTotal,
        shrinkPerTick,
        Math.max(0, lengthAfterMove - MIN_SNAKE_LENGTH)
      );
      const shrinkPending = lengthAfterMove - removeNow <= MIN_SNAKE_LENGTH ? 0 : pendingTotal - removeNow;
      // Predict which old tail cells remain occupied after this move.
      const cellsRemovedFromTail = (willGrow ? 0 : 1) + removeNow;
      const keepCount = Math.max(1, g.snake.length - cellsRemovedFromTail);
      const solid = g.snake.slice(0, keepCount);
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

      let growthRemaining = availableLengthChange;

      const snake = [newHead, ...g.snake];
      if (willGrow) {
        growthRemaining = roundPoints(growthRemaining - 1);
      } else {
        snake.pop(); // Normal tail movement.
        if (wantedShrink > newShrink) {
          growthRemaining = 0; // Shrink we couldn't pay (already at minimum) is discarded.
        } else if (newShrink > 0) {
          growthRemaining = roundPoints(growthRemaining + newShrink);
        }
      }
      // This tick's share of the queued wasabi shrink.
      for (let i = 0; i < removeNow && snake.length > MIN_SNAKE_LENGTH; i++) snake.pop();

      let foods = g.foods;
      let swallowing = null;
      let score = g.score;
      let status = "playing";
      let hunger = g.hunger;
      const wasabiEaten = g.wasabiEaten + (eatenWasabi ? 1 : 0);
      const wasabiNow = eatenWasabi ? null : g.wasabi;

      if (eating) {
        swallowing = eatenItem;
        const baseCalories = Number(eatenItem.calories ?? DEFAULT_FOOD_CALORIES) || 0;
        const calorieChange = roundPoints(
          baseCalories * (1 + WASABI_CALORIE_BOOST * g.wasabiEaten) * (cfg.scoreMult ?? 1)
        );
        score = roundPoints(score + calorieChange);
        if (calorieChange !== 0) {
          clearTimeout(scoreBonusTimeoutRef.current);
          setScoreBonus({ id: now, amount: calorieChange });
          scoreBonusTimeoutRef.current = setTimeout(() => setScoreBonus(null), SCORE_BONUS_DURATION_MS);
        }
        fillAnimRef.current = { from: hungerShownRef.current, start: now };
        // Show the eaten food in the hunger bar; each one fades on its own, side by side.
        setEatenFoods((prev) => [...prev, { image: eatenItem.image, key: now }].slice(-EATEN_FOOD_MAX));
        eatenTimeoutsRef.current.push(
          setTimeout(() => {
            setEatenFoods((prev) => prev.filter((f) => f.key !== now));
          }, EATEN_FOOD_FADE_MS)
        );
        hunger = {
          level: Math.min(
            1,
            hungerLevel(g.hunger, now, drainMs) + (eatenItem.satiation ?? DEFAULT_FOOD_SATIATION)
          ),
          at: now,
        };

        // Only normal food triggers respawns; wasabi lives outside the food-group limit.
        if (eatenFood) {
          runAteSushiRef.current = true;
          setNoSushiLosses(0);
          const blocked = wasabiNow ? [wasabiNow] : [];
          const remaining = g.foods.filter((f) => f !== eatenFood);
          // Hard modes: wait until every food is eaten, then spawn the whole set again.
          // Normal mode: top the board up as soon as a group is finished.
          foods = cfg.respawnAllAtOnce
            ? (remaining.length
                ? remaining
                : refillFoods(snake, [], cfg.foodCount, g.walls, blocked))
            : refillFoods(snake, remaining, cfg.foodCount, g.walls, blocked);
          if (!foods.length) status = "won";
        }
      }

      const wasabiUpdate = updateWasabi(g, wasabiNow, now, snake, foods, wasabiEaten);

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
        wasabi: wasabiUpdate.wasabi,
        wasabiCycle: wasabiUpdate.wasabiCycle,
        wasabiStart: g.wasabiStart,
        wasabiEaten,
        shrinkPending,
        shrinkPerTick,
      });
    };

    const id = setInterval(step, tickMs);
    return () => clearInterval(id);
  }, [tickMs]);

  // Advance the mouth animation.
  useEffect(() => {
    const id = setInterval(() => {
      if (pausedRef.current) return;
      advanceMouth(mouthRef.current, wantOpenRef.current);
      setFrame(mouthRef.current.frame);
    }, FRAME_MS);

    return () => clearInterval(id);
  }, []);

  // Update the hunger bar. After eating, the bar slides up to its new level.
  useEffect(() => {
    const id = setInterval(() => {
      const g = gameRef.current;
      const now = pausedRef.current ? pausedAtRef.current : performance.now(); // Frozen while paused.
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
      const now = pausedRef.current ? pausedAtRef.current : performance.now(); // Frozen while paused.
      const deltaMs = Math.min(40, Math.max(0, now - lastFrameAt));
      lastFrameAt = now;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, ARENA_COLS * c, ARENA_ROWS * c);

      // The ready screen has an empty grid, so there is nothing to draw yet.
      if (!g.snake.length) return;

      const nz = g.pattern.nz;

      const t = Math.min(1, (now - g.movedAt) / paramsRef.current.tickMs);

      // Belly side along the body: 0 or 1 on each cell, easing between neighbouring
      // cells so a flip becomes a one-cell twist. q + 1 - t is the body's position on
      // the cell track (cells slide forward by one over each move).
      const flipOf = (cellData) => cellData?.bellyFlip ?? 1;
      // The cells the body is sliding along: the new head, then the previous body. This
      // includes the cell the tail is still leaving, so the tail keeps easing through a
      // flip over the whole move instead of holding one side and snapping at the next move.
      const flipCells = [g.snake[0], ...g.prev];
      let flipPos = (q) => q + 1 - t; // Overridden below while the tail is retracting.
      const bellyFlipAt = (q) => {
        const cells = flipCells;
        const tau = Math.min(cells.length - 1, Math.max(0, flipPos(q)));
        const k = Math.floor(tau);
        const u = tau - k;
        const a = flipOf(cells[k]);
        const b = flipOf(cells[Math.min(cells.length - 1, k + 1)]);
        return a + (b - a) * (u * u * (3 - 2 * u));
      };

      // The belly is a band of constant width whose edges stay straight and parallel to the
      // body. Twisting slides the band straight across the body, from one side (side = 0)
      // to the other (side = 1), in the body's own frame (local y = across the body).
      const bellyBand = (full, side) => {
        const cut = full - 2 * full * BELLY_WIDTH;
        return { lo: cut + (-full - cut) * side, hi: full + (-cut - full) * side };
      };

      // Gradient across a body of half-width R: opaque between lo and hi, fading to
      // transparent over a short band outside each edge that lies inside the body.
      const bandGradient = (R, lo, hi, colourAt) => {
        const blend = Math.max(1e-3, (hi - lo) * BELLY_BLEND);
        const alphaAt = (y) =>
          Math.max(0, Math.min(1, (y - (lo - blend)) / blend)) *
          Math.max(0, Math.min(1, (hi + blend - y) / blend));
        const grad = ctx.createLinearGradient(0, -R, 0, R);
        for (const y of [-R, lo - blend, lo, hi, hi + blend, R]) {
          const yy = Math.min(R, Math.max(-R, y));
          grad.addColorStop((yy + R) / (2 * R), colourAt(alphaAt(yy)));
        }
        return grad;
      };

      if (g.status === "dead" && g.deathAt != null) {
        const elapsed = Math.min(DEATH_FADE_MS, Math.max(0, now - g.deathAt));
        setDeathElapsed((previous) =>
          Math.abs(previous - elapsed) > 14 ? elapsed : previous
        );
      }

      const W = BODY_WIDTH * c;
      const O = Math.max(1.25, c * OUTLINE_WIDTH);

      let pts;
      let shrinkSpan = null; // Head-to-tail length in cells while the tail is retracting.

      if (g.snake.length < g.prev.length) {
        // Shrinking: walk along the path the body already follows and pull the tail forward
        // along it, so the snake gets shorter smoothly instead of snapping.
        const path = [g.snake[0], ...g.prev];
        const at = (idx) => {
          const i = Math.min(path.length - 1, Math.max(0, Math.floor(idx)));
          const f = idx - i;
          const a = path[i];
          const b = path[Math.min(path.length - 1, i + 1)];
          return [(a.x + (b.x - a.x) * f + 0.5) * c, (a.y + (b.y - a.y) * f + 0.5) * c];
        };
        const headIdx = 1 - t;
        const tailIdx = g.prev.length - t * (g.prev.length - g.snake.length + 1);
        shrinkSpan = tailIdx - headIdx;
        pts = [];
        for (let j = 0; j < shrinkSpan - 0.02; j++) pts.push(at(headIdx + j));
        pts.push(at(tailIdx));
        // Map each point to its true position along the path (the last gap is shorter than a cell).
        const shrinkN = pts.length;
        flipPos = (q) =>
          q <= shrinkN - 2
            ? headIdx + q
            : headIdx + (shrinkN - 2) + (q - (shrinkN - 2)) * (tailIdx - headIdx - (shrinkN - 2));
      } else {
        pts = g.snake.map((sn, i) => {
          const p = g.prev[i] ?? sn;
          return [
            (p.x + (sn.x - p.x) * t + 0.5) * c,
            (p.y + (sn.y - p.y) * t + 0.5) * c,
          ];
        });
      }

      const n = pts.length;
      const deathAlpha = (q) => {
        if (g.status !== "dead" || g.deathAt == null) return 1;
        const elapsed = now - g.deathAt;
        const delay = Math.max(0, q) * DEATH_STAGGER_PER_SEGMENT_MS;
        return 1 - Math.max(0, Math.min(1, (elapsed - delay) / DEATH_FADE_MS));
      };

      const Leff = shrinkSpan != null
        ? Math.max(1, shrinkSpan - 1 + (g.swallowing ? t : 1))
        : Math.max(1, n - 2 + (g.swallowing ? t : 1));
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
      const skinC = [];
      const bellyC = [];
      const sNormal = []; // Angle of the body's left-hand normal (head to tail).
      const sSide = []; // 0 = belly on that normal side, 1 = opposite side, between = mid-slide.

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

        // The left-hand normal (-ty, tx) is continuous along the body, so it never flips by itself.
        const q = sQ[i];
        const normal = Math.atan2(ty, tx);
        const side = bellyFlipAt(q);

        sNormal.push(normal);
        sSide.push(side);

        const [, full] = widthsAt(q, Leff, n, g.bulges, now, W, c);

        sFull.push(full);
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

      // The tail frame's vertical axis is the body normal; the belly band slides across it.
      const ey0 = -Math.sin(sNormal[last]);
      const ey1 = Math.cos(sNormal[last]);

      const hwT = sFull[last];
      const tailBand = bellyBand(hwT, sSide[last]);
      const tailBelly = tailBand.hi - tailBand.lo > 0.5;

      // The tail is a long taper that narrows smoothly from the body's width to a fine tip.
      // Its belly is drawn per slice, so the belly narrows with the tail and slides across
      // it together with the body's twist.
      const TL = TAIL_LENGTH * c;
      const TAIL_STEPS = 28;
      const tailHalf = (s) => hwT * Math.pow(Math.max(0, 1 - s / TL), TAIL_TAPER);

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
        for (let i = 0; i <= TAIL_STEPS; i++) {
          const s = (TL * i) / TAIL_STEPS;
          ctx.lineTo(s, tailHalf(s));
        }
        for (let i = TAIL_STEPS; i >= 0; i--) {
          const s = (TL * i) / TAIL_STEPS;
          ctx.lineTo(s, -tailHalf(s));
        }
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
          ctx.fillStyle = darkMode ? OUTLINE_DARK_COLOUR : OUTLINE_LIGHT_COLOUR;
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      });

      inTailFrame(() => {
        ctx.globalAlpha = deathAlpha(n - 1);
        tailShape();
        ctx.lineWidth = 2 * O;
        ctx.lineJoin = "round";
        ctx.strokeStyle = darkMode ? OUTLINE_DARK_COLOUR : OUTLINE_LIGHT_COLOUR;
        ctx.stroke();
        ctx.globalAlpha = 1;
      });

      /* =====================================
         2. SKIN
         Full discs: the belly is painted over them, so the skin never leaves a
         sliver on the wrong side while the belly twists round.
      ===================================== */
      everything((from, to) => {
        for (let i = from; i <= to; i++) {
          ctx.globalAlpha = deathAlpha(sQ[i]);
          ctx.beginPath();
          ctx.arc(sx[i], sy[i], sFull[i], 0, Math.PI * 2);
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
         4. BELLY (soft fade from skin, no dividing line)
      ===================================== */
      // Each belly cap is clipped to its own body disc and rotated to the local
      // body normal. It fades in over a short band above its old edge.
      everything((from, to) => {
        for (let i = from; i <= to; i++) {
          if (sFull[i] < 0.5) continue;

          ctx.save();
          ctx.globalAlpha = deathAlpha(sQ[i]);
          ctx.translate(sx[i], sy[i]);
          ctx.rotate(sNormal[i]); // Always aligned to the body: the band's edges stay straight.

          const band = bellyBand(sFull[i], sSide[i]);
          ctx.beginPath();
          ctx.arc(0, 0, sFull[i], 0, Math.PI * 2);

          ctx.fillStyle = bandGradient(
            sFull[i], band.lo, band.hi,
            (a) => bellyC[i].replace(/\)$/, ` / ${a})`)
          );
          ctx.fill();

          const headShade = Math.max(0, 1 - sQ[i] / 3);
          if (headShade > 0) {
            ctx.fillStyle = bandGradient(
              sFull[i], band.lo, band.hi,
              (a) => `rgba(0, 0, 0, ${0.25 * headShade * a})`
            );
            ctx.fill(); // Reuses the same path.
          }

          ctx.restore();
        }
      });

      // Belly on the tail, clipped to the tail silhouette.
      if (tailBelly) {
        inTailFrame(() => {
          ctx.save();
          tailShape();
          ctx.clip();
          ctx.globalAlpha = deathAlpha(n - 1);

          // One belly cap per slice, the same way the body does it, but with the slice's
          // own (shrinking) width so the belly tapers with the tail.
          const slices = Math.max(8, Math.ceil(TL / (c / SUB)));
          for (let i = 0; i <= slices; i++) {
            const s = (TL * i) / slices;
            const h = tailHalf(s);
            if (h < 0.5) continue;

            const band = bellyBand(h, sSide[last]);
            ctx.save();
            ctx.translate(s, 0);
            ctx.beginPath();
            ctx.arc(0, 0, h, 0, Math.PI * 2);
            ctx.fillStyle = bandGradient(
              h, band.lo, band.hi,
              (a) => bellyC[last].replace(/\)$/, ` / ${a})`)
            );
            ctx.fill();
            ctx.restore();
          }

          ctx.lineWidth = Math.max(1, c * 0.035);
          ctx.lineCap = "butt";

          for (let j = Math.floor((n - 1) / BELLY_STRIPE_SPACING); ; j++) {
            const s = (stripeQ(j) - (n - 1)) * c;
            if (s >= TL) break;
            if (s < 1) continue;

            const h = tailHalf(s);
            if (h < 1.5) continue;

            const band = bellyBand(h, sSide[last]);
            const lean = Math.tan((hash(j) - 0.5) * 2 * STRIPE_ANGLE) * ((band.hi - band.lo) / 2);
            ctx.strokeStyle = stripeColour(nz, n - 1, j);
            ctx.beginPath();
            ctx.moveTo(s - lean, band.hi);
            ctx.lineTo(s + lean, band.lo);
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
        if (bellyDepth < 1) continue;
        const band = bellyBand(full, bellyFlipAt(q));

        const x = pts[i][0] + dx * f;
        const y = pts[i][1] + dy * f;
        const lean = Math.tan((hash(j) - 0.5) * 2 * STRIPE_ANGLE);
        const half = bellyDepth * 0.92;
        const sampleIndex = Math.min(last, Math.round(q * SUB));

        ctx.save();
        ctx.globalAlpha = deathAlpha(q);
        ctx.translate(x, y);
        ctx.rotate(sNormal[sampleIndex]);
        ctx.strokeStyle = stripeColour(nz, q, j);
        ctx.beginPath();
        ctx.moveTo(lean * half, band.lo);
        ctx.lineTo(-lean * half, band.hi);
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
          const greenCount = g.wasabiEaten * WASABI_DEATH_PARTICLES_PER_WASABI;

          for (let p = 0; p < DEATH_PARTICLE_COUNT + greenCount; p++) {
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
              size: rand(2.4, Math.max(4, c * 0.15)), // Doubled (was 1.2 / c * 0.075).
              bornAt: now,
              life,
              colour: p < DEATH_PARTICLE_COUNT
                ? DEATH_PARTICLE_COLOUR
                : WASABI_DEATH_PARTICLE_COLOURS[
                    Math.floor(Math.random() * WASABI_DEATH_PARTICLE_COLOURS.length)
                  ],
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
    autoManualUntilRef.current = 0;
    pausedRef.current = false;
    setPaused(false);
    runAteSushiRef.current = false;
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
    autoPlayRef.current = false;
    resetRun();
    dismissStartPopup();
    commit(activateGame(createGame(cfg), cfg));
  };

  const playAutomatically = () => {
    autoPlayRef.current = true;
    resetRun();
    dismissStartPopup();
    commit(activateGame(createGame(cfg), cfg));
  };

  // The key listener below is registered once, so it calls the latest playAgain through this ref.
  playAgainRef.current = playAgain;

  // Quit goes straight back to the "choose game mode" prompt.
  const quitToStart = () => {
    resetRun();
    setDifficulty(null);
    commit(createGame(DIFFICULTIES[DEFAULT_DIFFICULTY]));
  };

  // Pause freezes the snake, the hunger bar, the wasabi timers and the drawing clock.
  // Resuming shifts every timestamp forward by the time spent paused, so nothing jumps.
  const togglePause = () => {
    const g = gameRef.current;
    if (g.status !== "playing") return;

    if (!pausedRef.current) {
      pausedAtRef.current = performance.now();
      pausedRef.current = true;
      setPaused(true);
      setActiveDirection(null);
      return;
    }

    const d = performance.now() - pausedAtRef.current;
    pausedRef.current = false;
    setPaused(false);
    if (fillAnimRef.current) fillAnimRef.current = { ...fillAnimRef.current, start: fillAnimRef.current.start + d };
    autoManualUntilRef.current += d;
    commit({
      ...g,
      movedAt: g.movedAt + d,
      hunger: { ...g.hunger, at: g.hunger.at + d },
      wasabiStart: g.wasabiStart + d,
      wasabi: g.wasabi ? { ...g.wasabi, expiresAt: g.wasabi.expiresAt + d } : g.wasabi,
      bulges: g.bulges.map((b) => ({ ...b, t0: b.t0 + d })),
    });
  };

  // Turns are queued while a game is being played.
  const handleDirection = (d) => {
    const g = gameRef.current;
    if (g.status !== "playing" || pausedRef.current) return;

    // In auto mode, any manual turn blocks the AI for a few seconds.
    if (autoPlayRef.current) {
      autoManualUntilRef.current = performance.now() + AUTO_MANUAL_OVERRIDE_MS;
    }

    const queue = dirQueueRef.current;
    const last = queue.length ? queue[queue.length - 1] : g.dir;

    if (isOpposite(d, last)) return;
    if (d.x === last.x && d.y === last.y) return;
    if (queue.length < 2) queue.push(d);
  };

  // Arrow keys and WASD.
  useEffect(() => {
    const onKeyDown = (e) => {
      // Spacebar restarts the game from the game over / winner prompt.
      if (e.key === " " || e.code === "Space") {
        const status = gameRef.current.status;
        if (status === "dead" || status === "won") {
          e.preventDefault();
          if (!e.repeat) playAgainRef.current?.();
        }
        return;
      }

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
  // grid's rectangle changes size, taking whatever height is left.
  // On mobile the outer padding is just GAP on each side, so the fallback subtracts that.
  const boxW = Math.max(1, measuredBox?.w ?? w - (mobileMode ? 2 * GAP : 64));
  const boxH = Math.max(1, measuredBox?.h ?? h - (mobileMode ? 2 * GAP : 104));

  // Desktop keypad: two rows of keys. Mobile arrows: a console-style D-pad cross
  // whose size matches the joystick, so the layout does not jump when toggling.
  const keySize = KEY_SIZE_DESKTOP;
  const keyGap = KEY_GAP;
  const dpadArm = Math.floor(JOYSTICK_SIZE / 3);
  const dpadSize = dpadArm * 3;

  // Visible height of whichever controller is showing (no padding around it).
  const controlsH = joystickMode
    ? JOYSTICK_SIZE
    : mobileMode
      ? dpadSize
      : 2 * keySize + keyGap;

  // Calorie text is doubled but shrinks if the narrower score rectangle needs it.
  const scoreW = boxW - (mobileMode ? 3 : 2) * (rowH + GAP);
  const scoreFontPx = Math.floor(Math.min(textPx, (scoreW - 16) / 6));

  // Panel height = whole stack minus score row, hunger row, the two stack gaps and the border.
  // The grid gets what is left after the controller and three MIN_PANEL_SPACE gaps.
  const panelH = boxH - rowH - hungerH - 2 * GAP - 2;
  const gridRectH = Math.max(
    2 * RING_EXT + 60,
    panelH - controlsH - 3 * MIN_PANEL_SPACE
  );

  const cell = Math.max(
    4,
    Math.floor(
      GRID_SCALE *
        Math.min(
          CELL_SIZE,
          (boxW - GRID_CHROME) / ARENA_COLS,
          (gridRectH - 2 * RING_EXT) / ARENA_ROWS
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
    position: "relative", // The prompt is centred on this whole play area, not on the grid.
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

  // The calorie rectangle holds the calorie total and the home / controls buttons.
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

  // The score turns greener and starts glowing as more wasabis are eaten (up to WASABI_MAX_EATEN).
  const wasabiT = Math.min(1, game.wasabiEaten / WASABI_MAX_EATEN);
  const scoreStyle = {
    fontFamily: FONT_FAMILY,
    fontWeight: 700,
    fontSize: scoreFontPx,
    whiteSpace: "nowrap",
    color: wasabiT > 0
      ? `color-mix(in srgb, #3dff3d ${Math.round(wasabiT * 100)}%, var(--colour-7))`
      : "var(--colour-7)",
    textShadow: wasabiT > 0
      ? `0 0 ${2 + wasabiT * 12}px rgba(${WASABI_GLOW_RGB}, ${0.35 + wasabiT * 0.65}), 0 0 ${wasabiT * 22}px rgba(${WASABI_GLOW_RGB}, ${wasabiT * 0.7})`
      : "none",
    textAlign: "center",
  };

  // Absolutely positioned so the temporary bonus never changes the score label's width or centre.
  const scoreBonusStyle = {
    position: "absolute",
    left: "calc(100% + 0.35em)",
    top: "50%",
    whiteSpace: "nowrap",
    color: "var(--colour-7)",
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
    backgroundColor: "var(--colour-1)",
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
    backgroundColor: "var(--colour-3)",
  };

  // One shared panel with no padding or gap of its own. space-evenly puts the same
  // amount of space above the grid, between grid and controller, and below the controller.
  const gridControlsSectionStyle = {
    ...sectionStyle,
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minHeight: 0,
    padding: 0,
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "space-evenly",
    gap: 0,
  };

  // Exactly as tall as the grid plus its wall ring.
  const gridSectionStyle = {
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    padding: 0,
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
    backgroundColor: "var(--colour-1)",
    backgroundImage:
      "linear-gradient(var(--colour-3) 1px, transparent 1px), linear-gradient(90deg, var(--colour-3) 1px, transparent 1px)",
    backgroundSize: `${cell}px ${cell}px`,
    boxShadow: "none",
  };

  // Exactly as tall as the visible controller.
  const controlsSectionStyle = {
    height: controlsH,
    flexShrink: 0,
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
    position: "relative",
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
      color: "var(--colour-7)",
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

  // Compact CSS triangle drawn on each arm of the mobile D-pad.
  const directionTriangle = (direction, size) => {
    const height = Math.max(6, Math.round(size * 0.18));
    const halfBase = Math.max(5, Math.round(size * 0.16));
    const style = { display: "block", width: 0, height: 0, borderStyle: "solid" };

    if (direction === UP) {
      return { ...style, borderWidth: `0 ${halfBase}px ${height}px`, borderColor: "transparent transparent var(--colour-5)" };
    }
    if (direction === DOWN) {
      return { ...style, borderWidth: `${height}px ${halfBase}px 0`, borderColor: "var(--colour-5) transparent transparent" };
    }
    if (direction === LEFT) {
      return { ...style, borderWidth: `${halfBase}px ${height}px ${halfBase}px 0`, borderColor: "transparent var(--colour-5) transparent transparent" };
    }
    return { ...style, borderWidth: `${halfBase}px 0 ${halfBase}px ${height}px`, borderColor: "transparent transparent transparent var(--colour-5)" };
  };

  // Console-style D-pad: one cross-shaped outline with four invisible hit areas on top.
  const dpadArms = [
    { d: UP, x: 1, y: 0, label: "Move up" },
    { d: LEFT, x: 0, y: 1, label: "Move left" },
    { d: RIGHT, x: 2, y: 1, label: "Move right" },
    { d: DOWN, x: 1, y: 2, label: "Move down" },
  ];
  const isPressedDir = (d) =>
    activeDirection != null && activeDirection.x === d.x && activeDirection.y === d.y;
  const dpadPath = [
    `M${dpadArm},0`, `H${2 * dpadArm}`, `V${dpadArm}`, `H${3 * dpadArm}`,
    `V${2 * dpadArm}`, `H${2 * dpadArm}`, `V${3 * dpadArm}`, `H${dpadArm}`,
    `V${2 * dpadArm}`, `H0`, `V${dpadArm}`, `H${dpadArm}`, "Z",
  ].join(" ");

  const glassStyle = {
    position: "absolute",
    inset: 0,
    zIndex: 1000,
    pointerEvents: "none",
    background:
      "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 40%)",
  };

  // What the prompt says. Keep what it showed while it fades, so the game-over
  // text never appears behind the start popup.
  if (game.status === "choose" || game.status === "dead" || game.status === "won") {
    popupInfoRef.current = {
      status: game.status,
      reason: game.reason,
      score: game.score,
      wasabi: game.wasabiEaten,
      botGame: !!game.botGame,
    };
  }
  const popupInfo = popupInfoRef.current;
  const popupTitle =
    popupInfo.status === "choose"
      ? "CHOOSE MODE"
      : popupInfo.status === "won"
        ? `WINNER`
        : `GAME OVER`;
  // Wasabis are only mentioned if at least one was eaten.
  const wasabiText = popupInfo.wasabi > 0
    ? ` AND ${popupInfo.wasabi} WASABI${popupInfo.wasabi === 1 ? "" : "S"}`
    : "";
  const popupBody =
    popupInfo.status === "choose"
      ? `EAT SUSHI TO STOP YOURSELF FROM GOING HUNGRY`
      : popupInfo.status === "won"
        ? `YOU CONSUMED ${formatPoints(popupInfo.score)} CALORIES${wasabiText}`
        : `YOU CONSUMED ${formatPoints(popupInfo.score)} CALORIES${wasabiText} BEFORE ${DEATH_REASONS[popupInfo.reason]}`;
  // Show the selected difficulty icon, plus AUTO when the completed run was a bot game.
  const popupBodyIcon = popupInfo.status === "choose" ? null : icons[cfg.icon];
  // Only the "X WASABIS" part is green (darker), and only if at least one wasabi was eaten.
  const popupWasabiNode = popupInfo.wasabi > 0
    ? <>{" AND "}<span style={{ color: darkMode ? WASABI_TEXT_DARK_COLOUR : WASABI_TEXT_LIGHT_COLOUR }}>{`${popupInfo.wasabi} WASABI${popupInfo.wasabi === 1 ? "" : "S"}`}</span></>
    : null;
  const popupBodyNode =
    popupInfo.status === "choose"
      ? popupBody
      : popupInfo.status === "won"
        ? <>{`YOU CONSUMED ${formatPoints(popupInfo.score)} CALORIES`}{popupWasabiNode}</>
        : <>{`YOU CONSUMED ${formatPoints(popupInfo.score)} CALORIES`}{popupWasabiNode}{` BEFORE ${DEATH_REASONS[popupInfo.reason]}`}</>;

  // Fonts stay at full size; the square grows to fit them instead.
  const popupFont = Math.round(textPx);
  const popupBodyFont = Math.max(7, Math.round(popupFont * 0.85));
  const popupPad = Math.max(10, Math.round(popupFont * 0.7));
  const popupBtn = rowH; // Result buttons match the top-right control buttons exactly.
  const popupModeBtn = popupBtn; // Difficulty buttons are the same size as every other button.
  const popupButtonSize = popupInfo.status === "choose" ? popupModeBtn : popupBtn;
  const popupBtnGap = 8;
  const showAutoButton = popupInfo.status === "dead" && (autoUnlocked || noSushiLosses >= 3 || popupInfo.botGame);
  const popupButtonCount = popupInfo.status === "choose" ? Object.keys(DIFFICULTIES).length : (showAutoButton ? 3 : 2);
  const popupLabelMaxFont = Math.min(10, Math.round(popupBtn * 0.2));
  const popupLabelFont = (label) => {
    const longestWord = Math.max(...label.split(" ").map((word) => word.length));
    const availableWidth = popupBtn - 10;
    return LABEL_FONT_SCALE * Math.max(6, Math.min(popupLabelMaxFont, availableWidth / (longestWord * 0.62)));
  };
  const popupDiffIconPx = Math.round(2 * 1.3 * popupBodyFont); // Larger difficulty icon shown above the action buttons on results.

  // Greedy word wrap for a monospace font, so the number of body lines is known exactly.
  const wrapLineCount = (text, maxChars) => {
    let lines = 1;
    let len = 0;
    for (const word of text.split(" ")) {
      if (len === 0) len = word.length;
      else if (len + 1 + word.length <= maxChars) len += 1 + word.length;
      else {
        lines += 1;
        len = word.length;
      }
    }
    return lines;
  };

  // Find the smallest square side whose width fits the title, buttons and longest word,
  // and whose height holds the title, wrapped body, icon and buttons.
  const bodyCharPx = MONO_CHAR_EM * popupBodyFont;
  const longestWord = Math.max(...popupBody.split(" ").map((x) => x.length));
  const widthNeeded = Math.max(
    popupTitle.length * TITLE_CHAR_EM * popupFont,
    popupButtonCount * popupButtonSize + (popupButtonCount - 1) * popupBtnGap,
    longestWord * bodyCharPx,
    0
  );
  let popupSide = Math.ceil(widthNeeded + 2 * popupPad + 2 + POPUP_SLACK);
  for (let guard = 0; guard < 2000; guard++) {
    const innerW = popupSide - 2 * popupPad - 2;
    const maxChars = Math.max(1, Math.floor(innerW / bodyCharPx));
    const bodyLines = wrapLineCount(popupBody, maxChars);
    const needH =
      2 * popupPad + 2 + POPUP_SLACK +
      popupFont * 1.1 +
      POPUP_TEXT_GAP + bodyLines * popupBodyFont * 1.2 +
      (popupBodyIcon ? POPUP_TEXT_GAP + popupDiffIconPx : 0) +
      POPUP_GAP + popupButtonSize;
    if (needH <= popupSide) break;
    popupSide += 1;
  }

  const overlayStyle = {
    position: "fixed",
    left: "50vw",
    top: "50vh",
    width: popupSide,
    height: popupSide,
    boxSizing: "border-box",
    transform: "translate(-50%, -50%)",
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    gap: `${POPUP_GAP}px`,
    padding: `${popupPad}px`,
    overflow: "visible",
    textAlign: "center",
    color: "var(--colour-7)",
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
    gap: `${POPUP_TEXT_GAP}px`,
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
    fontSize: `${popupBodyFont}px`,
    lineHeight: 1.2,
    fontWeight: 400,
    textTransform: "uppercase",
  };

  // Difficulty and AUTO icons sit together below the body on bot-game results.
  const popupBodyIconRowStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Math.max(4, Math.round(popupDiffIconPx * 0.2)),
    flexShrink: 0,
  };
  const popupBodyIconStyle = {
    display: "block",
    width: popupDiffIconPx,
    height: popupDiffIconPx,
    flexShrink: 0,
    objectFit: "contain",
    pointerEvents: "none",
  };

  const popupButtonRowStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: popupBtnGap,
    flexShrink: 0,
  };

  const popupButtonIconStyle = {
    width: "62%",
    height: "48%",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // Icon slot for the EASY / NORMAL / HARD buttons. It is the same size as the other buttons'
  // slot; the icon inside is drawn larger and overflows it (the icon edges are transparent).
  const popupModeButtonIconStyle = {
    ...popupButtonIconStyle,
    position: "relative",
    overflow: "visible",
  };

  const popupModeIconImageStyle = {
    display: "block",
    width: `${MODE_ICON_SCALE * 100}%`,
    height: `${MODE_ICON_SCALE * 100}%`,
    flexShrink: 0,
    objectFit: "contain",
    pointerEvents: "none",
  };

  const popupButtonLabelStyle = (label) => ({
    width: "100%",
    maxHeight: "2.1em",
    overflow: "hidden",
    fontFamily: FONT_FAMILY,
    fontSize: `${popupLabelFont(label)}px`,
    lineHeight: 0.95,
    fontWeight: 700,
    color: "var(--colour-7)",
    textAlign: "center",
    whiteSpace: "normal",
    overflowWrap: "normal",
    textTransform: "uppercase",
    transform: `translateY(${LABEL_OFFSET_PX}px)`,
  });

  const popupButtonStyle = {
    fontFamily: FONT_FAMILY,
    width: popupBtn,
    height: popupBtn,
    minWidth: popupBtn,
    minHeight: popupBtn,
    flexShrink: 0,
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: 1,
    border: "1px solid var(--colour-5)",
    borderRadius: "8px",
    backgroundColor: pageBg ?? "transparent",
    color: "var(--colour-7)",
    fontWeight: 700,
    lineHeight: 1,
    cursor: "pointer",
    padding: "4px 3px",
    overflow: "hidden",
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.22)",
  };

  const modeButtonStyle = {
    ...popupButtonStyle,
    width: popupModeBtn,
    height: popupModeBtn,
    minWidth: popupModeBtn,
    minHeight: popupModeBtn,
    overflow: "visible", // Lets the larger icons spill past the button edge.
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
    color: "var(--colour-7)",
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

  // The controller toggle shows an icon with a text label under it, like the popup buttons.
  const toggleButtonStyle = {
    ...iconButtonStyle,
    flexDirection: "column",
    justifyContent: "space-evenly",
    gap: 1,
    padding: "4px 1px",
    overflow: "hidden",
  };
  const toggleLabel = mobileControlMode === "joystick" ? "DPAD" : "JOYSTICK";

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
            filter: `drop-shadow(0 0 1px ${darkMode ? OUTLINE_DARK_COLOUR : OUTLINE_LIGHT_COLOUR}) drop-shadow(0 0 1px ${darkMode ? OUTLINE_DARK_COLOUR : OUTLINE_LIGHT_COLOUR})`,
          }}
        />
      </div>
    </div>
  );

  // Layering: walls (1) < closed-mouth food (10 + row) < snake body canvas (400)
  // < head (500) < open-mouth food (600 + row) < mouth overlay (900) < glass (1000).
  // Ordinary food sits behind the snake body; open-mouth food can still appear in front
  // of the head during the eating animation. The row offset preserves food depth ordering.
  const HEAD_Z = 500;
  const OVERLAY_Z = 900;
  const foodZ = (food) => (frame === FULL_OPEN_FRAME ? 600 : 10) + food.y;

  const foodLayer = (food, key, extraStyle = null) => {
    // Each food scales the FOOD_SIZE constant by its own 0 to 1 size.
    const foodSize = FOOD_SIZE * cell * (food.size ?? DEFAULT_FOOD_SIZE);

    return (
    <div
      key={key}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: cell,
        height: cell,
        zIndex: foodZ(food),
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: foodSize,
        lineHeight: 1,
        transform: `translate(${food.x * cell}px, ${food.y * cell}px)`,
        filter: food.name === "wasabi"
          ? `drop-shadow(0 0 ${cell * 0.12 * WASABI_ARENA_GLOW}px rgba(${WASABI_GLOW_RGB}, ${0.95 * WASABI_ARENA_GLOW})) drop-shadow(0 0 ${cell * 0.3 * WASABI_ARENA_GLOW}px rgba(${WASABI_GLOW_RGB}, ${0.7 * WASABI_ARENA_GLOW}))`
          : "none",
        ...extraStyle,
      }}
    >
      {food.image ? (
        <img
          src={food.image}
          alt=""
          draggable={false}
          style={{
            width: foodSize,
            height: foodSize,
            objectFit: "contain",
            filter: `
              drop-shadow(1px 0 0 var(--colour-5))
              drop-shadow(-1px 0 0 var(--colour-5))
              drop-shadow(0 1px 0 var(--colour-5))
              drop-shadow(0 -1px 0 var(--colour-5))
            `,
          }}
        />
      ) : (
        FOOD_EMOJI
      )}
    </div>
    );
  };

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
  return (
    <div
      ref={colContainerRef}
      className={`snake-game${paused ? " paused" : ""}`}
      style={colContainer}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <style>{`${darkMode ? `.snake-game img { filter: brightness(${1 - DARK_MODE_IMAGE_DARKEN}); }` : ""}
      .snake-game.paused, .snake-game.paused * { animation-play-state: paused !important; }
      @keyframes hungerFoodFade {
        0% { opacity: 1; width: ${eatenSlot}px; }
        55% { opacity: 1; width: ${eatenSlot}px; }
        100% { opacity: 0; width: 0px; }
      }
      @keyframes swallowFood {
        0% { opacity: 1; }
        ${EATEN_FOOD_VISIBLE_FRAC * 100}% { opacity: 1; }
        ${(EATEN_FOOD_VISIBLE_FRAC + EATEN_FOOD_FADE_FRAC) * 100}% { opacity: 0; }
        100% { opacity: 0; }
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
              {formatPoints(game.score)}
              {!mobileMode && scoreBonus && (
                <div key={scoreBonus.id} style={scoreBonusStyle}>
                  (+{formatPoints(scoreBonus.amount)})
                </div>
              )}
              {" CALORIES"}
            </span>
          </div>
        </div>

        <div style={buttonRowStyle}>
          {mobileMode && (
            <button
              type="button"
              style={toggleButtonStyle}
              onClick={toggleMobileControls}
              aria-label={mobileControlMode === "joystick" ? "Use directional pad" : "Use joystick"}
              title={mobileControlMode === "joystick" ? "Use directional pad" : "Use joystick"}
            >
              <div style={popupButtonIconStyle}>
                {renderIcon(mobileControlMode === "joystick" ? icons.dpad : icons.joystick)}
              </div>
              <span style={popupButtonLabelStyle(toggleLabel)}>{toggleLabel}</span>
            </button>
          )}

          <button
            type="button"
            style={{
              ...toggleButtonStyle,
              opacity: game.status === "playing" ? 1 : 0.45,
              cursor: game.status === "playing" ? "pointer" : "default",
            }}
            onClick={togglePause}
            disabled={game.status !== "playing"}
            aria-label={paused ? "Resume game" : "Pause game"}
            title={paused ? "Resume game" : "Pause game"}
          >
            <div style={popupButtonIconStyle}>{renderIcon(paused ? icons.play : icons.pause)}</div>
            <span style={popupButtonLabelStyle(paused ? "PLAY" : "PAUSE")}>{paused ? "PLAY" : "PAUSE"}</span>
          </button>

          <button
            type="button"
            style={{ ...toggleButtonStyle, backgroundColor: "var(--red-0)" }}
            onClick={leaveActivities}
            aria-label="Exit activities"
            title="Exit activities"
          >
            <div style={popupButtonIconStyle}>{renderIcon(icons.cross)}</div>
            <span style={popupButtonLabelStyle("LEAVE")}>LEAVE</span>
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

      <div style={gridControlsSectionStyle}>
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
                  zIndex: 400,
                  pointerEvents: "none",
                }}
              />

              {/* No snake or food is rendered until the game starts. */}
              {game.snake.length > 0 && (
                <>
                  {headLayer(FRAMES[frame], HEAD_Z)}
                  {game.foods.map((f) => foodLayer(f, `food-${f.x}-${f.y}`))}
                  {game.wasabi && foodLayer(game.wasabi, "wasabi")}
                  {game.swallowing &&
                    foodLayer(game.swallowing, `swallowing-${game.movedAt}`, {
                      animation: `swallowFood ${tickMs}ms linear forwards`,
                    })}
                  {headLayer(OVERLAY_IMAGE, OVERLAY_Z, frame === FULL_OPEN_FRAME)}
                </>
              )}

              <div style={glassStyle} />
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
              <div
                style={{ position: "relative", width: dpadSize, height: dpadSize, flexShrink: 0 }}
                aria-label="Directional pad"
              >
                <svg
                  width={dpadSize}
                  height={dpadSize}
                  style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}
                  aria-hidden="true"
                >
                  <path d={dpadPath} fill="var(--colour-3)" />
                  {dpadArms.filter((a) => isPressedDir(a.d)).map((a) => (
                    <rect
                      key={a.label}
                      x={a.x * dpadArm}
                      y={a.y * dpadArm}
                      width={dpadArm}
                      height={dpadArm}
                      fill="var(--colour-4)"
                    />
                  ))}
                  <circle
                    cx={dpadSize / 2}
                    cy={dpadSize / 2}
                    r={dpadArm * 0.28}
                    fill="none"
                    stroke="var(--colour-5)"
                    strokeOpacity="0.5"
                  />
                  <path d={dpadPath} fill="none" stroke="var(--colour-5)" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>

                {dpadArms.map((a) => (
                  <button
                    key={a.label}
                    type="button"
                    aria-label={a.label}
                    style={{
                      position: "absolute",
                      left: a.x * dpadArm,
                      top: a.y * dpadArm,
                      width: dpadArm,
                      height: dpadArm,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      touchAction: "manipulation",
                      WebkitTapHighlightColor: "transparent",
                    }}
                    onPointerDown={() => {
                      setActiveDirection(a.d);
                      handleDirection(a.d);
                    }}
                    onPointerUp={() => setActiveDirection(null)}
                    onPointerCancel={() => setActiveDirection(null)}
                    onPointerLeave={() => setActiveDirection(null)}
                    onClick={(e) => {
                      // Pointer presses are handled above; this covers keyboard activation (detail 0).
                      if (e.detail === 0) handleDirection(a.d);
                    }}
                  >
                    <span style={directionTriangle(a.d, dpadArm)} />
                  </button>
                ))}
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

      {/* The prompt sits over the whole play area and is sized from its shape, not from the grid. */}
      {!popupHidden &&
        (game.status === "choose" ||
          game.status === "dead" ||
          game.status === "won" ||
          popupClosing) && (
          <div style={overlayStyle}>
            <div style={popupTextAreaStyle}>
              <div style={popupTitleStyle}>{popupTitle}</div>
              {popupBody && (
                <div style={popupBodyStyle}>{popupBodyNode}</div>
              )}
              {popupBodyIcon && (
                <div style={popupBodyIconRowStyle} aria-label="Difficulty">
                  <img src={popupBodyIcon} alt="" aria-hidden="true" draggable={false} style={popupBodyIconStyle} />
                </div>
              )}
            </div>

            {popupInfo.status === "choose" ? (
              <div style={popupButtonRowStyle}>
                {Object.entries(DIFFICULTIES).map(([key, d]) => (
                  <button
                    key={key}
                    type="button"
                    style={modeButtonStyle}
                    aria-label={`${d.label} mode`}
                    title={d.label}
                    onClick={() => chooseMode(key)}
                  >
                    <div style={popupModeButtonIconStyle}>
                      <img
                        src={icons[d.icon]}
                        alt=""
                        aria-hidden="true"
                        draggable={false}
                        style={popupModeIconImageStyle}
                      />
                    </div>
                    <span style={popupButtonLabelStyle(d.label)}>{d.label}</span>
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
                  <div style={popupButtonIconStyle}>
                    {renderIcon(icons.restart)}
                  </div>
                  <span style={popupButtonLabelStyle("RETRY")}>RETRY</span>
                </button>
                {showAutoButton && (
                  <button
                    type="button"
                    style={popupButtonStyle}
                    aria-label="Play automatically"
                    title="Play automatically"
                    onClick={playAutomatically}
                  >
                    <div style={popupButtonIconStyle}>
                      {renderIcon(icons.auto)}
                    </div>
                    <span style={popupButtonLabelStyle("AUTO")}>AUTO</span>
                  </button>
                )}
                <button
                  type="button"
                  style={popupButtonStyle}
                  aria-label="Choose game mode"
                  title="Choose game mode"
                  onClick={quitToStart}
                >
                  <div style={popupButtonIconStyle}>
                    {renderIcon(icons.change)}
                  </div>
                  <span style={popupButtonLabelStyle("MODES")}>MODES</span>
                </button>
              </div>
            )}
          </div>
        )}
    </div>
  );
};