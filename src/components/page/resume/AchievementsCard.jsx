import { useState } from "react";
import { Card } from "../../content/Card";
import { ThickBullet } from "../../content/ThickBullet";
import { Expander } from "../../content/Expander";
import unswDark from "../../../assets/logo/unsw_dark.png";
import unswLight from "../../../assets/logo/unsw_light.png";
import bssm from "../../../assets/logo/bssm.png";

/**
 * Achievement card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @returns achievement card for mobile mode
 */
export const AchievementsCard = ({ mobileMode, darkMode }) => {
  const [open, setOpen] = useState(false);

  // Define bullets
  const Bullet5 = () => {
    return <ThickBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"University of New South Wales"}
      subtitle={"The RS Components Prize for Engineering Excellence"}
      description={[
        "For the best performance in the final year of the undergraduate Mechatronic Engineering program"
      ]}
      iconLight={unswLight}
      iconDark={unswDark}
      dateStart={"Dec 2022"}
    />
  };
  const Bullet4 = () => {
    return <ThickBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"University of New South Wales"}
      subtitle={"University Medal in Mechatronic Engineering"}
      description={[
        "The University Medal is the most distinguished academic award to be bestowed on an undergraduate, and is recognition by the University of exceptional achievement"
      ]}
      iconLight={unswLight}
      iconDark={unswDark}
      dateStart={"Jun 2022"}
    />
  };
  const Bullet3 = () => {
    return <ThickBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"University of New South Wales"}
      subtitle={"Dean's Award (Stage 4)"}
      description={[
        "The UNSW Engineering Dean's Awards are designed to recognise the faculty's high-achieving students - those who have a minimum High Distinction average (an overall cumulative myUNSW WAM of 85)"
      ]}
      iconLight={unswLight}
      iconDark={unswDark}
      dateStart={"May 2022"}
    />
  };
  const Bullet2 = () => {
    return <ThickBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"British Society for Strain Measurement"}
      subtitle={"Young Stress Analyst 2021 Finalist"}
      description={[
        "The Young Stress Analyst competition is a prestigious competition run annually by the British Society for Strain Measurement, to recognise excellence in early career research"
      ]}
      iconLight={bssm}
      iconDark={bssm}
      dateStart={"Aug 2021"}
    />
  };
  const Bullet1 = () => {
    return <ThickBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"University of New South Wales"}
      subtitle={"Dean's Award (Stage 3)"}
      description={[
        "The UNSW Engineering Dean's Awards are designed to recognise the faculty's high-achieving students - those who have a minimum High Distinction average (an overall cumulative myUNSW WAM of 85)"
      ]}
      iconLight={unswLight}
      iconDark={unswDark}
      dateStart={"May 2021"}
    />
  };

  // Return about card object
  return (
    <Card title={"Achievements"}>
      <div>
        <Bullet5/>
        <Bullet4/>
        <Bullet3/>
      </div>
      {open && <div>
        <Bullet2/>
        <Bullet1/>
      </div>}
      <Expander open={open} setOpen={setOpen}/>
    </Card>
  );
};