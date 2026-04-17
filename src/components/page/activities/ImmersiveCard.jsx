import { Card } from "../../content/Card";
import { WordleActivity } from "./immersive/WordleActivity";

/**
 * Immersive card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @param {*} activityController controller for activities
 * @returns immersive card
 */
export const ImmersiveCard = ({ mobileMode, darkMode, activityController }) => {

  const Bullet1 = () => <WordleActivity mobileMode={mobileMode} darkMode={darkMode} activityController={activityController}/>

  // Return about card object
  return <Card mobileMode={mobileMode} title="Immersive">
    <Bullet1/>
  </Card>
};
