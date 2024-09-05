// "use client";
// import React, { useState, useEffect, useRef, useContext } from "react";
// import { Stage, Layer, Circle, Group, Text, Image } from "react-konva";
// import BubbleNav from "./BubbleNav";
// import useImage from "use-image";
// import Konva from "konva";
// import { DataContext } from "../../providers/DataProvider.js";
// import Modal from "../shared/Modal";
// import { SettingAndFilterOptionsContext } from "../../providers/SettingAndFilterOptionsProvider";
// import BubblesLoad from "./BubblesLoad";
// import { color } from "../../data/color";
// import { formatNumber } from "./BubbleModal";
// import { lists } from "../Navbar/SelectLinks/USD";

// const bubbleNavMap = {
//   Hour: "percent_change_1h",
//   Day: "percent_change_24h",
//   Week: "percent_change_7d",
//   Month: "percent_change_30d",
//   Year: "yearPercentage",
//   "Market Cap & Day": "market_cap",
//   "2 Months": "percent_change_60d",
//   "3 Months": "percent_change_30d",
// };

// const bubbleContentMap = {
//   Performance: "volume_change_24h",
//   "Rank ↑↓": "cmc_rank",
//   "Market Cap": "market_cap",
//   "24h Volume": "percent_change_24h",
//   Price: "price",
//   Name: "name",
//   Dominance: "market_cap_dominance",
//   Hour: "percent_change_1h",
//   Day: "percent_change_24h",
//   Week: "percent_change_7d",
//   Month: "percent_change_30d",
//   Year: "yearPercentage",
// };

// const bubbleSizesMap = {
//   Performance: "percent_change_24h",
//   "Rank ↑↓": "cmc_rank",
//   "Market Cap": "market_cap",
//   "24h Volume": "percent_change_24h",
//   Hour: "percent_change_1h",
//   Week: "percent_change_7d",
//   Month: "percent_change_30d",
//   Year: "yearPercentage",
// };

// function calculatePercentile(value, sortedArray) {
//   let index = sortedArray.indexOf(value);
//   if (index === -1) {
//     return null;
//   }
//   return ((index + 1) / sortedArray.length) * 100;
// }

// function majorityWithinPercentile(values, minPercentile, maxPercentile) {
//   if (!Array.isArray(values) || values.length === 0) {
//     throw new Error("values should be a non-empty array");
//   }
//   if (
//     minPercentile > maxPercentile ||
//     minPercentile < 0 ||
//     maxPercentile > 100
//   ) {
//     throw new Error("Invalid percentile range");
//   }

//   const minValue = Math.min(...values);
//   const maxValue = Math.max(...values);

//   const minThreshold = minValue + (minPercentile / 100) * (maxValue - minValue);
//   const maxThreshold = minValue + (maxPercentile / 100) * (maxValue - minValue);

//   let countWithinRange = 0;

//   for (let value of values) {
//     if (value >= minThreshold && value <= maxThreshold) {
//       countWithinRange++;
//     }
//   }

//   // // console.log({
//   //   countWithinRange,
//   // });

//   return countWithinRange > values.length / 2;
// }

// const BubbleComponent = () => {
//   const speed = 0.005; // Movement speed of bubbles
//   const containerPadding = 0; // Padding of the parent container
//   const numBubbles = 150;
//   const [minBubbleSize, setMinBubbleSize] = useState(20); // Minimum diameter of bubble
//   const [maxBubbleSize, setMaxBubbleSize] = useState(150); // Maximum diameter of bubble
//   const affectRadius = 100;

//   const containerRef = useRef(null);
//   const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
//   const [bubbles, setBubbles] = useState([]);
//   const [lastDragPos, setLastDragPos] = useState({});
//   const [isReinitializing, setIsReinitializing] = useState(false);

//   const [sizes, setSizes] = useState({
//     min: null,
//     max: null,
//   });

//   // console.log(containerSize);

//   const { cryptos, loading, handleActiveBubble, handleSetIsRefetch } =
//     useContext(DataContext) || {};

//   // console.log({ cryptos: cryptos?.find((c) => c.symbol === "PYTH") });

//   const innerWidth = window.innerWidth;
//   const innerHeight = window.innerHeight;

//   // // // console.log({ bubbles });

//   const { filterOptions, bubbleNavLinks, isReinitialize } = useContext(
//     SettingAndFilterOptionsContext
//   );

//   const {
//     pages: { min, max },
//     activeBubbleLinkID,
//     colors,
//     language,
//     exchanges,
//   } = filterOptions;

//   // // console.log(filterOptions);

//   const stageRef = useRef();

//   const {
//     period,
//     bubbleContent,
//     bubbleColor,
//     bubbleSize: sizeOfBubble,
//   } = bubbleNavLinks.find(({ id }) => id === activeBubbleLinkID) || {};

//   const curPeriod = bubbleNavMap[period];

