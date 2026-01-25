import { Routes, Route } from "react-router-dom";
import { Home } from "./page/Home";
import { Template } from "./page/Template";
import { MAX_WIDTH } from "../helper/layout";

/**
 * The body of the page
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} colourTheme the theme to colour the site
 */
export const Body = ({ mobileMode, colourTheme }) => {

  // Container styles
  const outerStyle = {
    paddingTop: "var(--header-height)",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    boxSizing: "border-box",
    backgroundColor: "var(--colour-1)",
  };
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
          <Route path="/template" element={<Template mobileMode={mobileMode} colourTheme={colourTheme}/>}/>
        </Routes>
      </div>
    </div>
  );
};
