export const BasketBall = ({ size = 320 }) => {
  const lineThickness = size * 0.03;

  const ballStyle = {
    position: "relative",
    width: size,
    height: size,
    borderRadius: "50%",
    background: "radial-gradient(circle at center, #e65c00 0%, #803300 100%)",
    overflow: "hidden",
    boxShadow: `
      0 0 5px var(--colour-4),
      0 0 5px var(--colour-4),
      0 0 5px var(--colour-4)
    `,
  };

  const verticalLine = {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: "50%",
    width: lineThickness,
    backgroundColor: "#0d0d0d",
    transform: "translateX(-50%)",
  };

  const horizontalLine = {
    position: "absolute",
    left: 0,
    right: 0,
    top: "50%",
    height: lineThickness,
    backgroundColor: "#0d0d0d",
    transform: "translateY(-50%)",
  };

  const arcStyle = {
    position: "absolute",
    width: "100%",
    height: "100%",
    border: `${lineThickness}px solid #0d0d0d`,
    borderRadius: "50%",
    boxSizing: "border-box",
    background: "transparent",
  };

  const arcLeft = { ...arcStyle, right: "70%" };
  const arcRight = { ...arcStyle, left: "70%" };

  return (
    <div style={ballStyle}>
      <div style={verticalLine} />
      <div style={horizontalLine} />
      <div style={arcLeft} />
      <div style={arcRight} />
    </div>
  );
};
