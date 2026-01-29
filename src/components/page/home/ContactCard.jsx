import { Card } from "../../content/Card";
import { HyperlinkBullet } from "../../content/HyperlinkBullet";
import igIcon from "../../../assets/logo/ig.png";
import inIcon from "../../../assets/logo/in.png";
import rgIcon from "../../../assets/logo/rg.png";
import ghDark from "../../../assets/logo/gh_dark.png";
import ghLight from "../../../assets/logo/gh_light.png";
import mailIcon from "../../../assets/icon/mail.png";
import phoneIcon from "../../../assets/icon/phone.png";

/**
 * About card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @returns about card for mobile mode
 */
export const ContactCard = ({ mobileMode, darkMode }) => {
  const Bullet1 = () => {
    return <HyperlinkBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Email"}
      text={"janzenchoi@yahoo.com"}
      iconLight={mailIcon}
      iconDark={mailIcon}
    />
  };
  const Bullet2 = () => {
    return <HyperlinkBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Phone"}
      text={"(+61) 404 202 202"}
      iconLight={phoneIcon}
      iconDark={phoneIcon}
    />
  };
  const Bullet3 = () => {
    return <HyperlinkBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"LinkedIn"}
      hyperlink={"linkedin.com/in/janzen-choi-97319319a"}
      iconLight={inIcon}
      iconDark={inIcon}
    />
  };
  const Bullet4 = () => {
    return <HyperlinkBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"GitHub"}
      hyperlink={"github.com/janzenchoi"}
      iconLight={ghLight}
      iconDark={ghDark}
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
      title={"Instagram"}
      hyperlink={"instagram.com/janzenchoi/"}
      iconLight={igIcon}
      iconDark={igIcon}
    />
  };

  return <Card mobileMode={mobileMode} title={"Contact"}>
    <Bullet1/>
    <Bullet2/>
    <Bullet3/>
    <Bullet4/>
    <Bullet5/>
    <Bullet6/>
  </Card>
};
