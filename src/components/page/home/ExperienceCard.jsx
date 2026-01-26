import { useState } from "react";
import { Card } from "../../content/Card";
import { ThickBullet } from "../../content/ThickBullet";
import { Expander } from "../../content/Expander";
import anlDark from "../../../assets/logo/anl_dark.png";
import anlLight from "../../../assets/logo/anl_light.png";
import anstoDark from "../../../assets/logo/ansto_dark.png";
import anstoLight from "../../../assets/logo/ansto_light.png";
import ms from "../../../assets/logo/ms.png";
import puDark from "../../../assets/logo/pu_dark.png";
import puLight from "../../../assets/logo/pu_light.png";
import seDark from "../../../assets/logo/se_dark.png";
import seLight from "../../../assets/logo/se_light.png";
import unswDark from "../../../assets/logo/unsw_dark.png";
import unswLight from "../../../assets/logo/unsw_light.png";

/**
 * Experience card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @returns experience card for mobile mode
 */
export const ExperienceCard = ({ mobileMode, darkMode }) => {
  const [open, setOpen] = useState(false);

  // Define bullets
  const Bullet1 = () => {
    return <ThickBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Australian Nuclear Science and Technology Organisation"}
      subtitle={"Student Researcher"}
      description={[
        "Hybrid (Sydney, Australia)",
        "Developed and calibrated materials models for predicting the the creep and tensile deformation behaviour of Alloy 617; the research was conducted as part of my Honours project and PhD candidature"
      ]}
      iconLight={anstoLight}
      iconDark={anstoDark}
      dateStart={"Dec 2020"}
      dateEnd={"Dec 2025"}
    />
  };
  const Bullet2 = () => {
    return <ThickBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Argonne National Laboratory"}
      subtitle={"Technical Research Aide"}
      description={[
        "On-Site (Chicago, America)",
        "Assisted with DOE-sponsored projects on modelling the deformation behaviour of Alloy 617 and 709"
      ]}
      iconLight={anlLight}
      iconDark={anlDark}
      dateStart={"Aug 2024"}
      dateEnd={"Oct 2024"}
    />
  };
  const Bullet3 = () => {
    return <ThickBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Mission Systems"}
      subtitle={"DevOps Engineer"}
      description={[
        "On-Site (Sydney, Australia)",
        "Maintained and upgraded Linux-based systems, with a primary focus on Ubuntu environments; helped maintain Jenkins pipelines and supported Blender-based workflows within production environments"
      ]}
      iconLight={ms}
      iconDark={ms}
      dateStart={"Nov 2022"}
      dateEnd={"Nov 2023"}
    />
  };
  const Bullet4 = () => {
    return <ThickBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Argonne National Laboratory"}
      subtitle={"Technical Research Aide"}
      description={[
        "On-Site (Chicago, America)",
        "Assisted with the development and calibration of physics-based models to predict the deformation behaviour of 316H steel"
      ]}
      iconLight={anlLight}
      iconDark={anlDark}
      dateStart={"Jun 2023"}
      dateEnd={"Sep 2023"}
    />
  };
  const Bullet5 = () => {
    return <ThickBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"University of New South Wales"}
      subtitle={"Course Demonstrator"}
      description={[
        "Hybrid (Sydney, Australia)",
        "Taught undergraduate students in DESN1000 (Introduction to Engineering Design and Innovation), MATH2089 (Numerical Methods and Statistics), and MTRN4010 (Advanced Autonomous Systems)"
      ]}
      iconLight={unswLight}
      iconDark={unswDark}
      dateStart={"Jan 2020"}
      dateEnd={"Nov 2022"}
    />
  };
  const Bullet6 = () => {
    return <ThickBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Self-employed"}
      subtitle={"Private Tutor"}
      description={[
        "On-Site (Sydney, Australia)",
        "Taught secondary students in Maths, Physics, and Engineering in preparation for the highschool certificate (HSC)"
      ]}
      iconLight={seLight}
      iconDark={seDark}
      dateStart={"Aug 2018"}
      dateEnd={"May 2022"}
    />
  };
  const Bullet7 = () => {
    return <ThickBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Pre-Uni College"}
      subtitle={"Primary School Tutor"}
      description={[
        "On-Site (Sydney, Australia)",
        "Taught primary students in English, Maths, and General Ability in preparation for the opportunity class (OC) and selective tests"
      ]}
      iconLight={puLight}
      iconDark={puDark}
      dateStart={"Jun 2018"}
      dateEnd={"Dec 2018"}
    />
  };

  // Return about card object
  return (
    <Card title={"Experience"}>
      <div>
        <Bullet1/>
        <Bullet2/>
        <Bullet3/>
      </div>
      {open && <div>
        <Bullet4/>
        <Bullet5/>
        <Bullet6/>
        <Bullet7/>
      </div>}
      <Expander open={open} setOpen={setOpen}/>
    </Card>
  );
};
