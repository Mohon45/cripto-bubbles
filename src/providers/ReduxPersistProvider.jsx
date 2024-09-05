"use client";

import { persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";

const ReduxPersistProvider = ({ children }) => {
	return (
		<PersistGate loading={null} persistor={persistor}>
			{children}
		</PersistGate>
	);
};

export default ReduxPersistProvider;