//   function isWithinPercentageRange(
//     array,
//     minPercentage,
//     maxPercentage,
//     curSize
//   ) {
//     // Sort the array
//     const sortedArray = [...array].sort((a, b) => a - b);

//     // Calculate the indices for the min and max percentage
//     const minIndex = Math.floor(
//       (minPercentage / 100) * (sortedArray.length - 1)
//     );
//     const maxIndex = Math.floor(
//       (maxPercentage / 100) * (sortedArray.length - 1)
//     );

//     // Get the values at these indices
//     const minValue = sortedArray[minIndex];
//     const maxValue = sortedArray[maxIndex];

//     // Check if curSize falls within this range
//     return curSize >= minValue && curSize <= maxValue;
//   }

//   useEffect(() => {
//     const updateContainerSize = () => {
//       if (containerRef.current) {
//         const width = containerRef.current.offsetWidth - containerPadding * 2;
//         const height = containerRef.current.offsetHeight - containerPadding * 2;
//         setContainerSize({ width, height });

//         // // // console.log({ width, height });

//         // Calculate dynamic bubble sizes based on container size and number of bubbles
//         const totalArea = width * height;
//         const avgBubbleArea = totalArea / numBubbles;
//         const avgBubbleSize = Math.sqrt(avgBubbleArea / Math.PI) * 2; // Diameter
//         const dynamicMinBubbleSize = Math.max(avgBubbleSize * 0.5, 5); // Minimum size should not be too small
//         const dynamicMaxBubbleSize = avgBubbleSize * 1.5; // Adjust as needed

//         // // console.log({ dynamicMaxBubbleSize, dynamicMinBubbleSize });

//         setMinBubbleSize(
//           dynamicMinBubbleSize - 20 >= 10
//             ? dynamicMinBubbleSize - 20
//             : dynamicMinBubbleSize
//         );
//         setMaxBubbleSize(dynamicMaxBubbleSize);
//       }
//     };

//     updateContainerSize();
//     // window.addEventListener("resize", updateContainerSize);

//     // return () => {
//     //   window.removeEventListener("resize", updateContainerSize);
//     // };
//   }, [containerPadding]);

//   const generateGridPosition = (
//     index,
//     bubbleSize,
//     containerSize,
//     totalBubbles
//   ) => {
//     const cols = Math.ceil(Math.sqrt(totalBubbles));
//     const rows = Math.ceil(totalBubbles / cols);
//     const cellWidth = containerSize.width / cols;
//     const cellHeight = containerSize.height / rows;

//     const col = index % cols;
//     const row = Math.floor(index / cols);

//     const x = col * cellWidth + cellWidth / 2;
//     const y = row * cellHeight + cellHeight / 2;

//     const vx = Math.random() * speed * 2 - speed; // Randomize initial velocity
//     const vy = Math.random() * speed * 2 - speed; // Randomize initial velocity

//     return { x, y, vx, vy };
//   };

//   const initializeBubbles = () => {
//     const newBubbles = [];

//     // Find the min and max percent_change_1h values to normalize the sizes
//     const minPercentChange = Math.min(
//       ...cryptos?.map((crypto) =>
//         sizeOfBubble === "Rank ↑↓"
//           ? crypto[bubbleSizesMap[sizeOfBubble]]
//           : crypto.quote[language][bubbleSizesMap[sizeOfBubble]]
//       )
//     );
//     const maxPercentChange = Math.max(
//       ...cryptos?.map((crypto) =>
//         sizeOfBubble === "Rank ↑↓"
//           ? crypto[bubbleSizesMap[sizeOfBubble]]
//           : crypto.quote[language][bubbleSizesMap[sizeOfBubble]]
//       )
//     );

//     const normalizeSize = (percentChange) => {
//       const normalized =
//         minPercentChange === maxPercentChange
//           ? percentChange / maxPercentChange
//           : (percentChange - minPercentChange) /
//             (maxPercentChange - minPercentChange);
//       const reduce = sizeOfBubble === "percent_change_7d" ? 20 : 0;
//       const increase = sizeOfBubble === "market_cap" ? 30 : 0;

//       return (
//         normalized * (maxBubbleSize - minBubbleSize) +
//         minBubbleSize -
//         reduce +
//         increase
//       );
//     };

//     const gridRows = Math.sqrt(cryptos.length);
//     const gridCols = Math.ceil(cryptos.length / gridRows);
//     const cellWidth = containerSize.width / gridCols;
//     const cellHeight = containerSize.height / gridRows;

//     const cols = Math.ceil(Math.sqrt(100));

//     const spacingX = containerSize?.width / cols;
//     const spacingY = containerSize?.height / cols;

//     const max = cryptos?.map((item) => {
//       return Math.abs(item?.quote?.USD?.percent_change_1h);
//     });

//     let totalSquare = 0;

//     for (let i = 0; i < max.length; i++) {
//       const area = Math.PI * max[i] * max[i];
//       totalSquare += area;
//     }

