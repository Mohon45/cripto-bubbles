"use client";
import { useContext, useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { SettingAndFilterOptionsContext } from "../providers/SettingAndFilterOptionsProvider";
import { lists } from "../components/Navbar/SelectLinks/USD";
import { useSelector } from "react-redux";
import { bubbleNavLinks } from "@/utils/data.utils";

const gradientTextureCache = new Map();

const usePixiUtils = () => {
	// const {
	// 	filterOptions: { activeBubbleLinkID },
	// 	bubbleNavLinks,
	// 	language,
	// } = useContext(SettingAndFilterOptionsContext);
	const { activeBubbleLinkID, language, ...others } = useSelector((state) => state?.filters);

	const { bubbleContent } = bubbleNavLinks.find(({ size }) => activeBubbleLinkID === size) || {};

	const createContainer = (circle) => {
		const container = new PIXI.Container();
		container.position.set(circle?.x, circle?.y);
		container.hitArea = new PIXI.Circle(0, 0, circle?.radius);
		container.eventMode = "dynamic";

		return container;
	};

	const createImageSprite = (circle) => {
		const imgUrl = circle?.image;
		// if (!imgUrl) return;
		const imageSprite = PIXI.Sprite.from(imgUrl);
		const isFullSize = circle?.radius * 0.3 < 10;

		imageSprite.anchor.set(0.5);
		imageSprite.width = circle?.radius * (isFullSize ? 1.2 : 0.5);
		imageSprite.height = circle?.radius * (isFullSize ? 1.2 : 0.5);
		imageSprite.position = { x: 0, y: isFullSize ? 0 : -circle?.radius / 2 };
		circle.imageSprite = imageSprite;
		return imageSprite;
	};

	const createText = (circle) => {
		const fontSize = circle?.radius * 0.3;
		const isTextVisible = fontSize > 10;

		const textStyle = new PIXI.TextStyle({
			fontSize: isTextVisible ? fontSize + "px" : 0,
			fill: "#ffffff",
		});

		const text = new PIXI.Text(circle?.symbol?.toUpperCase(), textStyle);
		text.anchor.set(0.5);
		text.position.y = 0.15 * circle?.radius;
		circle.text = text;

		return text;
	};

	const formatNumber = (number) => {
		const bubble = {
			content: number,
		};

		let valueToShow = bubble?.content;
		let finalValue;
		if (bubbleContent === "Market Cap") {
			const absValue = Math.abs(+bubble?.content);

			if (absValue >= 1000000000000) {
				valueToShow = (absValue / 1000000000000).toFixed(1) + "T";
			} else if (absValue >= 1000000000) {
				valueToShow = (absValue / 1000000000).toFixed(1) + "B";
			} else if (absValue >= 100000000) {
				valueToShow = (absValue / 1000000000).toFixed(1) + "B"; // For 9-digit values
			} else {
				valueToShow = bubble?.content;
			}
			finalValue = valueToShow;
		} else {
			const curCurrency = lists.find((list) => list.name === language);
			const currencyLogo = bubbleContent === "Price" ? curCurrency.logo : "";

			if (typeof valueToShow === "number" && bubbleContent === "Price") {
				valueToShow = valueToShow.toFixed(1) + " " + currencyLogo;
			}

			if (typeof valueToShow === "number" && bubbleContent === "24h Volume") {
				valueToShow = valueToShow.toFixed(1);
			}

			finalValue =
				typeof bubble?.content === "number" ? +valueToShow?.toFixed(1) : bubble?.content?.split(" ")[0];
		}

		const percentage = ["Performance", "Hour", "Day", "Week", "Month"];

		if (percentage.includes(bubbleContent)) {
			finalValue += "%";
		}

		return finalValue;
	};

	const createText2 = (circle, bubbleSort) => {
		// console.log({ circle });
		const fontSize = circle?.radius * 0.3;
		const isTextVisible = fontSize > 10;

		const text2Style = new PIXI.TextStyle({
			fontSize: isTextVisible ? fontSize + "px" : 0,
			fill: "#ffffff",
		});

		// const data = circle[bubbleSort]
		//   ? circle[bubbleSort].toFixed(2) + "%"
		//   : "No data";

		const data = formatNumber(circle[bubbleContent]);

		const text2 = new PIXI.Text(data, text2Style);
		text2.anchor.set(0.5);
		text2.position.y = circle?.radius / 1.5;
		circle.text2 = text2;

		return text2;
	};

	const createGradientTexture = (radius, color) => {
		const textureKey = `${radius}_${color}`;

		if (gradientTextureCache.has(textureKey)) {
			return gradientTextureCache.get(textureKey);
		}

		const canvas = document.createElement("canvas");
		canvas.width = radius;
		canvas.height = radius;
		const context = canvas.getContext("2d");

		if (context) {
			const gradient = context.createRadialGradient(
				radius / 2,
				radius / 2,
				0,
				radius / 2,
				radius / 2,
				radius / 2
			);

			switch (color) {
				case "cyan":
					gradient.addColorStop(0, "rgba(46, 204, 113, 0)");
					gradient.addColorStop(0.42, "rgba(46, 204, 113, 0.15)");
					gradient.addColorStop(0.6, "rgba(46, 204, 113, 0.92)");
					break;
				case "red":
					gradient.addColorStop(0, "rgba(255, 99, 71, 0.1)");
					gradient.addColorStop(0.45, "rgba(255, 99, 71, 0.15)");
					gradient.addColorStop(0.6, "rgba(255, 99, 71, 0.95)");
					break;
				default:
					break;
			}

			context.fillStyle = gradient;
			context.beginPath();
			context.arc(radius / 2, radius / 2, radius / 2 / 2, 0, Math.PI * 2);
			context.fill();

			const texture = PIXI.Texture.from(canvas);
			gradientTextureCache.set(textureKey, texture);

			return texture;
		}

		return PIXI.Texture.from(canvas);
	};

	return {
		createContainer,
		createImageSprite,
		createText,
		createText2,
		createGradientTexture,
		formatNumber,
	};
};

export default usePixiUtils;
