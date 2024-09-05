import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	pages: {
		min: 1,
		max: 100,
		value: "1 - 100",
	},
	lists: "",
	exchanges: "",
	fiat: "",
	crypto: "",
	language: "USD",
	colors: "Red + Green",
	stable: "Show",
	activeLink: "",
	activeBubbleLinkID: "HOUR",
	bubbleSize: "24h Volume",
	bubbleContent: "Hour",
	bubbleColor: "Performance",
};

const filterSlice = createSlice({
	name: "filters",
	initialState,
	reducers: {
		setPaginationFilter: (state, action) => {
			state.exchanges = "";
			state.lists = "";
			state.pages = action.payload;
		},
		setListFilter: (state, action) => {
			state.pages.value = "";
			state.exchanges = "";
			state.lists = action.payload;
		},
		setExchangesFilter: (state, action) => {
			state.pages.value = "";
			state.lists = "";
			state.exchanges = action.payload;
		},
		setActiveLink: (state, action) => {
			state.activeLink = action.payload;
		},
		setActiveBubbleLinkID: (state, action) => {
			state.activeBubbleLinkID = action.payload;
		},
		setLanguage: (state, action) => {
			state.language = action.payload;
		},
		setColors: (state, action) => {
			state.colors = action.payload;
		},
		setBubbleSize: (state, action) => {
			state.bubbleSize = action.payload;
		},
		setBubbleContent: (state, action) => {
			state.bubbleContent = action.payload;
		},
		setBubbleColor: (state, action) => {
			state.bubbleColor = action.payload;
		},
	},
});

export const {
	setPaginationFilter,
	setListFilter,
	setExchangesFilter,
	setActiveLink,
	setActiveBubbleLinkID,
	setLanguage,
	setColors,
	setBubbleSize,
	setBubbleContent,
	setBubbleColor,
} = filterSlice.actions;

export default filterSlice.reducer;
