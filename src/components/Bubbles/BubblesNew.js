import * as PIXI from "pixi.js";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useBubbles } from "../../hooks/useBubbles";
import usePixiUtils from "../../hooks/usePixiUtils";
import { SettingAndFilterOptionsContext } from "../../providers/SettingAndFilterOptionsProvider";
import { bubbleNavLinks } from "@/utils/data.utils";
import { useSelector } from "react-redux";
// import { DataContext } from "../../providers/DataProvider";

export default function Bubbles() {
	const appRef = React.useRef(null);

	const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
	const [innerWidth, setInnerWidth] = useState(0);
	const [innerHeight, setInnerHeight] = useState(0);

	const {
		pages: { max, min },
		language,
		activeBubbleLinkID,
		exchanges,
		...others
	} = useSelector((state) => state?.filters);
	const { coins, ...otherCoinData } = useSelector((state) => state?.cryptos);
	// const [coins, setCoins] = useState([])
	useEffect(() => {
		if (typeof window !== undefined) {
			setInnerWidth(window.innerWidth);
			setInnerHeight(window.innerHeight);
		}
	}, []);

	const { appConfig, getScalingFactor, update, addCanvasEventListeners, generateCircles, clearBubbles } = useBubbles(
		containerSize.width,
		containerSize.height
	);

	const { createContainer, createImageSprite, createText, createText2, createGradientTexture, formatNumber } =
		usePixiUtils();

	// const { coins, refetchedCoins, allCryptos } = useContext(DataContext);

	const { width, height } = containerSize;
	const [isLoading, setIsLoading] = useState(true);
	const [circles, setCircles] = useState([]);

	const maxCircleSize = Math.max(coins?.map((c) => +c.HOUR)) || 150;
	const minCircleSize = Math.min(coins?.map((c) => +c.HOUR)) || 20;

	// const {
	// 	filterOptions: {
	// 		activeBubbleLinkID,
	// 		pages: { min, max },
	// 	},
	// 	exchanges,
	// 	bubbleNavLinks,
	// 	language,
	// } = useContext(SettingAndFilterOptionsContext);

	const { size: bubbleSort, bubbleContent } = bubbleNavLinks.find(({ size }) => activeBubbleLinkID === size) || {};

	const scalingFactor = useMemo(() => {
		// console.log("recalled use memo");
		return getScalingFactor(coins, bubbleSort);
	}, [bubbleSort, min, max, coins]);

	useEffect(() => {
		if (appRef.current) {
			const width = appRef.current.clientWidth;
			const height = appRef.current.clientHeight;
			setContainerSize({ width, height });
		}
	}, [innerWidth, innerHeight]);

	useEffect(() => {
		// if (coins?.length > 0 && circles?.length === 0) {
		// 	// console.log("updated");
		// 	const scalingFactor = getScalingFactor(coins, "HOUR");
		// 	const shapes = generateCircles(coins, scalingFactor);
		// 	setCircles(shapes);
		// }
		if (coins?.length) {
			if (appRef.current) {
				clearBubbles(appRef.current, circles, () => {
					const scalingFactor = getScalingFactor(coins, "HOUR");
					const shapes = generateCircles(coins, scalingFactor);
					setCircles(shapes);
				});
			}
			const scalingFactor = getScalingFactor(coins, "HOUR");
			const shapes = generateCircles(coins, scalingFactor);
			setCircles(shapes);
		}
	}, [coins]);

	// let count = 0;

	// useEffect(() => {
	// 	// count++;
	// 	// console.log({ count });
	// 	if (circles?.length > 0) {
	// 		const newCoins = allCryptos?.slice(min - 1, max).map((coin) => ({
	// 			id: coin.id,
	// 			symbol: coin.symbol,
	// 			coinName: coin.name,
	// 			slug: coin?.slug,
	// 			HOUR: coin.quote[language || "USD"]?.percent_change_1h,
	// 			DAY: coin?.quote[language || "USD"]?.percent_change_24h,
	// 			WEEK: coin?.quote[language || "USD"]?.percent_change_7d,
	// 			MONTH: coin?.quote[language || "USD"]?.percent_change_30d,
	// 			YEAR: coin?.quote?.USD?.yearPercentage,
	// 			MARKET_CAP: coin?.quote[language || "USD"]?.market_cap,
	// 			image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin?.id}.png`,
	// 			text2: "",
	// 			market_urls: coin?.market_urls,
	// 			Performance: coin.quote[language || "USD"]?.volume_change_24h,
	// 			"Rank ↑↓": coin?.cmc_rank,
	// 			Name: coin?.name,
	// 			Dominance: coin.quote[language || "USD"]?.market_cap_dominance,
	// 			Hour: coin.quote[language || "USD"]?.percent_change_1h,
	// 			Day: coin?.quote[language || "USD"]?.percent_change_24h,
	// 			Week: coin?.quote[language || "USD"]?.percent_change_7d,
	// 			Month: coin?.quote[language || "USD"]?.percent_change_30d,
	// 			Price: coin?.quote[language || "USD"]?.price,
	// 			data: coin,
	// 			keep: true,
	// 		}));

	// 		const scalingFactor = getScalingFactor(newCoins, bubbleSort);
	// 		const shapes = generateCircles(newCoins, scalingFactor, bubbleSort);

	// 		circles.forEach((c, i) => {
	// 			Object.assign(c, shapes[i]);
	// 		});
	// 	}
	// }, [min, max, coins]);

	// const { text2, ...c } = circles[0] || {};
	// console.log({ c });

	useEffect(() => {
		if (circles?.length === 0) return;

		// console.log("Recalled main effect");

		const app = new PIXI.Application({
			width,
			height,
			backgroundColor: "#0F0112",
		});

		const appContainer = appRef.current;
		appContainer?.appendChild(app.view);
		// appContainer?.children[0].addEventListener("click", (e) =>
		//   handleEmptySpaceClick(e, circles)
		// );

		if (appContainer?.children[0]) {
			addCanvasEventListeners(appContainer.children[0], circles, app);
		}

		const imageSprites = [];
		const textSprites = [];
		const text2Sprites = [];
		const circleGraphics = [];

		for (let i = 0; i < circles.length; i++) {
			const circle = circles[i];
			const container = createContainer(circle);

			const imageSprite = createImageSprite(circle);
			imageSprites.push(imageSprite);
			container.addChild(imageSprite);

			const circleGraphic = new PIXI.Sprite(createGradientTexture(circle.radius * 4, circle.color));
			circleGraphic.anchor.set(0.5);
			circleGraphics.push(circleGraphic);
			container.addChild(circleGraphic);

			const text = createText(circle);
			container.addChild(text);
			textSprites.push(text);

			const text2 = createText2(circle, "HOUR");
			container.addChild(text2);
			text2Sprites.push(text2);

			// container.interactive = true;
			container.buttonMode = true;

			// Add dragging event listeners
			// container
			//   .on("pointerdown", onDragStart)
			//   .on("pointerup", onDragEnd)
			//   .on("pointerupoutside", onDragEnd)
			//   .on("pointermove", onDragMove);

			// addDragEventListeners(container, circles);

			app.stage.addChild(container);
		}

		const ticker = update(circles, imageSprites, textSprites, text2Sprites, circleGraphics);
		setTimeout(() => {
			app.ticker.add(ticker);
			setIsLoading(false);
		}, 200);

		// return () => {
		//   appContainer?.children[0]?.removeEventListener("click", (e) =>
		//     handleEmptySpaceClick(e, circles)
		//   );
		// };
	}, [circles]);

	const [isChanged, setIsChanged] = useState(false);

	useEffect(() => {
		// count++;
		// console.log({ count });
		if (circles?.length > 0) {
			const max = maxCircleSize;
			const min = minCircleSize;
			// console.log("Hit");
			// console.log({ circle: circles[0].symbol });

			circles.forEach((circle, idx) => {
				// debugger;
				if (!circle[bubbleSort]) return;
				const radius = Math.abs(Math.floor(circle[bubbleSort] * scalingFactor));
				console.log(circle, max, min, radius, circle[bubbleSort]);
				circle.targetRadius = radius > max ? max : radius > min ? radius : min;
				circle.color = circle[bubbleSort] > 0 ? "cyan" : "red";
				if (circle.text2) {
					circle.text2.text = formatNumber(circle[bubbleContent]);
					//  idx === 0 && // console.log({ text: circle.text2.text });
					// circle.text2 = createText2(circle, bubbleSort);
				} //  else {
				// 	circle.text2 = createText2(circle);
				// }

				// // Update image
				// if (circle.imageSprite) {
				// 	circle.imageSprite.texture = PIXI.Texture.from(circle.image);
				// 	//  idx === 0 && // console.log({ image: circle.imageSprite.texture });
				// } else {
				// 	circle.imageSprite = createImageSprite(circle);
				// }

				// // Update text
				// if (circle.text) {
				// 	circle.text.text = circle.symbol.toUpperCase();
				// 	//  idx === 0 && // console.log({ text: circle.text.text });
				// } else {
				// 	circle.text = createText(circle);
				// }

				// if (refetchedCoins?.length > 0) {
				// 	const coinsMap = {};

				// 	circles.forEach((c) => {
				// 		c.keep = false;
				// 	});

				// 	refetchedCoins.forEach((c) => {
				// 		coinsMap[c.slug] = {
				// 			...c,
				// 			keep: false,
				// 		};
				// 	});

				// 	circles.forEach((circle) => {
				// 		const slug = circle.slug;

				// 		if (coinsMap[slug]) {
				// 			coinsMap[slug].keep = true;
				// 			const coin = coinsMap[slug];

				// 			const radius = Math.abs(Math.floor(circle[bubbleSort] * scalingFactor));
				// 			circle.targetRadius = radius > max ? max : radius > min ? radius : min;
				// 			circle.color = circle[bubbleSort] > 0 ? "cyan" : "red";

				// 			circle.HOUR = coin?.HOUR;
				// 			circle.DAY = coin?.DAY;
				// 			circle.WEEK = coin?.WEEK;
				// 			circle.MONTH = coin?.MONTH;
				// 			circle.YEAR = coin?.YEAR;
				// 			circle.MARKET_CAP = coin?.MARKET_CAP;
				// 			circle.market_urls = coin?.market_urls;
				// 			circle.Performance = coin?.Performance;
				// 			coin["Rank ↑↓"] = coin["Rank ↑↓"];
				// 			circle.Dominance = coin?.Dominance;
				// 			circle.Hour = coin?.Hour;
				// 			circle.Day = coin?.Day;
				// 			circle.Week = coin?.Week;
				// 			circle.Month = coin?.Month;
				// 			circle.Price = coin?.Price;
				// 			circle.data = coin?.data;
				// 			circle.keep = true;
				// 		} else {
				// 		}
				// 	});

				// 	const falseKeepRefetched = [];

				// 	refetchedCoins.forEach((c) => {
				// 		!c.keep && falseKeepRefetched.push(c);
				// 	});

				// 	// console.log(Object.keys(falseKeepRefetched)?.length);

				// 	let i = 0;
				// 	circles.forEach((c) => {
				// 		const curCoin = falseKeepRefetched[i];
				// 		if (!c.keep) {
				// 			Object.assign(c, curCoin);
				// 			const radius = Math.abs(Math.floor(c[bubbleSort] * scalingFactor));
				// 			c.targetRadius = radius > max ? max : radius > min ? radius : min;
				// 			c.text2 = createText2(c, bubbleSort);
				// 		}
				// 	});
				// }
			});
		}
	}, [bubbleSort, circles, scalingFactor, bubbleContent, exchanges, coins]);

	return <div style={{ height: "78vh" }} className="w-full overflow-hidden" ref={appRef}></div>;
}

