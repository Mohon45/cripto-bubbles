"use client";

import React, { useContext } from "react";
import { NavSelectLinkContext } from "../../../providers/NavSelectLinkProvider";
import { SiBinance, SiKucoin } from "react-icons/si";
import { MdStar } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { MdBlock } from "react-icons/md";
import { SettingAndFilterOptionsContext } from "../../../providers/SettingAndFilterOptionsProvider";
import { useDispatch, useSelector } from "react-redux";
import {
	setActiveLink,
	setExchangesFilter,
	setListFilter,
	setPaginationFilter,
} from "@/redux/slices/filter/filterSlice";
import { watchLists } from "@/utils/data.utils";

const pages = [
	{
		name: "1 - 100",
		value: {
			min: 1,
			max: 100,
			value: "1 - 100",
		},
	},
	{
		name: "101 - 200",
		value: {
			min: 101,
			max: 200,
			value: "101 - 200",
		},
	},
	{
		name: "201 - 300",
		value: {
			min: 201,
			max: 300,
			value: "201 - 300",
		},
	},
	{
		name: "301 - 400",
		value: {
			min: 301,
			max: 400,
			value: "301 - 400",
		},
	},
	{
		name: "401 - 500",
		value: {
			min: 401,
			max: 500,
			value: "401 - 500",
		},
	},
	{
		name: "501 - 600",
		value: {
			min: 501,
			max: 600,
			value: "501 - 600",
		},
	},
	{
		name: "601 - 700",
		value: {
			min: 601,
			max: 700,
			value: "601 - 700",
		},
	},
	{
		name: "701 - 800",
		value: {
			min: 701,
			max: 800,
			value: "701 - 800",
		},
	},
	{
		name: "801 - 900",
		value: {
			min: 801,
			max: 900,
			value: "801 - 900",
		},
	},
	{
		name: "901 - 1000",
		value: {
			min: 901,
			max: 1000,
			value: "901 - 1000",
		},
	},
];
const Dollar = () => {
	// const { handleActiveSelectLink, activeLink } =
	//   useContext(NavSelectLinkContext);

	// const { filterOptions, handleFilter } = useContext(
	//   SettingAndFilterOptionsContext
	// );
	// console.log(activeLink);

	// const { pages: curPage, exchanges: curExchange } = filterOptions;
	const {
		pages: curPage,
		exchanges: curExchange,
		lists: filterList,
		activeLink,
		...others
	} = useSelector((state) => state?.filters);
	const dispatch = useDispatch();

	const handleClick = () => {
		if (activeLink === "dollar") {
			dispatch(setActiveLink(""));
		} else {
			dispatch(setActiveLink("dollar"));
		}
	};

	let curPageIdx = 0;

	pages.forEach((page, idx) => {
		if (page.name === curPage.value) {
			curPageIdx = idx;
		}
	});

	const handleLeft = () => {
		const prevIdx = curPageIdx - 1 < 0 ? 0 : curPageIdx - 1;
		// console.log({ prevIdx });

		dispatch(setPaginationFilter(pages[prevIdx].value));
	};
	const handleRight = () => {
		const nextIdx = curPageIdx + 1 >= pages?.length ? curPageIdx : curPageIdx + 1;

		// console.log({ nextIdx });

		// handleFilter("pages", pages[nextIdx].value);
		dispatch(setPaginationFilter(pages[nextIdx].value));
	};

	return (
		<div className="flex items-center justify-center gap-x-[.6vw]">
			<div onClick={handleLeft} className="rotate-90 cursor-pointer rounded-full bg-pink p-[.4vw]">
				<img src="/down-arrow.svg" alt="Down Arrow" className="size-[1.4vw]" />
			</div>
			<div className="relative">
				<div
					onClick={handleClick}
					className="flex items-center gap-1 px-4 xl:px-[1.2vw] py-2 xl:py-[.6vw] text-white rounded-md xl:rounded-[.4vw] cursor-pointer bg-pink"
				>
					<p className="xl:text-[1.1vw]">
						{curPage?.value ? curPage?.value : curExchange ? curExchange : filterList}
					</p>
					<img
						src="/down-arrow.svg"
						alt=""
						className={`mt-[3px] ${
							activeLink === "dollar" ? "rotate-180" : "rotate-0"
						} size-[20px] xl:size-[1.4vw]  duration-300`}
					/>
				</div>
				<DropDown />
			</div>
			<div onClick={handleRight} className="-rotate-90 cursor-pointer rounded-full bg-pink p-[.4vw]">
				<img src="/down-arrow.svg" alt="Down Arrow" className="size-[1.4vw]" />
			</div>
		</div>
	);
};

