import { FOOTER_HEIGHT } from "../helper/constant";

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
    backgroundColor: "var(--colour-1)",
    transition: "background-color 0.3s ease",
    // boxShadow: "0 0px 2px var(--colour-5)",
  };

  // Return header object
  return (
    <div style={footerStyle}>
    </div>
  );
};
