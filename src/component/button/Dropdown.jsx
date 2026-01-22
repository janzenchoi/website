import { useRef, useEffect } from "react";

/**
 * Controlled dropdown menu
 * @param {boolean} open whether dropdown is open
 * @param {function} onClose function to call when clicked outside
 * @param {*} ignoreRefs areas to include as 'inside'
 * @param {*} children menu items
 */
export const Dropdown = ({ open, onClose, children, ignoreRefs=[] }) => {
  const dropdownRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const clickOutsideHandler = (e) => {
      const clickedInsideDropdown = dropdownRef.current?.contains(e.target);
      const clickedInsideIgnored = ignoreRefs.some(ref => ref.current?.contains(e.target));
      if (!clickedInsideDropdown && !clickedInsideIgnored)
        onClose();
    };
    document.addEventListener("mousedown", clickOutsideHandler);
    return () => document.removeEventListener("mousedown", clickOutsideHandler);
  }, [onClose, ignoreRefs]);

  // Dropdown arrow style
  const triangleStyle = {
    position: "absolute",
    top: "-8px",
    right: "4px",
    width: 0,
    height: 0,
    borderLeft: "9px solid transparent",
    borderRight: "9px solid transparent",
    borderBottom: "9px solid var(--colour-2)",
    filter: "drop-shadow(0 -2px 1px var(--colour-3))",
  };

  // Dropdown menu style
  const menuStyle = {
    position: "absolute",
    top: "16px",
    right: 0,
    display: open ? "flex" : "none",
    flexDirection: "column",
    justifyContent: "center",
    padding: "8px 12px",
    backgroundColor: "var(--colour-2)",
    borderRadius: "4px",
    boxShadow: "0 0 3px var(--colour-4)",
    zIndex: 1000,
    opacity: open ? 1 : 0,
    pointerEvents: open ? "auto" : "none",
    transition: "opacity 0.2s ease",
    minWidth: "200px",
  };

  // Returns the dropdown menu
  return (
    <div ref={dropdownRef} style={{ position: "relative" }}>
      <div style={menuStyle}>
        <div style={triangleStyle} />
        {children}
      </div>
    </div>
  );
};

// Define style for the dropdown menu item
export const dropdownItemStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  padding: "0px 4px 0px 4px",
  width: "100%",
  height: "30px",
};

// Define style for the dropdown menu divider
export const dropdownDividerStyle = {
  width: "100%",
  height: "1px",
  margin: "8px 0px 8px 0px",
  boxShadow: "0 1px 4px var(--colour-3)",
  backgroundColor: "var(--colour-4)",
  opacity: 0.8,
};