function DropDown() {
	// const { activeLink } = useContext(NavSelectLinkContext);

	// const { handleFilter, filterOptions, watchLists } = useContext(SettingAndFilterOptionsContext);
	const {
		pages: { value: activePage },
		exchanges: activeExchange,
		activeLink,
		lists: activeList,
		...others
	} = useSelector((state) => state?.filters);
	const dispatch = useDispatch();
	// const {
	// 	pages: { value: activePage },
	// 	lists: activeList,
	// 	exchanges: activeExchange,
	// } = filterOptions;

	// console.log({ filterOptions });

	// if (activeLink !== "dollar") return null;

	const watchListsNav =
		watchLists?.map((watchlist) => ({
			name: watchlist?.value,
			value: watchlist?.value,
			logo: <FaEye />,
		})) ?? [];

	const lists = [
		{
			name: "Favorites",
			logo: <MdStar className="text-xl text-white" />,
			value: "Favorites",
		},
		...watchListsNav,
		{
			name: "Blocklist",
			logo: <MdBlock />,
			value: "Blocklist",
		},
	];

	const exchanges = [
		{
			name: "Binance",
			value: "Binance",

			logo: () => <SiBinance className="text-yellow-500" />,
		},
		{
			name: "MEXC",
			value: "MEXC",

			logo: () => (
				<>
					<img src="/mexc-logo.webp" alt="MEXC logo" width={24} height={24} />
				</>
			),
		},
		{
			name: "Bybit",
			value: "Bybit",

			logo: () => (
				<>
					<img src="/bybit-logo.png" alt="ByBit logo" width={24} height={24} />
				</>
			),
		},
		{
			name: "KuCoin",
			value: "KuCoin",

			logo: () => <SiKucoin className="text-green-500" />,
		},
		{
			name: "Gate.io",
			value: "Gate.io",

			logo: () => (
				<>
					<img src="/gate-io-logo.png" alt="Gate IO logo" width={24} height={24} />
				</>
			),
		},
		{
			name: "OKX",
			logo: () => (
				<>
					<img src="/okx-logo.svg" alt="OKX logo" width={24} height={24} />
				</>
			),
		},
		{
			name: "Coinbase",
			value: "Coinbase Exchange",
			logo: () => (
				<>
					<img src="/coinbase-logo.svg" alt="OKX logo" width={24} height={24} />
				</>
			),
		},
	];
	return (
		<div
			style={{ zIndex: activeLink === "dollar" ? 50 : -99999 }}
			className={`z-20 absolute flex flex-col gap-y-3 rounded-md p-4 md:w-[80vw] lg:w-[45vw] top-[100%] right-0    bg-dark ${
				activeLink === "dollar" ? "w-full  min-h-[300px] h-auto opacity-100" : "w-0 min-h-0 h-0 opacity-0"
			} duration-300`}
		>
			{/* Pages  */}
			<div className="flex flex-col gap-y-2">
				<h3
					className={`text-xl text-[#AEAEAE] font-bold ${
						activeLink === "dollar" ? " h-auto opacity-100 z-50" : " h-0 opacity-0 -z-50"
					}`}
				>
					Pages
				</h3>
				<div className="flex flex-wrap items-center gap-2">
					{pages.map((name) => (
						<div
							onClick={() => dispatch(setPaginationFilter(name.value))}
							className={`p-2 flex items-center gap-2 font-semibold cursor-pointer rounded-md  text-white ${
								name.value.value === activePage ? "bg-logo" : "bg-[#5C5959]"
							} ${
								activeLink === "dollar" ? " h-auto opacity-100 z-50" : " h-auto opacity-0 -z-50"
							} duration-300`}
							key={name.name}
						>
							<p>{name.name}</p>
						</div>
					))}
				</div>
			</div>

			{/* Lists  */}
			<div className="flex flex-col gap-y-2">
				<h3
					className={`text-xl text-[#AEAEAE] font-bold ${
						activeLink === "dollar" ? " h-auto opacity-100" : " h-0 opacity-0 "
					}`}
				>
					Lists
				</h3>
				<div className="flex flex-wrap items-center gap-2">
					{lists.map((list) => (
						<div
							onClick={() => dispatch(setListFilter(list.value))}
							className={`p-2 flex items-center gap-2 font-semibold cursor-pointer rounded-md  text-white ${
								list.value === activeList ? "bg-logo" : "bg-[#5C5959]"
							} ${
								activeLink === "dollar" ? " h-auto opacity-100 z-50" : " h-0 opacity-0 -z-50"
							} duration-200`}
							key={list.name}
						>
							<p>{list.logo}</p>
							<p>{list.name}</p>
						</div>
					))}
				</div>
			</div>

			{/* Exchanges  */}
			<div className="flex flex-col gap-y-2">
				<h3
					className={`text-xl text-[#AEAEAE] font-bold ${
						activeLink === "dollar" ? " h-auto opacity-100" : " h-0 opacity-0 "
					}`}
				>
					Exchanges
				</h3>
				<div className="flex flex-wrap items-center gap-2">
					{exchanges.map((list) => (
						<div
							onClick={() => dispatch(setExchangesFilter(list.value))}
							className={`p-2 flex items-center gap-2 font-semibold cursor-pointer rounded-md  text-white ${
								list.value === activeExchange ? "bg-logo" : "bg-[#5C5959]"
							} ${
								activeLink === "dollar" ? " h-auto opacity-100 z-50" : " h-0 opacity-0 -z-50"
							} duration-300`}
							key={list.name}
						>
							<p>{list.logo()}</p>
							<p>{list.name}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default Dollar;
