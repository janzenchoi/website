import { useState, useEffect } from "react";
import { Card, titleStyle } from "../../content/Card";
import { AboutCard } from "./AboutCard";
import { EducationCard } from "./EducationCard";
import { ExperienceCard } from "./ExperienceCard";
import { AchievementsCard } from "./AchievementsCard";

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
      <EducationCard mobileMode={mobileMode} darkMode={darkMode}/>
      <ExperienceCard mobileMode={mobileMode} darkMode={darkMode}/>
      <AchievementsCard mobileMode={mobileMode} darkMode={darkMode}/>

      <Card title="Projects">
        <div style={titleStyle}>{lorem}</div>
      </Card>
      <Card title="Contact">
        <div style={titleStyle}>{lorem}</div>
      </Card>
      <Card title="Temp"><div style={titleStyle}>{lorem}</div></Card>
      <Card title="Temp"><div style={titleStyle}>{lorem}</div></Card>
      <Card title="Temp"><div style={titleStyle}>{lorem}</div></Card>
      <Card title="Temp"><div style={titleStyle}>{lorem}</div></Card>
      <Card title="Temp"><div style={titleStyle}>{lorem}</div></Card>
      <Card title="Temp"><div style={titleStyle}>{lorem}</div></Card>
      <Card title="Temp"><div style={titleStyle}>{lorem}</div></Card>
      <Card title="Temp"><div style={titleStyle}>{lorem}</div></Card>
    </div>
  );
}

const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";