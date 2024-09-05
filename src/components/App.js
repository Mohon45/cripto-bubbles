"use client";
import {
	createTheme,
	ThemeProvider,
	// responsiveFontSizes,
	Button,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Table from "./CoinTable";
import Graph from "../components/Graph";
import axios from "axios";
import Navbar from "../components/Navbar/Navbar";
import NavSelectLinkProvider, { NavSelectLinkContext } from "../providers/NavSelectLinkProvider";
import Container from "../components/container/Container";
import TestComponent from "../components/TestComponent/TestComponent";
import SettingAndFilterOptionsProvider, {
	SettingAndFilterOptionsContext,
} from "../providers/SettingAndFilterOptionsProvider";
import BubbleNav from "../components/Bubbles/BubbleNav";
import DataProvider, { DataContext } from "../providers/DataProvider.js";

import BubbleModal from "../components/Bubbles/BubbleModal";
import BubblesLoad from "../components/Bubbles/BubblesLoad";
import Footer from "../components/Footer/Footer";
import MinuteInterval from "../components/MinuteInterval/MinuteInterval";
// import Bubbles from "../components/Bubbles/Bubbles";
import Bubbles from "../components/Bubbles/BubblesNew";
// import BubblesNew2 from "../components/Bubbles/BubblesNew2";
import CustomTable from "./CustomTable";
import { criptos } from "./cryptos";
import { useDispatch, useSelector } from "react-redux";
import { setAllCrypto, setCoins } from "@/redux/slices/crypto/cryptoSlice";
import { useQuery } from "@tanstack/react-query";

let theme = createTheme({
	palette: {
		mode: "dark",
	},
});
// let fontResponsive = responsiveFontSizes(theme);
function App() {
	const [graphVersion, setGraphVersion] = useState("HOUR");
	const [minuteData, setMinuteData] = useState(false);
	const [apiData, setApiDate] = useState([]);
	const [coinName, setCoinName] = useState("");
	const [coinSymbol, setCoinSymbol] = useState("");
	const [coinId, setCoinId] = useState(null);
	const [key, setKey] = useState("1");
	const [loading, setLoading] = useState(true);

	const { pages, language, exchanges, ...others } = useSelector((state) => state?.filters);
	const dispatch = useDispatch();
	console.log(language);
	const cryptosQueries = useQuery({
		queryKey: ["cryptos"],
		queryFn: async () => {
			const response = await axios.get(process.env.NEXT_PUBLIC_BASE_URL + "/cryptos");
			return response?.data;
		},
		refetchInterval: 60000,
		// staleTime: 0,
		// refetchOnWindowFocus: false,
		// refetchOnReconnect: false,
		// retry: false,
	});

	// const { handleActiveBubble, activeBubble, loading } = useContext(DataContext) || {};
	// const {
	// 	filterOptions: {
	// 		activeBubbleLinkID,
	// 		pages: { min, max },
	// 	},
	// 	setShowResults,
	// 	language,
	// } = useContext(SettingAndFilterOptionsContext);

	// console.log("Rerendered");

	// const getMinuteDate = async () => {
	// 	// setGraphVersion("DAY");
	// 	const result = await axios.post("http://localhost:5000/user/tenminute", {
	// 		key: key,
	// 	});
	// 	setMinuteData(false);
	// 	// console.log(result?.data?.data?.quotes);
	// 	setApiDate(result?.data?.data?.quotes);
	// 	setCoinName(result?.data?.data?.name);
	// 	setCoinSymbol(result?.data?.data?.symbol);
	// 	setCoinId(result?.data?.data?.id);
	// };

	// useEffect(() => {
	// 	console.log("state changed");
	// }, [pages]);

	useEffect(() => {
		if (cryptosQueries?.data?.result) {
			console.log(exchanges);
			let newCoins = [];
			if (exchanges && exchanges !== "") {
				const filteredByExchanged = cryptosQueries?.data?.result?.filter((item) =>
					item.market_urls.map((market) => market.name).includes(exchanges)
				);
				console.log(filteredByExchanged);
				newCoins = filteredByExchanged;
			}
			if (pages?.value !== "") {
				newCoins = cryptosQueries?.data?.result?.slice(pages?.min - 1, pages?.max);
			}
			console.log(newCoins);
			const filterCoins = newCoins?.map((coin) => ({
				id: coin.id,
				symbol: coin.symbol,
				coinName: coin.name,
				slug: coin?.slug,
				HOUR: coin.quote[language || "USD"]?.percent_change_1h,
				DAY: coin?.quote[language || "USD"]?.percent_change_24h,
				WEEK: coin?.quote[language || "USD"]?.percent_change_7d,
				MONTH: coin?.quote[language || "USD"]?.percent_change_30d,
				YEAR: coin?.quote?.USD?.yearPercentage,
				MARKET_CAP: coin?.quote[language || "USD"]?.market_cap,
				image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin?.id}.png`,
				text2: "",
				market_urls: coin?.market_urls,
				Performance: coin.quote[language || "USD"]?.volume_change_24h,
				"Rank ↑↓": coin?.cmc_rank,
				Name: coin?.name,
				Dominance: coin.quote[language || "USD"]?.market_cap_dominance,
				Hour: coin.quote[language || "USD"]?.percent_change_1h,
				Day: coin?.quote[language || "USD"]?.percent_change_24h,
				Week: coin?.quote[language || "USD"]?.percent_change_7d,
				Month: coin?.quote[language || "USD"]?.percent_change_30d,
				Price: coin?.quote[language || "USD"]?.price,
				data: coin,
				keep: true,
			}));

			dispatch(setAllCrypto(cryptosQueries?.data?.result));
			dispatch(setCoins(filterCoins));
			setLoading(false);
		}
	}, [pages, cryptosQueries?.isLoading, cryptosQueries?.isFetching, exchanges, language]);

	// useEffect(() => {
	// 	// everyMinuteData();
	// }, [key]);
	let extractedData = null;
	if (!minuteData) {
		extractedData = apiData?.map((item) => ({
			date: item?.timestamp,
			price: item?.quote?.USD?.price,
		}));
	} else {
		extractedData = apiData?.map((item) => ({
			date: item?.last_updated,
			price: item?.quote?.USD?.price,
		}));
	}
	const width = 1000;
	const height = 3000;

	// const weeklyData = async () => {
	//   setGraphVersion("WEEK")
	//   const result = await axios.post("http://localhost:5000/user/onehour", {
	//     key: key,
	//   });
	//   setMinuteData(false);
	//   // console.log(result?.data?.data?.quotes);
	//   setApiDate([result?.data?.data?.quotes]);
	//   setCoinName(result?.data?.data?.name);
	//   setCoinSymbol(result?.data?.data?.symbol);
	//   setCoinId(result?.data?.data?.id);
	// };

	// const weeklyData = async () => {
	// 	setGraphVersion("WEEK");
	// 	const result = await axios.post("http://localhost:5000/user/onehour", {
	// 		key: key,
	// 	});
	// 	setMinuteData(false);
	// 	// console.log(result?.data?.data?.quotes);
	// 	setApiDate(result?.data?.data?.quotes);
	// 	setCoinName(result?.data?.data?.name);
	// 	setCoinSymbol(result?.data?.data?.symbol);
	// 	setCoinId(result?.data?.data?.id);
	// };

	// const monthlyData = async () => {
	// 	setGraphVersion("MONTH");
	// 	const result = await axios.post("http://localhost:5000/user/sixhour", {
	// 		key: key,
	// 	});
	// 	setMinuteData(false);
	// 	// console.log(result?.data?.data?.quotes);
	// 	setApiDate(result?.data?.data?.quotes);
	// 	setCoinName(result?.data?.data?.name);
	// 	setCoinSymbol(result?.data?.data?.symbol);
	// 	setCoinId(result?.data?.data?.id);
	// };

	// const yearlyData = async () => {
	// 	setGraphVersion("YEAR");
	// 	const result = await axios.post("http://localhost:5000/user/threeday", {
	// 		key: key,
	// 	});
	// 	setMinuteData(false);
	// 	// console.log(result?.data?.data?.quotes);
	// 	setApiDate(result?.data?.data?.quotes);
	// 	setCoinName(result?.data?.data?.name);
	// 	setCoinSymbol(result?.data?.data?.symbol);
	// 	setCoinId(result?.data?.data?.id);
	// };

	// const everyMinuteData = async () => {
	// 	setGraphVersion("HOUR");
	// 	const result = await axios.post("http://localhost:5000/userdte", {
	// 		key: key,
	// 	});
	// 	setMinuteData(true);
	// 	// console.log(result?.data?.data);
	// 	setApiDate(result?.data?.data);
	// 	setCoinName(result?.data?.data[0]?.name);
	// 	setCoinSymbol(result?.data?.data[0]?.symbol);
	// 	setCoinId(result?.data?.data[0]?.id);
	// };

	// Inline styles for tooltip and price

	// console.log("Hitted App.js, This is App");

	return (
		<ThemeProvider theme={theme}>
			<Container
				// onClick={() => handleActiveSelectLink("")}
				className="w-full h-full"
				// style={{ backgroundColor: "#0F0112" }}
			>
				<div style={{ position: "relative" }}>
					{/* <Graph
        data={extractedData}
        width={width}
        height={height}
        coinName={coinName}
        coinSymbol={coinSymbol}
        id={coinId}
      /> */}
					{/* Price tooltip */}
				</div>
				<Navbar />

				<div className="relative h-auto max-w-full border border-white/30">
					<MinuteInterval />
					<BubbleNav />

					{cryptosQueries.isLoading ? <BubblesLoad /> : <Bubbles />}

					{/* {loading ? <BubblesLoad /> : <BubblesNew2 />} */}

					{/* <Bubbles /> */}
				</div>

				{/* <BubbleModal /> */}

				{/* <TestComponent /> */}
				{/* <Button
          style={{
            background: `${graphVersion !== "HOUR" ? "" : "blue"}`,
            color: "red",
          }}
          onClick={everyMinuteData}
        >
          Hour
        </Button>
        <Button
          style={{
            background: `${graphVersion !== "DAY" ? "" : "blue"}`,
            color: "red",
          }}
          onClick={getMinuteDate}
        >
          Day
        </Button>
        <Button
          style={{
            background: `${graphVersion !== "WEEK" ? "" : "blue"}`,
            color: "red",
          }}
          onClick={weeklyData}
        >
          Week
        </Button>
        <Button
          style={{
            background: `${graphVersion !== "MONTH" ? "" : "blue"}`,
            color: "red",
          }}
          onClick={monthlyData}
        >
          Month
        </Button>
        <Button
          style={{
            background: `${graphVersion !== "YEAR" ? "" : "blue"}`,
            color: "red",
          }}
          onClick={yearlyData}
        >
          Year
        </Button> */}

				<section className="overflow-x-auto w-full scrollbar-none !h-fit">
					{/* <CustomTable />
					{loading && <Table keys={setKey} />} */}
				</section>
				<Footer />
			</Container>
		</ThemeProvider>
	);
}

export default App;
