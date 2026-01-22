import { useState, useRef } from "react";
import { Dropdown } from "./Dropdown";

/**
 * Dropdown menu triggered by text
 * @param {String} text items of the dropdown
 * @param {*} style style for the text
 * @param {*} children items of the dropdown
 * @returns text-triggered dropdown menu
 */
const TextDropdown = ({ text, style, children }) => {
  const [open, setOpen] = useState(false);
  const textRef = useRef(null)

  // Return burger menu
  return (
    <div style={{ ...style, position: "relative", display: "inline-block" }}>
      <div onClick={() => {setOpen(!open)}} ref={textRef}>{text}</div>
      <Dropdown open={open} onClose={() => setOpen(false)} ignoreRefs={[textRef]}>
        {children}
      </Dropdown>
    </div>
  );
};

export default TextDropdown;
