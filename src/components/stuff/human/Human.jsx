import { Draggable } from "./Draggable";
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

// Constants
const HUMAN_SCALE = 1;

/**
 * Human object
 * @returns human object
 */
export const Human = ({
  headRotation = 0,           // [-40, 30]
  torsoRotation = 0,
  foreUpperArmRotation = 180,
  foreLowerArmRotation = 0,
  hindUpperArmRotation = 180,
  hindLowerArmRotation = 0,
  hipRotation = 200,          // [190, 220]
  foreUpperLegRotation = -20, // [-60, 70]
  foreLowerLegRotation = 0,   // [0, -150]
  foreFootRotation = 90,      // [50, 110], 90
  hindUpperLegRotation = -20, // [-60, 70]
  hindLowerLegRotation = 0,   // [0, -150]
  hindFootRotation = 90,      // [50, 110], 90
}) => {

  // Define head
  const Head = () => {
    return <Stick
      length={45*HUMAN_SCALE}
      rotation={headRotation}
      image={<img src={headImage} style={{ height: 63 * HUMAN_SCALE }} draggable={false} alt="Janzen's head"/>}
      imageOffset={{ x: 3 * HUMAN_SCALE, y: -40 * HUMAN_SCALE, r: 90 }}
    />
  };

  // Define torso
  const Torso = () => {
    return <Stick
      length={90*HUMAN_SCALE}
      rotation={torsoRotation}
      image={<img src={torsoImage} style={{ height: 100*HUMAN_SCALE }} alt="Janzen's torso"/>}
      imageOffset={{ x: 25*HUMAN_SCALE, y: -55*HUMAN_SCALE, r: 90 }}
      childAxes={[90*HUMAN_SCALE, 80*HUMAN_SCALE]}
    />
  };
  
  // Define fore upper arm
  const ForeUpperArm = ({ children }) => {
    return <Stick
      length={45*HUMAN_SCALE}
      rotation={foreUpperArmRotation}
      image={<img src={foreUpperArmImage} style={{ height: 60*HUMAN_SCALE }} alt="Janzen's fore upper arm"/>}
      imageOffset={{ x: 12*HUMAN_SCALE, y: -30*HUMAN_SCALE, r: -90 }}
    >
      {children}
    </Stick>
  };

  // Define fore lower arm
  const ForeLowerArm = () => {
    return <Stick
      length={45*HUMAN_SCALE}
      rotation={foreLowerArmRotation}
      image={<img src={foreLowerArmImage} style={{ height: 75*HUMAN_SCALE }} alt="Janzen's fore lower arm"/>}
      imageOffset={{ x: 22*HUMAN_SCALE, y: -36*HUMAN_SCALE, r: -90 }}
    />
  };

  // Define hind upper arm
  const HindUpperArm = ({ children }) => {
    return <Stick
      length={45*HUMAN_SCALE}
      rotation={hindUpperArmRotation}
      image={<img src={hindUpperArmImage} style={{ height: 58*HUMAN_SCALE }} alt="Janzen's hind upper arm"/>}
      imageOffset={{ x: 12*HUMAN_SCALE, y: -28*HUMAN_SCALE, r: -90 }}
    >
      {children}
    </Stick>
  };

  // Define hind lower arm
  const HindLowerArm = () => {
    return <Stick
      length={45*HUMAN_SCALE}
      rotation={hindLowerArmRotation}
      image={<img src={hindLowerArmImage} style={{ height: 73*HUMAN_SCALE }} alt="Janzen's hind lower arm"/>}
      imageOffset={{ x: 22*HUMAN_SCALE, y: -36*HUMAN_SCALE, r: -90 }}
    />
  };

  // Define hip
  const Hip = ({ children }) => {
    return <Stick
      length={15*HUMAN_SCALE}
      rotation={hipRotation}
      image={<img src={hipImage} style={{ height: 50*HUMAN_SCALE }} alt="Janzen's hip"/>}
      imageOffset={{ x: -20*HUMAN_SCALE, y: -20*HUMAN_SCALE, r: -90 }}
    >
      {children}
    </Stick>
  };

  // Define fore upper leg
  const ForeUpperLeg = ({ children }) => {
    return <Stick
      length={60*HUMAN_SCALE}
      rotation={foreUpperLegRotation}
      image={<img src={foreUpperLegImage} style={{ height: 80*HUMAN_SCALE }} alt="Janzen's fore upper leg"/>}
      imageOffset={{ x: 12*HUMAN_SCALE, y: -38*HUMAN_SCALE, r: -90 }}
    >
      {children}
    </Stick>
  };

  // Define fore lower leg
  const ForeLowerLeg = ({ children }) => {
    return <Stick
      length={50*HUMAN_SCALE}
      rotation={foreLowerLegRotation}
      image={<img src={foreLowerLegImage} style={{ height: 70*HUMAN_SCALE }} alt="Janzen's fore lower leg"/>}
      imageOffset={{ x: 10*HUMAN_SCALE, y: -35*HUMAN_SCALE, r: -90 }}
    >
      {children}
    </Stick>
  };

  // Define fore foot
  const ForeFoot = ({ children }) => {
    return <Stick
      length={20*HUMAN_SCALE}
      rotation={foreFootRotation}
      image={<img src={foreFootImage} style={{ height: 20*HUMAN_SCALE }} alt="Janzen's fore foot"/>}
      imageOffset={{ x:-15*HUMAN_SCALE, y: -15*HUMAN_SCALE, r: 180 }}
    >
      {children}
    </Stick>
  };

  // Define hind upper leg
  const HindUpperLeg = ({ children }) => {
    return <Stick
      length={60*HUMAN_SCALE}
      rotation={hindUpperLegRotation}
      image={<img src={hindUpperLegImage} style={{ height: 80*HUMAN_SCALE }} alt="Janzen's hind upper leg"/>}
      imageOffset={{ x: 12*HUMAN_SCALE, y: -38*HUMAN_SCALE, r: -90 }}
    >
      {children}
    </Stick>
  };

  // Define hind lower leg
  const HindLowerLeg = ({ children }) => {
    return <Stick
      length={50*HUMAN_SCALE}
      rotation={hindLowerLegRotation}
      image={<img src={hindLowerLegImage} style={{ height: 70*HUMAN_SCALE }} alt="Janzen's hind lower leg"/>}
      imageOffset={{ x: 10*HUMAN_SCALE, y: -35*HUMAN_SCALE, r: -90 }}
    >
      {children}
    </Stick>
  };

  // Define hind foot
  const HindFoot = ({ children }) => {
    return <Stick
      length={20*HUMAN_SCALE}
      rotation={hindFootRotation}
      image={<img src={hindFootImage} style={{ height: 20*HUMAN_SCALE }} alt="Janzen's hind foot"/>}
      imageOffset={{ x:-15*HUMAN_SCALE, y: -15*HUMAN_SCALE, r: 180 }}
    >
      {children}
    </Stick>
  };

  // Render object
  return (
    <Draggable initialX={200} initialY={200}>
      <Stick
        length={10*HUMAN_SCALE}
        rotation={-90}
        childAxes={[82*HUMAN_SCALE, 90*HUMAN_SCALE, 0*HUMAN_SCALE, 0*HUMAN_SCALE, 82*HUMAN_SCALE]}
      >

        <HindUpperArm>
          <HindLowerArm/>
        </HindUpperArm>
        <Head/>
        <Hip>
          <HindUpperLeg>
            <HindLowerLeg>
              <HindFoot/>
            </HindLowerLeg>
          </HindUpperLeg>
          <ForeUpperLeg>
            <ForeLowerLeg>
              <ForeFoot/>
            </ForeLowerLeg>
          </ForeUpperLeg>
        </Hip>
        <Torso/>
        <ForeUpperArm>
          <ForeLowerArm/>
        </ForeUpperArm>

      </Stick>
    </Draggable>
  );
};
