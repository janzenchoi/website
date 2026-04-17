import { Immersion } from "./Immersion";
import { GenericMenu } from "./Screen";
import { useState } from "react";

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
  const [score, setScore] = useState(0);

  // Wordle container
  const outerContainer = {
    width: "100%",
    height: "100vh",
    padding: "2rem",
    boxSizing: "border-box",
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
      { label: "Play Daily",  onClick: () => setScreen("game") },
      { label: "Play Random", onClick: () => setScreen("game") },
      { label: "Settings",    onClick: () => setScreen("settings") },
    ]}
  />

  // Game screen
  const Game = () => <WordleGame
    onWin={(s) => {
      setScore(s);
      setScreen("results");
    }}
    onLose={() => setScreen("results")}
  />

  // Results screen
  const Results = () => <WordleResults
    score={score}
    onReplay={() => setScreen("game")}
    onMenu={() => setScreen("menu")}
  />

  // Return wordle
  return (
    <Immersion mobileMode={mobileMode} darkMode={darkMode} leaveActivities={leaveActivities}>
      <div style={outerContainer}>
        {screen === "menu"    && <Menu/>}
        {screen === "game"    && <Game/>}
        {screen === "results" && <Results/>}
      </div>
    </Immersion>
  );
}

// Wordle Game Screen
const WordleGame = ({ onWin, onLose }) => (
  <div>Game</div>
);

// Wordle Results Screen
const WordleResults = ({ score, onReplay, onMenu }) => (
  <div>
    <p>Score: {score}</p>
    <button onClick={onReplay}>Play again</button>
    <button onClick={onMenu}>Menu</button>
  </div>
);