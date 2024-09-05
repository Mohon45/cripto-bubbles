"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constant/constant";
import { SettingAndFilterOptionsContext } from "./SettingAndFilterOptionsProvider";

// Create a context for managing and providing crypto data
export const DataContext = createContext(null);

const DataProvider = ({ children }) => {
	const [cryptos, setCryptos] = useState([]);

	const [isRefetched, setIsRefetched] = useState(false);
	const [refetching, setRefetching] = useState(false);
	const [watchLists, setWatchLists] = useState([]);
	const [blockLists, setBlockLists] = useState([]);
	const [favorites, setFavorites] = useState([]);
	const [loading, setLoading] = useState(true);
	const [curCryptos, setCurCryptos] = useState([]);
	const [activeBubble, setActiveBubble] = useState("");
	const [allCryptos, setAllCryptos] = useState([]);
	const [coins, setCoins] = useState([]);
	const [refetchedCoins, setRefetchedCoins] = useState([]);
	const [isFetched, setIsFetched] = useState(false);

	const [showResults, setShowRes] = useState(false);

	// Get filter options from context
	const {
		filterOptions: {
			pages: { min, max },
			lists,
			exchanges,
			activeBubbleLinkID,
		},
		bubbleNavLinks,
		bubbleColor,

		colors,
		language,
	} = useContext(SettingAndFilterOptionsContext);

	const curActiveExchange = exchanges;

	// console.log({ bubbleNavLinks });

	const plusColor = colors === "Red + Green" ? "green" : "cyan";
	const minusColor = colors === "Red + Green" ? "red" : "yellow";

	const [period, setPeriod] = useState("");

	useEffect(() => {
		const curBubble =
			bubbleNavLinks?.find(({ id }) => {
				return activeBubbleLinkID === id;
			}) || {};

		const { bubbleSize: bubbleSort, period } = curBubble;
		setPeriod(period);
	}, [activeBubbleLinkID]);

	// console.log({ period });

	// // console.log({ min, max, curCryptos: curCryptos[0]?.name });

	const setShowResults = (res) => {
		setShowRes(res);
	};

	// Handle setting the active bubble
	const handleActiveBubble = useCallback((bubble) => {
		// console.log(bubble);
		setActiveBubble(bubble);
	}, []);

	// Update current cryptos based on filter options and list type
	useEffect(() => {
		setLoading(true);
		if (loading) return;
		if (!lists) {
			setCurCryptos(cryptos?.slice(min - 1, max));
			return setLoading(false);
		}

		if (lists === "Favorites") {
			setCurCryptos(favorites);
			return setLoading(false);
		}

		if (lists === "Blocklist") {
			setCurCryptos(blockLists);
			return setLoading(false);
		}

		setCurCryptos(watchLists.filter((watchlist) => watchlist.type === lists));
		setLoading(false);
	}, [lists, loading, favorites, blockLists, cryptos, watchLists, min, max]);

	// console.log({ watchLists });
	// console.log({ curCryptos });

	const handleFilterByExchange = (exchange, isSet = true) => {
		// console.log("called");
		const filteredCryptos = allCryptos?.filter((crypto) => {
			const exchanges = crypto?.market_urls?.map((c) => c.name);
			const isMatched = exchanges.includes(exchange);
			return isMatched;
		});

		// console.log({ length: filteredCryptos?.length });
		isSet && setCurCryptos(filteredCryptos);

		return filteredCryptos;
	};

	// Handle adding or removing from watchlist
	const handleWatchlist = (type) => {
		const isExist = watchLists.find(({ id }) => id === activeBubble?.id);
		if (isExist) {
			setWatchLists(watchLists.filter(({ id }) => id !== activeBubble?.data?.id));
		} else {
			setWatchLists([
				...watchLists,
				{
					type,
					...activeBubble?.data,
				},
			]);
		}
	};

	// Handle adding or removing from favorites
	const handleFavorites = (type) => {
		// console.log(favorites);
		// console.log(activeBubble.name, activeBubble.id);
		const isExist = favorites.find(({ id }) => id === activeBubble?.id);
		// console.log(isExist);
		if (isExist) {
			setFavorites(favorites.filter(({ id }) => id !== activeBubble?.data?.id));
		} else {
			setFavorites([
				...favorites,
				{
					type,
					...activeBubble?.data,
				},
			]);
		}
	};

	// Handle adding or removing from blocklist
	const handleBlocklists = (type) => {
		const isExist = blockLists.find(({ id }) => id === activeBubble?.id);
		if (isExist) {
			setBlockLists(blockLists.filter(({ id }) => id !== activeBubble?.data?.id));
		} else {
			setBlockLists([
				...blockLists,
				{
					type,
					...activeBubble?.data,
				},
			]);
		}
	};

	const handleSetIsRefetch = () => {
		setIsRefetched(!isRefetched);
	};

	useEffect(() => {
		let interval;

		interval = setInterval(() => {
			!loading && handleRefetch();
		}, 60000);

		return () => clearInterval(interval);
	}, [loading]);

	// // console.log({ curActiveExchange, min });

	useEffect(() => {
		if (period === "Year") {
			// setCurCryptos(curCryptos?.filter((c) => c.quote.USD.yearPercentage));
		}
	}, [period]);

	// Update current cryptos when filter options change
	useEffect(() => {
		// console.log("Called");
		setIsFetched(false);
		if (cryptos?.length === 0) return;
		let curCryptos = allCryptos?.slice(min - 1, max);

		if (curActiveExchange) {
			// console.log({ curActiveExchangeInside: curActiveExchange, min });
			curCryptos = handleFilterByExchange(curActiveExchange, false);
			setCurCryptos(curCryptos);
		} else {
			if (period === "Year") {
				// console.log({ period, c: curCryptos[0] });
				// setCurCryptos(curCryptos?.filter((c) => c.quote.USD.yearPercentage));
				// // console.log({ c: curCryptos[0] });
			} else {
				setCurCryptos(curCryptos);
			}
		}

		// localStorage.setItem("cryptos", JSON.stringify(curCryptos));
		// localStorage.setItem("value", Math.floor(Math.random() * 100000));

		// // console.log({ curLength: curCryptos?.length });
		setIsFetched(true);
		setCoins(
			cryptos?.slice(min - 1, max).map((coin) => ({
				id: coin.id,
				// x: number,
				// y: number,
				// vx: number,
				// vy: number,
				// color: string,
				// dragging: boolean,
				// targetRadius: number,
				symbol: coin.symbol,
				coinName: coin.name,
				slug: coin?.slug,
				// radius: number,
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
			}))
		);
	}, [min, max, cryptos, curActiveExchange, allCryptos]);

	useEffect(() => {
		// setRefetchedCoins();
		// allCryptos?.slice(min - 1, max).map((coin) => ({
		//   id: coin.id,
		//   // x: number,
		//   // y: number,
		//   // vx: number,
		//   // vy: number,
		//   // color: string,
		//   // dragging: boolean,
		//   // targetRadius: number,
		//   symbol: coin.symbol,
		//   coinName: coin.name,
		//   slug: coin?.slug,
		//   // radius: number,
		//   HOUR: coin.quote[language || "USD"]?.percent_change_1h,
		//   DAY: coin?.quote[language || "USD"]?.percent_change_24h,
		//   WEEK: coin?.quote[language || "USD"]?.percent_change_7d,
		//   MONTH: coin?.quote[language || "USD"]?.percent_change_30d,
		//   YEAR: coin?.quote?.USD?.yearPercentage,
		//   MARKET_CAP: coin?.quote[language || "USD"]?.market_cap,
		//   image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin?.id}.png`,
		//   text2: "",
		//   market_urls: coin?.market_urls,
		//   Performance: coin.quote[language || "USD"]?.volume_change_24h,
		//   "Rank ↑↓": coin?.cmc_rank,
		//   Name: coin?.name,
		//   Dominance: coin.quote[language || "USD"]?.market_cap_dominance,
		//   Hour: coin.quote[language || "USD"]?.percent_change_1h,
		//   Day: coin?.quote[language || "USD"]?.percent_change_24h,
		//   Week: coin?.quote[language || "USD"]?.percent_change_7d,
		//   Month: coin?.quote[language || "USD"]?.percent_change_30d,
		//   Price: coin?.quote[language || "USD"]?.price,
		//   data: coin,
		//   keep: true,
		// }))
	}, [min, max]);

	// Refetch crypto data from server
	const handleRefetch = () => {
		setIsRefetched(true);
		setRefetching(true);
		axios
			.get(process.env.NEXT_PUBLIC_BASE_URL + "/cryptos")
			.then((res) => {
				setCryptos(res.data?.result);
				setAllCryptos(res?.data?.result);
				// setLoading(false);
				// setRefetchedCoins(
				//   res.data?.result?.slice(min - 1, max).map((coin) => ({
				//     id: coin.id,
				//     // x: number,
				//     // y: number,
				//     // vx: number,
				//     // vy: number,
				//     // color: string,
				//     // dragging: boolean,
				//     // targetRadius: number,
				//     symbol: coin.symbol,
				//     coinName: coin.name,
				//     slug: coin?.slug,

				//     // radius: number,
				//     HOUR: coin.quote[language || "USD"]?.percent_change_1h,
				//     DAY: coin?.quote[language || "USD"]?.percent_change_24h,
				//     WEEK: coin?.quote[language || "USD"]?.percent_change_7d,
				//     MONTH: coin?.quote[language || "USD"]?.percent_change_30d,
				//     YEAR: coin?.quote?.USD?.yearPercentage,
				//     MARKET_CAP: coin?.quote[language || "USD"]?.market_cap,
				//     image: `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin?.id}.png`,
				//     text2: "",
				//     market_urls: coin?.market_urls,
				//     Performance: coin.quote[language || "USD"]?.volume_change_24h,
				//     "Rank ↑↓": coin?.cmc_rank,
				//     Name: coin?.name,
				//     Dominance: coin.quote[language || "USD"]?.market_cap_dominance,
				//     Hour: coin.quote[language || "USD"]?.percent_change_1h,
				//     Day: coin?.quote[language || "USD"]?.percent_change_24h,
				//     Week: coin?.quote[language || "USD"]?.percent_change_7d,
				//     Month: coin?.quote[language || "USD"]?.percent_change_30d,
				//     Price: coin?.quote[language || "USD"]?.price,
				//     data: coin,
				//     keep: true,
				//   }))
				// );
				setRefetching(false);
			})
			.catch((err) => {
				// console.log(err.message);
				setIsRefetched(false);
				// setLoading(false);
				setRefetching(false);
			});
	};

	// Initial fetch of crypto data on component mount
	useEffect(() => {
		if (cryptos?.length === 0 && process.env.NEXT_PUBLIC_BASE_URL) {
			axios
				.get(process.env.NEXT_PUBLIC_BASE_URL + "/cryptos")
				.then((res) => {
					setCryptos(res.data?.result);
					setAllCryptos(res?.data?.result);
					setLoading(false);
				})
				.catch((err) => {
					// console.log(err.message);
					setLoading(false);
				});
		}
	}, [cryptos]);

	useEffect(() => {}, [curCryptos]);

	// Provide crypto data and handlers to children components
	const value = {
		cryptos: curCryptos,
		coins,
		refetchedCoins,
		allCryptos,
		loading,
		isFetched,
		handleActiveBubble,
		handleFilterByExchange,
		activeBubble,
		showResults,
		setShowResults,
		handleFavorites,
		handleWatchlist,
		handleBlocklists,
		watchLists,
		favorites,
		blockLists,
		refetching,
		handleRefetch,
		handleSetIsRefetch,
	};

	return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataProvider;
