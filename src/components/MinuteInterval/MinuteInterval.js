"use client";
import React, { useEffect, useState, useRef } from "react";

const MinuteInterval = () => {
  const [progress, setProgress] = useState(0);
  const [width, setWidth] = useState(0);
  const animationFrameId = useRef(null);
  // const { loading } = useContext(DataContext) || { };

  const [innerWidth, setInnerWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== undefined) {
      setInnerWidth(window.innerWidth);
    }
  }, []);

  useEffect(() => {
    // Function to update the width of the container
    const updateWidth = () => {
      const bodyWidth = document.body.clientWidth;
      setWidth(bodyWidth);
    };

    // Set initial width
    updateWidth();

    // Update width on window resize
    typeof window !== undefined &&
      window.addEventListener("resize", updateWidth);

    // Clean up the event listener on component unmount
    return () => {
      typeof window !== undefined &&
        window.removeEventListener("resize", updateWidth);
    };
  }, [innerWidth]);
  useEffect(() => {
    // if (!loading) {
    const startTime = Date.now();
    const updateProgress = () => {
      const elapsedTime = Date.now() - startTime;

      const newProgress = ((elapsedTime % 60000) / 60000) * 100;
      setProgress(newProgress);

      // // console.log({ newProgress: newProgress.toFixed(2) });

      if (+newProgress >= 99.95) {
        // handleRefetch();
      }

      animationFrameId.current = requestAnimationFrame(updateProgress);
    };

    animationFrameId.current = requestAnimationFrame(updateProgress);
    // }

    return () => cancelAnimationFrame(animationFrameId.current);
  }, []);

  return (
    <div
      className="absolute top-0 left-0 h-[2px] bg-[#a922c7]"
      style={{
        width: `${(progress / 100) * width}px`,
      }}
    ></div>
  );
};

export default MinuteInterval;
