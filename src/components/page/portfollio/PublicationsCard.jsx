import { Card } from "../../content/Card";
import { PublicationBullet } from "../../content/PublicationBullet";
import paper5 from "../../../assets/publications/paper_5.pdf";
import paper4 from "../../../assets/publications/paper_4.pdf";
import paper3 from "../../../assets/publications/paper_3.pdf";
import paper2 from "../../../assets/publications/paper_2.pdf";
import paper1 from "../../../assets/publications/paper_1.pdf";

import image5 from "../../../assets/publications/image_5.png";
import image4 from "../../../assets/publications/image_4.png";
import image3 from "../../../assets/publications/image_3.png";
import image2 from "../../../assets/publications/image_2.png";
import image1 from "../../../assets/publications/image_1.png";

/**
 * Publications card
 * @param {boolean} mobileMode whether to use mobile or desktop view
 * @param {boolean} darkMode whether to use dark or light mode
 * @returns publications card for mobile mode
 */
export const PublicationsCard = ({ mobileMode, darkMode }) => {

  // Define bullets
  const Bullet5 = () => {
    return <PublicationBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Multi-Objective Surrogate-Assisted Calibration of CPFEM Models Using Macroscopic Response and In Situ EBSD Measurements of Grain Reorientation Trajectories"}
      subtitle={"Acta Materialia"}
      description={[
        "J. Choi, O. Muránsky, M.C. Messner, T. Wei, T. Hu, J.J. Kruzic, M.D. McMurtrey",
        "This study presents a multi-objective surrogate-assisted calibration workflow for crystal plasticity finite element method (CPFEM) models that combines a genetic algorithm with a deep neural network (DNN) surrogate to efficiently identify model parameters",
        "*The workflow is applied to three CPFEM formulations using in situ EBSD data from Alloy 617 under tensile loading",
        "*The results show accurate stress-strain and texture predictions, physically consistent parameters, and good transferability to higher-fidelity microstructural models",
      ]}
      image={image5}
      imageCaption={"Calibration and validation results after five runs of the multi-objective surrogate-assisted calibration workflow, comparing the experimental data in grey with the simulated responses in green (all runs) and red (best run). The calibration data comprise the a) stress-strain response and b) reorientation trajectories of eight grains, while the validation data comprise the c) trajectories of eight more grains and d,e) overall texture evolution (validation). The texture evolution is presented using d) contoured {111} pole figures at ε = 0.0%, 10.6%, and 29.0%, and e) texture indexes over 0.0% to 29.0%."}
      imageMaxHeight={"360px"}
      link={"doi.org/10.1016/j.actamat.2025.121809"}
      downloadable={paper5}
      date={"Feb 2026"}
    />
  };
  const Bullet4 = () => {
    return <PublicationBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Multi-objective Calibration of Elastic-Viscoplastic Models to Capture the Elevated-Temperature Creep and Tensile Behaviour of Alloy 617"}
      subtitle={"International Journal of Pressure Vessels and Piping"}
      description={[
        "J. Choi, O. Muránsky, M.C. Messner, J.J. Kruzic, M.D. McMurtrey",
        "This study presents a multi-objective three-stage calibration workflow for elastic-viscoplastic (EVP) models that uses a genetic algorithm",
        "*The workflow is applied to two EVP formulations using high-temperature creep and tensile data of Alloy 617 to failure",
        "*The results show accurate creep predictions and reasonable tensile predictions when using a work-based damage formulation at the cost of increased calibration complexity"
      ]}
      image={image4}
      imageCaption={"Calibration results from the three-stage calibration workflow applied to an EVP-coupled work-damage formulation and experimental data at 900°C. The top row of plots (a, c, e) shows the creep predictions while the bottom row of plots (b, d, and f) shows the tensile predictions. The experimental datasets are in grey, the simulated curves used for calibration are in green, and the simulated curves used for validation are in red. The boxplots (g) show the distribution of the found parameters, where x* represents the optimal parameter value, the vertical line represents the mean, the boxes represent the standard deviations, and the whiskers represent the ranges"}
      imageMaxHeight={"480px"}
      link={"doi.org/10.1016/j.ijpvp.2025.105566"}
      downloadable={paper4}
      date={"Dec 2025"}
    />
  };
  const Bullet3 = () => {
    return <PublicationBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"A mechanistic model for creep and thermal aging in Alloy 709"}
      subtitle={"U.S. Department of Energy Office of Scientific and Technical Information"}
      description={[
        "T. Hu, J. Choi, M.C. Messner",
        "The report develops a physics-based crystal plasticity finite element (CPFE) model to predict creep and thermal aging in Alloy 709, an advanced austenitic alloy for future reactors with limited test data",
        "*The model incorporates key deformation and failure mechanisms, with stochastic calibration conducted using surrogate modelling techniques",
        "*The approach enabled more accurate long-term creep life predictions than traditional empirical methods"
      ]}
      image={image3}
      imageCaption={"Comparison between the surrogate model's time-to-tertiary predictions (vertical) and the CPFE model's time-to-tertiary predictions (horizontal)."}
      link={"doi.org/10.2172/1999400"}
      downloadable={paper3}
      date={"Sep 2023"}
    />
  };
  const Bullet2 = () => {
    return <PublicationBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"On the prediction of creep behaviour of alloy 617 using Kachanov-Rabotnov model coupled with multi-objective genetic algorithm optimisation"}
      subtitle={"International Journal of Pressure Vessels and Piping"}
      description={[
        "J. Choi, L.B. Neto, R.N. Wright, J.J. Kruzic, O. Muránsky",
        "This study combines the Kachanov-Rabotnov (K-R) creep model with a multi-objective genetic algorithm to predict the elevated-temperature creep behaviour of Alloy 617 under various stresses",
        "*The calibrated model accurately captured creep behaviour where oxidation effects are negligible",
        "*Its predictions remain reliable only within the inherent limitations of the K-R formulation at higher temperatures"
      ]}
      image={image2}
      imageCaption={"Boxplots of optimised material parameters for the K-R model (A, n, M, φ, and χ) at 800°C when calibrated against all stress conditions (red) and limited stress conditions (blue). In the boxplots, the horizontal lines represent the mean, the boxes represent the standard deviations, and the whiskers represent the range. The green dotted lines represent the values of the A and n parameters obtained from Norton's power law."}
      link={"doi.org/10.1016/j.ijpvp.2022.104721"}
      downloadable={paper2}
      date={"Oct 2022"}
    />
  };
  const Bullet1 = () => {
    return <PublicationBullet
      mobileMode={mobileMode}
      darkMode={darkMode}
      title={"Multi-objective genetic algorithm for material parameter optimisation to predict high-temperature creep behaviour"}
      subtitle={"British Society for Strain Measurement"}
      description={[
        "J. Choi, L.B. Neto, R.N. Wright, J.J. Kruzic, O. Muránsky",
        "The study presents a multi-objective calibration approach to predict long-term creep behaviour of Alloy 617 from short-term data by optimising the constitutive Kachanov-Rabotnov (K-R) model",
        "*The method performs well at 800°C but loses accuracy at 900-1000°C",
        "*Accuracy reduction due to oxidation effects not captured by the K-R model",
      ]}
      image={image1}
      imageCaption={"Creep strain-time curves at various stress-temperature conditions at a) 800°C, b) 900°C, and c) 1000°C. Experimental and predicted curves are represented by solid and dotted lines, respectively."}
      link={""}
      downloadable={paper1}
      date={"Sep 2021"}
    />
  };

  // Return about card object
  return (
    <Card mobileMode={mobileMode} title={"Publications"}>
      <Bullet5/>
      <Bullet4/>
      <Bullet3/>
      <Bullet2/>
      <Bullet1/>
    </Card>
  );
};