//     let scalingFactor =
//       Math.sqrt((containerSize?.width * containerSize?.height) / totalSquare) *
//       (containerSize?.width > 920 ? 0.8 : 0.5);

//     for (let i = 0; i < cryptos.length; i++) {
//       const crypto = cryptos[i];
//       const existingBubble = bubbles.find((b) => b.id === crypto.id);
//       // const bubbleSize = normalizeSize(
//       // sizeOfBubble === "Rank ↑↓"
//       //   ? crypto[bubbleSizesMap[sizeOfBubble]]
//       //   : crypto?.quote[language][bubbleSizesMap[sizeOfBubble]]
//       // );

//       const col = i % cols;
//       const row = Math.floor(i / cols);

//       // Randomize the position within the cell
//       // const x = col * cellWidth + Math.random() * (cellWidth - bubbleSize);
//       // const y = row * cellHeight + Math.random() * (cellHeight - bubbleSize);

//       // const x = col * spacingX + spacingX / 2;
//       // const y = row * spacingY + spacingY / 2;

//       // const vx = Math.random() * speed * 2 - speed;
//       // const vy = Math.random() * speed * 2 - speed;

//       const content = ["Name", "Rank ↑↓"].includes(bubbleContent)
//         ? crypto[bubbleContentMap[bubbleContent]]
//         : crypto.quote[language || "USD"][bubbleContentMap[bubbleContent]];

//       const sizes = cryptos?.map((crypto) =>
//         sizeOfBubble === "Rank ↑↓"
//           ? crypto[bubbleSizesMap[sizeOfBubble]]
//           : crypto.quote[language][bubbleSizesMap[sizeOfBubble]]
//       );

//       const isMajoritySmall = majorityWithinPercentile(sizes, 0, 40);

//       const curSize =
//         sizeOfBubble === "Rank ↑↓"
//           ? crypto[bubbleSizesMap[sizeOfBubble]]
//           : crypto?.quote[language][bubbleSizesMap[sizeOfBubble]];

//       const radius = Math.abs(curSize * scalingFactor);

//       let minCircleSize = exchanges
//         ? containerSize.width * 0.005
//         : containerSize.width * 0.02;
//       const maxCircleSize = containerSize.width * 0.2;
//       let circleSize = radius * 2;

//       const twentyPercentile =
//         minCircleSize + (maxCircleSize - minCircleSize) * 0.2;

//       const increase =
//         (sizeOfBubble === "Market Cap" && circleSize < twentyPercentile) ||
//         isMajoritySmall
//           ? innerWidth * (isMajoritySmall ? 0.02 : 0.025)
//           : 0;

//       minCircleSize = minCircleSize + increase;
//       let size =
//         circleSize > maxCircleSize
//           ? maxCircleSize
//           : circleSize > minCircleSize
//           ? circleSize
//           : minCircleSize;

//       const isBetween80to100 = isWithinPercentageRange(sizes, 80, 100, curSize);
//       const isBetween40to80 = isWithinPercentageRange(sizes, 40, 80, curSize);
//       const isBetween20to40 = isWithinPercentageRange(sizes, 20, 40, curSize);

//       // isBetween80to100 && // console.log({ size });
//       size =
//         isBetween80to100 && !exchanges && isMajoritySmall
//           ? size * 0.6
//           : isBetween80to100 && !exchanges
//           ? size * 0.75
//           : isBetween40to80 && !exchanges
//           ? size * 1.3
//           : isBetween20to40 && !exchanges && isMajoritySmall
//           ? size * 1.3
//           : isBetween20to40 && !exchanges
//           ? size * 1.1
//           : size;

//       // isBetween80to100 && // console.log({ isBetween80to100, size });

//       const { x, y, vx, vy } = generateGridPosition(
//         i,
//         size,
//         containerSize,
//         cryptos.length
//       );

//       const bubble = {
//         id: crypto.id,
//         size,
//         x,
//         y,
//         vx,
//         vy,
//         dragging: false,
//         modalOpen: false,
//         value: crypto?.quote[language][curPeriod],
//         content,
//         name: crypto?.name,
//         data: crypto,
//         symbol: crypto?.symbol,
//         market_urls: crypto?.market_urls,
//         text1FontSize: size * 0.15,
//         text2FontSize: size * 0.15,
//         text1X: -size * 0.5,
//         text1Y: -size * 0.05,
//         text2X: -size * 0.5,
//         text2Y: -size * -0.2,
//       };

//       newBubbles.push(bubble);
//     }

//     setBubbles(newBubbles);
//   };

//   useEffect(() => {
//     const containerWidth = containerRef?.current?.offsetWidth;
//     const containerHeight = containerRef?.current?.offsetHeight;

//     setContainerSize({ width: containerWidth, height: containerHeight });
//   }, [innerWidth, innerHeight]);

