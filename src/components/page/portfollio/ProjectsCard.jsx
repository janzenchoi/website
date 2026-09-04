import { Card } from "../../content/Card";
import { ProjectBullet } from "../../content/ProjectBullet";

import image5 from "../../../assets/projects/image_5.png";
// import image4 from "../../../assets/projects/image_4.png";
// import image3 from "../../../assets/projects/image_3.png";
// import image2 from "../../../assets/projects/image_2.png";
// import image1 from "../../../assets/projects/image_1.png";

/**
 * Projects card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @returns projects card for mobile mode
 */
export const ProjectsCard = ({ mobileMode, darkMode }) => {

  // Define bullets
  const Bullet5 = () => {
    return <ProjectBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Project Prostheses"}
      subtitle={"Independent Student Project (10 members)"}
      description={[
        "Designed modular, low-cost prostheses with interchangeable modules to accommodate different activities and physical growth.",
        "*Focused on research, model development (CAD), and testing of the knee-joint module in lower-limb prostheses",
        "*Produced reports and presentations for external stakeholders",
        "*Contributed to a working prototype through 3D printing",
      ]}
      image={image5}
      imageCaption={"Panel a) shows a 3D-printed model of an early design for the knee-joint module while panel b) shows a CAD of the final design for the knee-joint module."}
      imageMaxHeight={"200px"}
      link={""}
      date={"Sep 2021 - Sep 2022"}
    />
  };
  const Bullet4 = () => {
    return <ProjectBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"AI 4 Everyone"}
      subtitle={"ChallENG Vertically Integrated Project (~30 members)"}
      description={[
        "Conducted research on robotics, computer vision, and disaster response via underground autonomous vehicles; founding member of UNSW's RoboCup@Rescue team",
        "*Composed comprehensive literature reviews on underground, aerial, and marine UAVs and their use across disaster scenarios",
        "*Helped develop a SLAM-based navigation system using ROS and MATLAB",
        "*Tested computer vision models (YOLO) via simulation as part of the computer vision sub-team",
        "*Authored foundational documentation to guide future cohorts",
      ]}
      image={image5}
      imageCaption={""}
      imageMaxHeight={"200px"}
      link={"www.unsw.edu.au/challeng/vertically-integrated-projects/explore-vertically-integrated-projects/ai-4-everyone"}
      date={"Dec 2020 - Dec 2021"}
    />
  };
  const Bullet3 = () => {
    return <ProjectBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"AIAA Design, Build, Fly"}
      subtitle={"ChallENG Aircraft Design Competition (~50 members)"}
      description={[
        "Participated in a university project for designing a competition remote-control aircraft tasked to transport payload figurines",
        "*Helped design and manufacture the mechanism for grabbing and securing the payload",
        "*Collaborated within a large, multi-disciplinary team spanning aerodynamics, structures, and electronics, coordinating across sub-teams to integrate components ",
        "*Authored technical reports and presentations to satisfy competition documentation and stakeholder requirements",
      ]}
      image={image5}
      imageCaption={""}
      imageMaxHeight={"200px"}
      link={""}
      date={""}
    />
  };
  const Bullet2 = () => {
    return <ProjectBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"AI 4 Everyone"}
      subtitle={"ChallENG Vertically Integrated Project (~30 members)"}
      description={[
        "",
      ]}
      image={image5}
      imageCaption={""}
      imageMaxHeight={"200px"}
      link={""}
      date={""}
    />
  };
  const Bullet1 = () => {
    return <ProjectBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"AI 4 Everyone"}
      subtitle={"ChallENG Vertically Integrated Project (~30 members)"}
      description={[
        "",
      ]}
      image={image5}
      imageCaption={""}
      imageMaxHeight={"200px"}
      link={""}
      date={""}
    />
  };

  // Return about card object
  return (
    <Card mobileMode={mobileMode} title={"Projects"}>
      <Bullet5/>
      <Bullet4/>
    </Card>
  );
};