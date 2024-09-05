"use client";

import React, { useContext } from "react";
// import { NavSelectLinkContext } from "../../../providers/NavSelectLinkProvider";
// import { SettingAndFilterOptionsContext } from "../../../providers/SettingAndFilterOptionsProvider";
import { setActiveBubbleLinkID, setActiveLink } from "@/redux/slices/filter/filterSlice";
import { useDispatch, useSelector } from "react-redux";
import { bubbleNavLinks } from "@/utils/data.utils";

const Time = () => {
	// const { handleActiveSelectLink, activeLink } =
	//   useContext(NavSelectLinkContext);
	const filterState = useSelector((state) => state?.filters);
	const dispatch = useDispatch();
	const handleClick = () => {
		if (filterState?.activeLink === "time") {
			dispatch(setActiveLink(""));
		} else {
			dispatch(setActiveLink("time"));
		}
	};

	return (
		<div className="relative">
			<div
				onClick={handleClick}
				className="flex items-center gap-1 px-4 xl:px-[1.2vw] py-2 xl:py-[.6vw] text-white rounded-md xl:rounded-[.4vw] cursor-pointer bg-pink"
			>
				<p className="xl:text-[1.1vw]">Time</p>
				<img
					src="/down-arrow.svg"
					alt=""
					className={`mt-[3px] ${
						filterState?.activeLink === "time" ? "rotate-180" : "rotate-0"
					} size-[20px] xl:size-[1.4vw]  duration-300`}
				/>
			</div>
			<DropDown />
		</div>
	);
};

function DropDown() {
	const filterState = useSelector((state) => state?.filters);
	// const {
	// 	bubbleNavLinks,
	// 	handleFilter,
	// 	filterOptions: { activeBubbleLinkID },
	// } = useContext(SettingAndFilterOptionsContext);
	const dispatch = useDispatch();

	if (filterState?.activeLink !== "time") return null;

	return (
		<div
			className={`z-20 absolute rounded-md w-full md:w-[80vw] lg:w-[45vw] top-[100%] right-0    bg-dark ${
				filterState?.activeLink === "time" ? "h-auto opacity-100" : "min-h-0 h-0 opacity-0"
			} duration-300 p-4`}
		>
			<div className="flex flex-col gap-y-2">
				<h3
					className={`text-xl text-[#AEAEAE] font-bold ${
						filterState?.activeLink === "time" ? " h-auto opacity-100" : " h-0 opacity-0 "
					}`}
				>
					Duration
				</h3>
				<div className="flex flex-wrap items-center gap-2">
					{bubbleNavLinks?.map((bubble) => (
						<div
							onClick={() => dispatch(setActiveBubbleLinkID(bubble?.size))}
							className={`p-2 flex items-center gap-2 font-semibold cursor-pointer rounded-md  text-white ${
								bubble?.size === filterState?.activeBubbleLinkID ? "bg-logo" : "bg-[#5C5959]"
							} ${
								filterState?.activeLink === "time" ? " h-auto opacity-100" : " h-0 opacity-0 "
							} duration-200`}
							key={bubble.id}
						>
							{bubble?.period}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default Time;
