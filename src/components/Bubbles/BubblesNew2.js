import React, { useRef, useEffect, useContext } from "react";
import * as PIXI from "pixi.js";
import { DataContext } from "../../providers/DataProvider.js";

const BubblesNew2 = () => {
  const containerRef = useRef();

  const { coins: data } = useContext(DataContext) || {};

  useEffect(() => {
    const app = new PIXI.Application({
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight,
      backgroundColor: "#0F0112",
    });
    containerRef.current.appendChild(app.view);

    const minSpeed = 0.1; // Minimum speed of bubbles
    const friction = 0.99; // Friction factor to reduce speed over time
    const bubbles = [];

    data.forEach((bubbleData) => {
      const bubble = createBubble(bubbleData);
      bubbles.push(bubble);
      app.stage.addChild(bubble);
    });

    app.ticker.add(() => {
      bubbles.forEach((bubble, index) => {
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;

        // Reduce speed gradually
        bubble.vx *= friction;
        bubble.vy *= friction;

        // Ensure minimum speed
        if (Math.abs(bubble.vx) < minSpeed)
          bubble.vx = minSpeed * Math.sign(bubble.vx);
        if (Math.abs(bubble.vy) < minSpeed)
          bubble.vy = minSpeed * Math.sign(bubble.vy);

        // Handle collision with walls
        if (
          bubble.x < bubble.radius ||
          bubble.x > app.screen.width - bubble.radius
        ) {
          bubble.vx *= -1;
        }

        if (
          bubble.y < bubble.radius ||
          bubble.y > app.screen.height - bubble.radius
        ) {
          bubble.vy *= -1;
        }

        // Handle collisions with other bubbles
        for (let i = index + 1; i < bubbles.length; i++) {
          const otherBubble = bubbles[i];
          if (isColliding(bubble, otherBubble)) {
            reflectBubbles(bubble, otherBubble);
          }
        }
      });
    });

    function createBubble(bubbleData) {
      const container = new PIXI.Container();
      const radius = getRadius(bubbleData.HOUR);

      container.radius = radius;
      container.vx = (Math.random() - 0.5) * 2;
      container.vy = (Math.random() - 0.5) * 2;
      container.x = Math.random() * app.screen.width;
      container.y = Math.random() * app.screen.height;

      const graphics = new PIXI.Graphics();
      graphics.beginFill(0xffffff);
      graphics.drawCircle(0, 0, radius);
      graphics.endFill();
      container.addChild(graphics);

      const image = PIXI.Sprite.from(bubbleData.image);
      image.width = radius * 2 * 0.3; // 30% of diameter
      image.height = radius * 2 * 0.3; // 30% of diameter
      image.anchor.set(0.5);
      image.y = -radius * 0.35;
      container.addChild(image);

      const text = new PIXI.Text(bubbleData.symbol, {
        fontSize: radius * 0.5,
        fill: 0x000000,
      }); // 50% of radius
      text.anchor.set(0.5);
      text.y = radius * 0.05;
      container.addChild(text);

      const text2 = new PIXI.Text(bubbleData.text2, {
        fontSize: radius * 0.4,
        fill: 0x000000,
      }); // 40% of radius
      text2.anchor.set(0.5);
      text2.y = radius * 0.35;
      container.addChild(text2);

      return container;
    }

    function getRadius(hourChange) {
      const minSize = 20;
      const maxSize = 150;
      const normalized =
        (hourChange - Math.min(...data.map((d) => d.HOUR))) /
        (Math.max(...data.map((d) => d.HOUR)) -
          Math.min(...data.map((d) => d.HOUR)));
      return minSize + normalized * (maxSize - minSize);
    }

    function isColliding(bubble1, bubble2) {
      const dx = bubble1.x - bubble2.x;
      const dy = bubble1.y - bubble2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < bubble1.radius + bubble2.radius;
    }

    function reflectBubbles(bubble1, bubble2) {
      const dx = bubble1.x - bubble2.x;
      const dy = bubble1.y - bubble2.y;
      const collisionAngle = Math.atan2(dy, dx);

      const speed1 = Math.sqrt(
        bubble1.vx * bubble1.vx + bubble1.vy * bubble1.vy
      );
      const speed2 = Math.sqrt(
        bubble2.vx * bubble2.vx + bubble2.vy * bubble2.vy
      );

      const direction1 = Math.atan2(bubble1.vy, bubble1.vx);
      const direction2 = Math.atan2(bubble2.vy, bubble2.vx);

      const newVx1 = speed1 * Math.cos(direction1 - collisionAngle);
      const newVy1 = speed1 * Math.sin(direction1 - collisionAngle);
      const newVx2 = speed2 * Math.cos(direction2 - collisionAngle);
      const newVy2 = speed2 * Math.sin(direction2 - collisionAngle);

      bubble1.vx =
        newVx2 * Math.cos(collisionAngle) +
        newVy1 * Math.cos(collisionAngle + Math.PI / 2);
      bubble1.vy =
        newVx2 * Math.sin(collisionAngle) +
        newVy1 * Math.sin(collisionAngle + Math.PI / 2);
      bubble2.vx =
        newVx1 * Math.cos(collisionAngle) +
        newVy2 * Math.cos(collisionAngle + Math.PI / 2);
      bubble2.vy =
        newVx1 * Math.sin(collisionAngle) +
        newVy2 * Math.sin(collisionAngle + Math.PI / 2);
    }

    return () => {
      app.destroy(true, true);
    };
  }, [data]);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "78vh" }}></div>
  );
};

export default BubblesNew2;