//   useEffect(() => {
//     initializeBubbles();
//   }, [containerSize]);

//   const reInitializeBubbles = () => {
//     // console.log("Called");
//     setIsReinitializing(true);
//     const newBubbles = [];
//     const minBubbleSpacing =
//       Math.min(containerSize.width, containerSize.height) /
//       Math.sqrt(cryptos.length);

//     if (cryptos?.length === 0) return setIsReinitializing(false);

//     // Find the min and max percent_change_1h values to normalize the sizes
//     const minPercentChange = Math.min(
//       ...cryptos?.map((crypto) =>
//         sizeOfBubble === "Rank ↑↓"
//           ? crypto[bubbleSizesMap[sizeOfBubble]]
//           : crypto.quote[language][bubbleSizesMap[sizeOfBubble]]
//       )
//     );
//     const maxPercentChange = Math.max(
//       ...cryptos?.map((crypto) =>
//         sizeOfBubble === "Rank ↑↓"
//           ? crypto[bubbleSizesMap[sizeOfBubble]]
//           : crypto.quote[language][bubbleSizesMap[sizeOfBubble]]
//       )
//     );

//     const normalizeSize = (percentChange) => {
//       const normalized =
//         minPercentChange === maxPercentChange
//           ? percentChange / maxPercentChange
//           : (percentChange - minPercentChange) /
//             (maxPercentChange - minPercentChange);
//       const reduce = sizeOfBubble === "percent_change_7d" ? 20 : 0;
//       const increase = sizeOfBubble === "Market Cap" ? innerWidth * 0.025 : 0;

//       // increase && // console.log({ increase });

//       return (
//         normalized * (maxBubbleSize - minBubbleSize) +
//         minBubbleSize -
//         reduce +
//         increase
//       );
//     };

//     const cols = Math.ceil(Math.sqrt(100));

//     const spacingX = containerSize?.width / cols;
//     const spacingY = containerSize?.height / cols;

//     const max = cryptos?.map((crypto) => {
//       return Math.abs(
//         sizeOfBubble === "Rank ↑↓"
//           ? crypto[bubbleSizesMap[sizeOfBubble]]
//           : crypto.quote[language][bubbleSizesMap[sizeOfBubble]]
//       );
//     });

//     let totalSquare = 0;

//     for (let i = 0; i < max.length; i++) {
//       const area = Math.PI * max[i] * max[i];
//       totalSquare += area;
//     }

//     let scalingFactor =
//       Math.sqrt((containerSize?.width * containerSize?.height) / totalSquare) *
//       (containerSize?.width > 920 ? 0.8 : 0.5);

//     cryptos.forEach((crypto) => {
//       // if (!crypto?.quote?.USD?.yearPercentage) return;

//       const existingBubble = bubbles.find((b) => b.id === crypto.id);
//       const bubbleSize = normalizeSize(
//         sizeOfBubble === "Rank ↑↓"
//           ? crypto[bubbleSizesMap[sizeOfBubble]]
//           : crypto.quote[language][bubbleSizesMap[sizeOfBubble]],
//         existingBubble?.name
//       );

//       const curSize =
//         sizeOfBubble === "Rank ↑↓"
//           ? crypto[bubbleSizesMap[sizeOfBubble]]
//           : crypto?.quote[language][bubbleSizesMap[sizeOfBubble]];

//       const radius = Math.abs(curSize * scalingFactor);

//       let minCircleSize = exchanges
//         ? containerSize.width * 0.005
//         : containerSize.width * 0.02;
//       const maxCircleSize = containerSize.width * 0.2;

//       const twentyPercentile =
//         minCircleSize + (maxCircleSize - minCircleSize) * 0.2;

//       const sizes = cryptos?.map((crypto) =>
//         sizeOfBubble === "Rank ↑↓"
//           ? crypto[bubbleSizesMap[sizeOfBubble]]
//           : crypto.quote[language][bubbleSizesMap[sizeOfBubble]]
//       );

//       const isMajoritySmall = majorityWithinPercentile(sizes, 0, 40);

//       // isMajoritySmall && // console.log({ isMajoritySmall });

//       let circleSize = radius * 2;
//       const increase =
//         (sizeOfBubble === "Market Cap" && circleSize < twentyPercentile) ||
//         isMajoritySmall
//           ? innerWidth * (isMajoritySmall ? 0.02 : 0.025)
//           : 0;

//       // // console.log({
//       //   sizeOfBubble,
//       //   minCircleSize,
//       //   circleSize,
//       //   twentyPercentile: circleSize < twentyPercentile,
//       //   increase,
//       // });

//       // increase && // console.log({ circleSize });

//       minCircleSize = minCircleSize + increase;

//       // increase && // console.log({ circleSize });

//       const x = existingBubble
//         ? existingBubble.x
//         : Math.random() * (containerSize.width - bubbleSize) + bubbleSize / 2;
//       const y = existingBubble
//         ? existingBubble.y
//         : Math.random() * (containerSize.height - bubbleSize) + bubbleSize / 2;

