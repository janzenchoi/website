import { MAX_WIDTH, MIN_WIDTH } from "../../../helper/constant";

/**
 * Immersion
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @param {function} leaveActivities leaves all activities
 * @returns immersion space object
 */
export const Immersion = ({ mobileMode, darkMode, leaveActivities, children }) => {

  // Container styles
  const outerContainer = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    zIndex: 9999,
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  // Close button
  const closeButton = {
    position: "absolute",
    top: "0.5rem",
    left: "1rem",
    background: "none",
    border: "none",
    color: "rgba(200, 200, 200, 0.8)",
    fontSize: "4rem",
    fontWeight: mobileMode ? 400 : 200,
    cursor: "pointer",
    lineHeight: 1,
    padding: 0,
  };

  // Inner container
  const innerContainer = {
    width: "100%",
    maxWidth: MAX_WIDTH,
    minWidth: mobileMode ? "unset" : MIN_WIDTH,
    boxSizing: "border-box",
    backgroundColor: "var(--colour-2)",
  };

  // Return immersion space
  return (
    <div style={outerContainer}>
      <button style={closeButton} onClick={leaveActivities}>×</button>
      <div style={innerContainer}>
        {children}
      </div>
    </div>
  );
}
