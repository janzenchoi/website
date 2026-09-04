import { FOOTER_HEIGHT } from "../helper/constant";
import { textStyle } from "./content/Card";

/**
 * Fixed footer
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @returns fixed footer object
 */
export const Footer = ({ mobileMode }) => {

  // Footer style
  const footerStyle = {
    height: FOOTER_HEIGHT,
    width: "100%",
    backgroundColor: "var(--colour-0)",
    transition: "background-color 0.3s ease",
    boxShadow: "0 0px 2px var(--colour-5)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  };
  const innerContainer = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };

  // Return header object
  return (
    <div style={footerStyle}>
      <div style={{ ...textStyle, ...innerContainer, color: "var(--colour-4)" }}>
        Last updated in September 2026
      </div>
    </div>
  );
};