//       const vx = existingBubble
//         ? existingBubble.vx
//         : Math.random() * speed * 2 - speed;
//       const vy = existingBubble
//         ? existingBubble.vy
//         : Math.random() * speed * 2 - speed;

//       const content = ["Name", "Rank ↑↓"].includes(bubbleContent)
//         ? crypto[bubbleContentMap[bubbleContent]]
//         : crypto.quote[language || "USD"][bubbleContentMap[bubbleContent]];

//       let size =
//         circleSize > maxCircleSize
//           ? maxCircleSize
//           : circleSize > minCircleSize
//           ? circleSize
//           : minCircleSize;

//       const isBetween80to100 = isWithinPercentageRange(sizes, 80, 100, curSize);
//       const isBetween40to80 = isWithinPercentageRange(sizes, 40, 80, curSize);
//       const isBetween20to40 = isWithinPercentageRange(sizes, 20, 40, curSize);
//       const isBetween0to20 = isWithinPercentageRange(sizes, 0, 20, curSize);
//       // isBetween80to100 && // console.log({ size });

//       const isMajorityUnder20 = majorityWithinPercentile(sizes, 0, 20);

//       size =
//         isBetween80to100 && !exchanges && isMajoritySmall
//           ? size * 0.6
//           : isBetween80to100 && !exchanges
//           ? size * 0.75
//           : isBetween40to80 && !exchanges
//           ? size * 1.3
//           : isBetween20to40 && !exchanges && isMajorityUnder20
//           ? size * 1.5
//           : isBetween20to40 && !exchanges && isMajoritySmall
//           ? size * 1.3
//           : isBetween20to40 && !exchanges
//           ? size * 1.1
//           : isBetween0to20 && !exchanges && isMajorityUnder20
//           ? size * 1.08
//           : isBetween0to20 && !exchanges && isMajoritySmall
//           ? size * 1.05
//           : size;

//       const year =
//         !crypto?.quote?.USD?.yearPercentage && sizeOfBubble === "Year";

//       // console.log({ sizeOfBubble });

//       size = year ? 0 : size;

//       // year && // console.log({ year });

//       // size === 0 && // console.log({ size });

//       const bubble = {
//         id: crypto.id,
//         size,
//         x,
//         y,
//         vx,
//         vy,
//         dragging: false,
//         modalOpen: false,
//         value: crypto?.quote[language][curPeriod],
//         content,
//         name: crypto?.name,
//         data: crypto,
//         symbol: crypto?.symbol,
//         market_urls: crypto?.market_urls,
//         text1FontSize: size * 0.15,
//         text2FontSize: size * 0.15,
//         text1X: -size * 0.5,
//         text1Y: -size * 0.05,
//         text2X: -size * 0.5,
//         text2Y: -size * -0.2,
//       };
//       // console.log({ sizeOfBubble });
//       // if (sizeOfBubble === "Year") {
//       //   if (crypto?.quote?.USD?.yearPercentage) {
//       //     newBubbles.push(bubble);
//       //   }
//       // } else {
//       //   newBubbles.push(bubble);
//       // }
//       newBubbles.push(bubble);
//     });

//     setBubbles(newBubbles);
//     setIsReinitializing(false);
//   };

//   let isCalled = false;
//   useEffect(() => {
//     if (
//       containerSize.width > 0 &&
//       containerSize.height > 0 &&
//       bubbles?.length === 0 &&
//       !loading &&
//       !isCalled
//     ) {
//       isCalled = true;
//       // // console.log("Called");
//       // console.log("initialize called");
//       initializeBubbles();
//     }
//   }, [containerSize, cryptos, loading]);

//   useEffect(() => {
//     if (min && max && bubbles?.length > 0 && !loading && isReinitialize) {
//       // console.log("Re initialize called");
//       if (cryptos?.length === 0) return setBubbles([]);
//       reInitializeBubbles();
//     }
//   }, [
//     min,
//     max,
//     loading,
//     curPeriod,
//     bubbleContent,
//     sizeOfBubble,
//     cryptos,
//     language,
//     isReinitialize,
//   ]);

//   useEffect(() => {
//     const updateBubbles = () => {
//       setBubbles((prevBubbles) => {
//         return prevBubbles.map((bubble, index) => {
//           let { x, y, vx, vy, dragging } = bubble;

//           if (!dragging) {
//             x += vx;
//             y += vy;

//             const minSpeed = 0.05; // Reduced minimum speed for smoother movement
//             const dampingFactor = 0.95; // Higher damping factor for smoother deceleration

//             vx *= dampingFactor;
//             vy *= dampingFactor;

//             vx = Math.sign(vx) * Math.max(minSpeed, Math.abs(vx));
//             vy = Math.sign(vy) * Math.max(minSpeed, Math.abs(vy));