// "use client";
// import * as PIXI from "pixi.js";
// import React, { useContext, useEffect, useMemo, useState } from "react";
// import { useBubbles } from "../../hooks/useBubbles";
// import usePixiUtils from "../../hooks/usePixiUtils";
// import { SettingAndFilterOptionsContext } from "../../providers/SettingAndFilterOptionsProvider";
// import { DataContext } from "../../providers/DataProvider";

// export default function Bubbles() {
//   const appRef = React.useRef(null);
//   const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

//   const innerWidth = window.innerWidth;
//   const innerHeight = window.innerHeight;

//   const {
//     appConfig,
//     getScalingFactor,
//     update,
//     handleEmptySpaceClick,
//     generateCircles,
//   } = useBubbles(containerSize.width, containerSize.height);

//   const {
//     createContainer,
//     createImageSprite,
//     createText,
//     createText2,
//     createGradientTexture,
//     formatNumber,
//   } = usePixiUtils();

//   const { coins, refetchedCoins, allCryptos } = useContext(DataContext) || {};

//   const { width, height } = containerSize;
//   const [isLoading, setIsLoading] = useState(true);
//   const [circles, setCircles] = useState([]);

//   const maxCircleSize = Math.max(coins?.map((c) => +c.HOUR)) || 150;
//   const minCircleSize = Math.min(coins?.map((c) => +c.HOUR)) || 20;

