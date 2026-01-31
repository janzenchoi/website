import { useState, useRef } from "react";
import { Dropdown } from "./Dropdown";

/**
 * Dropdown menu triggered by text
 * @param {String} text items of the dropdown
 * @param {*} style style for the text
 * @param {*} children items of the dropdown
 * @returns text-triggered dropdown menu
 */
export const TextDropdown = ({ text, style, children }) => {
  const [open, setOpen] = useState(false);
  const textRef = useRef(null);

  // Define styles
  const textStyle = {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
  };
  const arrowStyle = {
    marginLeft: "10px",
    marginRight: "-2px",
    width: "5px",
    height: "5px",
    display: "inline-block",
    borderLeft: "2px solid currentColor",
    borderBottom: "2px solid currentColor",
    transformOrigin: "50% 70%",
    transition: "transform 0.3s ease",
    transform: open ? "scaleX(-1) rotate(135deg)" : "rotate(-45deg)",
  };
  const dropdownStyle = {
    position: "absolute",
    right: "-10px",
  };

  // Return text dropdown object
  return (
    <div style={{ ...style, position: "relative", display: "inline-block" }}>
      <div ref={textRef} onClick={() => setOpen(!open)} style={textStyle}>
        <span>{text}</span>
        <span style={arrowStyle}></span>
      </div>
      <div style={dropdownStyle}>
        <Dropdown open={open} onClose={() => setOpen(false)} ignoreRefs={[textRef]}>
          {children}
        </Dropdown>
      </div>
    </div>
  );
};
