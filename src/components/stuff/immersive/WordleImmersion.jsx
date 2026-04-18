import { Immersion } from "./Immersion";
import { GenericMenu } from "./Screen";
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

/**
 * Wordle Immersion
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @param {function} leaveActivities leaves all activities
 * @returns wordle immersion space object
 */
export const WordleImmersion = ({ mobileMode, darkMode, leaveActivities }) => {

  // The screen to show
  const [screen, setScreen] = useState("menu");
  
  // Get daily word
  const getDailyEntry = () => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return WORDS[seed % WORDS.length];
  };
  const daily = getDailyEntry(WORDS);
  
  // Get random word
  const entry = WORDS[Math.floor(Math.random() * WORDS.length)];

  // Wordle container
  const outerContainer = {
    width: "100%",
    height: "100vh",
    boxSizing: "border-box",
    padding: "2rem"
  };

  // Menu screen
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
      { label: "Play Random (❓)", onClick: () => setScreen("random") },
      { label: "Settings (⚙️)",    onClick: () => setScreen("settings") },
    ]}
  />

  // Game screens
  const Daily = () => <WordleGame
    word={daily.word.toUpperCase()}
    hint={daily.hint}
    onEnd={() => setScreen("results")}
  />
  const Random = () => <WordleGame
    word={entry.word.toUpperCase()}
    hint={entry.hint}
    onEnd={() => setScreen("results")}
  />

  // Settings screen
  const Settings = () => <WordleSettings
    onWin={() => {
      setScreen("results");
    }}
    onLose={() => setScreen("results")}
  />

  // Results screen
  const Results = () => <WordleResults
    onReplay={() => setScreen("game")}
    onMenu={() => setScreen("menu")}
  />

  // Return wordle
  return (
    <Immersion mobileMode={mobileMode} darkMode={darkMode} leaveActivities={leaveActivities}>
      <div style={outerContainer}>
        {screen === "menu"     && <Menu/>}
        {screen === "daily"    && <Daily/>}
        {screen === "random"   && <Random/>}
        {screen === "results"  && <Results/>}
        {screen === "settings" && <Settings/>}
      </div>
    </Immersion>
  );
}

/**
 * Wordle game screen
 * @param {string} word the target word to guess
 * @param {string} hint clue displayed to the user
 * @param {function} onEnd callback when the game ends, called with true if won, false if lost
 * @param {number} numLetters number of columns in the grid (default 10)
 * @param {number} numGuesses number of allowed guesses (default 6)
 * @returns wordle game screen object
 */
const WordleGame = ({ word, hint, onEnd, numLetters = 10, numGuesses = 6 }) => {

  const PADDING = window.innerWidth * 0.05; // 5% of screen width
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

  // Refs to avoid stale closures
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

  // Inject animations
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
        white-space: nowrap;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // CSS variables for sizing
  const maxWidth = parseInt(MAX_WIDTH);
  useEffect(() => {
    const compute = () => {
      const available = Math.min(window.innerWidth, maxWidth) - PADDING * 2;
      const letterPx = available / (numLetters * 1.1);
      const keyPx = available / 12;
      document.documentElement.style.setProperty("--letter-size", `${letterPx}px`);
      document.documentElement.style.setProperty("--key-size", `${keyPx}px`);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, [numLetters, maxWidth]);

  // Colours
  const COLOUR_PRIORITY = { "#538d4e": 2, "#b59f3b": 1, "#3a3a3c": 0 };
  const KEY_COLOUR_MAP = {
    "#538d4e": "rgba(83, 141, 78, 0.8)",
    "#b59f3b": "rgba(181, 159, 59, 0.8)",
    "#3a3a3c": "rgba(58, 58, 60, 0.8)",
  };

  // Show popup
  const showPopup = (message) => {
    setPopupMessage(message);
    setPopupVisible(false);
    setTimeout(() => {
      setPopupVisible(true);
      setTimeout(() => setPopupVisible(false), 5000);
    }, 10);
  };

  // Shake a row
  const shakeRow = (row) => {
    setShakenRow(row);
    setTimeout(() => setShakenRow(null), 400);
  };

  // Validate word against dictionary API
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

  // Submit guess
  const submitGuess = async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;

    const row = currentRowRef.current;
    const wl = wordLengthRef.current;
    const guess = guessesRef.current[row].filter(l => l !== "");

    const valid = await validateWord(guess.join(""));
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

    // Initial pass — all gray
    for (let i = 0; i < numLetters; i++) {
      newColours[row][i] = "#3a3a3c";
    }

    // Green pass — only within word length
    guess.forEach((letter, i) => {
      if (i < wl && letter === wordArr[i]) {
        newColours[row][i] = "#538d4e";
        used[i] = true;
      }
    });

    // Yellow / gray pass — all typed letters
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

    // Update key colours
    setKeyColours(prev => {
      const next = { ...prev };
      guess.forEach((letter, i) => {
        const gridColour = newColours[row][i];
        const newKeyColour = KEY_COLOUR_MAP[gridColour];
        const existing = next[letter];
        if (!existing || COLOUR_PRIORITY[gridColour] > COLOUR_PRIORITY[existing]) {
          next[letter] = newKeyColour;
        }
      });
      return next;
    });

    const won = guess.length === wl && guess.join("") === word;
    if (won || row + 1 >= numGuesses) {
      setGameOver(true);
      gameOverRef.current = true;
      setTimeout(() => onEnd(won), 1000);
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

  // Handle key
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

  // Physical keyboard
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

  // Keyboard rows
  const keyboardRows = [
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["ENTER","Z","X","C","V","B","N","M","BACKSPACE"],
  ];

  // Styles
  const colContainer = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "4vh",
    height: "100%",
    padding: `2rem ${PADDING}px`,
  };
  const titleStyle = {
    fontWeight: 700,
    fontSize: "3rem",
    color: "var(--colour-6)",
    textAlign: "center",
  };
  const hintStyle = {
    fontWeight: 500,
    fontSize: "1.4rem",
    color: "var(--colour-5)",
    textAlign: "center",
    maxWidth: "30rem",
    marginTop: "1rem",
  };
  const gridStyle = {
    display: "grid",
    gridTemplateColumns: `repeat(${numLetters}, var(--letter-size))`,
    gap: "calc(var(--letter-size) * 0.1)",
  };
  const letterStyle = (row, col) => {
    const bg = colours[row][col] !== "transparent"
      ? colours[row][col]
      : "var(--colour-2)";
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
    marginBottom: "4rem",
  };
  const keyRowStyle = {
    display: "flex",
    flexDirection: "row",
    gap: "calc(var(--key-size) * 0.15)",
  };
  const keyStyle = (key) => {
    const guessedColour = keyColours[key];
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

  const onPressLetter = (key) => {
    setPressedKey(key);
    handleKey(key);
  };

  return (
    <div style={colContainer}>
      {popupVisible && <div className="popup">{popupMessage}</div>}
      <div>
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

// Wordle Settings Screen
const WordleSettings = ({ onWin, onLose }) => (
  <div>Settings</div>
);

// Wordle Results Screen
const WordleResults = ({ onReplay, onMenu }) => (
  <div>
    <button onClick={onReplay}>Play again</button>
    <button onClick={onMenu}>Menu</button>
  </div>
);