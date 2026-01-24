import { useState, useEffect } from "react";
import { ProfileImage } from "../content/ProfileImage";
import { Card, dividerStyle, textStyle } from "../content/Card";

/**
 * Home page
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} colourTheme the theme to colour the site
 * @returns home object
 */
export const Home = ({mobileMode, colourTheme}) => {

  // Monitor colour theme
  const [darkMode, setDarkMode] = useState(colourTheme === "dark");
  useEffect(() => {
    setDarkMode(colourTheme === "dark");
  }, [colourTheme]);

  // Return home object
  return (
    <div>
      <Card title="About">
        <ProfileImage toggle={darkMode}/>
      </Card>
      <Card title="Experience">
        <div style={textStyle}>{lorem}</div>
      </Card>
      <Card title="Projects">
        <div style={textStyle}>{lorem}</div>
      </Card>
      <Card title="Contact">
        <div style={textStyle}>{lorem}</div>
      </Card>
      <Card title="Temp"><div style={textStyle}>{lorem}</div></Card>
      <Card title="Temp"><div style={textStyle}>{lorem}</div></Card>
      <Card title="Temp"><div style={textStyle}>{lorem}</div></Card>
      <Card title="Temp"><div style={textStyle}>{lorem}</div></Card>
    </div>
  );
}

const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";