import React from "react";
import Lottie from "react-lottie";
import animationData from "../../animation/loading-animation.json";

const BubblesLoad = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <section className="w-full h-[77vh] z-30 flex justify-center items-center">
      <Lottie options={defaultOptions} height={"15vw"} width={"15vw"} />
    </section>
  );
};

export default BubblesLoad;
