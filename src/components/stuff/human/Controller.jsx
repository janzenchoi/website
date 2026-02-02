import React, { useState } from "react";
import { HumanAnimator } from "./HumanAnimator";
import { Draggable } from "./Draggable";
import { standStraight, standCasual } from "./poses";
import { walkStride1, walkStride2, walkStride3, walkStride4, walkStride5, walkStride6 } from "./poses";
import { runStride1, runStride2, runStride3, runStride4, runStride5, runStride6 } from "./poses";
import { jumpPrime, jumpFly, jumpPeak, jumpFall, jumpLand } from "./poses";
import { standJumpPrime, standJumpFly } from "./poses";

/**
 * Controls the human to do poses
 * @returns controller object
 */
export const Controller = () => {

  // Initialise
  const [pose, setPose] = useState(standStraight);
  const [duration, setDuration] = useState(1);

  // Runs the animation
  const animate = async (targetPose, duration) => {
    setDuration(duration);
    setPose(targetPose);
    await new Promise((resolve) => setTimeout(resolve, duration));
  };

  // Animate standing straight
  const animateStand = async () => {
    await animate(standStraight, 400);
  };

  // Priming animation
  const animateCasual = async () => {
    await animate(standCasual, 500);
  };

  // Walking animation
  const animateWalk = async (count=1) => {
    const strides = [walkStride1, walkStride2, walkStride3, walkStride4, walkStride5, walkStride6];
    for (let i = 0; i < count; i++) {
      for (const stride of strides) {
        await animate(stride, 100);
      }
    }
  };

  // Running animation
  const animateRun = async (count=1) => {
    const strides = [runStride1, runStride2, runStride3, runStride4, runStride5, runStride6 ];
    for (let i = 0; i < count; i++) {
      for (const stride of strides) {
        await animate(stride, 100);
      }
    }
  };

  // Walking Jumping animation
  const animateWalkJump = async (count=1) => {
    for (let i = 0; i < count; i++) {
      await animate(jumpFly, 300);
      await animate(standJumpFly, 300);
      await animate(jumpLand, 300);
      await animate(standCasual, 300);
    }
  };

  // Running Jumping animation
  const animateRunJump = async (count=1) => {
    for (let i = 0; i < count; i++) {
      await animate(jumpPrime, 300);
      await animate(jumpFly, 300);
      await animate(jumpPeak, 300);
      await animate(jumpFall, 300);
      await animate(jumpLand, 300);
      await animate(standCasual, 300);
    }
  };

  // Standing Jumping animation
  const animateStandJump = async (count=1) => {
    for (let i = 0; i < count; i++) {
      await animate(standCasual, 300);
      await animate(standJumpPrime, 300);
      await animate(standJumpFly, 300);
      await animate(standJumpFly, 900);
      await animate(standJumpPrime, 300);
      await animate(standCasual, 300);
    }
  };

  return (
    <Draggable>
    <div
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <HumanAnimator
        targetPose={pose}
        duration={duration}
        debug={true}
        humanScale={1}
      />

      <div style={{ marginTop: "-200px" }}>
        <button onClick={() => animateStand()}>STAND</button>
        <button onClick={() => animateCasual()}>CASUAL</button>
        <button onClick={() => animateWalk(2)}>WALK</button>
        <button onClick={() => animateRun(2)}>RUN</button>
        <button onClick={() => animateWalkJump(1)}>W.JUMP</button>
        <button onClick={() => animateRunJump(1)}>R.JUMP</button>
        <button onClick={() => animateStandJump(1)}>S.JUMP</button>
      </div>
    </div>
    </Draggable>
  );
};
