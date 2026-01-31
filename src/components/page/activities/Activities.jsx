import { Card } from "../../content/Card";

/**
 * Activities page
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @returns activities page
 */
export const Activities = ({ mobileMode, darkMode }) => {
  return (
    <div>
      <Card mobileMode={mobileMode} title={"NOTHING"}/>
    </div>
  );
}