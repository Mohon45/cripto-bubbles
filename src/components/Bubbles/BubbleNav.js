"use client";

import React, { useContext } from "react";
import BubblesNavEditAndAdd from "../BubblesNavEditAndAdd/BubblesNavEditAndAdd";
import { SettingAndFilterOptionsContext } from "../../providers/SettingAndFilterOptionsProvider";
import { useDispatch, useSelector } from "react-redux";
import { bubbleNavLinks } from "@/utils/data.utils";
import { setActiveBubbleLinkID } from "@/redux/slices/filter/filterSlice";

const BubbleNav = () => {
	const navLinks = ["Hour", "Day", "Week", "Month", "Year", "Market Cap & Day"];

	// const { bubbleNavLinks, filterOptions, handleFilter } = useContext(
	//   SettingAndFilterOptionsContext
	// );
	// // console.log({ bubbleNavLinksLength: bubbleNavLinks?.length });
	// const { activeBubbleLinkID } = filterOptions;
	const filterState = useSelector((state) => state?.filters);
	const dispatch = useDispatch();

	return (
		<section className="grid w-full grid-cols-4 p-4 xl:p-[1.2vw] xs:grid-cols-5 md:grid-cols-6 bg-lightDark">
			<div className="max-w-[90%] col-span-3 xs:col-span-4 md:col-span-5 !overflow-x-auto no-scrollbar">
				<div className="flex items-center w-full gap-3 xl:gap-[1vw] overflow-x-auto no-scrollbar">
					{bubbleNavLinks.map(({ period, id, size }) => {
						// console.log({ period, id });
						return (
							<div
								onClick={() => dispatch(setActiveBubbleLinkID(size))}
								key={period}
								className={`px-3 xl:px-[.9vw] py-2 xl:py-[.6vw]  min-[1700px]:py-[.8vw] min-[2000px]:py-[1vw] min-[2200px]:py-[1.2vw] text-sm xl:text-[1.2vw] duration-[.2s] border rounded-md xl:rounded-[.6vw] cursor-pointer min-w-fit hover:shadow-sm hover:shadow-white/60  border-white/30 sm:text-base ${
									size === filterState?.activeBubbleLinkID ? "bg-logo text-white" : "text-logo"
								}`}
							>
								{period}
							</div>
						);
					})}
				</div>
			</div>
			<div className="flex items-center justify-end gap-3 min-w-fit">
				<BubblesNavEditAndAdd action="edit" />
				<BubblesNavEditAndAdd />
			</div>
		</section>
	);
};

export default BubbleNav;