//   const {
//     filterOptions: {
//       activeBubbleLinkID,
//       pages: { min, max },
//     },
//     bubbleNavLinks,
//     language,
//   } = useContext(SettingAndFilterOptionsContext);

//   const { size: bubbleSort, bubbleContent } =
//     bubbleNavLinks.find(({ id }) => activeBubbleLinkID === id) || {};

//   const scalingFactor = useMemo(() => {
//     // console.log("recalled use memo");
//     return getScalingFactor(coins, bubbleSort);
//   }, [bubbleSort, coins]);

//   useEffect(() => {
//     if (appRef.current) {
//       const width = appRef.current.clientWidth;
//       const height = appRef.current.clientHeight;
//       setContainerSize({ width, height });
//     }
//   }, [innerWidth, innerHeight]);

//   useEffect(() => {
//     if (coins?.length > 0 && circles?.length === 0) {
//       // console.log("updated");
//       // const scalingFactor = getScalingFactor(coins, "HOUR");
//       // const shapes = generateCircles(coins, scalingFactor);
//       setCircles(coins);
//     }
//   }, [coins]);

//   let count = 0;

//   useEffect(() => {
//     count++;
//     // console.log({ count });
//     if (circles?.length > 0) {
//       const newCoins = allCryptos?.slice(min - 1, max).map((coin) => ({
//         id: coin.id,
//         symbol: coin.symbol,
//         coinName: coin.name,
//         slug: coin?.slug,
//         HOUR: coin.quote[language || "USD"]?.percent_change_1h,
//         DAY: coin?.quote[language || "USD"]?.percent_change_24h,
//         WEEK: coin?.quote[language || "USD"]?.percent_change_7d,
//         MONTH: coin?.quote[language || "USD"]?.percent_change_30d,
//         YEAR: coin?.quote?.USD?.yearPercentage,
//         MARKET_CAP: coin?.quote[language || "USD"]?.market_cap,
//         image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin?.id}.png`,
//         text2: "",
//         market_urls: coin?.market_urls,
//         Performance: coin.quote[language || "USD"]?.volume_change_24h,
//         "Rank ↑↓": coin?.cmc_rank,
//         Name: coin?.name,
//         Dominance: coin.quote[language || "USD"]?.market_cap_dominance,
//         Hour: coin.quote[language || "USD"]?.percent_change_1h,
//         Day: coin?.quote[language || "USD"]?.percent_change_24h,
//         Week: coin?.quote[language || "USD"]?.percent_change_7d,
//         Month: coin?.quote[language || "USD"]?.percent_change_30d,
//         Price: coin?.quote[language || "USD"]?.price,
//         data: coin,
//         keep: true,
//       }));

