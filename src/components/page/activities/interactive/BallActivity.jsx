import { ActivityBullet } from "../../../content/ActivityBullet";
import image from "../../../../assets/stuff/ball_icon.png";

/**
 * Ball activity card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @param {*} activityController controller for activities
 * @returns Ball activity card object
 */
export const BallActivity = ({ mobileMode, darkMode, activityController }) => {
  
  // Constants
  const title = "Bouncy Ball";
  const subtitle = "Throw different bouncy balls around";
  const mobileDescription = [
    "Drag the ball with a finger to move it",
    "Swipe the ball to launch it",
    "The ball is randomised each time",
  ];
  const desktopDescription = [
    "Drag the ball with the cursor to move it",
    "Flick the ball to launch it",
    "The ball is randomised each time",
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