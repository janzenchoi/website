import { useEffect, useState } from "react";
import { titleStyle, subtitleStyle, textStyle } from "./Card";

/**
 * Nice button
 * @param {string} text string to display on the button
 * @param {*} onClick handler function for the button
 * @returns clean button object
 */
export const CleanButton = ({ text, onClick }) => {

  // States
  const [hover, setHover] = useState(false);
  
  // Styles
  const containerStyle = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  };
  const buttonStyle = {
    ...titleStyle,
    width: "50%",
    borderRadius: "4px",
    padding: "1rem",
    border: "1px solid var(--colour-4)",
    boxShadow: "2px 2px 4px var(--colour-3)",
    backgroundColor: hover ? "var(--colour-1)" : "var(--colour-2)",
    textAlign: "center",
    cursor: "pointer",
  };

  // Return
  return (
    <div style={containerStyle}>
      <div
        style={buttonStyle}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => onClick()}
      >
        {text}
      </div>
    </div>
  );
}