//             if (
//               x + bubble.size / 2 >= containerSize.width ||
//               x - bubble.size / 2 <= 0
//             ) {
//               vx *= -1;
//             }
//             if (
//               y + bubble.size / 2 >= containerSize.height ||
//               y - bubble.size / 2 <= 0
//             ) {
//               vy *= -1;
//             }

//             x = Math.max(
//               bubble.size / 2,
//               Math.min(containerSize.width - bubble.size / 2, x)
//             );
//             y = Math.max(
//               bubble.size / 2,
//               Math.min(containerSize.height - bubble.size / 2, y)
//             );

//             prevBubbles.forEach((otherBubble, otherIndex) => {
//               if (index !== otherIndex) {
//                 const dx = otherBubble.x - x;
//                 const dy = otherBubble.y - y;
//                 const distance = Math.sqrt(dx * dx + dy * dy);
//                 const minDistance = bubble.size / 2 + otherBubble.size / 2;

//                 if (distance < minDistance) {
//                   const angle = Math.atan2(dy, dx);
//                   const targetX = x + Math.cos(angle) * minDistance;
//                   const targetY = y + Math.sin(angle) * minDistance;
//                   const ax = (targetX - otherBubble.x) * 0.03; // Smaller factor for slower movement
//                   const ay = (targetY - otherBubble.y) * 0.03; // Smaller factor for slower movement

//                   vx -= ax;
//                   vy -= ay;
//                   otherBubble.vx += ax;
//                   otherBubble.vy += ay;
//                 }
//               }
//             });
//           }

//           return { ...bubble, x, y, vx, vy };
//         });
//       });
//     };

//     const interval = setInterval(() => {
//       if (!isReinitializing) updateBubbles();
//     }, 1000 / 60);
//     return () => clearInterval(interval);
//   }, [containerSize, isReinitializing]);

//   const handleDragStart = (index) => {
//     const newBubbles = [...bubbles];
//     newBubbles[index].dragging = true; // Set dragging to true when dragging starts
//     setBubbles(newBubbles);
//   };

//   // const handleDragMove = (index, event) => {
//   //   const { x, y } = event.target.attrs;
//   //   const newBubbles = [...bubbles];
//   //   newBubbles[index].x = x;
//   //   newBubbles[index].y = y;
//   //   const tween = new Konva.Tween({
//   //     node: event.target,
//   //     x: x,
//   //     y: y,
//   //     duration: 0.5,
//   //     onFinish: () => {
//   //       tween.destroy();
//   //     },
//   //   });
//   //   tween.play();
//   //   setBubbles(newBubbles);
//   // };

//   const handleDragMove = (index, event) => {
//     const { x, y } = event.target.attrs;
//     const newBubbles = [...bubbles];
//     const bubble = newBubbles[index];

//     // Introduce a more significant delay effect
//     const tween = new Konva.Tween({
//       node: event.target,
//       x: x * 0.8 + bubble.x * 0.2, // Reduce the movement speed more by blending new and old positions
//       y: y * 0.8 + bubble.y * 0.2, // Reduce the movement speed more by blending new and old positions
//       duration: 1.0, // Increase animation duration for more delay
//       onUpdate: () => {
//         // Update the bubble's position during the tween
//         bubble.x = event.target.attrs.x;
//         bubble.y = event.target.attrs.y;

//         // Detect collisions and apply smooth push effect
//         newBubbles.forEach((otherBubble, otherIndex) => {
//           if (index !== otherIndex) {
//             const dx = otherBubble.x - bubble.x;
//             const dy = otherBubble.y - bubble.y;
//             const distance = Math.sqrt(dx * dx + dy * dy);
//             const minDistance = bubble.size / 2 + otherBubble.size / 2;

//             if (distance < minDistance) {
//               const nx = dx / distance;
//               const ny = dy / distance;
//               const pushDistance = minDistance - distance + 1;

//               otherBubble.x += nx * pushDistance * 0.5; // Smooth push effect
//               otherBubble.y += ny * pushDistance * 0.5; // Smooth push effect

//               if (otherBubble.ref) {
//                 const reflectTween = new Konva.Tween({
//                   node: otherBubble.ref.current,
//                   x: otherBubble.x,
//                   y: otherBubble.y,
//                   duration: 1, // Immediate reflection
//                   onFinish: () => {
//                     reflectTween.destroy();
//                   },
//                 });
//                 reflectTween.play();
//               }
//             }
//           }
//         });
//       },
//       onFinish: () => {
//         // Ensure the final position is set correctly
//         bubble.x = event.target.attrs.x;
//         bubble.y = event.target.attrs.y;
//       },
//     });

//     tween.play();

//     // Update the state with new bubble positions
//     setBubbles(newBubbles);
//   };

//   const handleDragEnd = (index, event) => {
//     const newBubbles = [...bubbles];
//     newBubbles[index].vx = 0;
//     newBubbles[index].vy = 0;
//     newBubbles[index].dragging = false;
//     setBubbles(newBubbles);
//   };

