import { Card } from "../../content/Card";
import { ThickBullet } from "../../content/ThickBullet";
import unswDark from "../../../assets/logo/unsw_dark.png";
import unswLight from "../../../assets/logo/unsw_light.png";

/**
 * Education card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @returns education card for mobile mode
 */
export const EducationCard = ({ mobileMode, darkMode }) => {

  // Define bullets
  const Bullet1 = () => {
    return <ThickBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"University of New South Wales"}
      subtitle={"PhD in Mechanical Engineering"}
      description={[
        "Focused on applying machine learning and optimisation techniques to develop and calibrate material models for predicting the creep and tensile deformation behaviour of Alloy 617"
      ]}
      iconLight={unswLight}
      iconDark={unswDark}
      dateStart={"May 2022"}
      dateEnd={"Dec 2025"}
    />
  };
  const Bullet2 = () => {
    return <ThickBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"University of New South Wales"}
      subtitle={"Bachelor of Mechatronic Engineering (Honours)"}
      description={[
        "Graduated with First Class Honours and the University Medal (92HD)"
      ]}
      iconLight={unswLight}
      iconDark={unswDark}
      dateStart={"Feb 2018"}
      dateEnd={"May 2022"}
    />
  };
  const Bullet3 = () => {
    return <ThickBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"University of New South Wales"}
      subtitle={"Bachelor of Computer Science"}
      description={[
        "Graduated with Distinction (92HD)"
      ]}
      iconLight={unswLight}
      iconDark={unswDark}
      dateStart={"Feb 2018"}
      dateEnd={"May 2022"}
    />
  };

  // Return about card object
  return (
    <Card title={"Education"}>
      <Bullet1/>
      <Bullet2/>
      <Bullet3/>
    </Card>
  );
};