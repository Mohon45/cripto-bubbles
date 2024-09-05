import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
const filterState = useSelector((state) => state?.filters);

const initialState = {
	bubbleNavLinks: [
		{
			id: uuid(),
			period: "Hour",
			bubbleSize: "Hour",
			bubbleContent: "Hour",
			bubbleColor: "Performance",
			size: "HOUR",
		},
		{
			id: uuid(),
			period: "Day",
			bubbleSize: "24h Volume",
			bubbleContent: "Day",
			bubbleColor: "Performance",
			size: "DAY",
		},
		{
			id: uuid(),
			period: "Week",
			bubbleSize: "Week",
			bubbleContent: "Week",
			bubbleColor: "Performance",
			size: "WEEK",
		},
		{
			id: uuid(),
			period: "Month",
			bubbleSize: "Month",
			bubbleContent: "Month",
			bubbleColor: "Performance",
			size: "MONTH",
		},
		{
			id: uuid(),
			period: "Year",
			bubbleSize: "Year",
			bubbleContent: "Year",
			bubbleColor: "Performance",
			size: "YEAR",
		},
		{
			id: uuid(),
			period: "Market Cap & Day",
			bubbleSize: "Market Cap",
			bubbleContent: "Market Cap",
			bubbleColor: "Market Cap",
			size: "MARKET_CAP",
		},
	],
};

const bubbleNavLinksSlice = createSlice({
	name: "bubbleNavLinks",
	initialState,
	reducers: {
		setBubbleNavLinks: (state, action) => {
			state.bubbleNavLinks = [...state.bubbleNavLinks, ...action.payload];
		},
	},
});

export const { setBubbleNavLinks } = bubbleNavLinksSlice.actions;

export default bubbleNavLinksSlice.reducer;
