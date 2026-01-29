import { useState, useEffect } from "react";
import { SkillsCard } from "./SkillsCard";
import { EducationCard } from "./EducationCard";
import { ExperienceCard } from "./ExperienceCard";
import { AchievementsCard } from "./AchievementsCard";
import { PublicationsCard } from "./PublicationsCard";

/**
 * Home page
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} colourTheme the theme to colour the site
 * @returns home object
 */
export const Resume = ({ mobileMode, colourTheme }) => {

  // Monitor colour theme
  const [darkMode, setDarkMode] = useState(colourTheme === "dark");
  useEffect(() => {
    setDarkMode(colourTheme === "dark");
  }, [colourTheme]);

  // Return home object
  return (
    <div>
      <SkillsCard mobileMode={mobileMode} darkMode={darkMode}/>
      <EducationCard mobileMode={mobileMode} darkMode={darkMode}/>
      <ExperienceCard mobileMode={mobileMode} darkMode={darkMode}/>
      <AchievementsCard mobileMode={mobileMode} darkMode={darkMode}/>
      <PublicationsCard mobileMode={mobileMode} darkMode={darkMode}/>
    </div>
  );
}
