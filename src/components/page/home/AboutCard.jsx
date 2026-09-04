import { ProfileImage } from "../../content/ProfileImage";
import { Card, titleStyle, textStyle } from "../../content/Card";

/**
 * About card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @returns about card
 */
export const AboutCard = ({ mobileMode, darkMode }) => {
  
  // Text
  const text1 = "Hello, I'm Janzen.";
  const text2 = "I am a recent PhD graduate whose research focused on applying machine learning and optimisation techniques to model material behaviour. I have strong programming skills (Bash, C, C++, Java, JavaScript, MATLAB, Python, SQL) and software proficiency (CAD, FEM, Microsoft Suite). I have worked as an academic tutor, student researcher, DevOps engineer, and research aide.";
  const text3 = "I currently seek employment.";

  // Text object
  const TextObject = () => {
    return <>
      <div style={titleStyle}>{text1}</div>
      <div style={textStyle}>{text2}</div>
      <div style={textStyle}>{text3}</div>
    </>
  };

  // Returns the desktop version
  const DesktopObject = () => {
    return <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
      <div style={{ display: "flex", flexDirection: "column", flex: "0 0 50%" }}>
        <ProfileImage darkMode={darkMode}/>
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "0.8rem" }}><TextObject/></div>
    </div>
  };

  // Returns the mobile version
  const MobileObject = () => {
    return <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
      <div style={titleStyle}>{text1}</div>
      <div style={{ height: "200px" }}>
        <ProfileImage darkMode={darkMode}/>
      </div>
      <TextObject/>
    </div>
  };

  // Return about card object
  return <Card mobileMode={mobileMode} title="About">
    {!mobileMode && <DesktopObject/>}
    {mobileMode && <MobileObject/>}
  </Card>
};
