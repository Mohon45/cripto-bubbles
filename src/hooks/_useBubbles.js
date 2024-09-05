// import { useContext, useEffect, useRef, useState } from "react";
// import * as PIXI from "pixi.js";
// import usePixiUtils from "./usePixiUtils";
// import { SettingAndFilterOptionsContext } from "../providers/SettingAndFilterOptionsProvider";
// import { DataContext } from "../providers/DataProvider";

// const changeSizeStep = 2;

// export const useBubbles = (width, height) => {
//   const { activeBubbleLinkID, bubbleNavLinks } = useContext(
//     SettingAndFilterOptionsContext
//   );

//   const { size: bubbleSort } =
//     bubbleNavLinks?.find(({ id }) => activeBubbleLinkID === id) || {};

//   const { coins, handleActiveBubble } = useContext(DataContext);

//   const { createText2, createGradientTexture, createText, createImageSprite } =
//     usePixiUtils();

//   const { colors } = useContext(SettingAndFilterOptionsContext);

//   const plusColor = colors === "Red + Green" ? "green" : "cyan";
//   const minusColor = colors === "Red + Green" ? "red" : "yellow";

//   const [appConfig, setAPpConfig] = useState({
//     // width: typeof window !== "undefined" ? window.innerWidth - 16 : 100,
//     // height: typeof window !== "undefined" ? window.innerHeight * 0.84 : 100,
//     speed: 0.005,
//     elasticity: 0.1,
//     wallDamping: 0.3,
//     maxCircleSize: 200,
//     minCircleSize: 50,
//   });

//   useEffect(() => {
//     // if (coins?.length > 0) {
//     //   setAPpConfig({
//     //     ...appConfig,
//     //     maxCircleSize: Math.max(coins?.map((coin) => coin?.HOUR)),
//     //     minCircleSize: Math.min(coins?.map((coin) => coin?.HOUR)),
//     //   });
//     // }
//   }, [coins]);

//   const { wallDamping, speed, elasticity } = appConfig;

//   const maxCircleSize = Math.max(coins?.map((c) => +c.HOUR)) || 150;
//   const minCircleSize = Math.min(coins?.map((c) => +c.HOUR)) || 20;

//   const getScalingFactor = (data, bubbleSort = "HOUR") => {
//     if (!data) return 1;

//     const max = data.map((item) => {
//       return Math.abs(+item[bubbleSort]);
//     });
//     let totalSquare = 0;

//     for (let i = 0; i < max.length; i++) {
//       const area = Math.PI * max[i] * max[i];
//       totalSquare += area;
//     }

//     return (
//       Math.sqrt((width * height) / totalSquare) * (width > 920 ? 0.8 : 0.5)
//     );
//   };

//   const update = (
//     circles,
//     imageSprites,
//     textSprites,
//     text2Sprites,
//     circleGraphics = []
//   ) => {
//     const minVelocity = 0.1;
//     const velocityDecay = 0.97;
//     const changeSizeStep = 2;

//     return () => {
//       for (let i = 0; i < circles.length; i++) {
//         const circle = circles[i];
//         const circleGraphic = circleGraphics[i];
//         const imageSprite = imageSprites[i];
//         const text = textSprites[i];
//         const text2 = text2Sprites[i];

//         const updateCircleChilds = () => {
//           circleGraphic.texture = createGradientTexture(
//             circle.radius * 4,
//             circle.color
//           );

//           const fontSize = circle.radius * 0.5;
//           const isFullSize = circle.radius * 0.5 < 20;
//           const isTextVisible = fontSize >= 20;

//           if (imageSprite) {
//             imageSprite.width = circle.radius * (isFullSize ? 1.2 : 0.5);
//             imageSprite.height = circle.radius * (isFullSize ? 1.2 : 0.5);
//             imageSprite.position = {
//               x: 0,
//               y: isFullSize ? 0 : -circle.radius / 2,
//             };
//           }

//           const textStyle = new PIXI.TextStyle({
//             fontSize: isTextVisible ? fontSize + "px" : "1px",
//             fill: "#ffffff",
//           });

