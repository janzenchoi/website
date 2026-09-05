import { useState } from "react";
import { titleStyle, subtitleStyle, textStyle, verticalDividerStyle } from "./Card";

/**
 * Project bullet point
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @param {string} title bullet title
 * @param {string} subtitle bullet subtitle
 * @param {string[]} description bullet subtext. Strings starting with "*" render as a bulleted line with a hanging indent.
 * @param {*} link link to publication
 * @param {*} downloadable file to download
 * @param {string} date date
 * @param {string} image optional image to show below the authors/subtitle
 * @param {string} imageCaption optional caption shown below the image
 * @returns project bullet object
 */
export const PublicationBullet = ({
  mobileMode,
  darkMode,
  title,
  subtitle,
  description = [],
  link = null,
  downloadable = null,
  date = "",
  image = null,
  imageCaption = "",
  imageMaxHeight = "240px"
}) => {
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);

  // Auxiliary
  const dateText = mobileMode ? `(${date})` : date;

  // Container styles
  const outerContainer = {
    padding: "0.4rem",
    marginBottom: open ? "0.4rem" : "0",
    width: "calc(100% - 1rem)",
    display: "flex",
    flexDirection: "row",
    backgroundColor: hover ? "var(--colour-1)" : "transparent",
    cursor: "pointer",
    gap: "1rem",
  };
  const textContainer = {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    flex: 1,
  };
  const dateContainer = {
    ...textStyle,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
  };
  const arrowStyle = {
    marginRight: "0.4rem",
    marginBottom: "0.4rem",
    width: "5px",
    height: "5px",
    display: "inline-block",
    borderLeft: "2px solid currentColor",
    borderBottom: "2px solid currentColor",
    transformOrigin: "50% 70%",
    transition: "transform 0.3s ease",
    transform: open ? "scaleX(-1) rotate(135deg)" : "rotate(-45deg)",
    position: "absolute",
    color: "var(--colour-6)",
    bottom: 0,
    right: 0
  };

  // Figure: white background + rounded corners wrap both the image and its caption
  const figureStyle = {
    margin: "0.6rem 0 0.4rem 0",
    padding: "0.4rem",
    backgroundColor: "#fff",
    border: "1px solid var(--colour-4)",
    borderRadius: "0.3rem",
    overflow: "hidden",
  };
  const imageContainerStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    lineHeight: 0, // extra safety net against the inline baseline gap
  };
  const imageStyle = {
    width: "auto",
    maxWidth: "100%",
    maxHeight: imageMaxHeight,
    objectFit: "contain",
    display: "block",
  };
  const imageCaptionStyle = {
    ...textStyle,
    fontSize: "0.8rem",
    fontStyle: "italic",
    opacity: 0.7,
    textAlign: mobileMode ? "start" : "justify",
    color: "#000",
  };

  // For hyperlinks
  const Hyperlink = () => {
    const fullLink = `https://${link}`;
    const hyperlinkStyle = {
      display: "flex",
      flexDirection: mobileMode ? "column" : "row",
      position: "relative",
      overflowWrap: "anywhere",
    };
    return (
      <div style={hyperlinkStyle}>
        {link !== "" && <a href={fullLink} target="_blank" rel="noopener noreferrer">
          <div style={{ ...textStyle, textDecoration: "underline" }}>{link}</div>
        </a>}
        {!mobileMode && link !== "" && <div style={{ width: "0.4rem" }}/>}
        {downloadable !== null && <a href={downloadable} download={"publication"}>
          <div style={{ ...textStyle, textDecoration: "underline" }}>(download)</div>
        </a>}
      </div>
    );
  };

  // For additional description
  const AdditionalDescription = () => {
    const descriptionStyle = {
      ...textStyle,
      marginTop: "0.4rem",
      textAlign: "justify",
    };
    const bulletLineStyle = {
      ...textStyle,
      marginTop: "0.4rem",
      textAlign: "justify",
      display: "flex",
      flexDirection: "row",
      alignItems: "flex-start",
    };
    const bulletMarkerStyle = {
      flexShrink: 0,
      width: "1.2rem",
    };
    const bulletTextStyle = {
      flex: 1,
      minWidth: 0,
    };

    // Renders a single description line (bullet or plain), preserving its
    // original index in `description` so bullet-run spacing stays correct
    // even though the first line renders above the image and the rest below.
    const renderLine = (text, idx) => {
      const isBullet = text.startsWith("*");
      const bodyText = isBullet ? text.slice(1).trimStart() : text;
      const prevIsBullet = idx > 0 && description[idx - 1].startsWith("*");

      if (isBullet) {
        const isFirstBullet = !prevIsBullet;
        return (
          <div
            key={idx}
            style={{ ...bulletLineStyle, marginTop: isFirstBullet ? "0.4rem" : 0 }}
          >
            <span style={bulletMarkerStyle}>•</span>
            <span style={bulletTextStyle}>{bodyText}</span>
          </div>
        );
      }

      return (
        <div key={idx}>
          <div style={descriptionStyle}>{bodyText}</div>
        </div>
      );
    };

    const [firstDescription, ...restDescription] = description;

    return (
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
        <div style={verticalDividerStyle}/>
        <div style={{ flex: 1, minWidth: 0 }}>
          {firstDescription !== undefined && renderLine(firstDescription, 0)}
          {image && (
            <figure style={figureStyle}>
              <div style={imageContainerStyle}>
                <img src={image} alt={title} style={imageStyle} />
              </div>
              {imageCaption && (
                <figcaption style={imageCaptionStyle}>{imageCaption}</figcaption>
              )}
            </figure>
          )}
          {restDescription.map((text, idx) => renderLine(text, idx + 1))}
          <div style={{ marginTop: "0.4rem" }}/>
          <Hyperlink/>
        </div>
      </div>
    );
  };

  // Mobile bullet object
  const MobileBullet = () => {
    return (
      <div
        style={outerContainer}
        onClick={() => setOpen(!open)}
      >
        <div style={textContainer}>
          <div style={{ ...titleStyle, fontSize: "1rem", textAlign: "start" }}>{title}</div>
          <div style={{ ...subtitleStyle, textAlign: "start" }}>{subtitle}</div>
          <div style={dateContainer}>{dateText}</div>
          {open && <AdditionalDescription/>}
        </div>
        <div style={{ position: "relative", width: "0.8rem" }}>
          <div style={arrowStyle}/>
        </div>
      </div>
    );
  };

  // Desktop bullet object
  const DesktopBullet = () => {
    return (
      <div
        style={outerContainer}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => setOpen(!open)}
      >
        <div style={textContainer}>
          <div style={{ ...titleStyle, textAlign: "start" }}>{title}</div>
          <div style={{ ...subtitleStyle, textAlign: "start" }}>{subtitle}</div>
          {open && <AdditionalDescription/>}
        </div>
        <div style={{ position: "relative" }}>
          <div style={dateContainer}>{dateText}</div>
          <div style={arrowStyle}/>
        </div>
      </div>
    );
  };

  // Return bullet object
  return (mobileMode ? <MobileBullet/> : <DesktopBullet/>);
}