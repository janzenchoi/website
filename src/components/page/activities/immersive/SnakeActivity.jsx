import { ImmersiveBullet } from "../../../content/ImmersiveBullet";
import image from "../../../../assets/activities/snake_icon.png";

/**
 * Snake activity card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @param {*} activityController controller for activities
 * @returns Snake activity card object
 */
export const SnakeActivity = ({ mobileMode, darkMode, activityController }) => {
  
  // Constants
  const title = "Snake Game";
  const subtitle = "Play a Janzen-ified snake game";
  
  // Render
  return (
    <ImmersiveBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      status={activityController.status}
      setStatus={activityController.setStatus}
      setActivity={activityController.setSnakeExists}
      title={title}
      subtitle={subtitle}
      iconLight={image}
      iconDark={image}
    />
  );
}