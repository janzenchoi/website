
/**
 * Card for the body
 * @param {string} title card title
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {*} children card items
 * @returns card object
 */
export const Card = ({ mobileMode, title, children }) => {

  // Container style for the card
  const containerStyle = {
    backgroundColor: "var(--colour-1)",
    padding: "1rem 1rem 1rem 1rem",
    borderBottom: "1px solid var(--colour-4)",
  };

  // Style for title
  const titleStyle = {
    width: "100%",
    fontWeight: 600,
    fontSize: "1.4rem",
    color: "var(--colour-6)",
    paddingBottom: "1rem",
  };

  // Return body object
  return (
    <div style={containerStyle}>
      <div style={titleStyle}>{title}</div>
      {children}
    </div>
  );
}

/**
 * Text style
 */
export const textStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  fontWeight: 400,
  fontSize: "1rem",
  color: "var(--colour-5)",
  cursor: "pointer",
  textAlign: "justify"
};