import { useState, useEffect } from "react";
import { HashRouter } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useViewport } from "../helper/Viewport";
import { DEFAULT_MODE, HEADER_HEIGHT } from "../helper/constant";
import { getStoredValue } from "../helper/storage";
import { updateSafeAreaColour, blendSafeAreaColour } from "../helper/brightness";

import fg_dark from "../assets/janzen/fg_dark.png";
import fg_light from "../assets/janzen/fg_light.png";

import { Body } from "./Body";
import { Ball } from "./activities/Ball";
import { Character } from "./activities/human/Character";
import { TelevisionObject } from "./activities/TelevisionObject";

import { WordleImmersion } from "./activities/immersive/WordleImmersion";
import { SnakeImmersion } from "./activities/immersive/SnakeImmersion";

/**
 * Site
 * @returns site object
 */
export const Site = () => {
  
  // Deals with dark / light mode
  const [colourTheme, setColourTheme] = useState(() => {
    return getStoredValue("colour-theme") || DEFAULT_MODE;
  });

  // Deals with mobile / desktop state
  const { isMobile } = useViewport();
  const [ forceMobile, setForceMobile ] = useState(getStoredValue("force-mobile") === "true");
  const [ mobileMode, setMobileMode ] = useState(isMobile || forceMobile);
  useEffect(() => {
    setMobileMode(isMobile || forceMobile);
  }, [isMobile, forceMobile]);

  // Activities
  const [status, setStatus] = useState("none");
  const [ televisionExists, setTelevisionExists ] = useState(false);
  const [ ballExists, setBallExists ] = useState(false);
  const [ janzenExists, setJanzenExists ] = useState(false);
  const [ wordleExists, setWordleExists ] = useState(false);
  const [ snakeExists, setSnakeExists ] = useState(false);
  const activityController = {
    status,
    setStatus,
    setBallExists,
    setJanzenExists,
    setTelevisionExists,
    setWordleExists,
    setSnakeExists
  };

  // Function update safe area colour upon entering immersive activity
  useEffect(() => {
    if (wordleExists || snakeExists) {
      blendSafeAreaColour();
      document.body.style.overflow = "hidden"; // stops scrolling
    } else {
      updateSafeAreaColour();
      document.body.style.overflow = "";
    }
  }, [wordleExists, snakeExists]);

  // Function to leave all activities
  const leaveActivities = () => {
    setBallExists(false);
    setJanzenExists(false);
    setTelevisionExists(false);
    setWordleExists(false);
    setSnakeExists(false);
    setStatus("none");
  };

  // Define style for site
  const siteStyle = {
    backgroundColor: "var(--colour-0)",
    transition: "all 0.3s ease",
  };
  
  // FG object
  const FgObject = () => {
    const janzenFgStyle = {
      top: `calc(${HEADER_HEIGHT} - 42px)`,
      height: "40px",
      width: "auto",
      display: "block",
      position: "absolute",
      left: "calc(50% - 5rem)",
      zIndex: 10,
    };
    const fg_image = colourTheme === "dark" ? fg_dark : fg_light;
    return <img style={janzenFgStyle} src={fg_image} alt={"Janzen as a French girl"}/>;
  };

  // Close button shown while the ball, Janzen or television exists
  const CloseButton = () => {
    const closeButtonStyle = {
      position: "fixed",
      bottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)",
      left: "10px",
      width: "40px",
      height: "40px",
      padding: 0,
      boxSizing: "border-box",
      lineHeight: 0,
      borderRadius: "50%",
      border: "2px solid var(--red-1)",
      backgroundColor: "var(--colour-0)",
      cursor: "pointer",
      zIndex: 2000, // above the ball, Janzen and television (1000)
    };

    return <button
      type="button"
      style={closeButtonStyle}
      onClick={leaveActivities}
      aria-label="Close activities"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "block",
          margin: 0,
        }}
      >
        <path
          d="M3 3 L15 15 M15 3 L3 15"
          stroke="var(--red-1)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </button>;
  };

  const showCloseButton = ballExists || janzenExists || televisionExists;

  // Returns the site
  return <div style={siteStyle}>
    <HashRouter>
      <FgObject/>
      <Header
        mobileMode={mobileMode}
        forceMobile={forceMobile}
        setForceMobile={setForceMobile}
        colourTheme={colourTheme}
        setColourTheme={setColourTheme}
        />
      <div>
        <Body
          mobileMode={mobileMode}
          colourTheme={colourTheme}
          activityController={activityController}
        />
      </div>
      <Footer/>
      {ballExists && <Ball
        mobileMode={mobileMode}
        darkMode={colourTheme === "dark"}
        />}
      {janzenExists && <Character
        mobileMode={mobileMode}
        darkMode={colourTheme === "dark"}
        />}
      {televisionExists && <TelevisionObject
        mobileMode={mobileMode}
        darkMode={colourTheme === "dark"}
        />}
      {wordleExists && <WordleImmersion
        mobileMode={mobileMode}
        darkMode={colourTheme === "dark"} 
        leaveActivities={leaveActivities}
      />}
      {snakeExists && <SnakeImmersion
        mobileMode={mobileMode}
        darkMode={colourTheme === "dark"} 
        leaveActivities={leaveActivities}
      />}
      {showCloseButton && <CloseButton/>}
    </HashRouter>
  </div>
}