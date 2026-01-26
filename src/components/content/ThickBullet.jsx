import { useState } from "react";
import { titleStyle, subtitleStyle, textStyle, horizontalDividerStyle } from "./Card.jsx";

/**
 * Thick bullet point
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @param {string} iconLight bullet icon in light mode
 * @param {string} iconDark bullet icon in dark mode
 * @param {string} title bullet title
 * @param {string} subtitle bullet subtitle
 * @param {string[]} description bullet subtext
 * @param {string} dateStart starting date
 * @param {string} dateEnd ending date
 * @returns thick bullet object
 */
export const ThickBullet = ({ mobileMode, darkMode, iconLight, iconDark, title, subtitle, description="", dateStart="", dateEnd="" }) => {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);

  // Auxiliary
  const dateText = Boolean(dateStart) || Boolean(dateEnd)
  ? mobileMode
    ? `(${[dateStart, dateEnd].filter(Boolean).join(" - ")})`
    : `${[dateStart, dateEnd].filter(Boolean).join(" - ")}`
  : "";
  const icon = darkMode ? iconDark : iconLight;

  // Container styles
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
    backgroundColor: "var(--colour-3)",
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
  const arrowStyle = {
    marginRight: "0.4rem",
    marginBottom: "0.4rem",
    width: "5px",
    height: "5px",
    display: "inline-block",
    borderLeft: "2px solid currentColor",
    borderBottom: "2px solid currentColor",
    transformOrigin: "50% 70%",
    transition: "transform 0.3s ease",
    transform: open ? "scaleX(-1) rotate(135deg)" : "rotate(-45deg)",
    position: "absolute",
    color: "var(--colour-6)",
    bottom: 0,
    right: 0
  };
  const dividerStyle = {
    ...horizontalDividerStyle,
    marginTop: "0.4rem",
    marginBottom: "0.2rem",
  };

  // For additional description
  const AdditionalDescription = () => {
    return (
      <div>
        {description.map((text, idx) => (
          <div key={idx}>
            <div style={dividerStyle}/>
            <div style={textStyle}>{text}</div>
          </div>
        ))}
      </div>
    );
  };

  // Mobile bullet object
  const MobileBullet = () => {
    return (
      <div
        style={outerContainer}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        onClick={() => setOpen(!open)}
      >
        <img style={imageContainer} src={icon}/>
        <div style={textContainer}>
          <div style={{ ...titleStyle, textAlign: "start" }}>{title}</div>
          <div style={{ ...subtitleStyle, textAlign: "start" }}>{subtitle}</div>
          <div style={dateContainer}>{dateText}</div>
          {open && <AdditionalDescription/>}
        </div>
        <div style={{ position: "relative", width: "0.4rem" }}>
          <div style={arrowStyle}/>
        </div>
      </div>
    );
  };

  // Desktop bullet object
  const DesktopBullet = () => {
    return (
      <div
        style={outerContainer}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        onClick={() => setOpen(!open)}
      >
        <img style={imageContainer} src={icon}/>
        <div style={textContainer}>
          <div style={{ ...titleStyle, textAlign: "start" }}>{title}</div>
          <div style={{ ...subtitleStyle, textAlign: "start" }}>{subtitle}</div>
          {open && <AdditionalDescription/>}
        </div>
        <div style={{ position: "relative" }}>
          <div style={dateContainer}>{dateText}</div>
          <div style={arrowStyle}/>
        </div>
      </div>
    );
  };

  // Return bullet object
  return (mobileMode ? <MobileBullet/> : <DesktopBullet/>);
}
