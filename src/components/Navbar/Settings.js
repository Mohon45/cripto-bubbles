"use client";

import React, { useContext, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { RxCross1 } from "react-icons/rx";
import Modal from "../shared/Modal";
import Select from "../shared/Select";
import WatchList from "./WatchList";
import { SettingAndFilterOptionsContext } from "../../providers/SettingAndFilterOptionsProvider";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setColors } from "@/redux/slices/filter/filterSlice";

const Settings = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [menuOpen, setMenuOpen] = useState(true);

	return (
		<>
			<div onClick={() => setIsOpen(true)} className="p-3 xl:p-[.8vw] rounded-full bg-pink">
				<img src="/setting.svg" alt="" className="xl:size-[1.8vw]" />
			</div>

			<AnimatePresence wait={true} initial={false} onExitComplete={() => null}>
				{isOpen && (
					<Modal onClose={() => setIsOpen(false)}>
						<section className="h-auto ">
							<div className="flex items-center justify-between w-full duration-300">
								<div className="flex items-center gap-x-2 xl:gap-x-[.6vw]">
									{/* Down arrow  */}
									<div
										onClick={() => setMenuOpen(!menuOpen)}
										className="p-[10px] xl:p-[.7vw] bg-[#313131] rounded-full flex justify-center items-center"
									>
										<img
											src="/down-arrow.svg"
											className={`${
												menuOpen ? "rotate-0" : "rotate-180"
											} duration-300 size-[22px] xl:size-[1.5vw]`}
											alt="Down Arrow"
										/>
									</div>
									{/* Settings Icon  */}
									<img
										src="/setting.svg"
										alt="Settings icon"
										className="size-[26px] xl:size-[1.7vw]"
									/>
									<h3 className="text-lg font-medium text-white md:text-xl xl:text-[1.4vw] ">
										Settings
									</h3>
								</div>
								<div
									onClick={() => setIsOpen(false)}
									className="p-3 xl:p-[.8vw] rounded-full bg-lightGray"
								>
									<RxCross1 className="font-bold text-white" />
								</div>
							</div>
							{menuOpen && <SettingContent menuOpen={menuOpen} />}
						</section>
					</Modal>
				)}
			</AnimatePresence>
		</>
	);
};

