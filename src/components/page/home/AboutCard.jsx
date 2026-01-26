import { ProfileImage } from "../../content/ProfileImage";
import { Card, titleStyle, textStyle } from "../../content/Card";

/**
 * About card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @returns about card for mobile mode
 */
export const AboutCard = ({ mobileMode, darkMode }) => {
  
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
