import { Card } from "../../content/Card";
import { HyperlinkBullet } from "../../content/HyperlinkBullet";
import mailIcon from "../../../assets/icon/mail.png";
import phoneIcon from "../../../assets/icon/phone.png";

/**
 * Contact card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @returns contact card
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
      title={"Mobile"}
      text={"(+61) 404 202 202"}
      iconLight={phoneIcon}
      iconDark={phoneIcon}
    />
  };

  return <Card mobileMode={mobileMode} title={"Contact"}>
    <Bullet1/>
    <Bullet2/>
  </Card>
};
