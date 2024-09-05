import React, { useContext } from "react";
import { NavSelectLinkContext } from "../../providers/NavSelectLinkProvider";
import { SettingAndFilterOptionsContext } from "../../providers/SettingAndFilterOptionsProvider";
import { DataContext } from "../../providers/DataProvider.js";
import { useDispatch, useSelector } from "react-redux";
import { setActiveLink } from "@/redux/slices/filter/filterSlice";

const Container = ({ children }) => {
	// const { handleActiveSelectLink, activeLink } =
	//   useContext(NavSelectLinkContext);
	// const { isOpen, setIsOpen, setIsAddToOpen } = useContext(
	//   SettingAndFilterOptionsContext
	// );

	// const { setShowResults } = useContext(DataContext) || {};
	const filterState = useSelector((state) => state?.filters);
	const dispatch = useDispatch();
	return (
		<section
			onClick={() => {
				filterState?.activeLink !== "" && dispatch(setActiveLink(""));
				// setShowResults(false);
				// setIsAddToOpen("");
				// setIsOpen(false);
			}}
			className="w-full h-full "
		>
			{children}
		</section>
	);
};

export default Container;
