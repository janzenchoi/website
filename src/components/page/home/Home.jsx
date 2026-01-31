import { useState, useEffect } from "react";
import { AboutCard } from "./AboutCard";
import { ContactCard } from "./ContactCard";

/**
 * Home page
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} colourTheme the theme to colour the site
 * @returns home object
 */
export const Home = ({ mobileMode, colourTheme }) => {

  // Monitor colour theme
  const [darkMode, setDarkMode] = useState(colourTheme === "dark");
  useEffect(() => {
    setDarkMode(colourTheme === "dark");
  }, [colourTheme]);

  // Return home object
  return (
    <div>
      <AboutCard mobileMode={mobileMode} darkMode={darkMode}/>
      <ContactCard mobileMode={mobileMode} darkMode={darkMode}/>
    </div>
  );
}
