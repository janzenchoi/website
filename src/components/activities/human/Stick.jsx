import React from "react";

/**
 * A stick with optional image and child sticks.
 * All children render below the parent (stick + image).
 * 
 * @param {number} length length of the stick
 * @param {number} rotation rotation in degrees
 * @param {JSX.Element} image optional <img /> element
 * @param {{x:number,y:number,r:number}} imageOffset offset for the image, r is rotation in degrees
 * @param {JSX.Element[]} children child sticks
 * @param {number[]} childAxes array of distances from the start of the stick for each child's pivot
 * @param {number} zIndex base z-index of the stick container
 * @param {boolean} debug show pivot points
 */
export const Stick = ({
  length = 100,
  rotation = 0,
  image = null,
  imageOffset = { x: 0, y: 0, r: 0 },
  children = [],
  childAxes = [],
  zIndex = 1000,
  debug = true,
}) => {
  // Container
  const containerStyle = {
    position: "absolute",
    left: 0,
    top: 0,
    transformOrigin: "0 50%",
    transform: `rotate(${rotation}deg)`,
    pointerEvents: "auto",
    zIndex,
  };

  // Stick line
  const stickStyle = {
    width: `${length}px`,
    height: "1px",
    backgroundColor: debug ? "red" : "transparent",
    position: "relative",
    overflow: "visible",
    zIndex: zIndex+100,
  };

  // Image wrapper
  const imageWrapperStyle = {
    position: "absolute",
    left: imageOffset.x,
    top: imageOffset.y,
    transformOrigin: "center",
    transform: `rotate(${imageOffset.r || 0}deg)`,
    pointerEvents: "none",
  };

  // Debug pivot circles
  const pivotStyle = (color) => ({
    position: "absolute",
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: color,
    top: "-3.5px",
    zIndex: zIndex+100,
  });

  // Render children elements BELOW parent
  const childrenElements = React.Children.map(children, (child, index) => {
    const axis = childAxes[index] ?? length;
    return (
      <div
        style={{
          position: "absolute",
          left: `${axis}px`,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      >
        {child}
      </div>
    );
  });

  return (
    <div style={containerStyle}>
      {/* Children BELOW parent */}
      {childrenElements}

      {/* Stick line */}
      <div style={stickStyle}>
        {debug && (
          <>
            <div style={{ ...pivotStyle("blue"), left: 0 }} />
            <div style={{ ...pivotStyle("green"), left: `${length}px` }} />
          </>
        )}
      </div>

      {/* Parent image */}
      {image && <div style={imageWrapperStyle}>{image}</div>}
    </div>
  );
};
