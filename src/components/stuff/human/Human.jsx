import { Stick } from "./Stick";

// Images
import foreFootImage from "../../../assets/stuff/human/fore_foot.png";
import foreLowerArmImage from "../../../assets/stuff/human/fore_lower_arm.png";
import foreLowerLegImage from "../../../assets/stuff/human/fore_lower_leg.png";
import foreUpperArmImage from "../../../assets/stuff/human/fore_upper_arm.png";
import foreUpperLegImage from "../../../assets/stuff/human/fore_upper_leg.png";
import headImage from "../../../assets/stuff/human/head.png";
import hindFootImage from "../../../assets/stuff/human/hind_foot.png";
import hindLowerArmImage from "../../../assets/stuff/human/hind_lower_arm.png";
import hindLowerLegImage from "../../../assets/stuff/human/hind_lower_leg.png";
import hindUpperArmImage from "../../../assets/stuff/human/hind_upper_arm.png";
import hindUpperLegImage from "../../../assets/stuff/human/hind_upper_leg.png";
import hipImage from "../../../assets/stuff/human/hip.png";
import torsoImage from "../../../assets/stuff/human/torso.png";

/**
 * A hierarchical human puppet composed of stick-based body parts.
 * All joints are rotated relative to their parent joint.
 *
 * @param {number} humanRotation rotation of the entire human (degrees)
 * @param {number} headRotation rotation of the head (degrees)
 * @param {number} foreUpperArmRotation rotation of the front upper arm / shoulder (degrees)
 * @param {number} foreLowerArmRotation rotation of the front lower arm / elbow (degrees)
 * @param {number} hindUpperArmRotation rotation of the rear upper arm / shoulder (degrees)
 * @param {number} hindLowerArmRotation rotation of the rear lower arm / elbow (degrees)
 * @param {number} hipRotation rotation of the pelvis / hip joint (degrees)
 * @param {number} foreUpperLegRotation rotation of the front upper leg / thigh (degrees)
 * @param {number} foreLowerLegRotation rotation of the front lower leg / knee (degrees)
 * @param {number} foreFootRotation rotation of the front foot / ankle (degrees)
 * @param {number} hindUpperLegRotation rotation of the rear upper leg / thigh (degrees)
 * @param {number} hindLowerLegRotation rotation of the rear lower leg / knee (degrees)
 * @param {number} hindFootRotation rotation of the rear foot / ankle (degrees)
 * @param {boolean} debug enable debug output / visual aids
 * @param {number} human_scale factor to scale everything
 * @param {boolean} darkMode make all body parts 30% darker if true
 * @returns human object
 */
