import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Immersion } from "./Immersion";
import { WORDS } from "../../../assets/activities/wordle/words";
import icon_cross_light from "../../../assets/activities/symbols/cross_light.png";
import icon_cross_dark from "../../../assets/activities/symbols/cross_dark.png";
import icon_change_light from "../../../assets/activities/symbols/change_light.png";
import icon_change_dark from "../../../assets/activities/symbols/change_dark.png";
import icon_restart_light from "../../../assets/activities/symbols/restart_light.png";
import icon_restart_dark from "../../../assets/activities/symbols/restart_dark.png";
import icon_surrender_light from "../../../assets/activities/symbols/surrender_light.png";
import icon_surrender_dark from "../../../assets/activities/symbols/surrender_dark.png";
import icon_copy_light from "../../../assets/activities/symbols/copy_light.png";
import icon_copy_dark from "../../../assets/activities/symbols/copy_dark.png";
import icon_copied_light from "../../../assets/activities/symbols/copied_light.png";
import icon_copied_dark from "../../../assets/activities/symbols/copied_dark.png";
import icon_daily_light from "../../../assets/activities/symbols/daily_light.png";
import icon_daily_dark from "../../../assets/activities/symbols/daily_dark.png";
import icon_random_light from "../../../assets/activities/symbols/random_light.png";
import icon_random_dark from "../../../assets/activities/symbols/random_dark.png";

const THEME_ICONS = {
  light: {
    cross: icon_cross_light,
    change: icon_change_light,
    restart: icon_restart_light,
    surrender: icon_surrender_light,
    copy: icon_copy_light,
    copied: icon_copied_light,
    daily: icon_daily_light,
    random: icon_random_light,
  },
  dark: {
    cross: icon_cross_dark,
    change: icon_change_dark,
    restart: icon_restart_dark,
    surrender: icon_surrender_dark,
    copy: icon_copy_dark,
    copied: icon_copied_dark,
    daily: icon_daily_dark,
    random: icon_random_dark,
  },
};

/* =====================================
   SETTINGS: GAME
===================================== */

const NUM_GUESSES = 6;
const DEFAULT_LETTERS = 6;

const ABSENT_GREY = "#3a3a3c";
const ABSENT_GREY_DARK = "#6a6a6e";
const ABSENT_GREY_DARK_KEY = "rgba(106, 106, 110, 0.8)";

const COLOUR_PRIORITY = {
  "#538d4e": 2,
  "#b59f3b": 1,
  "#3a3a3c": 0,
};

const KEY_COLOUR_MAP = {
  "#538d4e": "rgba(83, 141, 78, 0.8)",
  "#b59f3b": "rgba(181, 159, 59, 0.8)",
  "#3a3a3c": "rgba(58, 58, 60, 0.8)",
};

const COLOUR_EMOJI = {
  "#538d4e": "🟩",
  "#b59f3b": "🟨",
  "#3a3a3c": "⬛",
};

const WIN_FACES = [
  "😀", "😃", "😄", "😁", "😆",
  "🥳", "😎", "🤩", "😍", "🤗",
];

const GAVE_UP_FACES = [
  "😒", "🙄", "😑", "😐", "😶",
  "😬", "😏", "😵", "😳", "😤",
];

const LOSE_FACES = [
  "😩", "😭", "😢", "😞", "😖",
  "😫", "😣", "😰", "😔", "😟",
];

/* =====================================
   SETTINGS: SCREEN AND PANELS
===================================== */

const FONT_FAMILY = "'Courier New', Courier, monospace";
const GAP = 6;
const MIN_PANEL_SPACE = 36;
const PANEL_PAD_X = 12;

const ROW_H_MOBILE = 55;
const ROW_H_DESKTOP = 50;

const TEXT_PX_MOBILE = 21.76;
const TEXT_PX_DESKTOP = 25.6;

const MAX_LETTER_PX = 64;
const MAX_KEY_PX = 52;
const KEYBOARD_HEIGHT_SHARE = 0.36;

const END_DELAY_MS = 1200;
const POPUP_FADE_MS = 260;

/* =====================================
   SETTINGS: BUTTON LABELS
===================================== */

// All button labels are moved down by 3px.
const BUTTON_LABEL_OFFSET = 3;

// All button labels are approximately 13% larger.
const BUTTON_LABEL_SCALE = 1.13;

/* =====================================
   SETTINGS: PROMPT (POPUP)
===================================== */

// Match Snake: the same 12px spacing is used above, below and between prompt components.
const POPUP_SPACE = GAP * 2;
const POPUP_TEXT_GAP = POPUP_SPACE;

const MONO_CHAR_EM = 0.62;
const TITLE_CHAR_EM = 0.66;
const WORD_CHAR_EM = 0.62 + 0.1;

/* =====================================
   HELPERS
===================================== */

const pickFace = (faces, roll) =>
  faces[Math.floor(roll * faces.length)];

const getDailyEntry = () => {
  const today = new Date();

  const seed =
    today.getFullYear() * 10000 +
    (today.getMonth() + 1) * 100 +
    today.getDate();

  return WORDS[seed % WORDS.length];
};

const pickRandomEntry = (excludeWord) => {
  if (WORDS.length < 2) return WORDS[0];

  let next;

  do {
    next = WORDS[Math.floor(Math.random() * WORDS.length)];
  } while (excludeWord && next.word === excludeWord);

  return next;
};

const emptyGuesses = (len) =>
  Array.from(
    { length: NUM_GUESSES },
    () => Array(len).fill("")
  );

