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

/**
 * Updates the colour of the safe area based on immersion overlay
 */
export function blendSafeAreaColour() {
  const colour = getComputedStyle(document.documentElement).getPropertyValue("--colour-0").trim();

  // Parse rgb/hex from colour-0
  const temp = document.createElement("div");
  temp.style.color = colour;
  document.body.appendChild(temp);
  const [r, g, b] = getComputedStyle(temp).color.match(/\d+/g).map(Number);
  document.body.removeChild(temp);

  // Blend with rgba(0,0,0,0.8) overlay manually
  const alpha = 0.8;
  const blended = `rgb(${Math.round(r * (1 - alpha))}, ${Math.round(g * (1 - alpha))}, ${Math.round(b * (1 - alpha))})`;

  const themeMeta = document.getElementById("theme-color-meta");
  if (themeMeta)
    themeMeta.setAttribute("content", blended);
}