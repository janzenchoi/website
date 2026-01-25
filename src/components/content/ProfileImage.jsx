import profileLightImage from "../../assets/profile_light_far.png";
import profileDarkImage from "../../assets/profile_dark_far.png";

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
    borderRadius: "4px",
    overflow: "hidden",
    flexShrink: 0,
  };
  const imageStyle = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "65% 30%",
    transition: "opacity 0.3s ease"
  };

  // Return image object
  return (
    <div style={imageContainerStyle}>
      <img src={profileDarkImage}  style={{ ...imageStyle, opacity: darkMode ? 1 : 0}}/>
      <img src={profileLightImage} style={{ ...imageStyle, opacity: !darkMode ? 1 : 0}}/>
    </div>
  );
}