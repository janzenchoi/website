import { Immersion } from "./Immersion";
import { GenericMenu } from "./Screen";
import { CleanButton } from "../../content/CleanButton";
import { useState, useEffect, useRef } from "react";
import { MAX_WIDTH } from "../../../helper/constant";
import { WORDS } from "../../../assets/stuff/wordle/words";

// Tiny GIF
import frame1 from "../../../assets/stuff/wordle/frame_1.png";
import frame2 from "../../../assets/stuff/wordle/frame_2.png";
import frame3 from "../../../assets/stuff/wordle/frame_3.png";
import frame4 from "../../../assets/stuff/wordle/frame_4.png";
import frame5 from "../../../assets/stuff/wordle/frame_5.png";
import frame6 from "../../../assets/stuff/wordle/frame_6.png";
import frame7 from "../../../assets/stuff/wordle/frame_7.png";
import frame8 from "../../../assets/stuff/wordle/frame_8.png";
import frame9 from "../../../assets/stuff/wordle/frame_9.png";
import frame10 from "../../../assets/stuff/wordle/frame_10.png"

const NUM_GUESSES = 6;

// Lighter gray for "letter not in word" in dark mode (the default #3a3a3c is too close to the dark background)
const ABSENT_GREY = "#3a3a3c";
const ABSENT_GREY_DARK = "#6a6a6e";
const ABSENT_GREY_DARK_KEY = "rgba(106, 106, 110, 0.8)";

// Largest gap between the title, hint, grid and keyboard (the gap shrinks below this on short screens)
const MAX_GAP = "2rem";

// Face emojis for the results subtitle, 10 per outcome
const WIN_FACES     = ["😀", "😃", "😄", "😁", "😆", "🥳", "😎", "🤩", "😍", "🤗"];
const GAVE_UP_FACES = ["😒", "🙄", "😑", "😐", "😶", "😬", "😏", "😵", "😳", "😤"];
const LOSE_FACES    = ["😩", "😭", "😢", "😞", "😖", "😫", "😣", "😰", "😔", "😟"];

// Pick a random entry, avoiding the one we were just on
const pickRandomEntry = (exclude) => {
  if (WORDS.length < 2) return WORDS[0];
  let next;
  do {
    next = WORDS[Math.floor(Math.random() * WORDS.length)];
  } while (exclude && next.word === exclude.word);
  return next;
};

// Current window width, kept up to date on resize
const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
};

/**
 * Wordle Immersion
 */
export const WordleImmersion = ({ mobileMode, darkMode, leaveActivities }) => {

  const [screen, setScreen] = useState("menu");
  const [gameResult, setGameResult] = useState(null);

  const getDailyEntry = () => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return WORDS[seed % WORDS.length];
  };
  const daily = getDailyEntry(WORDS);
  const [entry, setEntry] = useState(() => pickRandomEntry());

  const startRandom = () => {
    setEntry(prev => pickRandomEntry(prev));
    setScreen("random");
  };
  const resetRandom = () => setEntry(prev => pickRandomEntry(prev));

  const outerContainer = {
    position: "relative", // anchors the top-right game buttons
    width: "100%",
    height: "100vh",
    boxSizing: "border-box",
    padding: "2rem"
  };

  const icons = [frame1, frame2, frame3, frame4, frame5, frame6, frame7, frame8, frame9, frame10];
  const Menu = () => <GenericMenu
    mobileMode={mobileMode}
    darkMode={darkMode}
    title="Wooordle"
    description="Get 6 chances to guess a word between 6-10 letters long"
    icons={icons}
    iconInterval={800}
    buttons={[
      { label: "Play Daily (📅)",  onClick: () => setScreen("daily") },
      { label: "Play Random (❓)", onClick: startRandom },
    ]}
  />

  const handleGameEnd = (result) => {
    setGameResult(result);
    setScreen("results");
  };

  const Daily = () => <WordleGame
    word={daily.word.toUpperCase()}
    hint={daily.hint}
    onEnd={handleGameEnd}
    onBack={() => setScreen("menu")}
    mobileMode={mobileMode}
    darkMode={darkMode}
    numLetters={daily.word.length}
  />
  const Random = () => <WordleGame
    key={entry.word}
    word={entry.word.toUpperCase()}
    hint={entry.hint}
    onEnd={handleGameEnd}
    onBack={() => setScreen("menu")}
    onReset={resetRandom}
    mobileMode={mobileMode}
    darkMode={darkMode}
    numLetters={entry.word.length}
  />

  const Results = () => <WordleResults
    result={gameResult}
    mobileMode={mobileMode}
    onMenu={() => setScreen("menu")}
  />

  return (
    <Immersion mobileMode={mobileMode} darkMode={darkMode} leaveActivities={leaveActivities}>
      <div style={outerContainer}>
        {screen === "menu"     && <Menu/>}
        {screen === "daily"    && <Daily/>}
        {screen === "random"   && <Random/>}
        {screen === "results"  && <Results/>}
      </div>
    </Immersion>
  );
}