//   const handleClick = (event) => {
//     // console.log("clicked");
//     // event.stopPropagation();
//     const stage = event.target.getStage();
//     const stagePosition = stage.getPointerPosition();

//     if (stagePosition) {
//       const clickX = stagePosition.x;
//       const clickY = stagePosition.y;
//       let clickedBubble = false;

//       for (let bubble of bubbles) {
//         const dx = clickX - bubble.x;
//         const dy = clickY - bubble.y;
//         const distance = Math.sqrt(dx * dx + dy * dy);

//         if (distance <= bubble.size / 2) {
//           // console.log(bubble);
//           if (!bubble.dragging) handleActiveBubble(bubble);
//           clickedBubble = true;
//           break;
//         }
//       }

//       if (clickedBubble) return;

//       const waveForce = 150; // Adjust the wave force as needed

//       setBubbles((prevBubbles) =>
//         prevBubbles.map((bubble) => {
//           const dx = bubble.x - clickX;
//           const dy = bubble.y - clickY;
//           const distance = Math.sqrt(dx * dx + dy * dy);
//           const angle = Math.atan2(dy, dx);

//           // Apply a force to push the circles away from the click point
//           return {
//             ...bubble,
//             vx: bubble.vx + (waveForce * Math.cos(angle)) / distance,
//             vy: bubble.vy + (waveForce * Math.sin(angle)) / distance,
//           };
//         })
//       );
//     }
//   };

//   const generateName = (name) => {
//     const words = name?.split(" ");
//     let word;
//     if (words?.length > 1) {
//       word = words.slice(0, 1).join(" ");
//     } else {
//       word = words?.join(" ");
//     }

//     if (word?.length > 5) {
//       return word.slice(0, 6);
//     }
//     return word;
//   };

//   function getValueAtPercentage(min, max, percentage) {
//     if (percentage < 0 || percentage > 100) {
//       throw new Error("Percentage must be between 0 and 100");
//     }

//     return Math.floor(min + (max - min) * (percentage / 100));
//   }

//   function getSize(items, type) {
//     let sizes = items.map((item) => item.size);

//     if (type === "min") {
//       return Math.min(...sizes);
//     } else {
//       return Math.max(...sizes);
//     }
//   }

//   return (
//     <section ref={containerRef} className="w-full h-[78vh] z-30">
//       <Stage
//         ref={stageRef}
//         onClick={handleClick}
//         width={containerSize.width}
//         height={containerSize.height}
//       >
//         <Layer>
//           {bubbles.map((bubble, index) => {
//             const plusColor = colors === "Red + Green" ? "green" : "cyan";
//             const minusColor = colors === "Red + Green" ? "red" : "yellow";

//             const bubbleColor = bubble?.value < 0 ? minusColor : plusColor;

//             const circleOne = color[bubbleColor].circleOne;
//             const circleTwo = color[bubbleColor].circleTwo;

//             let valueToShow = bubble.content;
//             let finalValue;
//             if (bubbleContent === "Market Cap") {
//               const absValue = Math.abs(+bubble.content);

//               if (absValue >= 1000000000000) {
//                 valueToShow = (absValue / 1000000000000).toFixed(1) + "T";
//               } else if (absValue >= 1000000000) {
//                 valueToShow = (absValue / 1000000000).toFixed(1) + "B";
//               } else if (absValue >= 1000000) {
//                 valueToShow = (absValue / 1000000).toFixed(1) + "M";
//               } else if (absValue >= 1000000) {
//                 valueToShow = (absValue / 1000000).toFixed(1) + "M"; // For 6-digit values
//               } else {
//                 valueToShow = bubble.content;
//               }
//               finalValue = valueToShow;
//             } else {
//               const curCurrency = lists.find((list) => list.name === language);
//               const currencyLogo =
//                 bubbleContent === "Price" ? curCurrency.logo : "";

//               if (
//                 typeof valueToShow === "number" &&
//                 bubbleContent === "Price"
//               ) {
//                 valueToShow = valueToShow.toFixed(2) + " " + currencyLogo;
//               }

//               if (
//                 typeof valueToShow === "number" &&
//                 bubbleContent === "24h Volume"
//               ) {
//                 valueToShow = valueToShow.toFixed(2);
//               }

//               finalValue =
//                 typeof bubble?.content === "number"
//                   ? +valueToShow?.toFixed(1)
//                   : bubble?.content?.split(" ")[0];
//             }

//             const percentage = [
//               "Performance",
//               "Hour",
//               "Day",
//               "Week",
//               "Month",
//               "Year",
//             ];

//             if (percentage.includes(bubbleContent)) {
//               finalValue += "%";
//             }

//             const minSize = getSize(bubbles, "min");
//             const maxSize = getSize(bubbles, "max");

