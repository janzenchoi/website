import { ActivityBullet } from "../../../content/ActivityBullet";
import image from "../../../../assets/stuff/janzen_icon.png";

/**
 * Janzen activity card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @param {*} activityController controller for activities
 * @returns janzen activity card object
 */
export const JanzenActivity = ({ mobileMode, darkMode, activityController }) => {
  
  // Constants
  const title = "Puppet";
  const subtitle = "Control a Janzen marionette";
  const mobileDescription = [
    "Hold and release Janzen to forcibly relocate him",
    "Move joystick left / right to walk left / right",
    "Move joystick upward /downward to jump / crouch",
    "Move joystick outside the dashed ring to sprint",
    "Drag the burger icon to relocate the joystick",
  ];
  const desktopDescription = [
    "Drag and release Janzen to forcibly relocate him",
    "Hold A / D to walk left / right",
    "Hold W / S to jump / crouch",
    "Hold SHIFT to sprint",
    "Press 2 to see what happens when Janzen receives a rejection email",
    // "Press 1-9 to emote."
  ];

  // Render
  return (
    <ActivityBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      status={activityController.status}
      setStatus={activityController.setStatus}
      setActivity={activityController.setJanzenExists}
      title={title}
      subtitle={subtitle}
      description={mobileMode ? mobileDescription : desktopDescription}
      iconLight={image}
      iconDark={image}
    />
  );
}