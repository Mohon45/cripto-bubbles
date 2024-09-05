import { exchangeIds } from "@/data/exchangeIds";
import Crypto from "@/server/models/crypto";
import axios from "axios";
import { calculatePercentage } from "./getUnixDate";
const apiKey = "";
const queryParams =
  "limit=1000&aux=market_url,currency_name,currency_slug,price_quote,effective_liquidity,market_score,market_reputation&category=spot";

async function getExchangeMarketPairs(exchangeId) {
  const url = `https://pro-api.coinmarketcap.com/v1/exchange/market-pairs/latest?id=${exchangeId}&${queryParams}`;
  const config = {
    headers: {
      "X-CMC_PRO_API_KEY": apiKey,
    },
  };

  try {
    const response = await axios.get(url, config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching data for exchangeId ${exchangeId}:`, error);
    return null;
  }
}

export async function fetchAndProcessExchangeData(cryptoData) {
  let mainData = [...(cryptoData || [])];

  if (!mainData || mainData?.length === 0) {
    // console.log("Hit ");

    const res = await Crypto.find({});
    mainData = res[0]?.result;
  }

  // // console.log("fetched called", typeof mainData);
  let newData = [...mainData];

  newData = newData.map((data) => {
    data.market_urls = [];

    return data;
  });

  for (let exchange of exchangeIds) {
    const response = await getExchangeMarketPairs(exchange.id);
    const market_pairs =
      response && response.data && response.data.market_pairs;

    newData = newData.map((crypto) => {
      const id = crypto.id;

      if (Array.isArray(market_pairs)) {
        for (let marketPair of market_pairs) {
          const currencyId = marketPair.market_pair_base.currency_id;

          if (currencyId === id) {
            const currencyName = marketPair.market_pair_base.currency_name;

            const isExist = crypto.market_urls.find(
              ({ name }) => name === exchange.name
            );

            if (!isExist) {
              crypto.market_urls = [
                ...crypto.market_urls,
                {
                  ...exchange,
                  url: marketPair.market_url,
                },
              ];
            }
          }
        }
      }

      return crypto;
    });
  }

  if (!cryptoData) {
    // console.log("Hit Crypto Data");
    await Crypto.deleteMany({});
    const cryptoModel = new Crypto({ result: newData });
    await cryptoModel.save();
  }

  return newData;
}

export async function saveCryptoDataEveryMinute() {
  // console.log("Hit _saveCryptoDataEveryMinute");
  try {
    const result = await axios.get(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=1000&convert=USD,EUR,RUB,GBP,AUD,CAD,TRY`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-CMC_PRO_API_KEY": "",
        },
      }
    );
    const data = await result?.data?.data;

    let newData = [...data];
    const res = await Crypto.find({});
    const cryptos = res[0]?.result;
    if (Array.isArray(cryptos) && cryptos?.length > 0) {
      // console.log("IF Hit");
      const prevData = cryptos;

      const marketUrlMap = {};

      prevData.forEach((obj) => {
        marketUrlMap[obj.id] = obj?.market_urls || [];
      });

      newData = newData.map((obj) => {
        obj.market_urls = marketUrlMap[obj.id] || [];
        return obj;
      });
    } else {
      // console.log("Else Hit");
      newData = await fetchAndProcessExchangeData(data);
    }

    await Crypto.deleteMany({});

    const dataToSave = newData.map((obj) => {
      let {
        tags,
        num_market_pairs,
        date_added,
        total_supply,
        infinite_supply,
        tvl_ratio,
        ...rest
      } = obj;
      return rest;
    });

    const idsWithNoYearPercentage = dataToSave
      .filter((data) => !data?.quote?.USD?.yearPercentage)
      .map((data) => data?.id);

    // // console.log({ idsWithNoYearPercentage });

    // await saveArrayToFile(idsWithNoYearPercentage, "idsWithNoYear.json");

    const cryptoModel = new Crypto({ result: dataToSave });

    await cryptoModel.save();

    // console.log("Data Saved");
  } catch (error) {
    // console.log("Error saving crypto data", error.message);
    throw new Error(error);
  }
}

export async function fetchYearlyDataEvery5Minutes() {
  try {
    const res = await Crypto.find({});
    const cryptos = res[0]?.result;

    if (!cryptos || cryptos.length === 0) {
      // console.log("No crypto data available to fetch yearly data.");
      throw new Error("No crypto data available to fetch yearly data.");
    }

    const ids = cryptos.map((crypto) => crypto.id).join(",");

    const resultYear = await axios.get(
      `https://pro-api.coinmarketcap.com/v3/cryptocurrency/quotes/historical?id=${ids}&count=1&interval=365d`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-CMC_PRO_API_KEY": "",
        },
      }
    );

    const dataYear = await resultYear?.data?.data;

    const currencies = [
      "USD",
      "EUR",
      "RUB",
      "BRL",
      "GBP",
      "INR",
      "AUD",
      "CAD",
      "PLN",
      "TRY",
      "IST",
    ];

    const updatedCryptos = [];

    for (let idx = 0; idx < cryptos.length; idx++) {
      const crypto = cryptos[idx];
      const currentId = crypto.id;
      const yearPrice = dataYear[currentId]?.quotes[0]?.quote?.USD?.price;
      const currentPrice = crypto.quote.USD.price;

      const yearPercentage = await calculatePercentage(currentPrice, yearPrice);
      crypto.quote.USD.yearPercentage = yearPercentage;

      // idx === 0 && // console.log({ crypto });

      updatedCryptos.push(crypto);
    }

    // console.log(updatedCryptos[0]);

    await Crypto.updateOne(
      { _id: res[0]._id },
      {
        $set: {
          result: updatedCryptos,
        },
      }
    );

    // console.log("Yearly Data Updated");
  } catch (error) {
    // console.log("Error fetching yearly data", error.message);
    throw new Error(error);
  }
}
