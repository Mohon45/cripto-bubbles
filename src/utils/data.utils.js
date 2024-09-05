import axios from "axios";
import { v4 as uuid } from "uuid";

export const filterByExchange = (exchange, isSet, allCryptos, setCurCryptos) => {
	const filteredCryptos = allCryptos?.filter((crypto) => {
		const exchanges = crypto?.market_urls?.map((c) => c.name);
		const isMatched = exchanges.includes(exchange);
		return isMatched;
	});

	isSet && setCurCryptos(filteredCryptos);

	return filteredCryptos;
};

export const watchlist = (type, setWatchLists, watchLists, activeBubble) => {
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

export const _favorites = (type, setFavorites, favorites, activeBubble) => {
	const isExist = favorites.find(({ id }) => id === activeBubble?.id);

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

export const _blockLists = (type, setBlockLists, blockLists, activeBubble) => {
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

export const refetch = (setIsRefetched, setRefetching, setCryptos, setAllCryptos) => {
	setIsRefetched(true);
	setRefetching(true);
	axios
		.get(process.env.NEXT_PUBLIC_BASE_URL + "/cryptos")
		.then((res) => {
			setCryptos(res.data?.result);
			setAllCryptos(res?.data?.result);

			setRefetching(false);
		})
		.catch((err) => {
			// console.log(err.message);
			setIsRefetched(false);
			// setLoading(false);
			setRefetching(false);
		});
};

export const bubbleNavLinks = [
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
];
export const watchLists = [
	{
		value: "Watchlist 1",
		placeholder: "Watchlist 1",
	},
];
