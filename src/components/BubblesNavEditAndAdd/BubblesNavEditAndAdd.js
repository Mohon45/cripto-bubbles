import React, { useContext, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Modal from "../shared/Modal";
import { RxCross1 } from "react-icons/rx";
import { MdOutlineDelete } from "react-icons/md";
import { SettingAndFilterOptionsContext } from "../../providers/SettingAndFilterOptionsProvider";
import DeleteIcon from "../shared/DeleteIcon";
import { useDispatch, useSelector } from "react-redux";
import { bubbleNavLinks } from "@/utils/data.utils";
import { setActiveBubbleLinkID, setActiveLink } from "@/redux/slices/filter/filterSlice";

const BubblesNavEditAndAdd = ({ action = "add" }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [menuOpen, setMenuOpen] = useState(true);
	const filterState = useSelector((state) => state?.filters);
	const dispatch = useDispatch();
	// const {
	// 	bubbleNavLinks,
	// 	handleActiveBubbleLink,
	// 	filterOptions: { activeBubbleLinkID },
	// 	handleEditSingleBubble,
	// } = useContext(SettingAndFilterOptionsContext);

	const iconSrc = action === "add" ? "/plus.svg" : "/edit.svg";

	const periods = [
		// { name: "1 min", value: "1 min" },
		// { name: "5 min", value: "5 min" },
		// { name: "15 min", value: "15 min" },
		{ name: "Hour", value: "Hour" },
		{ name: "Day", value: "Day" },
		{ name: "Week", value: "Week" },
		{ name: "Month", value: "Month" },
		{ name: "2 Months", value: "2 Months" },
		{ name: "3 Months", value: "3 Months" },
		{ name: "Year", value: "Year" },
		{ name: "Market Cap & Day", value: "Market Cap & Day" },
	];

	const bubbleSizes = [
		{ name: "Performance", value: "Performance" },
		{ name: "Rank ↑↓", value: "Rank ↑↓" },
		{ name: "Market Cap", value: "Market Cap" },
		{ name: "24h Volume", value: "24h Volume" },
	];

	const bubbleContents = [
		{ name: "Performance", value: "Performance" },
		{ name: "Rank ↑↓", value: "Rank ↑↓" },
		{ name: "Market Cap", value: "Market Cap" },
		{ name: "24h Volume", value: "24h Volume" },
		{ name: "Price", value: "Price" },
		{ name: "Name", value: "Name" },
		{ name: "Dominance", value: "Dominance" },
	];

	const bubbleColors = [
		{ name: "Performance", value: "Performance" },
		{ name: "Rank ↑↓", value: "Rank ↑↓" },
		{ name: "Neutral", value: "Neutral" },
	];

	const handleActiveBubbleLink = (size, value) => {
		const sizes = bubbleNavLinks.map(({ size }) => size);

		if (sizes.includes(size)) {
			// setBubbleNavLinks(
			// 	bubbleNavLinks.map((link) => {
			// 		if (link.id !== size) {
			// 			return link;
			// 		}

			// 		return {
			// 			...link,
			// 			...value,
			// 		};
			// 	})
			// );

			dispatch(setActiveLink(size));
		} else {
			// const id = uuid();
			// // setBubbleNavLinks((prev) => [
			// // 	...prev,
			// // 	{
			// // 		...value,
			// // 		id,
			// // 	},
			// // ]);
			// handleFilter("activeBubbleLinkID", id);
		}
	};

	const handleOnClick = () => {
		const size = action === "add" ? -1 : filterState?.activeBubbleLinkID;

		// console.log({ activeBubbleLinkID });

		// const bubbleNavLink = bubbleNavLinks.find(({ id: bId }) => bId === id);
		const bubbleNavLink = bubbleNavLinks.find(({ size: bsize }) => bsize === size);
		console.log(bubbleNavLink);
		handleActiveBubbleLink(size, {
			period: size === -1 ? "Day" : bubbleNavLink.period,
			bubbleSize: size === -1 ? "Performance" : bubbleNavLink.bubbleSize,
			bubbleContent: size === -1 ? "Performance" : bubbleNavLink.bubbleContent,
			bubbleColor: size === -1 ? "Performance" : bubbleNavLink.bubbleColor,
		});
		// console.log({ bubbleNavLinks, activeBubbleLinkID, action, id });
		setIsOpen(true);
	};

	const bubbleNavLink = bubbleNavLinks.find(({ size }) => size === filterState?.activeBubbleLinkID) || {};

	const {
		period: activePeriod,
		bubbleSize: activeBubbleSize,
		bubbleContent: activeBubbleContent,
		bubbleColor: activeBubbleColor,
	} = bubbleNavLink || {};

	// console.log({
	//   activePeriod,
	//   activeBubbleContent,
	//   activeBubbleSize,
	//   activeBubbleColor,
	// });

	return (
		<>
			<div onClick={handleOnClick} className="rounded-full p-[10px] cursor-pointer border-white/30 border">
				<img src={iconSrc} alt="" className="size-[22px] xl:size-[1.6vw]" />
			</div>

			<AnimatePresence wait={true} initial={false} onExitComplete={() => null}>
				{isOpen && (
					<Modal onClose={() => setIsOpen(false)}>
						<section>
							<div className="grid items-center w-full grid-cols-7 gap-2 duration-300  xl:gap-[.8vw]">
								{/* Down arrow  */}
								<div
									onClick={() => setMenuOpen(!menuOpen)}
									className="p-[10px] xl:p-[.7vw] bg-[#313131] rounded-full flex justify-center items-center max-w-fit"
								>
									<img
										src="/down-arrow.svg"
										className={`${
											menuOpen ? "rotate-0" : "rotate-180"
										} duration-300 size-[22px] xl:size-[1.5vw]`}
										alt="Down Arrow"
									/>
								</div>
								<div className="col-span-4 ">
									<CustomName />
								</div>
								<div className="flex items-center justify-end col-span-2 gap-2 xl:gap-[.6vw]">
									<div className="max-w-fit">
										<DeleteOption setIsOpen={setIsOpen} />
									</div>
									<div
										onClick={() => setIsOpen(false)}
										className="p-3 xl:p-[.9vw] rounded-full bg-lightGray max-w-fit"
									>
										<RxCross1 className="font-bold text-white xl:text-[1.2vw]" />
									</div>
								</div>
							</div>

							{menuOpen && (
								<section
									className={`flex mt-6 flex-col duration-300 gap-y-3 xl:gap-y-[1vw] ${
										menuOpen ? "h-auto opacity-100" : "h-0 opacity-0"
									}`}
								>
									<Option
										header="Period"
										action={action}
										options={periods}
										keyName="period"
										activeVal={activePeriod}
									/>
									<Option
										header="Bubble Size"
										action={action}
										options={bubbleSizes}
										keyName="bubbleSize"
										activeVal={activeBubbleSize}
									/>
									<Option
										header="Bubble Content"
										action={action}
										options={bubbleContents}
										keyName="bubbleContent"
										activeVal={activeBubbleContent}
									/>
									<Option
										header="Bubble Color"
										action={action}
										options={bubbleColors}
										keyName="bubbleColor"
										activeVal={activeBubbleColor}
									/>
								</section>
							)}
						</section>
					</Modal>
				)}
			</AnimatePresence>
		</>
	);
};

function Option({ header, options, keyName, activeVal }) {
	// const {
	// 	filterOptions: { activeBubbleLinkID },
	// 	handleEditSingleBubble,
	// } = useContext(SettingAndFilterOptionsContext);
	console.log(keyName);
	const filterState = useSelector((state) => state?.filters);
	const dispatch = useDispatch();
	console.log(activeVal);
	return (
		<div className="flex flex-col gap-y-1 xl:gap-y-[.3vw] min-[1700px]:gap-y-[.5vw] min-[2000px]:gap-y-[.7vw] min-[2200px]:gap-y-[.9vw] 2xl:mt-[1.2vw]">
			<h3 className=" font-medium text-lg md:text-xl xl:text-[1.3vw] text-[#AEAEAE]">{header}</h3>

			<div className="flex flex-wrap items-center gap-2 xl:gap-[.6vw] ">
				{options?.map((option) => (
					<p
						onClick={() => {
							// console.log({ activeBubbleLinkID, keyName, value: option.value });
							// handleEditSingleBubble(activeBubbleLinkID, keyName, option.value);
							dispatch(setActiveBubbleLinkID(option?.value.toUpperCase()));
						}}
						className={`px-3 xl:px-[.9vw] py-2 xl:py-[.5vw]   font-semibold text-white rounded-md xl:rounded-[.4vw] cursor-pointer   xl:text-[1vw] ${
							option.value.toUpperCase() === activeVal?.toUpperCase()
								? "bg-logo text-white"
								: "bg-lightGray "
						}`}
						key={option.name}
					>
						{option.name}
					</p>
				))}
			</div>
		</div>
	);
}

function CustomName() {
	return (
		<section className="relative w-full min-w-[32px] min-h-[32px] xl:min-w-[2vw] xl:min-h-[2vw] xl:h-[1.2vw]">
			<img src="/edit.svg" alt="Edit icon" className="absolute top-[40%] left-[3%] size-[20px] xl:size-[1.4vw]" />
			<input
				type="text"
				placeholder="24h Volume & Market Cap"
				className=" w-full bg-dark  focus:!outline-none  placeholder:text-lightGray text-white py-2 xl:py-[.6vw] pl-8 xl:pl-[2.8vw] border  border-white/30 rounded-md xl:rounded-[.4vw] xl:placeholder:text-[1.2vw] xl:text-[1.2vw]"
			/>
		</section>
	);
}

function DeleteOption({ setIsOpen }) {
	// const {
	// 	filterOptions: { activeBubbleLinkID },
	// 	handleDeleteBubbleLink,
	// } = useContext(SettingAndFilterOptionsContext);

	return (
		<DeleteIcon
			onDelete={() => {
				// handleDeleteBubbleLink(activeBubbleLinkID);
				setIsOpen(false);
			}}
		/>
	);
}

export default BubblesNavEditAndAdd;
