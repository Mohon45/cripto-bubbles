import React, { useContext } from "react";
import { CircleImage, CustomInput } from "../Bubbles/BubbleModal";
import { MdOutlineDelete } from "react-icons/md";
import { SettingAndFilterOptionsContext } from "../../providers/SettingAndFilterOptionsProvider";
import DeleteIcon from "../shared/DeleteIcon";
import { watchLists } from "@/utils/data.utils";

const WatchList = () => {
	// const {
	//   handleChangeWatchList,
	//   handleAddWatchList,
	//   handleDeleteWatchList,
	//   watchLists,
	// } = useContext(SettingAndFilterOptionsContext);

	return (
		<section className="flex flex-col gap-y-2 xl:gap-y-[.6vw]">
			<div className="relative flex items-center justify-between">
				<p className=" font-medium text-lg md:text-xl xl:text-[1.4vw] text-[#AEAEAE]">Watchlists</p>
				<div
				// onClick={handleAddWatchList}
				>
					<CircleImage src="/plus.svg" alt="Plus Icon" />
				</div>
			</div>
			{watchLists.map(({ placeholder, value }, index) => (
				<div key={placeholder} className="flex items-center justify-between w-full gap-x-4 xl:gap-x-[1.2vw]">
					<CustomInput
						// onChange={(e) => handleChangeWatchList(e, index)}
						className="flex-2 !w-full"
						placeholder={placeholder}
						value={value}
					/>
					<DeleteIcon
						// onDelete={() => handleDeleteWatchList(index)}
						dropDownTop
					/>
				</div>
			))}
		</section>
	);
};

export default WatchList;
