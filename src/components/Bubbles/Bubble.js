import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

const Bubble = ({ size, color, speed }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);

  useEffect(() => {
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    const updatePosition = () => {
      const newX = position.x + speed.x;
      const newY = position.y + speed.y;

      // Handle edge reflection with additional checks for padding/margins
      const paddingLeft = parseInt(
        getComputedStyle(containerRef.current).paddingLeft,
        10
      );
      const paddingTop = parseInt(
        getComputedStyle(containerRef.current).paddingTop,
        10
      );
      const maxX = containerWidth - size - paddingLeft;
      const maxY = containerHeight - size - paddingTop;

      if (newX + size > maxX) {
        setPosition({ x: maxX - size, y: newY });
      } else if (newX < paddingLeft) {
        setPosition({ x: paddingLeft, y: newY });
      }

      if (newY + size > maxY) {
        setPosition({ x: newX, y: maxY - size });
      } else if (newY < paddingTop) {
        setPosition({ x: newX, y: paddingTop });
      } else {
        setPosition({ x: newX, y: newY });
      }
    };

    const intervalId = setInterval(updatePosition, 16); // Adjust interval for desired speed

    return () => clearInterval(intervalId);
  }, [speed, size]);

  return (
    <motion.div
      ref={containerRef}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: "50%",
        position: "absolute",
        left: position.x,
        top: position.y,
      }}
      // data-id={bubble.id} // Assuming data-id for bubble identification
    />
  );
};

export default Bubble;
