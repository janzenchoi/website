import profileLightImage from "../../assets/janzen/profile_light.png";
import profileDarkImage from "../../assets/janzen/profile_dark.png";

/**
 * Profile image
 * @param {boolean} darkMode whether dark mode is used
 * @returns profile image object
 */
export const ProfileImage = ({darkMode}) => {

  // Style of images
  const imageContainerStyle = {
    width: "100%",
    height: "100%",
    position: "relative",
    borderRadius: "8px",
    overflow: "hidden",
    flexShrink: 0,
  };
  const imageStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "50% 50%",
    transition: "opacity 0.3s ease"
  };

  // Return image object
  return (
    <div style={imageContainerStyle}>
      <img src={profileDarkImage}  style={{ ...imageStyle, opacity: darkMode ? 1 : 0}} alt={"Profie in dark mode"}/>
      <img src={profileLightImage} style={{ ...imageStyle, opacity: !darkMode ? 1 : 0}} alt={"Profie in light mode"}/>
    </div>
  );
}