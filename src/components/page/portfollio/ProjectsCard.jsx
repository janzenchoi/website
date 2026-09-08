import { Card } from "../../content/Card";
import { ProjectBullet } from "../../content/ProjectBullet";

import image5 from "../../../assets/projects/image_5.png";
import video4 from "../../../assets/projects/video_4.mp4";
import image3 from "../../../assets/projects/image_3.png";
import video2 from "../../../assets/projects/video_2.mp4";
import image1 from "../../../assets/projects/image_1.png";

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
        "Designed modular, low-cost prostheses with interchangeable modules to accommodate different activities and physical growth",
        "*Focused on research, model development (CAD), and testing of the knee-joint module in lower-limb prostheses",
        "*Produced reports and presentations for external stakeholders",
        "*Contributed to a working prototype through 3D printing",
      ]}
      image={image5}
      figureCaption={"Panel a) shows a 3D-printed model of an early design for the knee-joint module; panel b) shows a CAD of a later design for the knee-joint module; panel c) shows CAD variants of the assembled prostheses that include the developed knee-joint module."}
      figureMaxHeight={"160px"}
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
        "Conducted research on robotics, computer vision, and disaster response via underground autonomous vehicles (UAVs); founding member of UNSW's RoboCup@Rescue team",
        "*Composed comprehensive literature reviews on underground, aerial, and marine UAVs and their use across disaster scenarios",
        "*Tested computer vision models as part of the computer vision sub-team",
        "*Helped develop a navigation system using simultaneous localisation and mapping (SLAM), implemented in ROS and MATLAB",
        "*Authored foundational documentation to guide future cohorts",
      ]}
      video={video4}
      figureCaption={"Panel a) shows a computer vision model (YOLOv5) detecting human victims in a simulated environment, presenting a confidence percentage for each detected victim; panel b) shows a visualisation of the SLAM-based navigation algorithm in a simulated environment"}
      figureMaxHeight={"160px"}
      link={"www.unsw.edu.au/challeng/vertically-integrated-projects/explore-vertically-integrated-projects/ai-4-everyone"}
      date={"Dec 2020 - Dec 2021"}
    />
  };
  const Bullet3 = () => {
    return <ProjectBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"AIAA Design Build Fly"}
      subtitle={"ChallENG Aircraft Design Competition (~50 members)"}
      description={[
        "Participated in a university project for designing a competition remote-control aircraft tasked to transport payload figurines",
        "*Helped design and manufacture the mechanism for grabbing and securing the payload",
        "*Collaborated within a large, multi-disciplinary team spanning aerodynamics, structures, and electronics, coordinating across sub-teams to integrate components",
        "*Authored technical reports and presentations to satisfy competition documentation and stakeholder requirements",
      ]}
      image={image3}
      figureCaption={"Panel a) shows a payload figurine that was 3D printed for testing; panel b) shows the mechanism designed to secure the payload; panel c) shows the larger aircraft system that houses the payload components"}
      figureMaxHeight={"200px"}
      link={"www.unsw.edu.au/challeng/student-projects/explore-student-projects/aiaa-design-build-fly"}
      date={"Aug 2020 - Jun 2021"}
    />
  };
  const Bullet2 = () => {
    return <ProjectBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Coder One AI Sports Challenge"}
      subtitle={"AI Bot Competition (3 members)"}
      description={[
        "Competed in a multiplayer, turn-based strategy game using a self-programmed AI agent; team reached the semi-finals (8/16 teams)",
        "*Developed a reinforcement learning-based agent to compete against other teams' agents",
        "*Programmed the agent's decision-making logic in Python against Coder One's game engine",
        "*Designed objectives for navigation, hazard avoidance, and bomb placement",
      ]}
      video={video2}
      figureCaption={"Recording of the developed AI agent (represented by the wizard) competing against another team's agent (represented by the knight)"}
      figureMaxHeight={"200px"}
      link={"colab.research.google.com/drive/1M5-V9GR6FDWA8DrtK31HcHlCaPmw8rA6?usp=sharing&fbclid=IwY2xjawT0vk1wZG9mBWV4dG4DYWVtAjEwAGJyaWQRMVdzTTJiNVF1TGNnU2FVNVRzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEefYVwmF8zDwLfaFFTpScYnrSUV9dh1sCaPSQXNA0z-zcYyvh3Pi8YQS_TB0U_aem_3pdzvEpub-IGY1rnUDNxJQ#scrollTo=zhujRm4t6_wa"}
      date={"Nov 2020 - Dec 2020"}
    />
  };
  const Bullet1 = () => {
    return <ProjectBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"TEDI-London"}
      subtitle={"Product Design Program (7 members)"}
      description={[
        "Participated in a program for designing a dementia-care product",
        "*Designed mountable, triangular sensory (audio, visual, and tactile) tiles to support mood and engagement for people with dementia",
        "*Organised and managed workflows across design, research, and reporting",
        "*Authored reports and presentations to communicate decisions and progress to stakeholders",
        "*Contributed to a working prototype through 3D printing and laser cutting",
      ]}
      image={image1}
      figureCaption={"Panel a) shows a 3D-printed prototype of a tactile tile; panel b) shows an annotated diagram of an audio-visual tile; panel c) shows the electronic components developed for the audio-visual tile"}
      figureMaxHeight={"160px"}
      link={"www.science.unsw.edu.au/sites/default/files/documents/TEDI%20London%20Virtual%20Placement%20Term%202%202020_Faculty%20of%20Science%20Information%20Pack_Final.pdf"}
      date={"Apr 2020 - Aug 2020"}
    />
  };

  // Return about card object
  return (
    <Card mobileMode={mobileMode} title={"Projects"}>
      <Bullet5/>
      <Bullet4/>
      <Bullet3/>
      <Bullet2/>
      <Bullet1/>
    </Card>
  );
};