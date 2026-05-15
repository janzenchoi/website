import { ImmersiveBullet } from "../../../content/ImmersiveBullet";
import image from "../../../../assets/stuff/wordle_icon.png";

/**
 * Wordle activity card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @param {*} activityController controller for activities
 * @returns wordle activity card object
 */
export const WordleActivity = ({ mobileMode, darkMode, activityController }) => {
  
  // Constants
  const title = "Wooordle";
  const subtitle = "Wordle but with longer words";
  
  // Render
  return (
    <ImmersiveBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      status={activityController.status}
      setStatus={activityController.setStatus}
      setActivity={activityController.setWordleExists}
      title={title}
      subtitle={subtitle}
      iconLight={image}
      iconDark={image}
    />
  );
}