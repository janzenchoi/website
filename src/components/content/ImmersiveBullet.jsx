import { useEffect, useState } from "react";
import { titleStyle, subtitleStyle, textStyle } from "./Card";

/**
 * Immersive bullet for the body
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @param {boolean} status defines the status of the activity
 * @param {function} setStatus sets the activity status
 * @param {function} setActivity function to start/stop the activity
 * @param {string} iconLight bullet icon in light mode
 * @param {string} iconDark bullet icon in dark mode
 * @param {string} title bullet title (must be unique)
 * @param {string} subtitle bullet subtitle
 * @returns activity bullet object
 */
export const ImmersiveBullet = ({
  mobileMode, darkMode, status, setStatus, setActivity,
  title, subtitle, iconLight, iconDark
}) => {

  // Play status
  const [hover, setHover] = useState(false);

  // Monitor activity status
  const isActive = status === title;
  useEffect(() => {if (!isActive) setActivity(false)}, [isActive, setActivity]);

  // Auxiliary
  const icon = darkMode ? iconDark : iconLight;
  const statusText = mobileMode
  ? (isActive ? "(currently running)" : "(click to start)")
  : (isActive
      ? (hover ? "Deactivate" : "Active")
      : (hover ? "Activate" : "Inactive")
    );

  // Starts and stops the activity
  const handleActivity = () => {
    if (isActive) {
      setActivity(false);
      setStatus("none");
    } else {
      setActivity(true);
      setStatus(title);
    };
  };

  // Container styles
  const outerContainer = {
    padding: mobileMode ? "0.3rem" : "0.4rem",
    marginBottom: "0.4rem",
    width: "calc(100% - 1rem)",
    display: "flex",
    flexDirection: "row",
    backgroundColor: hover ? "var(--colour-1)" : "transparent",
    cursor: "pointer",
    gap: mobileMode ? "0.8rem" : "1rem",
  };
  const imageContainer = {
    height: mobileMode ? "3rem" : "4.5rem",
    width: mobileMode ? "3rem" : "4.5rem",
    borderRadius: "8px",
    border: "1px solid var(--colour-4)",
    backgroundColor: "var(--colour-3)",
  };
  const textContainer = {
    display: "flex",
    marginTop: mobileMode ? "-0.2rem" : 0,
    flexDirection: "column",
    minWidth: 0,
    flex: 1,
  };
  const statusContainer = {
    ...textStyle,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  };

  // Mobile bullet
  const MobileBullet = () => {
    return (
      <div
        style={outerContainer}
        onClick={() => handleActivity()}
      >
        <img style={imageContainer} src={icon} alt="Icon for mobile mode"/>
        <div style={textContainer}>
          <div style={{ ...titleStyle, textAlign: "start" }}>{title}</div>
          <div style={{ ...subtitleStyle, textAlign: "start" }}>{subtitle}</div>
          <div style={statusContainer}>{statusText}</div>
        </div>
      </div>
    );
  };

  // Desktop bullet
  const DesktopBullet = () => {
    return (
      <div
        style={outerContainer}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => handleActivity()}
      >
        <img style={imageContainer} src={icon} alt="Icon for mobile mode"/>
        <div style={textContainer}>
          <div style={{ ...titleStyle, textAlign: "start" }}>{title}</div>
          <div style={{ ...subtitleStyle, textAlign: "start" }}>{subtitle}</div>
        </div>
        <div style={{ position: "relative" }}>
          <div style={statusContainer}>{statusText}</div>
        </div>
      </div>
    );
  };

  // Return bullet object
  return (mobileMode ? <MobileBullet/> : <DesktopBullet/>);
}