//       const scalingFactor = getScalingFactor(newCoins, bubbleSort);
//       const shapes = generateCircles(newCoins, scalingFactor, bubbleSort);

//       // console.log(shapes?.length);

//       circles.forEach((c, i) => {
//         Object.assign(c, shapes[i]);
//       });

//       // console.log({
//         s1: shapes[0]?.text.text,
//         s2: circles[0]?.text.text,
//       });
//     }
//   }, [min, max, coins]);

//   const { text2, ...c } = circles[0] || {};
//   // console.log({ c });

//   const onDragStart = (event) => {
//     const circle = event.currentTarget;
//     circle.data = event.data;
//     circle.alpha = 0.5;
//     circle.dragging = true;
//   };

//   const onDragEnd = (event) => {
//     const circle = event.currentTarget;
//     circle.alpha = 1;
//     circle.dragging = false;
//     circle.data = null;
//   };

//   const onDragMove = (event) => {
//     const circle = event.currentTarget;
//     if (circle.dragging) {
//       const newPosition = circle.data.getLocalPosition(circle.parent);
//       circle.x = newPosition.x;
//       circle.y = newPosition.y;
//     }
//   };

//   useEffect(() => {
//     if (circles?.length === 0) return;

//     // console.log("Recalled main effect");

//     const app = new PIXI.Application({
//       width,
//       height,
//       backgroundColor: "#0F0112",
//     });