const emptyColours = (len) =>
  Array.from(
    { length: NUM_GUESSES },
    () => Array(len).fill("transparent")
  );

const lineUnits = (line) =>
  [...line].reduce(
    (sum, ch) =>
      sum + (ch.codePointAt(0) > 0x2000 ? 2 : 1),
    0
  );

const wrapLineCount = (widths, maxUnits) => {
  let lines = 1;
  let len = 0;

  for (const wd of widths) {
    if (len === 0) {
      len = wd;
    } else if (len + 1 + wd <= maxUnits) {
      len += 1 + wd;
    } else {
      lines += 1;
      len = wd;
    }
  }

  return lines;
};

const useWindowSize = () => {
  const [size, setSize] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });

  useEffect(() => {
    const onResize = () =>
      setSize({
        w: window.innerWidth,
        h: window.innerHeight,
      });

    window.addEventListener("resize", onResize);

    return () =>
      window.removeEventListener("resize", onResize);
  }, []);

  return size;
};

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

/* =====================================
   WORDLE IMMERSION
===================================== */

export const WordleImmersion = ({
  mobileMode,
  darkMode,
  leaveActivities,
}) => {
  const outerContainer = {
    position: "relative",
    width: "100%",
    height: "100vh",
    boxSizing: "border-box",
    padding: mobileMode ? GAP : "2rem",
    fontFamily: FONT_FAMILY,
  };

  return (
    <Immersion
      mobileMode={mobileMode}
      darkMode={darkMode}
      leaveActivities={leaveActivities}
    >
      <div style={outerContainer}>
        <WordleGame
          mobileMode={mobileMode}
          darkMode={darkMode}
          leaveActivities={leaveActivities}
        />
      </div>
    </Immersion>
  );
};

/* =====================================
   WORDLE GAME SCREEN
===================================== */

