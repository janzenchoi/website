import { useState } from "react";
import { horizontalDividerStyle } from "../content/Card";

/**
 * A button to press to expand a list of thick bullets
 * @param {*} open whether to open the expander or not
 * @returns expander object
 */
export const Expander = ({ open, setOpen }) => {
  const [hover, setHover] = useState(false);

  // Styles
  const dividerStyle = {
    ...horizontalDividerStyle,
    marginTop: "0.4rem",
    marginBottom: "0.4rem",
  };
  const containerStyle = {
    width: "100%",
    height: "24px",
    backgroundColor: hover ? "var(--colour-1)" : "var(--colour-0)",
    marginBottom: "-0.6rem",
    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  };
  const arrowStyle = {
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
  };

  // Return expander object
  return (
    <div>
      <div style={dividerStyle}/>
      <div
        style={containerStyle}
        onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        onClick={() => setOpen(!open)}
      >
        <div style={arrowStyle}/>
      </div>
    </div>
  );
};