//     const appContainer = appRef.current;
//     appContainer?.appendChild(app.view);
//     appContainer?.children[0].addEventListener("click", (e) =>
//       handleEmptySpaceClick(e, circles)
//     );

//     const imageSprites = [];
//     const textSprites = [];
//     const text2Sprites = [];
//     const circleGraphics = [];

//     for (let i = 0; i < circles.length; i++) {
//       const circle = circles[i];
//       const container = createContainer(circle);

//       const imageSprite = createImageSprite(circle);
//       imageSprites.push(imageSprite);
//       container.addChild(imageSprite);

//       const circleGraphic = new PIXI.Sprite(
//         createGradientTexture(circle.radius * 4, circle.color)
//       );
//       circleGraphic.anchor.set(0.5);
//       circleGraphics.push(circleGraphic);
//       container.addChild(circleGraphic);

//       const text = createText(circle);
//       container.addChild(text);
//       textSprites.push(text);

//       const text2 = createText2(circle, "HOUR");
//       container.addChild(text2);
//       text2Sprites.push(text2);

//       container.interactive = true;
//       container.buttonMode = true;

//       // Add dragging event listeners
//       container
//         .on("pointerdown", onDragStart)
//         .on("pointerup", onDragEnd)
//         .on("pointerupoutside", onDragEnd)
//         .on("pointermove", onDragMove);

//       app.stage.addChild(container);
//     }

//     const ticker = update(
//       circles,
//       imageSprites,
//       textSprites,
//       text2Sprites,
//       circleGraphics
//     );
//     setTimeout(() => {
//       app.ticker.add(ticker);
//       setIsLoading(false);
//     }, 200);

//     return () => {
//       appContainer?.children[0]?.removeEventListener("click", (e) =>
//         handleEmptySpaceClick(e, circles)
//       );
//     };
//   }, [circles, coins]);

//   const [isChanged, setIsChanged] = useState(false);

//   useEffect(() => {
//     count++;
//     // console.log({ count });
//     if (circles?.length > 0) {
//       const max = maxCircleSize;
//       const min = minCircleSize;
//       // console.log("Hit");
//       // console.log({ circle: circles[0].symbol });

