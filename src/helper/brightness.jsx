/**
 * Alternates between dark and light mode
 * @param {boolean} enabled whether to turn on dark mode 
 */
export function setDarkMode(enabled) {
  const colour_theme = enabled ? "dark" : "light";
  document.documentElement.setAttribute("colour-theme", colour_theme);
  updateSafeAreaColour();
}

/**
 * Function to update the colour of the safe area
 */
export function updateSafeAreaColour() {
  const colour = getComputedStyle(document.documentElement).getPropertyValue("--colour-0").trim();
  const themeMeta = document.getElementById("theme-color-meta");
  if (themeMeta)
    themeMeta.setAttribute("content", colour);
}