//           const text2Style = new PIXI.TextStyle({
//             fontSize: isTextVisible ? fontSize * 0.5 + "px" : "1px",
//             fill: "#ffffff",
//           });

//           text.style = textStyle;
//           text.position.y = 0.15 * circle.radius;

//           text2.style = text2Style;
//           text2.position.y = circle.radius / 1.5;
//         };

//         // Update circle position
//         // if (!circle.dragging) {
//         if (true) {
//           circle.x += circle.vx;
//           circle.y += circle.vy;

//           // Apply velocity decay
//           circle.vx *= velocityDecay;
//           circle.vy *= velocityDecay;

//           // Ensure minimum velocity
//           circle.vx =
//             Math.abs(circle.vx) < minVelocity
//               ? minVelocity * Math.sign(circle.vx)
//               : circle.vx;
//           circle.vy =
//             Math.abs(circle.vy) < minVelocity
//               ? minVelocity * Math.sign(circle.vy)
//               : circle.vy;
//         } else {
//           // Apply random movement while dragging
//           // const randomMovement = (Math.random() - 0.5) * 2;
//           // circle.x += randomMovement;
//           // circle.y += randomMovement;
//         }

//         // Check for collisions with walls
//         if (circle.x - circle.radius < 0) {
//           circle.x = circle.radius; // Keep the circle inside the left wall
//           circle.vx *= -1;
//           circle.vx *= 1 - wallDamping; // Apply wall damping
//         } else if (circle.x + circle.radius > width) {
//           circle.x = width - circle.radius; // Keep the circle inside the right wall
//           circle.vx *= -1;
//           circle.vx *= 1 - wallDamping; // Apply wall damping
//         }
//         if (circle.y - circle.radius < 0) {
//           circle.y = circle.radius; // Keep the circle inside the top wall
//           circle.vy *= -1;
//           circle.vy *= 1 - wallDamping; // Apply wall damping
//         } else if (circle.y + circle.radius > height) {
//           circle.y = height - circle.radius; // Keep the circle inside the bottom wall
//           circle.vy *= -1;
//           circle.vy *= 1 - wallDamping; // Apply wall damping
//         }

//         // Check for collisions with other circles
//         for (let j = i + 1; j < circles.length; j++) {
//           const otherCircle = circles[j];
//           const dx = otherCircle.x - circle.x;
//           const dy = otherCircle.y - circle.y;
//           const distance = Math.sqrt(dx * dx + dy * dy);

//           if (distance < circle.radius + otherCircle.radius) {
//             // Colliding circles
//             const angle = Math.atan2(dy, dx);

//             // Calculate the new velocities after collision with elasticity
//             const totalRadius = circle.radius + otherCircle.radius;
//             const overlap = totalRadius - distance;

//             // Separate circles immediately
//             const separationDistance = overlap / 2;
//             const cosAngle = Math.cos(angle);
//             const sinAngle = Math.sin(angle);

//             circle.x -= separationDistance * cosAngle;
//             circle.y -= separationDistance * sinAngle;
//             otherCircle.x += separationDistance * cosAngle;
//             otherCircle.y += separationDistance * sinAngle;

//             const force = overlap * elasticity;

//             // Apply the separation force and damping factor
//             const dampingFactor = wallDamping;
//             circle.vx -= force * cosAngle * dampingFactor;
//             circle.vy -= force * sinAngle * dampingFactor;
//             otherCircle.vx += force * cosAngle * dampingFactor;
//             otherCircle.vy += force * sinAngle * dampingFactor;
//           }
//         }

//         // Update container position
//         const container = circleGraphic.parent;
//         container.position.set(circle.x, circle.y);

//         // Add event listeners for dragging
//         container.interactive = true;
//         container.buttonMode = true;
//         // container
//         //   .on("pointerdown", (event) => handleMouseDown(event, circle))
//         //   .on("pointerup", () => handleMouseUp(circle))
//         //   .on("pointerupoutside", () => handleMouseUp(circle))
//         //   .on("pointermove", () => handleMouseMove(circle));

//         // Smoothly change the size of the circle
//         if (circle.radius !== circle.targetRadius) {
//           container.cacheAsBitmap = false;