export const Human = ({
  humanRotation = 0,          // [0, 360]
  headRotation = 0,           // [-40, 30]
  foreUpperArmRotation = 180, // [0, 360]
  foreLowerArmRotation = 0,   // [0, 150]
  hindUpperArmRotation = 180, // [0, 360]
  hindLowerArmRotation = 0,   // [0, 150]
  hipRotation = 200,          // [190, 220]
  foreUpperLegRotation = -20, // [-60, 70]
  foreLowerLegRotation = 0,   // [0, -150]
  foreFootRotation = 70,      // [30, 90]
  hindUpperLegRotation = -20, // [-60, 70]
  hindLowerLegRotation = 0,   // [0, -150]
  hindFootRotation = 70,      // [30, 90]
  debug = false,
  human_scale = 1,
  darkMode = false,
}) => {

  // Helper for consistent image styles including dark mode
  const imgStyle = (height) => ({
    height: height * human_scale,
    filter: darkMode ? "brightness(80%)" : "none",
    draggable: false,
  });

  // Define head
  const Head = () => {
    return <Stick
      length={45*human_scale}
      rotation={headRotation}
      image={<img src={headImage} style={imgStyle(63)} alt="Janzen's head"/>}
      imageOffset={{ x: 3 * human_scale, y: -40 * human_scale, r: 90 }}
      debug={debug}
    />
  };

  // Define torso
  const Torso = () => {
    return <Stick
      length={90*human_scale}
      rotation={0}
      image={<img src={torsoImage} style={imgStyle(100)} alt="Janzen's torso"/>}
      imageOffset={{ x: 25*human_scale, y: -55*human_scale, r: 90 }}
      childAxes={[90*human_scale, 80*human_scale]}
      debug={debug}
    />
  };
  
  // Define fore upper arm
  const ForeUpperArm = ({ children }) => {
    return <Stick
      length={45*human_scale}
      rotation={foreUpperArmRotation}
      image={<img src={foreUpperArmImage} style={imgStyle(60)} alt="Janzen's fore upper arm"/>}
      imageOffset={{ x: 12*human_scale, y: -30*human_scale, r: -90 }}
      debug={debug}
    >
      {children}
    </Stick>
  };

  // Define fore lower arm
  const ForeLowerArm = () => {
    return <Stick
      length={45*human_scale}
      rotation={foreLowerArmRotation}
      image={<img src={foreLowerArmImage} style={imgStyle(75)} alt="Janzen's fore lower arm"/>}
      imageOffset={{ x: 22*human_scale, y: -36*human_scale, r: -90 }}
      debug={debug}
    />
  };

  // Define hind upper arm
  const HindUpperArm = ({ children }) => {
    return <Stick
      length={45*human_scale}
      rotation={hindUpperArmRotation}
      image={<img src={hindUpperArmImage} style={imgStyle(58)} alt="Janzen's hind upper arm"/>}
      imageOffset={{ x: 12*human_scale, y: -28*human_scale, r: -90 }}
      debug={debug}
    >
      {children}
    </Stick>
  };

  // Define hind lower arm
  const HindLowerArm = () => {
    return <Stick
      length={45*human_scale}
      rotation={hindLowerArmRotation}
      image={<img src={hindLowerArmImage} style={imgStyle(73)} alt="Janzen's hind lower arm"/>}
      imageOffset={{ x: 22*human_scale, y: -36*human_scale, r: -90 }}
      debug={debug}
    />
  };

  // Define hip
  const Hip = ({ children }) => {
    return <Stick
      length={15*human_scale}
      rotation={hipRotation}
      image={<img src={hipImage} style={imgStyle(50)} alt="Janzen's hip"/>}
      imageOffset={{ x: -20*human_scale, y: -20*human_scale, r: -90 }}
      debug={debug}
    >
      {children}
    </Stick>
  };

  // Define fore upper leg
  const ForeUpperLeg = ({ children }) => {
    return <Stick
      length={60*human_scale}
      rotation={foreUpperLegRotation}
      image={<img src={foreUpperLegImage} style={imgStyle(80)} alt="Janzen's fore upper leg"/>}
      imageOffset={{ x: 12*human_scale, y: -38*human_scale, r: -90 }}
      debug={debug}
    >
      {children}
    </Stick>
  };

  // Define fore lower leg
  const ForeLowerLeg = ({ children }) => {
    return <Stick
      length={50*human_scale}
      rotation={foreLowerLegRotation}
      image={<img src={foreLowerLegImage} style={imgStyle(70)} alt="Janzen's fore lower leg"/>}
      imageOffset={{ x: 10*human_scale, y: -35*human_scale, r: -90 }}
      debug={debug}
    >
      {children}
    </Stick>
  };

  // Define fore foot
  const ForeFoot = ({ children }) => {
    return <Stick
      length={20*human_scale}
      rotation={foreFootRotation}
      image={<img src={foreFootImage} style={imgStyle(20)} alt="Janzen's fore foot"/>}
      imageOffset={{ x:-15*human_scale, y: -15*human_scale, r: 200 }}
      debug={debug}
    >
      {children}
    </Stick>
  };

  // Define hind upper leg
  const HindUpperLeg = ({ children }) => {
    return <Stick
      length={60*human_scale}
      rotation={hindUpperLegRotation}
      image={<img src={hindUpperLegImage} style={imgStyle(80)} alt="Janzen's hind upper leg"/>}
      imageOffset={{ x: 12*human_scale, y: -38*human_scale, r: -90 }}
      debug={debug}
    >
      {children}
    </Stick>
  };

  // Define hind lower leg
  const HindLowerLeg = ({ children }) => {
    return <Stick
      length={50*human_scale}
      rotation={hindLowerLegRotation}
      image={<img src={hindLowerLegImage} style={imgStyle(70)} alt="Janzen's hind lower leg"/>}
      imageOffset={{ x: 10*human_scale, y: -35*human_scale, r: -90 }}
      debug={debug}
    >
      {children}
    </Stick>
  };

  // Define hind foot
  const HindFoot = ({ children }) => {
    return <Stick
      length={20*human_scale}
      rotation={hindFootRotation}
      image={<img src={hindFootImage} style={imgStyle(20)} alt="Janzen's hind foot"/>}
      imageOffset={{ x:-15*human_scale, y: -15*human_scale, r: 200 }}
      debug={debug}
    >
      {children}
    </Stick>
  };

  // Render object
  return (
    <Stick
      length={10*human_scale}
      rotation={-90 + humanRotation}
      childAxes={[82*human_scale, 90*human_scale, 0*human_scale, 0*human_scale, 82*human_scale]}
      debug={debug}
    >
      <HindUpperArm><HindLowerArm/></HindUpperArm>
      <Head/>
      <Hip>
        <HindUpperLeg><HindLowerLeg><HindFoot/></HindLowerLeg></HindUpperLeg>
        <ForeUpperLeg><ForeLowerLeg><ForeFoot/></ForeLowerLeg></ForeUpperLeg>
      </Hip>
      <Torso/>
      <ForeUpperArm><ForeLowerArm/></ForeUpperArm>
    </Stick>
  );
};
