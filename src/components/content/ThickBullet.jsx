import { useState } from "react";
import { titleStyle, textStyle } from "./Card.jsx";

/**
 * Thick bullet point
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @param {string} iconLight bullet icon in light mode
 * @param {string} iconDark bullet icon in dark mode
 * @param {string} title bullet title
 * @param {string} text bullet text
 * @param {string} subtext bullet subtext
 * @param {string} dateStart starting date
 * @param {string} dateEnd ending date
 * @returns thick bullet object
 */
export const ThickBullet = ({ mobileMode, darkMode, iconLight, iconDark, title, text, subtext, dateStart, dateEnd }) => {
  const [hover, setHover] = useState(false);

  // Auxiliary
  const dateText = mobileMode ? `(${dateStart} - ${dateEnd})` : `${dateStart} - ${dateEnd}`;

  // Container styles
  const icon = darkMode ? iconDark : iconLight;
  const outerContainer = {
    padding: "0.4rem",
    width: "calc(100% - 1rem)",
    display: "flex",
    flexDirection: "row",
    backgroundColor: hover ? "var(--colour-1)" : "var(--colour-0)",
    transition: "background-color 0.2s ease",
    cursor: "pointer",
    gap: "1rem",
  };
  const imageContainer = {
    height: "4.5rem",
    width: "4.5rem",
    borderRadius: "8px",
  };
  const textContainer = {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    flex: 1,
  };
  const dateContainer = {
    ...textStyle,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  };

  // Mobile bullet object
  const MobileBullet = () => {
    return (
      <div style={outerContainer} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        <img style={imageContainer} src={icon}/>
        <div style={textContainer}>
          <div style={{ ...titleStyle, textAlign: "start" }}>{title}</div>
          <div style={{ ...textStyle, textAlign: "start" }}>{text}</div>
          <div style={dateContainer}>{dateText}</div>
        </div>
      </div>
    );
  };

  // Desktop bullet object
  const DesktopBullet = () => {
    return (
      <div style={outerContainer} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <img style={imageContainer} src={icon}/>
        <div style={textContainer}>
          <div style={{ ...titleStyle, textAlign: "start" }}>{title}</div>
          <div style={{ ...textStyle, textAlign: "start" }}>{text}</div>
        </div>
        <div style={dateContainer}>{dateText}</div>
      </div>
    );
  };

  // Return bullet object
  return (mobileMode ? <MobileBullet/> : <DesktopBullet/>);
}