function SettingContent({ menuOpen }) {
	const [curKey, setCurKey] = useState("");
	const handleCurrentKey = (key) => {
		setCurKey(key);
	};

	// const { handleFilter, filterOptions } = useContext(
	//   SettingAndFilterOptionsContext
	// );
	const filterState = useSelector((state) => state?.filters);
	const dispatch = useDispatch();

	const colorsOptions = [
		{
			name: "Red + Green",
			value: "Red + Green",
		},
		{
			name: "Yellow + Blue",
			value: "Yellow + Blue",
		},
	];

	const stableCoinsOptions = [
		{
			name: "Show",
			value: "Show",
		},
		{
			name: "Hide",
			value: "Hide",
		},
	];

	// console.log(curKey);

	return (
		<section
			className={`flex flex-col pt-4 xl:pt-[1.2vw]  gap-y-4 xl:gap-y-[1.2vw] bg-transparent duration-300 w-full ${
				menuOpen ? "min-h-[250px] h-auto opacity-100" : "min-h-0 h-0 opacity-0"
			}`}
		>
			{/* Language  */}
			<div className="relative flex items-center justify-between">
				<p className=" font-medium text-lg md:text-xl xl:text-[1.4vw] text-[#AEAEAE]">Language</p>
				<div
					onClick={(e) => {
						e.stopPropagation();
						curKey === "language" ? handleCurrentKey("") : handleCurrentKey("language");
					}}
					className={`flex text-white  duration-200 gap-2 xl:gap-[.6vw] justify-center  items-center py-2 xl:py-[.6vw] px-4 xl:px-[.8vw] rounded-md xl:rounded-[.4vw] ${
						curKey === "language" ? "bg-sky" : "bg-lightGray"
					}`}
				>
					<img
						src="/english.svg"
						alt="English language"
						className="w-[20px] h-[15px]  xl:w-[1.4vw] xl:h-[1.1vw]"
					/>
					<p className="text-[1.2vw]">English</p>

					<img
						src="/down-arrow.svg"
						alt="Down Arrow"
						className={` duration-300 size-[20px] xl:size-[1.5vw] ${
							curKey === "language" ? " rotate-180" : "rotate-0"
						}`}
					/>
					{curKey === "language" && <LanguageDropDown curKey={curKey} handleCurrentKey={handleCurrentKey} />}
				</div>
			</div>
			{/* Colors  */}
			<div className="relative flex items-center justify-between">
				<p className=" font-medium text-lg md:text-xl xl:text-[1.4vw] text-[#AEAEAE]">Colors</p>
				<Select
					className="px-12 xl:!px-[3vw]"
					activeVal={filterState?.colors || ""}
					onChange={(option) => {
						dispatch(setColors(option.value));
						setCurKey("");
					}}
					options={colorsOptions}
					onClick={() => (curKey === "color" ? setCurKey("") : setCurKey("color"))}
					isOpen={curKey === "color"}
				/>
			</div>
			{/* Stable Coins  */}
			{/* <div className="relative flex items-center justify-between">
        <p className=" font-medium text-lg md:text-xl xl:text-[1.4vw] text-[#AEAEAE]">
          Stablecoins
        </p>
        <Select
          className="px-8 xl:px-[2vw]"
          activeVal={filterOptions.stable || ""}
          options={stableCoinsOptions}
          onClick={() =>
            curKey === "stable" ? setCurKey("") : setCurKey("stable")
          }
          isOpen={curKey === "stable"}
          onChange={(option) => {
            handleFilter("stable", option.value);
            setCurKey("");
          }}
        />
      </div> */}

			{/* WatchList  */}
			<WatchList />
			{/* <div className="relative w-full md:w-[80%]">
        <div className="absolute bottom-[100%] left-0 bg-dark">
          <input
            type="text"
            className="w-full px-2 py-3 border border-gray-300 text-lightGray focus:outline-none bg-dark"
            value={JSON.stringify(filterOptions)}
          />
        </div>
        <TextIcon
          text="Export settings + lists"
          icon={<FaArrowRightToBracket />}
        />
      </div> */}
		</section>
	);
}

function LanguageDropDown({ curKey }) {
	const languages = [
		{
			name: "English",
			src: "/english.svg",
			value: "English",
		},
		{
			name: "Spain",
			src: "/spain.svg",
			value: "Spain",
		},
		{
			name: "Turkey",
			src: "/turkey.svg",
			value: "Turkey",
		},
		{
			name: "Netherland",
			src: "/netherland.svg",
			value: "Netherland",
		},
		{
			name: "France",
			src: "/france.svg",
			value: "France",
		},
		{
			name: "German",
			src: "/german.svg",
			value: "German",
		},
	];
	return (
		<section
			className={`z-50 absolute w-[85vw]  p-2 flex-wrap gap-2 xl:gap-[.6vw]  sm:w-[75vw] md:w-[55vw] lg:w-[35vw]  bg-[#313131] rounded-md xl:rounded-[.4vw] top-[100%] right-0 duration-300 ${
				curKey === "language" ? "h-auto opacity-100" : "h-0 opacity-0"
			}`}
		>
			<section className="flex flex-wrap items-center gap-2 xl:gap-[.6vw]">
				{languages.map((language) => (
					<div
						key={language.name}
						className="flex items-center justify-center px-3 xl:px-[.8vw]  py-2 xl:py-[.6vw] rounded-md xl:rounded-[.4vw] bg-lightGray min-w-fit gap-x-2 to-white"
					>
						<img
							src={language.src}
							alt={language.alt}
							className="w-[20px] h-[15px]  xl:w-[1.4vw] xl:h-[1.1vw]"
						/>
						<p>{language.name}</p>
					</div>
				))}
			</section>
		</section>
	);
}

function TextIcon({ text, icon }) {
	return (
		<div className="flex items-center px-3 xl:px-[.8vw] py-2 xl:py-[.6vw] text-lg xl:text-[1.4vw] text-white bg-lightGray gap-x-2  xl:gap-x-[.6vw] rounded-xl xl:rounded-[1vw]">
			{icon}
			{text}
		</div>
	);
}

export default Settings;
