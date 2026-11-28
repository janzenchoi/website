import { useState, useEffect } from "react";
import profileLightImage from "../../assets/janzen/profile_light.png";
import profileDark1 from "../../assets/janzen/profile_dark_1.png";
import profileDark2 from "../../assets/janzen/profile_dark_2.png";
import profileDark3 from "../../assets/janzen/profile_dark_3.png";
import profileDark4 from "../../assets/janzen/profile_dark_4.png";

// Dark mode images with relative weights (higher = more likely)
const darkImages = [
  { src: profileDark1, weight: 10 },
  { src: profileDark2, weight: 1 },
  { src: profileDark3, weight: 1 },
  { src: profileDark4, weight: 1 },
];

/**
 * Pick a dark image using weighted random selection
 * @returns {string} source of the selected image
 */
const pickWeightedDarkImage = () => {
  const totalWeight = darkImages.reduce((sum, img) => sum + img.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const img of darkImages) {
    roll -= img.weight;
    if (roll < 0) return img.src;
  }
  return darkImages[darkImages.length - 1].src; // fallback for rounding edge cases
};

/**
 * Profile image
 * @param {boolean} darkMode whether dark mode is used
 * @returns profile image object
 */
export const ProfileImage = ({ darkMode }) => {

  // Currently selected dark image
  const [darkImage, setDarkImage] = useState(pickWeightedDarkImage);

  // Pick a new dark image each time dark mode is switched on.
  // (Not re-picked when switching to light, so the fade-out keeps the same photo.)
  useEffect(() => {
    if (darkMode) setDarkImage(pickWeightedDarkImage());
  }, [darkMode]);

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
    transition: "opacity 0.3s ease",
  };

  // Return image object
  return (
    <div style={imageContainerStyle}>
      <img src={darkImage} style={{ ...imageStyle, opacity: darkMode ? 1 : 0 }} alt="Profile in dark mode" />
      <img src={profileLightImage} style={{ ...imageStyle, opacity: !darkMode ? 1 : 0 }} alt="Profile in light mode" />
    </div>
  );
};