//           const sizeDifference = circle.targetRadius - circle.radius;

//           if (Math.abs(sizeDifference) <= changeSizeStep) {
//             circle.radius = circle.targetRadius;
//             container.cacheAsBitmap = true;
//           } else {
//             circle.radius > circle.targetRadius
//               ? (circle.radius -= changeSizeStep)
//               : (circle.radius += changeSizeStep);
//             updateCircleChilds();
//           }
//         } else {
//           container.cacheAsBitmap = true;
//         }
//       }
//     };
//   };

//   // const update = (
//   //   circles,
//   //   imageSprites,
//   //   textSprites,
//   //   text2Sprites,
//   //   circleGraphics = []
//   // ) => {
//   //   // Minimum velocity threshold to prevent sticking

//   //   // console.log("Called");
//   //   return () => {
//   //     const minVelocity = 0.1;
//   //     for (let i = 0; i < circles.length; i++) {
//   //       const circle = circles[i];
//   //       const circleGraphic = circleGraphics[i];
//   //       const imageSprite = imageSprites[i];
//   //       const text = textSprites[i];
//   //       const text2 = text2Sprites[i];

//   //       const updateCircleChilds = () => {
//   //         circleGraphic.texture = createGradientTexture(
//   //           circle.radius * 4,
//   //           circle.color
//   //         );

//   //         const fontSize = circle.radius * 0.5;
//   //         const isFullSize = circle.radius * 0.5 < 20;
//   //         const isTextVisible = fontSize >= 20;

//   //         if (imageSprite) {
//   //           imageSprite.width = circle.radius * (isFullSize ? 1.2 : 0.5);
//   //           imageSprite.height = circle.radius * (isFullSize ? 1.2 : 0.5);
//   //           imageSprite.position = {
//   //             x: 0,
//   //             y: isFullSize ? 0 : -circle.radius / 2,
//   //           };
//   //         }

//   //         const textStyle = new PIXI.TextStyle({
//   //           fontSize: isTextVisible ? fontSize + "px" : "1px",
//   //           fill: "#ffffff",
//   //         });

//   //         const text2Style = new PIXI.TextStyle({
//   //           fontSize: isTextVisible ? fontSize * 0.5 + "px" : "1px",
//   //           fill: "#ffffff",
//   //         });

//   //         text.style = textStyle;
//   //         text.position.y = 0.15 * circle.radius;

//   //         text2.style = text2Style;
//   //         text2.position.y = circle.radius / 1.5;
//   //       };

//   //       // Update circle position
//   //       circle.x += circle.vx;
//   //       circle.y += circle.vy;

//   //       // Ensure minimum velocity
//   //       circle.vx =
//   //         Math.abs(circle.vx) < minVelocity
//   //           ? minVelocity * Math.sign(circle.vx)
//   //           : circle.vx;
//   //       circle.vy =
//   //         Math.abs(circle.vy) < minVelocity
//   //           ? minVelocity * Math.sign(circle.vy)
//   //           : circle.vy;

//   //       // Check for collisions with walls
//   //       if (circle.x - circle.radius < 0) {
//   //         circle.x = circle.radius; // Keep the circle inside the left wall
//   //         circle.vx *= -1;
//   //         circle.vx *= 1 - wallDamping; // Apply wall damping
//   //       } else if (circle.x + circle.radius > width) {
//   //         circle.x = width - circle.radius; // Keep the circle inside the right wall
//   //         circle.vx *= -1;
//   //         circle.vx *= 1 - wallDamping; // Apply wall damping
//   //       }
//   //       if (circle.y - circle.radius < 0) {
//   //         circle.y = circle.radius; // Keep the circle inside the top wall
//   //         circle.vy *= -1;
//   //         circle.vy *= 1 - wallDamping; // Apply wall damping
//   //       } else if (circle.y + circle.radius > height) {
//   //         circle.y = height - circle.radius; // Keep the circle inside the bottom wall
//   //         circle.vy *= -1;
//   //         circle.vy *= 1 - wallDamping; // Apply wall damping
//   //       }

