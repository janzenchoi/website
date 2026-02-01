import React, { useState } from "react";
import { Human } from "./Human";
import { Draggable } from "./Draggable";

/**
 * Puppet controller with fully functional sliders.
 * Panel header is the only drag handle; sliders slide smoothly and have reset buttons.
 * @param {boolean} darkMode whether to use dark or light mode
 * @returns puppet controller object
 */
export const Puppet = ({ darkMode }) => {
  const DEFAULTS = {
    humanRotation: 0,
    headRotation: 0,
    foreUpperArmRotation: 180,
    foreLowerArmRotation: 0,
    hindUpperArmRotation: 180,
    hindLowerArmRotation: 0,
    hipRotation: 200,
    foreUpperLegRotation: -20,
    foreLowerLegRotation: 0,
    foreFootRotation: 70,
    hindUpperLegRotation: -20,
    hindLowerLegRotation: 0,
    hindFootRotation: 70,
  };

  const RANGES = {
    humanRotation: [0, 360],
    headRotation: [-40, 30],
    foreUpperArmRotation: [0, 360],
    foreLowerArmRotation: [0, 150],
    hindUpperArmRotation: [0, 360],
    hindLowerArmRotation: [0, 150],
    hipRotation: [190, 220],
    foreUpperLegRotation: [-60, 70],
    foreLowerLegRotation: [-150, 0],
    foreFootRotation: [30, 90],
    hindUpperLegRotation: [-60, 70],
    hindLowerLegRotation: [-150, 0],
    hindFootRotation: [30, 90],
  };

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const [joints, setJoints] = useState({ ...DEFAULTS });

  const setJoint = (key) => (e) => {
    const [min, max] = RANGES[key] ?? [0, 360];
    const value = clamp(Number(e.target.value), min, max);
    setJoints((s) => ({ ...s, [key]: value }));
  };

  const resetJoint = (key) => () => setJoints((s) => ({ ...s, [key]: DEFAULTS[key] }));

  const Slider = ({ label, joint }) => {
    const [min, max] = RANGES[joint] ?? [0, 360];
    return (
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 12, marginBottom: 2 }}>
          {label}: {joints[joint]}°
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type="range"
            min={min}
            max={max}
            value={joints[joint]}
            onChange={setJoint(joint)}
            style={{ flexGrow: 1, marginRight: 6 }}
          />
          <button
            onClick={resetJoint(joint)}
            style={{
              width: 40,
              padding: "2px 4px",
              fontSize: 10,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Draggable Human */}
      <Draggable initialX={300} initialY={200}>
        <Human {...joints} debug={true} human_scale={2} darkMode={darkMode} />
      </Draggable>

      {/* Draggable Slider Panel */}
      <Draggable initialX={520} initialY={200}>
        {/* Only the header is the drag handle */}
        <div
          style={{
            width: 280,
            background: "var(--colour-6)",
            color: "var(--colour-1)",
            fontFamily: "monospace",
            borderRadius: 6,
            padding: 12,
          }}
        >
          {/* Drag handle */}
          <div
            style={{
              cursor: "grab",
              fontWeight: "bold",
              marginBottom: 10,
              userSelect: "none",
            }}
          >
            Puppet Controls
          </div>

          {/* Sliders are normal elements, not part of drag handle */}
          <Slider label="Human" joint="humanRotation" />
          <hr />
          <Slider label="Head" joint="headRotation" />
          <hr />
          <Slider label="Fore Upper Arm" joint="foreUpperArmRotation" />
          <Slider label="Fore Lower Arm" joint="foreLowerArmRotation" />
          <Slider label="Hind Upper Arm" joint="hindUpperArmRotation" />
          <Slider label="Hind Lower Arm" joint="hindLowerArmRotation" />
          <hr />
          <Slider label="Hip" joint="hipRotation" />
          <hr />
          <Slider label="Fore Upper Leg" joint="foreUpperLegRotation" />
          <Slider label="Fore Lower Leg" joint="foreLowerLegRotation" />
          <Slider label="Fore Foot" joint="foreFootRotation" />
          <Slider label="Hind Upper Leg" joint="hindUpperLegRotation" />
          <Slider label="Hind Lower Leg" joint="hindLowerLegRotation" />
          <Slider label="Hind Foot" joint="hindFootRotation" />
        </div>
      </Draggable>
    </>
  );
};