const WordleGame = ({
  mobileMode,
  darkMode,
  leaveActivities,
}) => {
  const icons = darkMode
    ? THEME_ICONS.dark
    : THEME_ICONS.light;

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

  const [status, setStatus] = useState("choose");
  const [entry, setEntry] = useState(null);
  const [result, setResult] = useState(null);
  const [gameMode, setGameMode] = useState(null);

  const [guesses, setGuesses] = useState(() =>
    emptyGuesses(DEFAULT_LETTERS)
  );

  const [colours, setColours] = useState(() =>
    emptyColours(DEFAULT_LETTERS)
  );

  const [keyColours, setKeyColours] = useState({});

  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);

  const [pressedKey, setPressedKey] = useState(null);
  const [shakenRow, setShakenRow] = useState(null);
  const [enterCooldown, setEnterCooldown] = useState(0);

  const [popupHidden, setPopupHidden] = useState(false);
  const [popupClosing, setPopupClosing] = useState(false);

  const [copied, setCopied] = useState(false);
  const [measuredBox, setMeasuredBox] = useState(null);
  const [pageBg, setPageBg] = useState(null);

  const [hintHeight, setHintHeight] = useState(
    mobileMode ? ROW_H_MOBILE : ROW_H_DESKTOP
  );

  const colContainerRef = useRef(null);
  const hintSectionRef = useRef(null);

  const popupInfoRef = useRef({
    kind: "choose",
    result: null,
  });

  const statusRef = useRef("choose");
  const entryRef = useRef(null);
  const lastWordRef = useRef(null);
  const gameIdRef = useRef(0);
  const gameOverRef = useRef(true);

  const currentRowRef = useRef(0);
  const currentColRef = useRef(0);

  const guessesRef = useRef(guesses);
  const coloursRef = useRef(colours);

  const keyHandlerRef = useRef(null);

  const enterCooldownRef = useRef(false);
  const cooldownIntervalRef = useRef(null);

  const submittingRef = useRef(false);

  const popupTimeoutRef = useRef(null);
  const copiedTimeoutRef = useRef(null);

  const { w, h } = useWindowSize();

  useEffect(() => {
    currentRowRef.current = currentRow;
  }, [currentRow]);

  useEffect(() => {
    currentColRef.current = currentCol;
  }, [currentCol]);

  useEffect(() => {
    guessesRef.current = guesses;
  }, [guesses]);

  useEffect(() => {
    coloursRef.current = colours;
  }, [colours]);

  useEffect(
    () => () => {
      gameIdRef.current += 1;

      clearInterval(cooldownIntervalRef.current);
      clearTimeout(popupTimeoutRef.current);
      clearTimeout(copiedTimeoutRef.current);
    },
    []
  );

  /* =====================================
     SHAKE AND COOLDOWN
  ===================================== */

  const shakeRow = (row) => {
    setShakenRow(row);

    setTimeout(() => {
      setShakenRow(null);
    }, 400);
  };

  const startCooldown = () => {
    clearInterval(cooldownIntervalRef.current);

    enterCooldownRef.current = true;
    setEnterCooldown(3);

    cooldownIntervalRef.current = setInterval(() => {
      setEnterCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownIntervalRef.current);
          enterCooldownRef.current = false;
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
  };

  const stopCooldown = () => {
    clearInterval(cooldownIntervalRef.current);

    enterCooldownRef.current = false;
    setEnterCooldown(0);
  };

  /* =====================================
     POPUP
  ===================================== */

  const showPopupNow = () => {
    clearTimeout(popupTimeoutRef.current);

    setPopupHidden(false);
    setPopupClosing(false);
  };

  const dismissPopup = () => {
    clearTimeout(popupTimeoutRef.current);

    setPopupClosing(true);

    popupTimeoutRef.current = setTimeout(() => {
      setPopupHidden(true);
      setPopupClosing(false);
    }, POPUP_FADE_MS);
  };

  /* =====================================
     BOARD RESET
  ===================================== */

  const resetBoard = (len) => {
    const g = emptyGuesses(len);
    const c = emptyColours(len);

    guessesRef.current = g;
    coloursRef.current = c;

    currentRowRef.current = 0;
    currentColRef.current = 0;

    setGuesses(g);
    setColours(c);
    setKeyColours({});

    setCurrentRow(0);
    setCurrentCol(0);

    setPressedKey(null);
    setShakenRow(null);

    stopCooldown();

    submittingRef.current = false;
  };

  /* =====================================
     GAME NAVIGATION
  ===================================== */

  const goToChoose = () => {
    gameIdRef.current += 1;
    gameOverRef.current = true;

    resetBoard(DEFAULT_LETTERS);

    entryRef.current = null;

    setEntry(null);
    setResult(null);
    setGameMode(null);

    statusRef.current = "choose";
    setStatus("choose");

    showPopupNow();
  };

  const startGame = (mode) => {
    const next =
      mode === "daily"
        ? getDailyEntry()
        : pickRandomEntry(lastWordRef.current);

    gameIdRef.current += 1;

    resetBoard(next.word.length);

    entryRef.current = next;
    lastWordRef.current = next.word;

    setEntry(next);
    setResult(null);
    setGameMode(mode);

    gameOverRef.current = false;

    statusRef.current = "playing";
    setStatus("playing");

    dismissPopup();
  };

  const restartRandomGame = () => {
    if (gameMode !== "random") return;

    startGame("random");
  };

  const retryGame = () => {
    if (gameMode === "random") {
      restartRandomGame();
    } else if (gameMode === "daily") {
      startGame("daily");
    }
  };

  const finishGame = (finalResult) => {
    gameOverRef.current = true;
    submittingRef.current = false;

    setResult(finalResult);

    statusRef.current = "over";
    setStatus("over");

    showPopupNow();
  };

  /* =====================================
     GUESSING
  ===================================== */

  const validateWord = async (guess) => {
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${guess.toLowerCase()}`
      );

      return res.ok;
    } catch {
      return true;
    }
  };

  const submitGuess = async () => {
    if (
      submittingRef.current ||
      enterCooldownRef.current
    ) {
      return;
    }

    if (
      statusRef.current !== "playing" ||
      gameOverRef.current ||
      !entryRef.current
    ) {
      return;
    }

    submittingRef.current = true;

    const myId = gameIdRef.current;
    const word = entryRef.current.word.toUpperCase();
    const wl = word.length;
    const row = currentRowRef.current;

    const guess = guessesRef.current[row].filter(
      (l) => l !== ""
    );

    const valid = await validateWord(guess.join(""));

    if (
      gameOverRef.current ||
      gameIdRef.current !== myId
    ) {
      submittingRef.current = false;
      return;
    }

    if (!valid) {
      shakeRow(row);
      startCooldown();

      submittingRef.current = false;
      return;
    }

    const newColours = coloursRef.current.map(
      (r) => [...r]
    );

    const wordArr = word.split("");
    const used = Array(wl).fill(false);

    for (let i = 0; i < wl; i++) {
      newColours[row][i] = "#3a3a3c";
    }

    // Green letters first.
    guess.forEach((letter, i) => {
      if (i < wl && letter === wordArr[i]) {
        newColours[row][i] = "#538d4e";
        used[i] = true;
      }
    });

    // Yellow letters second.
    guess.forEach((letter, i) => {
      if (newColours[row][i] === "#538d4e") return;

      const j = wordArr.findIndex(
        (l, idx) => l === letter && !used[idx]
      );

      if (j !== -1) {
        newColours[row][i] = "#b59f3b";
        used[j] = true;
      } else {
        newColours[row][i] = "#3a3a3c";
      }
    });

    coloursRef.current = newColours;
    setColours(newColours);

    setKeyColours((prev) => {
      const next = { ...prev };

      guess.forEach((letter, i) => {
        const gridColour = newColours[row][i];
        const existing = next[letter];

        if (
          !existing ||
          COLOUR_PRIORITY[gridColour] >
            COLOUR_PRIORITY[existing]
        ) {
          next[letter] = gridColour;
        }
      });

      return next;
    });

    const won =
      guess.length === wl &&
      guess.join("") === word;

    if (won || row + 1 >= NUM_GUESSES) {
      gameOverRef.current = true;

      const finalGuesses = guessesRef.current;

      setTimeout(() => {
        if (gameIdRef.current !== myId) return;

        finishGame({
          won,
          surrendered: false,
          word,
          guesses: finalGuesses,
          colours: newColours,
          faceRoll: Math.random(),
        });
      }, END_DELAY_MS);
    } else {
      currentRowRef.current = row + 1;
      currentColRef.current = 0;

      setCurrentRow(row + 1);
      setCurrentCol(0);
    }

    startCooldown();

    submittingRef.current = false;
  };

  /* =====================================
     SURRENDER
  ===================================== */

  const handleSurrender = () => {
    if (
      statusRef.current !== "playing" ||
      !entryRef.current
    ) {
      return;
    }

    gameIdRef.current += 1;

    finishGame({
      won: false,
      surrendered: true,
      word: entryRef.current.word.toUpperCase(),
      guesses: guessesRef.current,
      colours: coloursRef.current,
      faceRoll: Math.random(),
    });
  };

  /* =====================================
     KEYBOARD INPUT
  ===================================== */

  const handleKey = (key) => {
    if (
      statusRef.current !== "playing" ||
      gameOverRef.current
    ) {
      return;
    }

    if (
      key === "ENTER" &&
      (
        submittingRef.current ||
        enterCooldownRef.current
      )
    ) {
      return;
    }

    const len = entryRef.current
      ? entryRef.current.word.length
      : DEFAULT_LETTERS;

    const col = currentColRef.current;
    const row = currentRowRef.current;

    if (key === "BACKSPACE") {
      if (col === 0) return;

      const next = guessesRef.current.map(
        (r) => [...r]
      );

      next[row][col - 1] = "";

      guessesRef.current = next;
      currentColRef.current = col - 1;

      setGuesses(next);
      setCurrentCol(col - 1);
    } else if (key === "ENTER") {
      submitGuess();
    } else if (/^[A-Z]$/.test(key) && col < len) {
      const next = guessesRef.current.map(
        (r) => [...r]
      );

      next[row][col] = key;

      guessesRef.current = next;
      currentColRef.current = col + 1;

      setGuesses(next);
      setCurrentCol(col + 1);
    }
  };

  keyHandlerRef.current = handleKey;

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.code === "Space") {
        if (
          statusRef.current === "over" &&
          !e.repeat
        ) {
          e.preventDefault();
          retryGame();
        }

        return;
      }

      const key = e.key.toUpperCase();

      if (
        /^[A-Z]$/.test(key) ||
        key === "BACKSPACE" ||
        key === "ENTER"
      ) {
        setPressedKey(key);
        keyHandlerRef.current?.(key);
      }
    };

    const onKeyUp = () => setPressedKey(null);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [gameMode]);

  const onPressKey = (key) => {
    setPressedKey(key);
    handleKey(key);
  };

  /* =====================================
     SHARE TEXT
  ===================================== */

  const buildShareText = (res) => {
    if (!res) return "";

    const wordLength = res.word.length;
    const rows = [];

    for (let r = 0; r < res.guesses.length; r++) {
      const rowColours = res.colours[r];

      if (
        !rowColours.some(
          (c) => c !== "transparent"
        )
      ) {
        break;
      }

      const letters = res.guesses[r]
        .slice(0, wordLength)
        .join("");

      const emojis = rowColours
        .slice(0, wordLength)
        .map((c) => COLOUR_EMOJI[c] ?? "⬛")
        .join("");

      rows.push(`${r + 1}. ${emojis} (${letters})`);
    }

    if (res.surrendered) {
      rows.push(`${rows.length + 1}. Gave up`);
    }

    return rows.join("\n");
  };

  const handleCopy = (text) => {
    if (!navigator.clipboard) return;

    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(true);

        clearTimeout(copiedTimeoutRef.current);

        copiedTimeoutRef.current = setTimeout(
          () => setCopied(false),
          1000
        );
      })
      .catch(() => {});
  };

  /* =====================================
     SIZES
  ===================================== */

  const rowH = mobileMode
    ? ROW_H_MOBILE
    : ROW_H_DESKTOP;

  const textPx = mobileMode
    ? TEXT_PX_MOBILE
    : TEXT_PX_DESKTOP;

  const nLetters = entry
    ? entry.word.length
    : DEFAULT_LETTERS;

  const boxW = Math.max(
    1,
    measuredBox?.w ?? w - (mobileMode ? 2 * GAP : 64)
  );

  const boxH = Math.max(
    1,
    measuredBox?.h ?? h - (mobileMode ? 2 * GAP : 104)
  );

  const buttonCount = 2;

  // WOOORDLE is displayed on both mobile and desktop.
  const titleText = "WOOORDLE";

  const titleW =
    boxW - buttonCount * (rowH + GAP);

  const titleFontPx = Math.floor(
    Math.min(
      textPx,
      (titleW - 16) / (titleText.length * 0.62)
    )
  );

  const panelH =
    boxH - rowH - hintHeight - 2 * GAP - 2;

  const availW = Math.max(
    60,
    boxW - 2 - 2 * PANEL_PAD_X
  );

  const availH = Math.max(
    100,
    panelH - 3 * MIN_PANEL_SPACE
  );

  const keyPx = Math.max(
    12,
    Math.floor(
      Math.min(
        availW / 11.8,
        MAX_KEY_PX,
        (availH * KEYBOARD_HEIGHT_SHARE) / 4.8
      )
    )
  );

  const keyboardH = 4.8 * keyPx;

  const letterPx = Math.max(
    10,
    Math.floor(
      Math.min(
        availW / (1.1 * nLetters - 0.1),
        MAX_LETTER_PX,
        (availH - keyboardH) /
          (NUM_GUESSES * 1.1 - 0.1)
      )
    )
  );

  /* =====================================
     MEASURE IMMERSION AREA
  ===================================== */

  useLayoutEffect(() => {
    const container = colContainerRef.current;
    const outer = container?.parentElement;

    if (!outer) return;

    const cs = window.getComputedStyle(outer);

    const padX =
      (parseFloat(cs.paddingLeft) || 0) +
      (parseFloat(cs.paddingRight) || 0);

    const padY =
      (parseFloat(cs.paddingTop) || 0) +
      (parseFloat(cs.paddingBottom) || 0);

    const rect = outer.getBoundingClientRect();

    const innerW = outer.clientWidth - padX;
    const innerH = outer.clientHeight - padY;

    const visibleH =
      window.innerHeight - rect.top - padY;

    setMeasuredBox({
      w: Math.max(1, innerW),
      h: Math.max(
        150,
        Math.min(innerH, visibleH)
      ),
    });
  }, [mobileMode, w, h]);

  /* =====================================
     MEASURE HINT BAR
  ===================================== */

  useLayoutEffect(() => {
    const hint = hintSectionRef.current;

    if (!hint) return;

    const actualHeight =
      hint.getBoundingClientRect().height;

    setHintHeight((previous) =>
      Math.abs(previous - actualHeight) < 0.5
        ? previous
        : actualHeight
    );
  }, [entry?.hint, status, mobileMode, w, h]);

  /* =====================================
     PAGE BACKGROUND
  ===================================== */

  useLayoutEffect(() => {
    let el = colContainerRef.current;
    let bg = null;

    while (el) {
      const colour =
        window.getComputedStyle(el).backgroundColor;

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

    setPageBg((prev) =>
      prev === bg ? prev : bg
    );
  }, [mobileMode, w, h, status]);

  /* =====================================
     POPUP CONTENT
  ===================================== */

  if (status === "choose") {
    popupInfoRef.current = {
      kind: "choose",
      result: null,
    };
  } else if (status === "over") {
    popupInfoRef.current = {
      kind: "result",
      result,
    };
  }

  const popupInfo = popupInfoRef.current;

  const res =
    popupInfo.kind === "result"
      ? popupInfo.result
      : null;

  const showPopup =
    !popupHidden &&
    (status !== "playing" || popupClosing);

  let popupTitle = "CHOOSE MODE";
  let popupBodyText =
    `GUESS THE WORD IN ${NUM_GUESSES} TRIES`;

  let shareText = "";
  let shareLines = [];
  let wordWidths = null;

  const showShare = !!res && !mobileMode;

  if (res) {
    shareText = buildShareText(res);
    shareLines = shareText.split("\n");

    const guessesUsed = res.colours.filter((row) =>
      row.some((c) => c !== "transparent")
    ).length;

    popupTitle = res.won
      ? "WINNER"
      : res.surrendered
        ? "YOU GAVE UP"
        : "GAME OVER";

    const face = res.won
      ? pickFace(WIN_FACES, res.faceRoll)
      : res.surrendered
        ? pickFace(GAVE_UP_FACES, res.faceRoll)
        : pickFace(LOSE_FACES, res.faceRoll);

    if (res.won) {
      popupBodyText = mobileMode
        ? `YOU GOT THE WORD IN ${guessesUsed} ${guessesUsed === 1 ? "GUESS" : "GUESSES"} ${face}`
        : `YOU GUESSED THE WORD ${face}`;
    } else if (res.surrendered) {
      popupBodyText = `BETTER LUCK NEXT TIME ${face}`;
    } else {
      popupBodyText = `OUT OF TRIES ${face}`;
    }

    wordWidths = [
      3,
      4,
      3,
      res.word.length * (WORD_CHAR_EM / MONO_CHAR_EM),
    ];
  }

  const popupFont = Math.round(textPx);

  const popupBodyFont = Math.max(
    10,
    Math.round(popupFont * 0.8)
  );

  const popupBtn = rowH;
  const popupBtnGap = GAP; // Same 6px gap as Snake's prompt buttons.
  const popupLabelMaxFont = Math.min(
    10,
    Math.round(popupBtn * 0.2)
  );

  const popupActionsHeight = popupBtn;
  const popupButtonCount = res ? 3 : 2;

  const popupLabelFont = (label) => {
    const longestWord = Math.max(
      ...label.split(" ").map((word) => word.length)
    );

    const availableWidth = popupBtn - 10;

    return Math.max(
      6,
      Math.min(
        popupLabelMaxFont,
        availableWidth / (longestWord * 0.62)
      )
    );
  };

  const shareFont = mobileMode ? 16 : 20;
  const bodyCharPx = MONO_CHAR_EM * popupBodyFont;

  const bodyWidths = popupBodyText
    .split(" ")
    .map(lineUnits);

  const shareMaxUnits = Math.max(
    1,
    ...shareLines.map(lineUnits)
  );

  const shareBoxW = showShare
    ? Math.ceil(
        shareMaxUnits * MONO_CHAR_EM * shareFont + 22
      )
    : 0;

  const shareBoxH = showShare
    ? Math.ceil(
        shareLines.length * 1.5 * shareFont + 16 + 2
      )
    : 0;

  // Title, body, share results and answer are kept together as one scrollable area.
  const popupTextItemCount =
    2 + (showShare ? 1 : 0) + (wordWidths ? 1 : 0);
  const popupTextGapCount = popupTextItemCount - 1;

  const popupWidthNeeded = Math.ceil(
    Math.max(
      popupTitle.length * TITLE_CHAR_EM * popupFont,
      popupButtonCount * popupBtn +
        (popupButtonCount - 1) * popupBtnGap,
      Math.max(...bodyWidths) * bodyCharPx,
      shareBoxW,
      wordWidths
        ? Math.max(...wordWidths) * bodyCharPx
        : 0
    ) +
      2 * POPUP_SPACE +
      2
  );

  const popupHeightNeeded = (width) => {
    const innerW = width - 2 * POPUP_SPACE - 2;
    const maxUnits = Math.max(
      1,
      Math.floor(innerW / bodyCharPx)
    );

    const bodyH =
      wrapLineCount(bodyWidths, maxUnits) *
      popupBodyFont *
      1.2;

    const wordH = wordWidths
      ? wrapLineCount(wordWidths, maxUnits) *
        popupBodyFont *
        1.2
      : 0;

    // Two outer paddings, one gap before the actions, and the gaps inside the text area.
    const spacingCount = 3 + popupTextGapCount;

    return Math.ceil(
      2 +
        spacingCount * POPUP_SPACE +
        popupFont * 1.1 +
        bodyH +
        shareBoxH +
        wordH +
        popupActionsHeight
    );
  };

  // Keep the prompt as square as the available viewport allows.
  const popupWidthCap = Math.max(
    160,
    Math.min(boxW, window.innerWidth - 16)
  );

  const popupHeightCap = Math.max(
    160,
    Math.min(boxH, window.innerHeight - 16)
  );

  const popupTargetAspect = 1;
  const minPopupWidth = Math.min(
    popupWidthCap,
    popupWidthNeeded
  );
  const maxPopupWidth = Math.max(
    minPopupWidth,
    Math.min(popupWidthCap, popupHeightCap)
  );

  const popupAspectAt = (width) =>
    width / Math.max(1, popupHeightNeeded(width));

  let low = minPopupWidth;
  let high = maxPopupWidth;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);

    if (popupAspectAt(mid) < popupTargetAspect) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  const popupWidthCandidates = new Set(
    [
      minPopupWidth,
      maxPopupWidth,
      low - 2,
      low - 1,
      low,
      low + 1,
      low + 2,
    ].map((width) =>
      Math.min(maxPopupWidth, Math.max(minPopupWidth, width))
    )
  );

  let popupWidth = minPopupWidth;
  let bestAspectDifference = Infinity;

  for (const candidate of popupWidthCandidates) {
    const difference = Math.abs(
      popupAspectAt(candidate) - popupTargetAspect
    );

    if (difference < bestAspectDifference) {
      bestAspectDifference = difference;
      popupWidth = candidate;
    }
  }

  const requiredPopupHeight = popupHeightNeeded(popupWidth);
  const popupHeight = Math.min(
    requiredPopupHeight,
    popupHeightCap
  );
  const popupScroll = requiredPopupHeight > popupHeightCap;

  /* =====================================
     MAIN STYLES
  ===================================== */

  const colContainer = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "flex-start",
    gap: GAP,
    width: "100%",
    height: measuredBox ? boxH : "100%",
    boxSizing: "border-box",
    touchAction: "manipulation",
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

  /* =====================================
     TOP ROW
  ===================================== */

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

  const titleSectionStyle = {
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

  const titleStyle = {
    fontFamily: FONT_FAMILY,
    fontWeight: 700,
    fontSize: titleFontPx,
    whiteSpace: "nowrap",
    color: "var(--colour-7)",
    textAlign: "center",
  };

  const buttonRowStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: GAP,
    height: rowH,
    flexShrink: 0,
  };

  const iconButtonStyle = (dimmed = false) => ({
    fontFamily: FONT_FAMILY,
    width: rowH,
    height: rowH,
    boxSizing: "border-box",
    borderRadius: "8px",
    border: "1px solid var(--colour-5)",
    color: "var(--colour-7)",
    fontSize: `${Math.round(rowH * 0.5)}px`,
    fontWeight: 700,
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: dimmed ? "default" : "pointer",
    padding: Math.max(5, Math.round(rowH * 0.18)),
    flexShrink: 0,
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.22)",
    opacity: dimmed ? 0.45 : 1,
    transition: "background-color 0.15s, opacity 0.15s",
  });

  // Top-right buttons use Snake's layout: icon slot + fitted label, like the prompt buttons.
  const toggleButtonStyle = (dimmed = false) => ({
    ...iconButtonStyle(dimmed),
    flexDirection: "column",
    justifyContent: "space-evenly",
    gap: 1,
    padding: "4px 1px",
    overflow: "hidden",
  });

  /* =====================================
     HINT
  ===================================== */

  const hintSectionStyle = {
    ...sectionStyle,
    height: "auto",
    minHeight: rowH,
    padding: "0.5rem 0.72rem",
    flexShrink: 0,
  };

  const hintStyle = {
    fontFamily: FONT_FAMILY,
    fontWeight: 400,
    fontSize: mobileMode ? 14 : 18,
    lineHeight: 1.15,
    color: "var(--colour-7)",
    textAlign: "center",
    textTransform: "uppercase",
    display: "block",
    overflow: "visible",
    overflowWrap: "anywhere",
    whiteSpace: "normal",
    width: "100%",
  };

  /* =====================================
     GAME PANEL
  ===================================== */

  const panelStyle = {
    ...sectionStyle,
    position: "relative",
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    minHeight: 0,
    padding: 0,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: 0,
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${nLetters}, ${letterPx}px)`,
    gap: `${letterPx * 0.1}px`,
    flexShrink: 0,
  };

  const letterStyle = (row, col) => {
    const raw = colours[row]?.[col] ?? "transparent";

    const shown =
      raw === ABSENT_GREY && darkMode
        ? ABSENT_GREY_DARK
        : raw;

    const hasColour = raw !== "transparent";

    return {
      height: letterPx,
      width: letterPx,
      borderRadius: "4px",
      border: "1px solid var(--colour-4)",
      backgroundColor: hasColour
        ? shown
        : "var(--colour-2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: hasColour
        ? "white"
        : "var(--colour-7)",
      fontWeight: 700,
      fontSize: `${letterPx * 0.5}px`,
      transition: "background-color 0.3s",
    };
  };

  /* =====================================
     KEYBOARD STYLES
  ===================================== */

  const keyboardStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: keyPx * 0.15,
    flexShrink: 0,
  };

  const keyRowStyle = {
    display: "flex",
    flexDirection: "row",
    gap: keyPx * 0.15,
  };

  const keyStyle = (key) => {
    const hex = keyColours[key];

    const guessedColour = hex
      ? (
          hex === ABSENT_GREY && darkMode
            ? ABSENT_GREY_DARK_KEY
            : KEY_COLOUR_MAP[hex]
        )
      : null;

    const isWide =
      key === "ENTER" || key === "BACKSPACE";

    return {
      minWidth: isWide
        ? keyPx * 1.8
        : keyPx,
      height: keyPx * 1.5,
      boxSizing: "border-box",
      borderRadius: "4px",
      border: "1px solid var(--colour-4)",
      backgroundColor:
        pressedKey === key
          ? "var(--colour-4)"
          : guessedColour ?? "var(--colour-3)",
      color: guessedColour
        ? "white"
        : "var(--colour-7)",
      fontWeight: 600,
      fontSize: `${keyPx * 0.45}px`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      userSelect: "none",
      touchAction: "manipulation",
      transition: "background-color 0.1s",
    };
  };

  /* =====================================
     POPUP STYLES
  ===================================== */

  const overlayStyle = {
    position: "fixed",
    left: "50vw",
    top: "50vh",
    width: popupWidth,
    height: popupHeight,
    boxSizing: "border-box",
    transform: "translate(-50%, -50%)",
    zIndex: 25,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: `${POPUP_SPACE}px`,
    padding: `${POPUP_SPACE}px`,
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
    transition: `opacity ${POPUP_FADE_MS / 1000}s ease`,
    pointerEvents: popupClosing ? "none" : "auto",
  };

  // Keeps the title, description, results and answer together with consistent spacing.
  // When content is too tall, this area scrolls while the action buttons remain visible.
  const popupTextAreaStyle = {
    flex: "0 1 auto",
    minHeight: 0,
    overflowY: popupScroll ? "auto" : "visible",
    overflowX: "hidden",
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

  const popupBodyStyle = {
    width: "100%",
    boxSizing: "border-box",
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

  // Icon position is unchanged.
  const popupButtonIconStyle = {
    width: "62%",
    height: "48%",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // Button labels: 13% larger and 3px lower.
  const popupButtonLabelStyle = (label) => ({
    width: "100%",
    maxHeight: "2.1em",
    overflow: "hidden",
    fontFamily: FONT_FAMILY,
    fontSize: `${popupLabelFont(label) * BUTTON_LABEL_SCALE}px`,
    lineHeight: 0.95,
    fontWeight: 700,
    color: "var(--colour-7)",
    textAlign: "center",
    whiteSpace: "normal",
    overflowWrap: "normal",
    textTransform: "uppercase",
    transform: `translateY(${BUTTON_LABEL_OFFSET}px)`,
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
    color: "var(--colour-7)",
    fontWeight: 700,
    lineHeight: 1,
    cursor: "pointer",
    padding: "4px 3px",
    overflow: "hidden",
    boxShadow: "0 3px 10px rgba(0, 0, 0, 0.22)",
  };

  /* =====================================
     CHOOSE POPUP
  ===================================== */

  const renderChoosePopup = () => (
    <>
      <div style={popupTextAreaStyle}>
        <div style={popupTitleStyle}>
          {popupTitle}
        </div>

        <div style={popupBodyStyle}>
          {popupBodyText}
        </div>
      </div>

      <div style={popupButtonRowStyle}>
        {/* Daily */}
        <button
          type="button"
          className="imm-btn"
          style={popupButtonStyle}
          aria-label="Daily word"
          title="Daily word"
          onClick={() => startGame("daily")}
        >
          <div style={popupButtonIconStyle}>
            {renderIcon(icons.daily)}
          </div>

          <span style={popupButtonLabelStyle("DAILY")}>
            DAILY
          </span>
        </button>

        {/* Random */}
        <button
          type="button"
          className="imm-btn"
          style={popupButtonStyle}
          aria-label="Random word"
          title="Random word"
          onClick={() => startGame("random")}
        >
          <div style={popupButtonIconStyle}>
            {renderIcon(icons.random)}
          </div>

          <span style={popupButtonLabelStyle("RANDOM")}>
            RANDOM
          </span>
        </button>
      </div>
    </>
  );

  /* =====================================
     RESULT POPUP
  ===================================== */

  const renderResultPopup = () => {
    if (!res) return null;

    return (
      <>
        <div style={popupTextAreaStyle}>
          <div style={popupTitleStyle}>
            {popupTitle}
          </div>

          <div style={popupBodyStyle}>
            {popupBodyText}
          </div>

          {/* Results grid: desktop only. */}
          {showShare && (
            <div
              style={{
                boxSizing: "border-box",
                background: "var(--colour-2)",
                border: "1px solid var(--colour-4)",
                borderRadius: "8px",
                padding: "8px 10px",
                fontFamily: FONT_FAMILY,
                fontWeight: 400,
                fontSize: `${shareFont}px`,
                lineHeight: 1.5,
                whiteSpace: "pre",
                textAlign: "left",
                userSelect: "text",
                maxWidth: "100%",
                overflowX: "auto",
              }}
            >
              {shareText}
            </div>
          )}

          <div style={popupBodyStyle}>
            THE WORD WAS{" "}
            <span
              style={{
                fontWeight: 900,
                letterSpacing: "0.1em",
              }}
            >
              {res.word}
            </span>
          </div>
        </div>

        <div style={popupButtonRowStyle}>
          {/* Copy results */}
          <button
            type="button"
            className="imm-btn"
            style={popupButtonStyle}
            aria-label="Copy results"
            title="Copy results"
            onClick={() => handleCopy(shareText)}
          >
            <div style={popupButtonIconStyle}>
              {renderIcon(copied ? icons.copied : icons.copy)}
            </div>

            <span style={popupButtonLabelStyle(copied ? "COPIED" : "COPY")}>
              {copied ? "COPIED" : "COPY"}
            </span>
          </button>

          {/* Retry */}
          <button
            type="button"
            className="imm-btn"
            style={popupButtonStyle}
            aria-label="Retry game"
            title="Retry game"
            onClick={retryGame}
          >
            <div style={popupButtonIconStyle}>
              {renderIcon(icons.restart)}
            </div>

            <span style={popupButtonLabelStyle("RETRY")}>
              RETRY
            </span>
          </button>

          {/* Change mode */}
          <button
            type="button"
            className="imm-btn"
            style={popupButtonStyle}
            aria-label="Choose game mode"
            title="Choose game mode"
            onClick={goToChoose}
          >
            <div style={popupButtonIconStyle}>
              {renderIcon(icons.change)}
            </div>

            <span style={popupButtonLabelStyle("MODES")}>
              MODES
            </span>
          </button>
        </div>
      </>
    );
  };

  /* =====================================
     RENDER
  ===================================== */

  return (
    <div
      ref={colContainerRef}
      style={colContainer}
    >
      <style>{`
        @keyframes wordleShake {
          0%   { transform: translateX(0); }
          20%  { transform: translateX(-6px); }
          40%  { transform: translateX(6px); }
          60%  { transform: translateX(-6px); }
          80%  { transform: translateX(6px); }
          100% { transform: translateX(0); }
        }

        .wordle-shake {
          animation: wordleShake 0.4s ease;
        }

        .imm-btn { background-color: var(--colour-1); }
        @media (hover: hover) { .imm-btn:hover:not(:disabled) { background-color: var(--colour-2); } }
      `}</style>

      {/* =====================================
          TOP ROW
      ===================================== */}

      <div style={topRowStyle}>
        <div style={titleSectionStyle}>
          <div style={titleStyle}>
            {titleText}
          </div>
        </div>

        <div style={buttonRowStyle}>
          {/* Surrender / Give up */}
          <button
            type="button"
            className="imm-btn"
            style={toggleButtonStyle(status !== "playing")}
            disabled={status !== "playing"}
            onClick={handleSurrender}
            aria-label="Give up"
            title="Give up"
          >
            <div style={popupButtonIconStyle}>{renderIcon(icons.surrender)}</div>
            <span style={popupButtonLabelStyle("QUIT")}>QUIT</span>
          </button>

          {/* Exit activities */}
          <button
            type="button"
            style={{ ...toggleButtonStyle(false), backgroundColor: "var(--red-0)" }}
            onClick={leaveActivities}
            aria-label="Exit activities"
            title="Exit activities"
          >
            <div style={popupButtonIconStyle}>{renderIcon(icons.cross)}</div>
            <span style={popupButtonLabelStyle("LEAVE")}>LEAVE</span>
          </button>
        </div>
      </div>

      {/* =====================================
          HINT
      ===================================== */}

      <div
        ref={hintSectionRef}
        style={hintSectionStyle}
      >
        <div style={hintStyle}>
          {status === "choose" ? (
            "Choose a mode to start"
          ) : (
            <>
              <strong style={{ fontWeight: 700 }}>
                HINT:
              </strong>{" "}
              {entry?.hint ?? "NO HINT"}
            </>
          )}
        </div>
      </div>

      {/* =====================================
          GAME PANEL
      ===================================== */}

      <div style={panelStyle}>
        {/* Guess grid */}
        <div style={gridStyle}>
          {Array.from({
            length: NUM_GUESSES * nLetters,
          }).map((_, i) => {
            const row = Math.floor(i / nLetters);
            const col = i % nLetters;

            return (
              <div
                key={i}
                className={
                  shakenRow === row
                    ? "wordle-shake"
                    : ""
                }
                style={letterStyle(row, col)}
              >
                {guesses[row]?.[col] ?? ""}
              </div>
            );
          })}
        </div>

        {/* Keyboard */}
        <div style={keyboardStyle}>
          {KEYBOARD_ROWS.map((row, ri) => (
            <div
              key={ri}
              style={keyRowStyle}
            >
              {row.map((key) => (
                <div
                  key={key}
                  style={keyStyle(key)}
                  onPointerDown={(e) => {
                    e.preventDefault();
                    onPressKey(key);
                  }}
                  onPointerUp={() => setPressedKey(null)}
                  onPointerLeave={() => setPressedKey(null)}
                >
                  {key === "ENTER"
                    ? enterCooldown > 0
                      ? `${enterCooldown}s`
                      : "ENTER"
                    : key === "BACKSPACE"
                      ? "⌫"
                      : key}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* =====================================
            POPUP
        ===================================== */}

        {showPopup && (
          <div style={overlayStyle}>
            {popupInfo.kind === "choose"
              ? renderChoosePopup()
              : renderResultPopup()}
          </div>
        )}
      </div>
    </div>
  );
};