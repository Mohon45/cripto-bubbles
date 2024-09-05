import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../providers/DataProvider.js";
import { SettingAndFilterOptionsContext } from "../../providers/SettingAndFilterOptionsProvider";

const Search = () => {
  const { cryptos, handleActiveBubble, showResults, setShowResults } =
    useContext(DataContext) || {};

  const [results, setResults] = useState(
    cryptos?.map((crypto, idx) => ({ ...crypto, idx: idx + 1 }))
  );

  useEffect(() => {
    if (results?.length === 0 && showResults) {
      setResults(cryptos?.map((crypto, idx) => ({ ...crypto, idx: idx + 1 })));
    }
  }, [showResults, results, cryptos]);

  const handleQuery = (e) => {
    setShowResults(true);
    if (!e.target.value) {
      return setResults(
        cryptos?.map((crypto, idx) => ({ ...crypto, idx: idx + 1 }))
      );
    }

    setResults(
      cryptos
        .map((crypto, idx) => ({ ...crypto, idx: idx + 1 }))
        .filter((crypto) =>
          crypto.name.toLowerCase().includes(e.target.value.toLowerCase())
        )
    );
  };

  const handleClick = (crypto) => {
    // console.log({ crypto });

    handleActiveBubble({
      id: crypto.id,
      name: crypto?.name,
      data: crypto,
      symbol: crypto?.symbol,
      market_urls: crypto?.market_urls,
    });
    setShowResults(false);
  };

  // console.log({
  //   showResults,
  //   results: results?.length,
  //   cryptos: cryptos?.length,
  // });

  return (
    <div
      className=" w-2/4 2xl:w-[20vw] relative"
      onClick={(e) => e.stopPropagation()}
    >
      <input
        onFocus={() => setShowResults(true)}
        onClick={() => setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 100)}
        onChange={handleQuery}
        type="text"
        className="w-full h-10 xl:h-[3vw]   pr-4 xl:pr-[1.2vw] text-white rounded-md xl:rounded-[.6vw] bg-lightDark xl:placeholder:text-[1.2vw] focus:outline-none pl-9 xl:pl-[2.5vw] xl:text-[1.2vw]"
        placeholder="Search here..."
      />
      <img
        src="/search.svg"
        className="w-[18px] h-[18px] xl:size-[1.3vw] absolute top-[30%] left-[4%] "
        alt=""
      />

      {/* Search Results  */}
      {showResults && (
        <div
          className={`w-full 2xl:w-[20vw]  mt-1  rounded-md overflow-y-auto absolute top-[100%] flex flex-col h-auto duration-[.3s]  left-0  bg-dark  no-scrollbar`}
          style={{
            zIndex: 1900,
          }}
        >
          {results?.slice(0, 10)?.map((result, idx) => (
            <div
              key={result?.id}
              onClick={(e) => {
                e.stopPropagation();
                handleClick(result);
              }}
            >
              <Coin
                setShowResults={setShowResults}
                result={result}
                borderTop={idx !== 0}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function Coin({ result, borderTop, setShowResults }) {
  const { handleActiveBubble, activeBubble } = useContext(DataContext) || {};

  // // console.log({ activeBubble });
  // console.log({ result });
  return (
    <div
      className={`flex pl-4 pr-2 py-2 z-50   justify-between items-center hover:bg-lightGray duration-300 cursor-pointer  ${
        borderTop ? "border-t border-t-white/30" : ""
      }`}
      style={{
        zIndex: 9999,
      }}
    >
      <div className="flex items-center gap-x-2">
        <p>{result.idx}</p>
        <img
          src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${result.id}.png`}
          alt="Coin"
          width={20}
          height={20}
        />
        <p className="font-semibold text-white">{result.name}</p>
      </div>
      <p className="text-sm text-lightGray">{result.symbol}</p>
    </div>
  );
}

export default Search;
