import { useState, useEffect } from "react";
import { ProfileImage } from "../content/ProfileImage";
import { Card, titleStyle, textStyle } from "../content/Card";
import { ThickBullet } from "../content/ThickBullet";
import unswLight from "../../assets/logo/unsw_light.png";
import unswDark from "../../assets/logo/unsw_dark.png";

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

      <Card title="Achievements">
        <div style={titleStyle}>{lorem}</div>
      </Card>
      <Card title="Experience">
        <div style={titleStyle}>{lorem}</div>
      </Card>
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

/**
 * About card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @returns about card for mobile mode
 */
const AboutCard = ({ mobileMode, darkMode }) => {
  
  // Text
  const text1 = "Hello, I'm Janzen.";
  const text2 = "I'm a PhD-trained engineer and programmer with experience in machine learning, optimisation, and computational modelling.";
  const text3 = "I have solid programming skills (e.g., Bash, C, C++, Java, JavaScript, Python, SQL) and proficiency with a range of software tools (e.g., CAD, FEM, MS Suite)."

  // Returns the desktop version
  const DesktopObject = () => {
    return <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
      <div style={{ display: "flex", flexDirection: "column", flex: "0 0 50%" }}>
        <ProfileImage darkMode={darkMode}/>
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ ...titleStyle, marginBottom: "0.8rem" }}>{text1}</div>
        <div style={{ ...textStyle, marginBottom: "0.8rem"  }}>{text2}</div>
        <div style={{ ...textStyle }}>{text3}</div>
      </div>
    </div>
  };

  // Returns the mobile version
  const MobileObject = () => {
    return <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
      <div style={titleStyle}>{text1}</div>
      <div style={{ height: "200px" }}>
        <ProfileImage darkMode={darkMode}/>
      </div>
      <div style={textStyle}>{text2}</div>
      <div style={textStyle}>{text3}</div>
    </div>
  };

  // Return about card object
  return <Card title="About">
    {!mobileMode && <DesktopObject/>}
    {mobileMode && <MobileObject/>}
  </Card>
};

/**
 * Education card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @returns education card for mobile mode
 */
const EducationCard = ({ mobileMode, darkMode }) => {

  // Define bullets
  const Bullet1 = () => {
    return <ThickBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"University of New South Wales"}
      text={"PhD in Mechanical Engineering"}
      iconLight={unswLight}
      iconDark={unswDark}
      dateStart={"May 2022"}
      dateEnd={"Dec 2025"}
    />
  }
  const Bullet2 = () => {
    return <ThickBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"University of New South Wales"}
      text={"Bachelor of Mechatronics Engineering (Honours)"}
      iconLight={unswLight}
      iconDark={unswDark}
      dateStart={"Feb 2018"}
      dateEnd={"May 2022"}
    />
  }
  const Bullet3 = () => {
    return <ThickBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"University of New South Wales"}
      text={"Bachelor of Computer Science"}
      iconLight={unswLight}
      iconDark={unswDark}
      dateStart={"Feb 2018"}
      dateEnd={"May 2022"}
    />
  }

  // Returns the desktop version
  const DesktopObject = () => {
    return <div>
      <Bullet1/>
      <Bullet2/>
      <Bullet3/>
    </div>
  };

  // Returns the mobile version
  const MobileObject = () => {
    return <div>
      <Bullet1/>
      <Bullet2/>
      <Bullet3/>
    </div>
  };

  // Return about card object
  return <Card title="Education">
    {!mobileMode && <DesktopObject/>}
    {mobileMode && <MobileObject/>}
  </Card>
};

const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";