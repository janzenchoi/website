import { Routes, Route } from "react-router-dom";
import { Home } from "./page/Home";
import { Template } from "./page/Template";
import { MAX_WIDTH } from "../helper/layout";

/**
 * The body of the page
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} colourTheme the theme to colour the site
 * @returns body object
 */
export const Body = ({ mobileMode, colourTheme }) => {

  // Main style for the body
  const outerStyle = {
    paddingTop: "var(--header-height)",
    width: "calc(100%)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    boxSizing: "border-box",
    backgroundColor: "var(--colour-1)",
    boxShadow: "0 0px 4px var(--colour-4)",
  }
  const innerStyle = {
    maxWidth: MAX_WIDTH,
    width: "100%",
    boxSizing: "border-box",
  };

  // Return body object
  return (
    <div style={outerStyle}>
      <div style={innerStyle}>
        <Routes>
          <Route path="/" element={<Home mobileMode={mobileMode} colourTheme={colourTheme}/>}/>
          <Route path="/template" element={<Template/>}/>
        </Routes>
      </div>
    </div>
  );
}