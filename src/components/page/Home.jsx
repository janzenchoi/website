import { useState, useEffect } from "react";
import { ProfileImage } from "../content/ProfileImage";
import { Card, textStyle } from "../content/Card";

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
      <AboutCard mobileMode={mobileMode} darkMode={darkMode}/>
      <Card title="Education">
        <div style={textStyle}>{lorem}</div>
      </Card>
      <Card title="Achievements">
        <div style={textStyle}>{lorem}</div>
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
      <Card title="Temp"><div style={textStyle}>{lorem}</div></Card>
      <Card title="Temp"><div style={textStyle}>{lorem}</div></Card>
      <Card title="Temp"><div style={textStyle}>{lorem}</div></Card>
      <Card title="Temp"><div style={textStyle}>{lorem}</div></Card>
    </div>
  );
}

/**
 * About card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @returns about card for mobile mode
 */
const AboutCard = ({ mobileMode, darkMode }) => {
  
  // Text
  const text1 = "Hello, I'm Janzen.";
  const text2 = "I'm a PhD-trained engineer with experience in machine learning, optimisation, and computational modelling.";
  const text3 = "I have decent programming skills (e.g., Bash, C, C++, Java, JavaScript, Python, SQL) and proficiency with a range of software tools (e.g., CAD, FEM, Microsoft Suite)."

  // Returns the desktop version
  const DesktopObject = () => {
    return <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
      <div style={{ display: "flex", flexDirection: "column", flex: "0 0 40%" }}>
        <ProfileImage darkMode={darkMode}/>
      </div>
      <div style={{ ...textStyle, display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ marginBottom: "0.8rem" }}>{text1}</div>
        <div style={{ marginBottom: "0.8rem", color: "var(--colour-4)" }}>{text2}</div>
        <div style={{ color: "var(--colour-4)" }}>{text3}</div>
      </div>
    </div>
  };

  // Returns the mobile version
  const MobileObject = () => {
    return <div style={{ ...textStyle, display: "flex", flexDirection: "column", gap: "0.8rem" }}>
      <div>{text1}</div>
      <div style={{ height: "320px" }}>
        <ProfileImage darkMode={darkMode}/>
      </div>
      <div style={{ color: "var(--colour-4)" }}>{text2}</div>
      <div style={{ color: "var(--colour-4)" }}>{text3}</div>
    </div>
  };

  // Return about card object
  return <Card title="About">
    {!mobileMode && <DesktopObject/>}
    {mobileMode && <MobileObject/>}
  </Card>
};


const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";