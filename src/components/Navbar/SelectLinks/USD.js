"use client";

import React, { useContext } from "react";
import { NavSelectLinkContext } from "../../../providers/NavSelectLinkProvider";
import { FaDollarSign } from "react-icons/fa";
import { FaEuroSign } from "react-icons/fa";
import { FaRubleSign } from "react-icons/fa";
import { PiCurrencyGbp } from "react-icons/pi";
import { PiCurrencyInrBold } from "react-icons/pi";
import { RiEthFill } from "react-icons/ri";
import { SiBinance } from "react-icons/si";
import { SettingAndFilterOptionsContext } from "../../../providers/SettingAndFilterOptionsProvider";
import { useDispatch, useSelector } from "react-redux";
import { setActiveLink, setLanguage } from "@/redux/slices/filter/filterSlice";

export const lists = [
	{
		name: "USD",
		logo: "$",
	},
	{
		name: "EUR",
		logo: "€",
	},
	{
		name: "RUB",
		logo: "₽",
	},
	{
		name: "BRL",
		logo: "R$",
	},
	{
		name: "GBP",
		logo: "£",
	},
	{
		name: "INR",
		logo: "₹",
	},
	{
		name: "AUD",
		logo: "$",
	},
	{
		name: "CAD",
		logo: "$",
	},
	{
		name: "PLN",
		logo: "zł",
	},
	{
		name: "TRY",
		logo: "₺",
	},
];

const USD = () => {
	// const { handleActiveSelectLink, activeLink } =
	//   useContext(NavSelectLinkContext);

	// const {
	//   filterOptions: { language },
	// } = useContext(SettingAndFilterOptionsContext);
	const filterState = useSelector((state) => state?.filters);
	const dispatch = useDispatch();
	const handleClick = () => {
		if (filterState?.activeLink === "usd") {
			dispatch(setActiveLink(""));
		} else {
			dispatch(setActiveLink("usd"));
		}
	};

	const logo = lists.find((list) => list.name === filterState?.language)?.logo || "";

	return (
		<div className="relative z-20" onClick={(e) => e.stopPropagation()}>
			<div
				onClick={handleClick}
				className="flex items-center gap-1 px-4 xl:px-[1.2vw] py-2 xl:py-[.6vw] text-white rounded-md xl:rounded-[.4vw] cursor-pointer bg-pink"
			>
				<p className="xl:text-[1.1vw]">
					{filterState?.language} {logo}
				</p>
				<img
					src="/down-arrow.svg"
					alt=""
					width={20}
					height={20}
					className={`mt-[3px] ${
						filterState?.activeLink === "usd" ? "rotate-180" : "rotate-0"
					} size-[20px] xl:size-[1.4vw]  duration-300`}
				/>
			</div>
			<DropDown />
		</div>
	);
};

function DropDown() {
	// const { activeLink } = useContext(NavSelectLinkContext);
	// const { handleFilter, filterOptions } = useContext(SettingAndFilterOptionsContext);
	// const { crypto: activeCrypto, language: activeLanguage } = filterOptions;
	const filterState = useSelector((state) => state?.filters);
	const dispatch = useDispatch();

	if (filterState?.activeLink !== "usd") return null;

	const cryptos = [
		{
			name: "BTC",
			logo: <SiBinance className="text-xl text-white" />,
		},
		{
			name: "ETH",
			logo: <RiEthFill className="text-xl text-white" />,
		},
	];

	return (
		<div
			className={`z-20 absolute flex flex-col gap-y-3 rounded-md w-full p-4 md:w-[80vw] lg:w-[45vw] top-[100%] right-0    bg-dark ${
				filterState?.activeLink === "usd" ? "min-h-auto h-auto opacity-100" : "min-h-0 h-0 opacity-0"
			} duration-300`}
		>
			{/* Fiat  */}
			<div className="flex flex-col gap-y-2">
				<h3 className="text-xl text-[#AEAEAE] font-bold">Fiat</h3>
				<div className="flex flex-wrap items-center gap-2">
					{lists.map((list) => (
						<div
							onClick={() => dispatch(setLanguage(list.name))}
							className={` cursor-pointer py-2 px-3 flex items-center gap-2 font-semibold rounded-md text-white ${
								list.name === filterState?.language ? "bg-logo" : " bg-[#5C5959]"
							}`}
							key={list.name}
						>
							<p>{list.logo}</p>
							<p>{list.name}</p>
						</div>
					))}
				</div>
			</div>
			{/* Crypto  */}
			{/* <div className="flex flex-col gap-y-2">
        <h3 className="text-xl text-[#AEAEAE] font-bold">Crypto</h3>
        <div className="flex flex-wrap items-center gap-2">
          {cryptos?.map((list) => (
            <div
              onClick={() => handleFilter("crypto", list.name)}
              className={` cursor-pointer py-2 px-3 flex items-center gap-2 font-semibold rounded-md  text-white ${
                list.name === activeCrypto ? "bg-logo" : "bg-[#5C5959]"
              }`}
              key={list.name}
            >
              {list.logo}
              {list.name}
            </div>
          ))}
        </div>
      </div> */}
		</div>
	);
}

export default USD;
