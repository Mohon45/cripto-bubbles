import React from "react";

import Search from "./Search";
import Time from "./SelectLinks/Time";
import Dollar from "./SelectLinks/Dollar";
import USD from "./SelectLinks/USD";
import Settings from "./Settings";
import { Link } from "react-scroll";

const Navbar = () => {
	return (
		<nav className="grid grid-cols-2  max-w-screen   px-4 xl:px-[1.2vw] my-2 xl:my-[.6vw] text-red-500">
			{/* Left  */}
			<div className="flex items-center gap-4 xl:gap-[1.2vw]">
				<h1 className="text-2xl xl:text-[1.8vw] font-bold text-logo">CRYPTO BUBBLE</h1>
				<Search />
			</div>

			{/* Right  */}
			<div className="flex items-center justify-end gap-4 xl:gap-[1.2vw]">
				<Time />
				<Dollar />
				<USD />
				<Settings />

				{/* Edit  */}
				<Link
					smooth={true}
					duration={400}
					to="table"
					className="p-3 xl:[.8vw] rounded-full cursor-pointer bg-pink"
				>
					<img src="/menu.svg" alt="" className="xl:size-[1.8vw]" />
				</Link>
			</div>
		</nav>
	);
};

export default Navbar;
