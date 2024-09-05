import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	allCrypto: null,
	coins: null,
};

const cryptoSlice = createSlice({
	name: "cryptos",
	initialState,
	reducers: {
		setAllCrypto: (state, action) => {
			state.allCrypto = action.payload;
		},
		setCoins: (state, action) => {
			state.coins = action.payload;
		},
	},
});

export const { setAllCrypto, setCoins } = cryptoSlice.actions;

export default cryptoSlice.reducer;
