import React, { useState } from "react";

const TestComponent = () => {
  const [isTouched, setIsTouched] = useState(false);

  const checkTouch = () => {
    const circle1 = document.getElementById("circle1");
    const circle2 = document.getElementById("circle2");

    if (circle1 && circle2) {
      const rect1 = circle1.getBoundingClientRect();
      const rect2 = circle2.getBoundingClientRect();

      const circle1X = rect1.left + rect1.width / 2;
      const circle1Y = rect1.top + rect1.height / 2;

      const circle2X = rect2.left + rect2.width / 2;
      const circle2Y = rect2.top + rect2.height / 2;

      const distance = Math.sqrt(
        Math.pow(circle2X - circle1X, 2) + Math.pow(circle2Y - circle1Y, 2)
      );

      const touchDistance = rect1.width / 2 + rect2.width / 2;

      setIsTouched(distance <= touchDistance);
    }
  };

  return (
    <div className="my-8">
      <div
        id="circle1"
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          backgroundColor: "red",
          position: "absolute",
          top: "50px",
          left: "50px",
        }}
      ></div>
      <div
        id="circle2"
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          backgroundColor: "blue",
          position: "absolute",
          top: "50px",
          left: "160px",
        }}
      ></div>
      <button onClick={checkTouch}>Check Touch</button>
      <p>{isTouched ? "Edge is touched" : "Edge is not touched"}</p>
    </div>
  );
};

export default TestComponent;
