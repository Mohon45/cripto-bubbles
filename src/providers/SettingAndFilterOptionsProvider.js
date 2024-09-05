"use client";
import { v4 as uuid } from "uuid";
import React, { createContext, useEffect, useState } from "react";
import BubblesLoad from "../components/Bubbles/BubblesLoad";

export const SettingAndFilterOptionsContext = createContext(null);

const initialActiveBubbleLinkIDs = [uuid(), uuid(), uuid(), uuid(), uuid(), uuid()];
const SettingAndFilterOptionsProvider = ({ children }) => {
	const [bubbleNavLinks, setBubbleNavLinks] = useState([
		{
			id: initialActiveBubbleLinkIDs[0],
			period: "Hour",
			bubbleSize: "Hour",
			bubbleContent: "Hour",
			bubbleColor: "Performance",
			size: "HOUR",
		},
		{
			id: initialActiveBubbleLinkIDs[1],
			period: "Day",
			bubbleSize: "24h Volume",
			bubbleContent: "Day",
			bubbleColor: "Performance",
			size: "DAY",
		},
		{
			id: initialActiveBubbleLinkIDs[2],
			period: "Week",
			bubbleSize: "Week",
			bubbleContent: "Week",
			bubbleColor: "Performance",
			size: "WEEK",
		},
		{
			id: initialActiveBubbleLinkIDs[3],
			period: "Month",
			bubbleSize: "Month",
			bubbleContent: "Month",
			bubbleColor: "Performance",
			size: "MONTH",
		},
		{
			id: initialActiveBubbleLinkIDs[4],
			period: "Year",
			bubbleSize: "Year",
			bubbleContent: "Year",
			bubbleColor: "Performance",
			size: "YEAR",
		},
		{
			id: initialActiveBubbleLinkIDs[5],
			period: "Market Cap & Day",
			bubbleSize: "Market Cap",
			bubbleContent: "Market Cap",
			bubbleColor: "Market Cap",
			size: "MARKET_CAP",
		},
	]);

	const [filterOptions, setFilterOptions] = useState({
		pages: {
			min: 1,
			max: 100,
			value: "1 - 100",
		},
		lists: "",
		exchanges: "",
		fiat: "",
		crypto: "",
		language: "USD",
		colors: "Red + Green",
		stable: "Show",
		activeBubbleLinkID: bubbleNavLinks[0].id,
	});

	const [watchLists, setWatchLists] = useState([
		{
			value: "Watchlist 1",
			placeholder: "Watchlist 1",
		},
	]);

	const [isReinitialize, setIsReinitialize] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [isAddToOpen, setIsAddToOpen] = useState(false);

	// console.log({ filterOptions: filterOptions.activeBubbleLinkID });

	const handleFilter = (key, value) => {
		setIsReinitialize(true);

		if (key === "pages") {
			setFilterOptions((prev) => ({
				...prev,
				exchanges: "",
			}));
		}

		if (key === "exchanges") {
			setFilterOptions((prev) => ({
				...prev,
				pages: {
					...prev.pages,
					value: "",
				},
			}));
		}

		const newValue = filterOptions[key] === value && !["activeBubbleLinkID", "pages"].includes(key) ? "" : value;
		setFilterOptions((prev) => ({
			...prev,
			[key]: newValue,
		}));
	};

	const handleActiveBubbleLink = (id, value) => {
		const ids = bubbleNavLinks.map(({ id }) => id);

		if (ids.includes(id)) {
			setBubbleNavLinks(
				bubbleNavLinks.map((link) => {
					if (link.id !== id) {
						return link;
					}

					return {
						...link,
						...value,
					};
				})
			);

			handleFilter("activeBubbleLinkID", id);
		} else {
			const id = uuid();
			setBubbleNavLinks((prev) => [
				...prev,
				{
					...value,
					id,
				},
			]);

			handleFilter("activeBubbleLinkID", id);
		}
	};

	const handleEditSingleBubble = (_id, key, value) => {
		// console.log({ _id, key, value });
		const bubbleLink = bubbleNavLinks.find(({ id }) => id === filterOptions.activeBubbleLinkID) || {};

		if (!bubbleLink) return;

		const newBubbleLink = {
			...bubbleLink,
			// id: _id,
			[key]: value,
		};

		// console.log(bubbleLink);

		// setBubbleNavLinks((prev) => {
		//   return prev.map((link) => {
		//     if (link.id !== filterOptions.activeBubbleLinkID) return link;
		//     return newBubbleLink;
		//   });
		// });

		setBubbleNavLinks(
			bubbleNavLinks.map((link) => (link.id !== filterOptions.activeBubbleLinkID ? link : newBubbleLink))
		);
	};

	const handleDeleteBubbleLink = (_id) => {
		setBubbleNavLinks((prev) => prev.filter(({ id }) => id !== _id));
		handleFilter("activeBubbleLinkID", 0);
	};

	const handleChangeWatchList = (e, index) => {
		setWatchLists((prev) =>
			prev.map((v, idx) => {
				if (idx !== index) return v;

				return {
					...v,
					value: e.target.value,
				};
			})
		);
	};

	const handleAddWatchList = () => {
		setWatchLists((prev) => [
			...prev,
			{
				value: "",
				placeholder: "Watchlist " + (+watchLists.length + 1),
			},
		]);
	};

	const handleDeleteWatchList = (index) => {
		if (index === 0) return;
		setWatchLists((prev) => prev.filter((_, idx) => idx !== index));
	};

	const value = {
		filterOptions,
		watchLists,
		bubbleNavLinks,
		isReinitialize,
		isOpen,
		isAddToOpen,
		setIsOpen,
		setIsAddToOpen,
		handleFilter,
		handleChangeWatchList,
		handleDeleteWatchList,
		handleAddWatchList,
		handleActiveBubbleLink,
		handleEditSingleBubble,
		handleDeleteBubbleLink,
	};

	return <SettingAndFilterOptionsContext.Provider value={value}>{children}</SettingAndFilterOptionsContext.Provider>;
};

export default SettingAndFilterOptionsProvider;