//       circles.forEach((circle, idx) => {
//         if (!circle[bubbleSort]) return;

//         const radius = Math.abs(Math.floor(circle[bubbleSort] * scalingFactor));
//         circle.targetRadius = radius > max ? max : radius > min ? radius : min;
//         circle.color = circle[bubbleSort] > 0 ? "cyan" : "red";
//         if (circle.text2) {
//           circle.text2.text = formatNumber(circle[bubbleContent]);
//         //  idx === 0 && // console.log({ text: circle.text2.text });
//           // circle.text2 = createText2(circle, bubbleSort);
//         } else {
//           circle.text2 = createText2(circle);
//         }

//         // Update image
//         if (circle.imageSprite) {
//           circle.imageSprite.texture = PIXI.Texture.from(circle.image);
//         //  idx === 0 && // console.log({ image: circle.imageSprite.texture });
//         } else {
//           circle.imageSprite = createImageSprite(circle);
//         }

//         // Update text
//         if (circle.text) {
//           circle.text.text = circle.symbol.toUpperCase();
//         //  idx === 0 && // console.log({ text: circle.text.text });
//         } else {
//           circle.text = createText(circle);
//         }

//         if (refetchedCoins?.length > 0) {
//           const coinsMap = {};

//           circles.forEach((c) => {
//             c.keep = false;
//           });

//           refetchedCoins.forEach((c) => {
//             coinsMap[c.slug] = {
//               ...c,
//               keep: false,
//             };
//           });

//           circles.forEach((circle) => {
//             const slug = circle.slug;

//             if (coinsMap[slug]) {
//               coinsMap[slug].keep = true;
//               const coin = coinsMap[slug];

//               const radius = Math.abs(
//                 Math.floor(circle[bubbleSort] * scalingFactor)
//               );
//               circle.targetRadius =
//                 radius > max ? max : radius > min ? radius : min;
//               circle.color = circle[bubbleSort] > 0 ? "cyan" : "red";

//               circle.HOUR = coin?.HOUR;
//               circle.DAY = coin?.DAY;
//               circle.WEEK = coin?.WEEK;
//               circle.MONTH = coin?.MONTH;
//               circle.YEAR = coin?.YEAR;
//               circle.MARKET_CAP = coin?.MARKET_CAP;
//               circle.market_urls = coin?.market_urls;
//               circle.Performance = coin?.Performance;
//               coin["Rank ↑↓"] = coin["Rank ↑↓"];
//               circle.Dominance = coin?.Dominance;
//               circle.Hour = coin?.Hour;
//               circle.Day = coin?.Day;
//               circle.Week = coin?.Week;
//               circle.Month = coin?.Month;
//               circle.Price = coin?.Price;
//               circle.data = coin?.data;
//               circle.keep = true;
//             } else {
//             }
//           });

//           const falseKeepRefetched = [];

//           refetchedCoins.forEach((c) => {
//             !c.keep && falseKeepRefetched.push(c);
//           });

//           // console.log(Object.keys(falseKeepRefetched)?.length);

//           let i = 0;
//           circles.forEach((c) => {
//             const curCoin = falseKeepRefetched[i];
//             if (!c.keep) {
//               Object.assign(c, curCoin);
//               const radius = Math.abs(
//                 Math.floor(c[bubbleSort] * scalingFactor)
//               );
//               c.targetRadius = radius > max ? max : radius > min ? radius : min;
//               c.text2 = createText2(c, bubbleSort);
//             }
//           });
//         }
//       });
//     }
//   }, [bubbleSort, circles, scalingFactor, bubbleContent, refetchedCoins]);

//   return (
//     <div
//       style={{ height: "78vh" }}
//       className="w-full overflow-hidden"
//       ref={appRef}
//     ></div>
//   );
// }
