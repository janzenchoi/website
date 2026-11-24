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

  // Inner container
  const innerContainer = {
    width: "100%",
    maxWidth: MAX_WIDTH,
    minWidth: mobileMode ? "unset" : MIN_WIDTH,
    boxSizing: "border-box",
    backgroundColor: "var(--colour-0)",
  };

  // Return immersion space
  return (
    <div style={outerContainer}>
      <div style={innerContainer}>
        {children}
      </div>
    </div>
  );
}