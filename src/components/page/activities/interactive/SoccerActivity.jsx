import { ActivityBullet } from "../../../content/ActivityBullet";
import image from "../../../../assets/stuff/ball_icon.png";

/**
 * Soccer activity card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @param {*} activityController controller for activities
 * @returns soccer activity card object
 */
export const SoccerActivity = ({ mobileMode, darkMode, activityController }) => {
  
  // Constants
  const title = "Soccer Ball";
  const subtitle = "Kick a bouncy ball around.";
  const mobileDescription = [
    "Drag the soccer ball with a finger to move it",
    "Swipe the soccer ball to launch it"
  ];
  const desktopDescription = [
    "Drag the soccer ball with the cursor to move it",
    "Flick the soccer ball to launch it"
  ];

  // Render
  return (
    <ActivityBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      status={activityController.status}
      setStatus={activityController.setStatus}
      setActivity={activityController.setBallExists}
      title={title}
      subtitle={subtitle}
      description={mobileMode ? mobileDescription : desktopDescription}
      iconLight={image}
      iconDark={image}
    />
  );
}