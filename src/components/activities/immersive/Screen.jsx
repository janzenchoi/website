import { useState, useEffect } from "react";
import { CleanButton } from "../../content/CleanButton";

/**
 * Generic menu object for activities
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @param {String} title title of activity
 * @param {String} description description of activity
 * @param {string[]} icons list of icons to cycle through
 * @param {number} iconInterval milliseconds between icon changes
 * @param {{ label: string, onClick: function }[]} buttons list of buttons to show
 * @returns generic menu object
 */
export const GenericMenu = ({ mobileMode, darkMode, title, description, icons, iconInterval=1000, buttons }) => {

  const [iconIndex, setIconIndex] = useState(0);

  // For moving the icon image
  useEffect(() => {
    if (!icons || icons.length <= 1) return;
    const interval = setInterval(() => {
      setIconIndex((prev) => (prev + 1) % icons.length);
    }, iconInterval);
    return () => clearInterval(interval);
  }, [icons, iconInterval]);

  // Text styles
  const titleStyle = {
    fontWeight: 700,
    fontSize: "3rem",
    color: "var(--colour-6)",
    textAlign: "center",
  };
  const authorStyle = {
    fontWeight: 500,
    fontSize: "1.5rem",
    color: "var(--colour-6)",
    textAlign: "center",
  }
  const descriptionStyle = {
    fontWeight: 400,
    fontSize: "1.4rem",
    color: "var(--colour-5)",
    textAlign: "center",
  };

  // Image
  const imageStyle = {
    maxWidth: "16rem",
    maxHeight: "16rem",
    height: "auto",
  };

  // Containers
  const rowContainer = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  };
  const colContainer = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  };
  const outerContainer = {
    ...rowContainer,
    alignItems: "center",
    height: "100vh",
  };
  const innerContainer = {
    ...colContainer,
    gap: "3rem",
  };

  // Return menu
  return (
    <div style={outerContainer}>
      <div style={innerContainer}>
        <div>
          <div style={titleStyle}>{title ?? "NO TITLE"}</div>
          <div style={authorStyle}>{"(by Janzen)"}</div>
        </div>
        <div style={rowContainer}>
          {icons?.length > 0 && (
            <img style={imageStyle} src={icons[iconIndex]} alt="Icon" />
          )}
        </div>
        <div style={descriptionStyle}>{description ?? "NO DESCRIPTION"}</div>
        <div style={{ ...colContainer, gap: "1rem" }}>
          {buttons.map(({ label, onClick }) => (
            <CleanButton key={label} text={label} onClick={onClick}/>
          ))}
        </div>
      </div>
    </div>
  );
};