//   //       // Check for collisions with other circles
//   //       for (let j = i + 1; j < circles.length; j++) {
//   //         const otherCircle = circles[j];
//   //         const dx = otherCircle.x - circle.x;
//   //         const dy = otherCircle.y - circle.y;
//   //         const distance = Math.sqrt(dx * dx + dy * dy);

//   //         if (distance < circle.radius + otherCircle.radius) {
//   //           // Colliding circles
//   //           const angle = Math.atan2(dy, dx);

//   //           // Calculate the new velocities after collision with elasticity
//   //           const totalRadius = circle.radius + otherCircle.radius;
//   //           const overlap = totalRadius - distance;
//   //           const force = overlap * elasticity;

//   //           const dampingFactor = wallDamping;
//   //           circle.vx -=
//   //             force * Math.cos(angle) * dampingFactor + circle.vx * 0.01;
//   //           circle.vy -=
//   //             force * Math.sin(angle) * dampingFactor + circle.vy * 0.01;
//   //           otherCircle.vx += force * Math.cos(angle) * dampingFactor;
//   //           otherCircle.vy += force * Math.sin(angle) * dampingFactor;
//   //         }
//   //       }

//   //       // Update container position
//   //       const container = circleGraphic.parent;
//   //       container.position.set(circle.x, circle.y);

//   //       // Smoothly change the size of the circle
//   //       if (circle.radius !== circle.targetRadius) {
//   //         container.cacheAsBitmap = false;

//   //         const sizeDifference = circle.targetRadius - circle.radius;

//   //         if (Math.abs(sizeDifference) <= changeSizeStep) {
//   //           circle.radius = circle.targetRadius;
//   //           container.cacheAsBitmap = true;
//   //         } else {
//   //           circle.radius > circle.targetRadius
//   //             ? (circle.radius -= changeSizeStep)
//   //             : (circle.radius += changeSizeStep);
//   //           updateCircleChilds();
//   //         }
//   //       }
//   //     }
//   //   };
//   // };

//   const generateCircles = (coins, scalingFactor, bubbleSort = "HOUR") => {
//     const cols = Math.ceil(Math.sqrt(coins?.length)); // Number of columns for grid layout
//     const spacingX = width / cols;
//     const spacingY = height / cols;

//     const shapes = coins?.map((item, index) => {
//       const col = index % cols;
//       const row = Math.floor(index / cols);

//       const radius = Math.abs(item[bubbleSort] * scalingFactor);

//       // const { HOUR, DAY, MARKET_CAP, WEEK, MONTH, YEAR } = item;

//       const data = {
//         id: item?.id,
//         symbol: item?.symbol?.slice(0, 4),
//         image: item?.image,
//         coinName: item?.symbol,
//         x: col * spacingX + spacingX / 2,
//         y: row * spacingY + spacingY / 2,
//         vx: Math.random() * speed * 2 - speed,
//         vy: Math.random() * speed * 2 - speed,
//         color: item[bubbleSort] > 0 ? plusColor : minusColor,
//         targetRadius:
//           radius > maxCircleSize
//             ? maxCircleSize
//             : radius > minCircleSize
//             ? radius
//             : minCircleSize,
//         radius: minCircleSize,
//         dragging: false,
//         text2: null,
//         text: null,
//         imageSprite: null,
//         // HOUR,
//         // DAY,
//         // WEEK,
//         // MONTH,
//         // YEAR,
//         // MARKET_CAP,
//         ...item,
//       };

//       const shape = {
//         ...data,
//         text2: createText2(data, bubbleSort),
//         text: createText(data),
//         imageSprite: createImageSprite(data),
//       };

//       return shape;
//     });

//     return shapes;
//   };

//   const addCanvasEventListeners = (app, circles, appCanvas) => {
//     let dragTimeout = null;
//     let dragInterval = null;

//     const handleMouseMove = (event) => {
//       clearInterval(dragInterval);

//       const rect = event.target.getBoundingClientRect();
//       const mouseX = event.clientX - rect.left;
//       const mouseY = event.clientY - rect.top;
//       let dragForce = 0.0002;

//       for (let circle of circles) {
//         if (circle.dragging) {
//           const dx = mouseX - circle.x;
//           const dy = mouseY - circle.y;
//           circle.vx += dx * dragForce;
//           circle.vy += dy * dragForce;