//             const thresholdPercentage = sizeOfBubble === "Market Cap" ? 1 : 10;

//             const threshold = getValueAtPercentage(
//               minSize,
//               maxSize,
//               thresholdPercentage
//             );

//             // Attach a ref to the bubble
//             bubble.ref = React.createRef();

//             return (
//               <Group
//                 key={bubble?.id}
//                 x={bubble?.x}
//                 y={bubble?.y}
//                 width={bubble?.size}
//                 height={bubble?.size}
//                 draggable
//                 zIndex={50}
//                 onDragStart={() => handleDragStart(index)}
//                 onDragMove={(event) => handleDragMove(index, event)}
//                 onDragEnd={(event) => handleDragEnd(index, event)}
//                 dragBoundFunc={(pos) => {
//                   const newX = Math.max(
//                     bubble?.size / 2,
//                     Math.min(containerSize.width - bubble?.size / 2, pos.x)
//                   );
//                   const newY = Math.max(
//                     bubble?.size / 2,
//                     Math.min(containerSize.height - bubble?.size / 2, pos.y)
//                   );
//                   return { x: newX, y: newY };
//                 }}
//                 ref={bubble.ref} // Assign the ref here
//               >
//                 <Circle
//                   radius={bubble?.size / 2}
//                   fill={circleOne.fill} // Background color of the outer circle
//                   stroke={circleOne.stroke} // Border color of the outer circle
//                   strokeWidth={circleOne.strokeWidth} // Border width of the outer circle
//                   shadowOffsetX={circleOne?.shadowOffsetX} // Adjust shadow offset
//                   shadowOffsetY={circleOne.shadowOffsetY} // Adjust shadow offset
//                   shadowBlur={circleOne.shadowBlur} // Adjust shadow blur
//                   shadowColor={circleOne.shadowColor} // Shadow color
//                 />
//                 <Circle
//                   x={0} // Position within the Group
//                   y={0} // Position within the Group
//                   radius={bubble?.size / 2}
//                   fillRadialGradientStartPoint={{ x: 0, y: 0 }}
//                   fillRadialGradientStartRadius={bubble?.size * 0.4} // Adjust the start radius to control the green area
//                   fillRadialGradientEndPoint={{ x: 0, y: 0 }}
//                   fillRadialGradientEndRadius={bubble?.size / 2}
//                   fillRadialGradientColorStops={[
//                     ...circleTwo.fillRadialGradientColorStops,
//                   ]}
//                 />

//                 <MyImage bubble={bubble} threshold={threshold} />
//                 {bubble.size >= threshold && (
//                   <Text
//                     // text={generateName(bubble?.name)}
//                     text={bubble.symbol}
//                     fill="white"
//                     fontStyle="bold"
//                     // fontSize={bubble?.size * 0.15}
//                     // x={-bubble?.size * 0.5}
//                     // y={-bubble?.size * 0.05}
//                     fontSize={bubble.text1FontSize}
//                     x={bubble.text1X}
//                     y={bubble.text1Y}
//                     width={bubble?.size}
//                     align="center"
//                     verticalAlign="middle"
//                   />
//                 )}
//                 {bubble.size >= threshold && (
//                   <Text
//                     text={finalValue}
//                     fill={bubble?.value < 0 ? "red" : "green"}
//                     fontStyle="bold"
//                     // fontSize={
//                     //   typeof bubble.content === "number"
//                     //     ? bubble?.size * 0.15
//                     //     : bubble?.size * 0.15
//                     // }
//                     // x={-bubble?.size * 0.5}
//                     // y={-bubble?.size * -0.2}
//                     fontSize={bubble.text2FontSize}
//                     x={bubble.text2X}
//                     y={bubble.text2Y}
//                     width={bubble?.size}
//                     align="center"
//                     verticalAlign="middle"
//                   />
//                 )}
//               </Group>
//             );
//           })}
//         </Layer>
//       </Stage>
//     </section>
//   );
// };

// function MyImage({ bubble, threshold }) {
//   const url = `https://s2.coinmarketcap.com/static/img/coins/64x64/${bubble?.id}.png`;
//   const image = useImage(url)[0];

//   const multiplyByX = bubble?.size < threshold ? 0.64 : 0.55;
//   const multiplyByY = bubble?.size < threshold ? 0.64 : 0.8;

//   const multiplyByWidth = bubble?.size < threshold ? 0.5 : 0.3;
//   const multiplyByHeight = bubble?.size < threshold ? 0.5 : 0.3;

//   return (
//     <Image
//       image={image}
//       width={bubble?.size * multiplyByWidth}
//       height={bubble?.size * multiplyByHeight}
//       offsetX={bubble?.size * -0.4}
//       offsetY={bubble?.size * -0.4}
//       x={-bubble?.size * multiplyByX}
//       y={-bubble?.size * multiplyByY}
//     />
//   );
// }

// export default BubbleComponent;