/**
 * Wordle game screen
 */
const WordleGame = ({ word, hint, onEnd, onBack, onReset, mobileMode, darkMode, numLetters = 10, numGuesses = NUM_GUESSES }) => {

  const windowWidth = useWindowWidth();
  const PADDING = windowWidth * 0.05;
  const wordLength = word.length;

  const [guesses, setGuesses] = useState(Array(numGuesses).fill(null).map(() => Array(numLetters).fill("")));
  const [colours, setColours] = useState(Array(numGuesses).fill(null).map(() => Array(numLetters).fill("transparent")));
  const [keyColours, setKeyColours] = useState({});
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [pressedKey, setPressedKey] = useState(null);
  const [shakenRow, setShakenRow] = useState(null);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const enterCooldownRef = useRef(false);
  const [enterCooldown, setEnterCooldown] = useState(0);
  const submittingRef = useRef(false);
  const [confirmSurrender, setConfirmSurrender] = useState(false);
  const confirmTimeoutRef = useRef(null);
  const [confirmBack, setConfirmBack] = useState(false);
  const backTimeoutRef = useRef(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const resetTimeoutRef = useRef(null);
  const mountedRef = useRef(true);

  const currentRowRef = useRef(0);
  const currentColRef = useRef(0);
  const guessesRef = useRef(guesses);
  const coloursRef = useRef(colours);
  const gameOverRef = useRef(false);
  const wordLengthRef = useRef(wordLength);

  useEffect(() => { currentRowRef.current = currentRow; }, [currentRow]);
  useEffect(() => { currentColRef.current = currentCol; }, [currentCol]);
  useEffect(() => { guessesRef.current = guesses; }, [guesses]);
  useEffect(() => { coloursRef.current = colours; }, [colours]);
  useEffect(() => { gameOverRef.current = gameOver; }, [gameOver]);
  useEffect(() => { wordLengthRef.current = wordLength; }, [wordLength]);

  // Track mount state and clear the "tap again" timer on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimeout(confirmTimeoutRef.current);
      clearTimeout(backTimeoutRef.current);
      clearTimeout(resetTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes shake {
        0%   { transform: translateX(0); }
        20%  { transform: translateX(-6px); }
        40%  { transform: translateX(6px); }
        60%  { transform: translateX(-6px); }
        80%  { transform: translateX(6px); }
        100% { transform: translateX(0); }
      }
      .shake { animation: shake 0.4s ease; }

      @keyframes fadeOut {
        0%   { opacity: 1; }
        70%  { opacity: 1; }
        100% { opacity: 0; }
      }
      .popup {
        animation: fadeOut 2s ease forwards;
        position: fixed;
        top: 6rem;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(219, 28, 28, 0.83);
        color: white;
        padding: 0.6rem 1.4rem;
        border-radius: 8px;
        font-size: 1rem;
        font-weight: 600;
        pointer-events: none;
        z-index: 99999;
        white-space: pre-line;
        text-align: center;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const maxWidth = parseInt(MAX_WIDTH);
  useEffect(() => {
    const compute = () => {
      const availableW = Math.min(window.innerWidth, maxWidth) - PADDING * 2;
      // Reserve ~40vh for the grid; factor in numGuesses rows each with a 10% gap
      const availableH = window.innerHeight * 0.40;
      const letterByWidth  = availableW / (numLetters * 1.1);
      const letterByHeight = availableH / (numGuesses * 1.1);
      const letterPx = Math.min(letterByWidth, letterByHeight);
      // Keyboard shrinks with both width and height. It is 3 rows of 1.5 key-heights
      // plus 2 gaps of 0.15 (= 4.8 key-sizes tall), and gets ~25vh to work with.
      const keyByWidth  = availableW / 12;
      const keyByHeight = (window.innerHeight * 0.25) / 4.8;
      const keyPx = Math.min(keyByWidth, keyByHeight);
      document.documentElement.style.setProperty("--letter-size", `${letterPx}px`);
      document.documentElement.style.setProperty("--key-size", `${keyPx}px`);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [numLetters, numGuesses, maxWidth, PADDING]);

  const COLOUR_PRIORITY = { "#538d4e": 2, "#b59f3b": 1, "#3a3a3c": 0 };
  const KEY_COLOUR_MAP = {
    "#538d4e": "rgba(83, 141, 78, 0.8)",
    "#b59f3b": "rgba(181, 159, 59, 0.8)",
    "#3a3a3c": "rgba(58, 58, 60, 0.8)",
  };

  const showPopup = (message) => {
    setPopupMessage(message);
    setPopupVisible(false);
    setTimeout(() => {
      setPopupVisible(true);
      setTimeout(() => setPopupVisible(false), 5000);
    }, 10);
  };

  const shakeRow = (row) => {
    setShakenRow(row);
    setTimeout(() => setShakenRow(null), 400);
  };

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
    if (submittingRef.current || enterCooldownRef.current) return;
    submittingRef.current = true;

    const row = currentRowRef.current;
    const wl = wordLengthRef.current;
    const guess = guessesRef.current[row].filter(l => l !== "");

    const valid = await validateWord(guess.join(""));

    // Player may have surrendered or left while the dictionary lookup was in flight
    if (gameOverRef.current || !mountedRef.current) {
      submittingRef.current = false;
      return;
    }

    if (!valid) {
      shakeRow(row);
      showPopup("Not a valid word!");
      enterCooldownRef.current = true;
      setEnterCooldown(3);
      const cooldownInterval = setInterval(() => {
        setEnterCooldown(prev => {
          if (prev <= 1) {
            clearInterval(cooldownInterval);
            enterCooldownRef.current = false;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      submittingRef.current = false;
      return;
    }

    const newColours = coloursRef.current.map(r => [...r]);
    const wordArr = word.split("");
    const used = Array(wl).fill(false);

    for (let i = 0; i < numLetters; i++) {
      newColours[row][i] = "#3a3a3c";
    }

    guess.forEach((letter, i) => {
      if (i < wl && letter === wordArr[i]) {
        newColours[row][i] = "#538d4e";
        used[i] = true;
      }
    });

    guess.forEach((letter, i) => {
      if (newColours[row][i] === "#538d4e") return;
      const j = wordArr.findIndex((l, idx) => l === letter && !used[idx]);
      if (j !== -1) {
        newColours[row][i] = "#b59f3b";
        used[j] = true;
      } else {
        newColours[row][i] = "#3a3a3c";
      }
    });

    setColours(newColours);

    setKeyColours(prev => {
      const next = { ...prev };
      guess.forEach((letter, i) => {
        const gridColour = newColours[row][i];
        const existing = next[letter];
        if (!existing || COLOUR_PRIORITY[gridColour] > COLOUR_PRIORITY[existing]) {
          next[letter] = gridColour;
        }
      });
      return next;
    });

    const won = guess.length === wl && guess.join("") === word;
    if (won || row + 1 >= numGuesses) {
      setGameOver(true);
      gameOverRef.current = true;
      setTimeout(() => {
        // Don't yank the player to results if they already left the game
        if (!mountedRef.current) return;
        onEnd({
          won,
          surrendered: false,
          word,
          guesses: guessesRef.current,
          colours: newColours,
          numGuesses: row + 1,
        });
      }, 1200);
    } else {
      setCurrentRow(row + 1);
      setCurrentCol(0);
    }

    enterCooldownRef.current = true;
    setEnterCooldown(3);
    const cooldownInterval = setInterval(() => {
      setEnterCooldown(prev => {
        if (prev <= 1) {
          clearInterval(cooldownInterval);
          enterCooldownRef.current = false;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    submittingRef.current = false;
  };

  /**
   * Surrender: first tap arms the flag (turns red, resets after 3s),
   * second tap ends the game and jumps straight to the results screen.
   */
  const handleSurrender = () => {
    if (gameOverRef.current) return;

    if (!confirmSurrender) {
      setConfirmBack(false);
      clearTimeout(backTimeoutRef.current);
      setConfirmReset(false);
      clearTimeout(resetTimeoutRef.current);
      setConfirmSurrender(true);
      showPopup("Press again to give up\n(the answer will be revealed)");
      clearTimeout(confirmTimeoutRef.current);
      confirmTimeoutRef.current = setTimeout(() => setConfirmSurrender(false), 3000);
      return;
    }

    clearTimeout(confirmTimeoutRef.current);
    setConfirmSurrender(false);
    setGameOver(true);
    gameOverRef.current = true;

    // Only count rows that were actually submitted (coloured)
    const submittedRows = coloursRef.current.filter(r => r.some(c => c !== "transparent")).length;

    onEnd({
      won: false,
      surrendered: true,
      word,
      guesses: guessesRef.current,
      colours: coloursRef.current,
      numGuesses: submittedRows,
    });
  };

  // True once at least one guess has been submitted (its row is coloured)
  const hasSubmittedGuess = () =>
    coloursRef.current.some(row => row.some(c => c !== "transparent"));

  /**
   * Back: guesses aren't stored, so once a guess has been made the first tap only warns
   * and a second tap within 3s leaves. With no guesses it leaves straight away.
   */
  const handleBack = () => {
    if (!hasSubmittedGuess()) {
      gameOverRef.current = true; // ignore any in-flight guess
      onBack();
      return;
    }

    if (!confirmBack) {
      setConfirmSurrender(false);
      clearTimeout(confirmTimeoutRef.current);
      setConfirmReset(false);
      clearTimeout(resetTimeoutRef.current);
      setConfirmBack(true);
      showPopup("Press again to leave\n(guesses are not saved)");
      clearTimeout(backTimeoutRef.current);
      backTimeoutRef.current = setTimeout(() => setConfirmBack(false), 3000);
      return;
    }

    clearTimeout(backTimeoutRef.current);
    setConfirmBack(false);
    gameOverRef.current = true; // ignore any in-flight guess
    onBack();
  };

  /**
   * Reset (random mode only): swaps in a new word. Guesses are lost, so once a guess has
   * been made the first tap only warns and a second tap within 3s confirms.
   * With no guesses it swaps the word straight away.
   */
  const handleReset = () => {
    if (gameOverRef.current) return;

    if (!hasSubmittedGuess()) {
      gameOverRef.current = true; // ignore any in-flight guess
      onReset();
      return;
    }

    if (!confirmReset) {
      setConfirmSurrender(false);
      clearTimeout(confirmTimeoutRef.current);
      setConfirmBack(false);
      clearTimeout(backTimeoutRef.current);
      setConfirmReset(true);
      showPopup("Press again for a new word\n(guesses are not saved)");
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = setTimeout(() => setConfirmReset(false), 3000);
      return;
    }

    clearTimeout(resetTimeoutRef.current);
    setConfirmReset(false);
    gameOverRef.current = true; // ignore any in-flight guess
    onReset();
  };

  const handleKey = (key) => {
    if (gameOverRef.current) return;
    if (key === "ENTER" && (submittingRef.current || enterCooldownRef.current)) return;
    const col = currentColRef.current;
    const row = currentRowRef.current;

    if (key === "BACKSPACE") {
      if (col === 0) return;
      const next = guessesRef.current.map(r => [...r]);
      next[row][col - 1] = "";
      setGuesses(next);
      setCurrentCol(col - 1);
    } else if (key === "ENTER") {
      submitGuess();
    } else if (/^[A-Z]$/.test(key) && col < numLetters) {
      const next = guessesRef.current.map(r => [...r]);
      next[row][col] = key;
      setGuesses(next);
      setCurrentCol(col + 1);
    }
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key) || key === "BACKSPACE" || key === "ENTER") {
        setPressedKey(key);
        handleKey(key);
      }
    };
    const onKeyUp = () => setPressedKey(null);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const keyboardRows = [
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["ENTER","Z","X","C","V","B","N","M","BACKSPACE"],
  ];

  const GAP = `min(4vh, ${MAX_GAP})`;
  const colContainer = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: GAP,
    height: "100%",
    // Extra top room on mobile so the button row doesn't sit on the title
    padding: `${mobileMode ? "3.5rem" : "2rem"} ${PADDING}px 2rem`,
  };
  const titleStyle = {
    fontWeight: 700,
    fontSize: mobileMode ? "2.2rem" : "3rem",
    color: "var(--colour-6)",
    textAlign: "center",
  };
  const hintStyle = {
    fontWeight: 500,
    fontSize: mobileMode ? "1.1rem" : "1.4rem",
    color: "var(--colour-5)",
    textAlign: "center",
    maxWidth: "30rem",
  };
  const titleBlockStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: GAP,
  };
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${numLetters}, var(--letter-size))`,
    gap: "calc(var(--letter-size) * 0.1)",
  };
  const letterStyle = (row, col) => {
    const raw = colours[row][col];
    const shown = raw === ABSENT_GREY && darkMode ? ABSENT_GREY_DARK : raw;
    const bg = raw !== "transparent" ? shown : "var(--colour-2)";
    const hasColour = colours[row][col] !== "transparent";
    return {
      height: "var(--letter-size)",
      width: "var(--letter-size)",
      borderRadius: "4px",
      border: "1px solid var(--colour-4)",
      backgroundColor: bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: hasColour ? "white" : "var(--colour-6)",
      fontWeight: 700,
      fontSize: "calc(var(--letter-size) * 0.5)",
      transition: "background-color 0.3s",
    };
  };
  const keyboardStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "calc(var(--key-size) * 0.15)",
    width: "100%",
    maxWidth: "min(500px, 100%)",
    margin: "0 auto",
    marginBottom: "clamp(1rem, 5vh, 4rem)",
  };
  const keyRowStyle = {
    display: "flex",
    flexDirection: "row",
    gap: "calc(var(--key-size) * 0.15)",
  };
  const keyStyle = (key) => {
    const hexColour = keyColours[key];
    const guessedColour = hexColour
      ? (hexColour === ABSENT_GREY && darkMode ? ABSENT_GREY_DARK_KEY : KEY_COLOUR_MAP[hexColour])
      : null;
    const isPressed = pressedKey === key;
    return {
      minWidth: key === "ENTER" || key === "BACKSPACE" ? "calc(var(--key-size) * 1.8)" : "var(--key-size)",
      height: "calc(var(--key-size) * 1.5)",
      borderRadius: "4px",
      border: "1px solid var(--colour-4)",
      backgroundColor: isPressed ? "var(--colour-4)" : guessedColour ?? "var(--colour-3)",
      color: guessedColour ? "white" : "var(--colour-6)",
      fontWeight: 600,
      fontSize: "calc(var(--key-size) * 0.45)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      userSelect: "none",
      transition: "background-color 0.1s",
    };
  };

  // Top-right icon buttons: a vertical stack on desktop, a horizontal row on mobile
  const buttonSize = mobileMode ? "2.8rem" : "3.2rem";
  const topBarStyle = {
    position: "absolute",
    // Same offsets as the Immersion close button (top 0.5rem, left 1rem), mirrored to the right
    top: "1.5rem",
    right: "1.5rem",
    display: "flex",
    flexDirection: mobileMode ? "row" : "column",
    alignItems: "stretch",
    gap: "1rem",
    zIndex: 10,
  };
  const iconButtonStyle = (armed = false) => ({
    width: buttonSize,
    height: buttonSize,
    borderRadius: "8px",
    border: armed ? "1px solid var(--red-2)" : "1px solid var(--colour-4)",
    backgroundColor: armed ? "var(--red-1)" : "var(--colour-3)",
    color: armed ? "white" : "var(--colour-6)",
    fontSize: "2rem",
    fontWeight: 700,
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    padding: 0,
    transition: "background-color 0.15s",
  });

  const onPressLetter = (key) => {
    setPressedKey(key);
    handleKey(key);
  };

  return (
    <div style={colContainer}>
      {popupVisible && <div className="popup">{popupMessage}</div>}

      <div style={topBarStyle}>
        <button
          type="button"
          style={iconButtonStyle(confirmBack)}
          onClick={handleBack}
          aria-label="Back to menu"
          title="Back to menu"
        >
          🏠
        </button>
        {onReset && (
          <button
            type="button"
            style={iconButtonStyle(confirmReset)}
            onClick={handleReset}
            aria-label="New word"
            title="New word"
          >
            🎲
          </button>
        )}
        <button
          type="button"
          style={iconButtonStyle(confirmSurrender)}
          onClick={handleSurrender}
          aria-label="Give up"
          title="Give up"
        >
          🏳️
        </button>
      </div>

      <div style={titleBlockStyle}>
        <div style={titleStyle}>{"Wooordle"}</div>
        <div style={hintStyle}>{hint ?? "NO HINT"}</div>
      </div>
      <div style={gridStyle}>
        {Array.from({ length: numGuesses * numLetters }).map((_, i) => {
          const row = Math.floor(i / numLetters);
          const col = i % numLetters;
          return (
            <div
              key={i}
              className={shakenRow === row ? "shake" : ""}
              style={letterStyle(row, col)}
            >
              {guesses[row][col]}
            </div>
          );
        })}
      </div>
      <div style={keyboardStyle}>
        {keyboardRows.map((row, ri) => (
          <div key={ri} style={keyRowStyle}>
            {row.map(key => (
              <div
                key={key}
                style={keyStyle(key)}
                onPointerDown={(e) => { e.preventDefault(); onPressLetter(key); }}
                onPointerUp={() => setPressedKey(null)}
                onPointerLeave={() => setPressedKey(null)}
              >
                {key === "ENTER" ? (enterCooldown > 0 ? `${enterCooldown}s` : "ENTER") : key === "BACKSPACE" ? "⌫" : key}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Wordle Results Screen
 * Layout mirrors GenericMenu: title/subtitle → share grid → word reveal → buttons
 */
const WordleResults = ({ result, mobileMode, onMenu }) => {
  const [copied, setCopied] = useState(false);
  // Rolled once per results screen so the face doesn't change when the copy button re-renders
  const [faceRoll] = useState(() => Math.random());

  // Layout primitives — mirrors GenericMenu exactly
  const rowContainer = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  };
  const colContainer = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };
  const outerContainer = {
    ...rowContainer,
    alignItems: "center",
    height: "100vh",
  };
  const innerContainer = {
    ...colContainer,
    gap: "3rem",
    width: "100vw",
  };

  // Fallback before a result exists
  if (!result) {
    return (
      <div style={outerContainer}>
        <div style={innerContainer}>
          <CleanButton text="Back to Menu" onClick={onMenu} />
        </div>
      </div>
    );
  }

  const { won, surrendered, word, guesses, colours } = result;

  // Build emoji share grid — only submitted rows, trimmed to word length
  const COLOUR_EMOJI = {
    "#538d4e": "🟩",
    "#b59f3b": "🟨",
    "#3a3a3c": "⬛",
    "transparent": null,
  };

  const wordLength = word.length;
  const emojiRows = [];
  for (let r = 0; r < guesses.length; r++) {
    const rowColours = colours[r];
    if (!rowColours.some(c => c !== "transparent")) break;
    const letters = guesses[r].slice(0, wordLength).join("");
    const emojis = rowColours.slice(0, wordLength).map(c => COLOUR_EMOJI[c] ?? "⬛").join("");
    emojiRows.push(`${r + 1}. ${emojis} (${letters})`);
  }

  // Mark surrendered games in the share grid
  if (surrendered) {
    emojiRows.push(`${emojiRows.length + 1}. Gave up`);
  }

  const shareText = emojiRows.join("\n");
  const handleCopy = () => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  };

  const pickFace = (faces) => faces[Math.floor(faceRoll * faces.length)];
  const subtitleText = won
    ? `You guessed the word! ${pickFace(WIN_FACES)}`
    : surrendered
      ? `You gave up ${pickFace(GAVE_UP_FACES)}`
      : `Better luck next time ${pickFace(LOSE_FACES)}`;

  // Text styles — mirrors GenericMenu
  const titleStyle = {
    fontWeight: 700,
    fontSize: mobileMode ? "2.4rem" : "3.2rem",
    color: "var(--colour-6)",
    textAlign: "center",
  };
  const subtitleStyle = {
    fontWeight: 500,
    fontSize: mobileMode ? "1.2rem" : "1.5rem",
    color: "var(--colour-6)",
    textAlign: "center",
  };
  const descriptionStyle = {
    fontWeight: 400,
    fontSize: mobileMode ? "1.1rem" : "1.4rem",
    color: "var(--colour-5)",
    textAlign: "center",
  };

  const shareBoxStyle = {
    minWidth: mobileMode ? "unset" : "50%",
    maxWidth: "100%",
    boxSizing: "border-box",
    overflowX: "auto",
    background: "var(--colour-2)",
    border: "1px solid var(--colour-4)",
    borderRadius: "10px",
    margin: "0rem 1rem",
    padding: mobileMode ? "0.8rem 1rem" : "1rem 1.5rem",
    fontFamily: "monospace",
    fontSize: mobileMode ? "0.95rem" : "1.4rem",
    lineHeight: "1.7",
    whiteSpace: "pre",
    color: "var(--colour-6)",
    userSelect: "all",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    textAlign: "left",
  };

  return (
    <div style={outerContainer}>
      <div style={innerContainer}>

        {/* Title + outcome — mirrors title/author block */}
        <div>
          <div style={titleStyle}>Wooordle</div>
          <div style={subtitleStyle}>{subtitleText}</div>
        </div>

        {/* Emoji share grid — mirrors the icon block */}
        <div style={rowContainer}>
          <div style={shareBoxStyle}>{shareText}</div>
        </div>

        {/* Word reveal — mirrors description */}
        <div style={descriptionStyle}>
          The word was&nbsp;
          <span style={{ fontWeight: 700, color: "var(--colour-6)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {word}
          </span>
        </div>

        {/* Buttons — mirrors button list */}
        <div style={{ ...colContainer, gap: "1rem" }}>
          <CleanButton text={copied ? "Copied to Clipboard!" : "Share Results (📋)"} onClick={handleCopy} />
          <CleanButton text="Back to Menu (🏠)" onClick={onMenu} />
        </div>

      </div>
    </div>
  );
};