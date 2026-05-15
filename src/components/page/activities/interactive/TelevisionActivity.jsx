import { ActivityBullet } from "../../../content/ActivityBullet";
import image from "../../../../assets/stuff/tv_icon.png";

/**
 * Television activity card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @param {*} activityController controller for activities
 * @returns television activity card object
 */
export const TelevisionActivity = ({ mobileMode, darkMode, activityController }) => {
  
  // Constants
  const title = "Television";
  const subtitle = "Watch some normal TV";
  const mobileDescription = [
    "Drag the right edge of the television with a finger to move it",
    "Tap the television screen to turn it on",
    "Once on, tap the screen again to change channels",
  ];
  const desktopDescription = [
    "Drag the right edge of the television with the cursor to move it",
    "Click the television screen to turn it on",
    "Once on, click the screen again to change channels",
  ];

  // Render
  return (
    <ActivityBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      status={activityController.status}
      setStatus={activityController.setStatus}
      setActivity={activityController.setTelevisionExists}
      title={title}
      subtitle={subtitle}
      description={mobileMode ? mobileDescription : desktopDescription}
      iconLight={image}
      iconDark={image}
    />
  );
}