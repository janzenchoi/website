import { Card } from "../../content/Card";
import { HyperlinkBullet } from "../../content/HyperlinkBullet";
import igIcon from "../../../assets/logo/ig.png";
import inIcon from "../../../assets/logo/in.png";
import rgIcon from "../../../assets/logo/rg.png";
import sfLight from "../../../assets/logo/sf_light.png";
import sfDark from "../../../assets/logo/sf_dark.png";
import ghDark from "../../../assets/logo/gh_dark.png";
import ghLight from "../../../assets/logo/gh_light.png";
import gsIcon from "../../../assets/logo/gs.png";

/**
 * Links card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @returns links card
 */
export const LinksCard = ({ mobileMode, darkMode }) => {
  const Bullet1 = () => {
    return <HyperlinkBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"GitHub"}
      hyperlink={"github.com/janzenchoi"}
      iconLight={ghLight}
      iconDark={ghDark}
    />
  };
  const Bullet2 = () => {
    return <HyperlinkBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Google Scholar"}
      hyperlink={"scholar.google.com/citations?user=pR9IjEoAAAAJ"}
      iconLight={gsIcon}
      iconDark={gsIcon}
    />
  };
  const Bullet3 = () => {
    return <HyperlinkBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Instagram"}
      hyperlink={"instagram.com/janzenchoi"}
      iconLight={igIcon}
      iconDark={igIcon}
    />
  };
  const Bullet4 = () => {
    return <HyperlinkBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"LinkedIn"}
      hyperlink={"linkedin.com/in/janzen-choi-97319319a"}
      iconLight={inIcon}
      iconDark={inIcon}
    />
  };
  const Bullet5 = () => {
    return <HyperlinkBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"ResearchGate"}
      hyperlink={"researchgate.net/profile/Janzen-Choi"}
      iconLight={rgIcon}
      iconDark={rgIcon}
    />
  };
  const Bullet6 = () => {
    return <HyperlinkBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Spotify"}
      hyperlink={"open.spotify.com/user/jnznn?si=06f3446ebf13475e"}
      iconLight={sfLight}
      iconDark={sfDark}
    />
  };

  return <Card mobileMode={mobileMode} title={"Links"}>
    <Bullet1/>
    <Bullet2/>
    <Bullet3/>
    <Bullet4/>
    <Bullet5/>
    <Bullet6/>
  </Card>
};
