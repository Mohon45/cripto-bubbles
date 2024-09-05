import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import cryptoReducers from "@/redux/slices/crypto/cryptoSlice";
import filterReducers from "@/redux/slices/filter/filterSlice";
import { combineReducers } from "@reduxjs/toolkit";

const persistConfig = {
	key: "root",
	storage,
};

const rootreducers = combineReducers({
	cryptos: cryptoReducers,
	filters: filterReducers,
});

// export const persistedReducer = persistReducer(persistConfig, reducers);
const reducers = persistReducer(persistConfig, rootreducers);
// Export the reducers variable
export default reducers;
