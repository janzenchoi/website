import { useState, useEffect } from "react";
import { PublicationsCard } from "../portfollio/PublicationsCard";
import { ProjectsCard } from "../portfollio/ProjectsCard";

/**
 * Home page
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} colourTheme the theme to colour the site
 * @returns home object
 */
export const Portfollio = ({ mobileMode, colourTheme }) => {

  // Monitor colour theme
  const [darkMode, setDarkMode] = useState(colourTheme === "dark");
  useEffect(() => {
    setDarkMode(colourTheme === "dark");
  }, [colourTheme]);

  // Return home object
  return (
    <div>
      <PublicationsCard mobileMode={mobileMode} darkMode={darkMode}/>
      <ProjectsCard mobileMode={mobileMode} darkMode={darkMode}/>
    </div>
  );
}
