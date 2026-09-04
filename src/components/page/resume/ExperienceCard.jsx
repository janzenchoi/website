import { Card } from "../../content/Card";
import { IconBullet } from "../../content/IconBullet";
import seDark from "../../../assets/icon/se_dark.png";
import seLight from "../../../assets/icon/se_light.png";
import anlDark from "../../../assets/logo/anl_dark.png";
import anlLight from "../../../assets/logo/anl_light.png";
import anstoDark from "../../../assets/logo/ansto_dark.png";
import anstoLight from "../../../assets/logo/ansto_light.png";
import ms from "../../../assets/logo/ms.png";
import puDark from "../../../assets/logo/pu_dark.png";
import puLight from "../../../assets/logo/pu_light.png";
import unswDark from "../../../assets/logo/unsw_dark.png";
import unswLight from "../../../assets/logo/unsw_light.png";

/**
 * Experience card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @returns experience card for mobile mode
 */
export const ExperienceCard = ({ mobileMode, darkMode }) => {

  // Define bullets
  const Bullet7 = () => {
    return <IconBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Student Researcher"}
      subtitle={"Australian Nuclear Science and Technology Organisation"}
      description={[
        "Hybrid (Sydney, Australia)",
        "Developed models to predict material behaviour under extreme conditions; research was conducted as part of my Honours project and PhD candidature",
        "*Applied machine learning and optimisation techniques (e.g., genetic algorithms, surrogate modelling) to calibrate material models against experimental data",
        "*Presented research findings at meetings and conferences to internal and external stakeholders",
        "*Supported colleagues in their model development workflows",
        "*Co-authored three first-author peer-reviewed publications on modelling behaviour of Alloy 617"
      ]}
      iconLight={anstoLight}
      iconDark={anstoDark}
      dateStart={"Dec 2020"}
      dateEnd={"Dec 2025"}
    />
  };
  const Bullet6 = () => {
    return <IconBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Technical Research Aide"}
      subtitle={"Argonne National Laboratory"}
      description={[
        "On-Site (Chicago, America)",
        "Assisted with DOE-sponsored projects on modelling the deformation behaviour of Alloy 617 and 709",
        "*Built surrogate models using deep neural networks to reduce the evaluation of physics-based models from days to milliseconds",
        "*Developed crystal plasticity finite element method (CPFEM) models to capture the mesoscale behaviour of Alloy 617",
      ]}
      iconLight={anlLight}
      iconDark={anlDark}
      dateStart={"Aug 2024"}
      dateEnd={"Oct 2024"}
    />
  };
  const Bullet5 = () => {
    return <IconBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"DevOps Engineer"}
      subtitle={"Mission Systems"}
      description={[
        "On-Site (Sydney, Australia)",
        "Developed software to streamline the software development process",
        "*Designed and built a physical inventory tracking system from scratch, deployed in-house",
        "*Wrote automation scripts to streamline recurring operations tasks",
        "*Upgraded in-house codebase from Ubuntu 18.04 to 20.04",
        "*Helped build vehicle simulations in Blender to support internal workflows ",
        "*Maintained Jenkins pipelines and used Docker to support CI/CD",
      ]}
      iconLight={ms}
      iconDark={ms}
      dateStart={"Nov 2022"}
      dateEnd={"Nov 2023"}
    />
  };
  const Bullet4 = () => {
    return <IconBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Technical Research Aide"}
      subtitle={"Argonne National Laboratory"}
      description={[
        "On-Site (Chicago, America)",
        "Assisted with the development and calibration of physics-based models to predict the deformation behaviour of Alloy 617 and 316H steel",
        "*Developed elastic-viscoplastic models to simultaneously capture both creep and tensile behaviour of Alloy 617",
        "*Tested and contributed to NEML, Argonne's open-source material modelling codebase",
        "*Co-authored a peer-reviewed publication on the development of a mechanistic model for creep and thermal aging in Alloy 709"
      ]}
      iconLight={anlLight}
      iconDark={anlDark}
      dateStart={"Jun 2023"}
      dateEnd={"Sep 2023"}
    />
  };
  const Bullet3 = () => {
    return <IconBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Course Demonstrator"}
      subtitle={"University of New South Wales"}
      description={[
        "Hybrid (Sydney, Australia)",
        "Delivered labs, tutorials, and marking support across mechatronics, mathematics, and design engineering courses",
        "*Ran lab sessions and tutorials for MTRN4010 (Advanced Robotics), MATH2089 (Numerical Methods & Statistics), and DESN1000 (Introduction to Engineering Design)",
        "*Supported classes of up to 30 students, assisting with practical exercises and course material",
        "*Marked assignments and provided feedback to students",
      ]}
      iconLight={unswLight}
      iconDark={unswDark}
      dateStart={"Jan 2020"}
      dateEnd={"Nov 2022"}
    />
  };
  const Bullet2 = () => {
    return <IconBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Private Tutor"}
      subtitle={"Self-employed"}
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
  const Bullet1 = () => {
    return <IconBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Primary School Tutor"}
      subtitle={"Pre-Uni College"}
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
    <Card mobileMode={mobileMode} title={"Experience"}>
      <Bullet7/>
      <Bullet6/>
      <Bullet5/>
      <Bullet4/>
      <Bullet3/>
      <Bullet2/>
      <Bullet1/>
    </Card>
  );
};