//           dragInterval = setInterval(() => {
//             const dx = mouseX - circle.x;
//             const dy = mouseY - circle.y;
//             circle.vx += dx * (dragForce + 0.0001);
//             circle.vy += dy * (dragForce + 0.0001);
//           }, 5);
//         }
//       }
//     };

//     function handleMouseDown(event) {
//       const rect = event.target.getBoundingClientRect();
//       const clickX = event.clientX - rect.left;
//       const clickY = event.clientY - rect.top;

//       for (let circle of circles) {
//         const dx = clickX - circle.x;
//         const dy = clickY - circle.y;
//         const distance = Math.sqrt(dx * dx + dy * dy);

//         if (distance <= circle.radius) {
//           dragTimeout = setTimeout(() => {
//             circle.dragging = true;
//             appCanvas.stage.setChildIndex(
//               circle,
//               appCanvas.stage.children.length - 1
//             );
//           }, 200); // Delay before dragging starts
//         }
//       }
//     }

//     function handleMouseUp(event) {
//       clearTimeout(dragTimeout);
//       clearInterval(dragInterval);

//       for (let circle of circles) {
//         if (circle.dragging) {
//           circle.dragging = false;
//           return;
//         }
//       }

//       let clickedBubble = false;

//       const rect = event.target.getBoundingClientRect();
//       const clickX = event.clientX - rect.left;
//       const clickY = event.clientY - rect.top;

//       for (let circle of circles) {
//         const dx = clickX - circle.x;
//         const dy = clickY - circle.y;
//         const distance = Math.sqrt(dx * dx + dy * dy);

//         if (distance <= circle.radius) {
//           handleActiveBubble(circle);
//           clickedBubble = true;
//           break;
//         }
//       }

//       if (clickedBubble) return;

//       const waveForce = 100; // Adjust the wave force as needed

//       circles.forEach((circle) => {
//         const dx = circle.x - clickX;
//         const dy = circle.y - clickY;
//         const distance = Math.sqrt(dx * dx + dy * dy);
//         const angle = Math.atan2(dy, dx);

//         // Apply a force to push the circles away from the click point
//         circle.vx += (waveForce * Math.cos(angle)) / distance;
//         circle.vy += (waveForce * Math.sin(angle)) / distance;
//       });
//     }

//     app.addEventListener("mouseup", (e) => handleMouseUp(e));
//     app.addEventListener("mousedown", (e) => handleMouseDown(e));
//     app.addEventListener("mousemove", (e) => handleMouseMove(e));
//   };

// const generateCircles = (coins, scalingFactor, bubbleSort = "HOUR") => {
//   const shapes = coins?.map((item) => {
//     // console.log({ scalingFactor });
//     const radius = Math.abs(item[bubbleSort] * scalingFactor);

//     const { HOUR, DAY, MARKET_CAP, WEEK, MONTH, YEAR } = item;

//     const data = {
//       id: item?.id,
//       symbol: item?.symbol?.slice(0, 4),
//       image: item?.image,
//       coinName: item?.symbol,
//       x: Math.random() * (width - radius * 2),
//       y: Math.random() * (height - radius * 2),
//       vx: Math.random() * speed * 2 - speed,
//       vy: Math.random() * speed * 2 - speed,
//       color: item[bubbleSort] > 0 ? plusColor : minusColor,
//       targetRadius:
//         radius > maxCircleSize
//           ? maxCircleSize
//           : radius > minCircleSize
//           ? radius
//           : minCircleSize,
//       radius: minCircleSize,
//       dragging: false,
//       text2: null,
//       HOUR,
//       DAY,
//       WEEK,
//       MONTH,
//       YEAR,
//       MARKET_CAP,
//     };

//     const shape = { ...data, text2: createText2(data, bubbleSort) };

//     return shape;
//   });

//   return shapes;
// };

//   return {
//     appConfig,
//     getScalingFactor,
//     update,
//     // handleMouseMove,
//     // handleMouseDown,
//     // handleMouseUp,
//     generateCircles,
//     addCanvasEventListeners,
//   };
// };
