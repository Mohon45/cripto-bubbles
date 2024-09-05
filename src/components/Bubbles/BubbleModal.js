import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../providers/DataProvider.js";
import Modal from "../shared/Modal";
import { AnimatePresence } from "framer-motion";
import { RxCross1 } from "react-icons/rx";
import CustomLineChart from "../../charts/LineChart";
import { BASE_URL } from "../../constant/constant";
import axios from "axios";
import { SettingAndFilterOptionsContext } from "../../providers/SettingAndFilterOptionsProvider";
import { FaEye } from "react-icons/fa";
import { MdBlock, MdStar } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";

const timeUrlMap = {
  Hour: "/oneminute",
  Day: "/tenminute",
  Year: "/threeday",
  Month: "/sixhour",
  Week: "/onehour",
};

const bubbleNavMap = {
  Hour: "percent_change_1h",
  Day: "percent_change_24h",
  Week: "percent_change_7d",
  Month: "percent_change_30d",
  Year: "fully_diluted_market_cap",
  "Market Cap & Day": "market_cap",
  "2 Months": "percent_change_60d",
  "3 Months": "percent_change_30d",
};

export function formatNumber(value) {
  // Check if the value is a number
  if (typeof value !== "number" || isNaN(value)) {
    return "Invalid number";
  }

  // Convert the value to absolute value
  const absValue = Math.abs(value);

  if (absValue >= 1000000000000) {
    return (absValue / 1000000000000).toFixed(1) + "T";
  } else if (absValue >= 1000000000) {
    return (absValue / 1000000000).toFixed(1) + "B";
  }

  // If less than a billion, return the original value
  return value;
}

const BubbleModal = () => {
  const { handleActiveBubble, activeBubble } = useContext(DataContext) || {};
  const {
    filterOptions: { language },
  } = useContext(SettingAndFilterOptionsContext);

  // console.log(language);

  // console.log({ activeBubble });

  const [menuOpen, setMenuOpen] = useState(true);
  const [time, setTime] = useState("Hour");
  const [loading, setLoading] = useState(true);
  const [exchangLoading, setExchangeLoading] = useState(false);
  const { id, data: coinInfo } = activeBubble || {};
  const [price, setPrice] = useState(coinInfo?.quote[language]?.price);
  const [numOfCoin, setNumOfCoin] = useState(1);
  const [exchangeInfo, setExchangeInfo] = useState([]);

  // console.log(Object.keys(activeBubble));

  const [data, setData] = useState([]);

  // console.log({ coinInfo: coinInfo?.quote });

  // console.log(data);

  // console.log(exchangeInfo);

  useEffect(() => {
    // for getting exchange info of a particular coin every time the modal open
    if (activeBubble?.id && false) {
      setExchangeLoading(true);
      axios
        .get(BASE_URL + `/exchange?id=${activeBubble.id}`)
        .then((res) => {
          setExchangeInfo(res.data.market_pairs);
          setExchangeLoading(false);
        })
        .catch((err) => {
          // console.log(err.message);
          setExchangeLoading(false);
        });
    }
  }, [activeBubble?.id]);

  useEffect(() => {
    // This is for graph, for now it's disabled
    if (false) {
      setLoading(true);
      // console.log(timeUrlMap[time]);
      axios
        .post(BASE_URL + timeUrlMap[time], {
          key: id,
        })
        .then((res) => {
          // console.log(res);
          const data = time === "Hour" ? res.data.data : res.data.data.quotes;
          // console.log(data);
          const dataForGraph = data.map((coin) => ({
            value: formatNumber(coin.quote[language]?.price),
            date:
              coin?.quote[language]?.timestamp ||
              coin?.quote[language]?.last_updated,
          }));
          // console.log(dataForGraph);

          setData(dataForGraph);
          setLoading(false);
        })
        .catch((err) => {
          // console.log(err.message);
          setLoading(false);
        });
    }
  }, [time, id, language]);

  return (
    <AnimatePresence wait={true} initial={false} onExitComplete={() => null}>
      {activeBubble && (
        <Modal
          onClose={(e) => {
            handleActiveBubble("");
          }}
          smallHeight
          removePadding
        >
          <section className="min-h-[70vh] relative py-4 xl:py-[1.2vw] min-[1700px]:px-[1.4vw]">
            <div className="flex items-center justify-between w-full gap-2 px-4 duration-300">
              {/* Down arrow  */}
              <div className="flex items-center gap-2 xl:gap-[.6vw]">
                {/* <div
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-[10px] bg-[#313131] rounded-full flex justify-center  items-center max-w-fit"
                >
                  <img
                    src="/down-arrow.svg"
                    className={`${
                      menuOpen ? "rotate-0" : "rotate-180"
                    } duration-300`}
                    alt="Down Arrow"
                    width={22}
                    height={22}
                  />
                </div> */}

                <CircleImage
                  src="/down-arrow.svg"
                  alt="Down Arrow"
                  rotate
                  setMenuOpen={setMenuOpen}
                  menuOpen={menuOpen}
                />

                {/* <CircleImage src="/plus.svg" alt="Plus" /> */}
                <AddTo />
              </div>

              <div className="flex items-center justify-end col-span-2 gap-2">
                <div
                  onClick={() => handleActiveBubble("")}
                  className="p-3 xl:p-[.8vw] rounded-full bg-lightGray max-w-fit"
                >
                  <RxCross1 className="font-bold text-white xl:text-[1.2vw]" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-4 xl:gap-y-[1.2vw]">
              {!exchangLoading && (
                <Trade exchangeInfo={activeBubble?.market_urls || []} />
              )}
              {exchangLoading && <TradeSkeleton />}
              <div className="flex items-center justify-center w-full gap-2 xl:gap-[.6vw]">
                <CustomInput
                  type="number"
                  min={1}
                  onChange={(e) => setNumOfCoin(e.target.value)}
                  value={numOfCoin}
                />
                <p className="text-lg  xl:text-[1.4vw] font-bold text-gray-300">
                  {coinInfo?.symbol} ={" "}
                  <span>
                    ${(coinInfo?.quote[language]?.price * numOfCoin).toFixed(2)}
                  </span>
                </p>
              </div>
              <div className="flex md:w-[80%] mx-auto justify-between items-center">
                <Data header={"Rank"} value={coinInfo?.cmc_rank} />
                <Data
                  header={"Market Cap"}
                  value={formatNumber(coinInfo?.quote[language]?.market_cap)}
                />
                <Data
                  header={"24h Volume"}
                  value={coinInfo?.quote[language]?.percent_change_24h.toFixed(
                    2
                  )}
                />
              </div>
            </div>

            {/* <div className="w-full h-[250px]">
              {!loading && <CustomLineChart data={data} />}
              {loading && (
                <div className="flex items-center justify-center w-full h-full">
                  <img
                    src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${id}.png`}
                    alt="Coin"
                    width={40}
                    height={40}
                    className="animate-spin"
                  />
                </div>
              )}
            </div> */}

            {/* <Tab setTime={setTime} time={time} /> */}
          </section>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export function AddTo({ bubble }) {
  const {
    handleFilter,
    filterOptions: { language },
    watchLists,
    isAddToOpen: isOpen,
    setIsAddToOpen: setIsOpen,
  } = useContext(SettingAndFilterOptionsContext);

  const {
    handleFavorites,
    handleWatchlist,
    handleBlocklists,
    watchLists: watchListsBubble,
    favorites,
    blockLists,
    activeBubble: curBubble,
  } = useContext(DataContext) || {};
  // const [isOpen, setIsOpen] = useState(false);

  const activeBubble = bubble ? bubble : curBubble;

  const watchListsNav = watchLists.map((watchlist) => ({
    name: watchlist.value,
    value: watchlist.value,
    logo: <FaEye />,
    add: (type) => handleWatchlist(type),
  }));

  const lists = [
    {
      name: "Favorites",
      logo: <MdStar className="text-xl text-white" />,
      value: "Favorites",
      add: (type) => handleFavorites(),
    },
    ...watchListsNav,
    {
      name: "Blocklist",
      logo: <MdBlock />,
      value: "Blocklist",
      add: (type) => handleBlocklists(),
    },
  ];

  return (
    <div className="relative">
      <div
        onClick={(e) => {
          // console.log(isOpen);
          e.stopPropagation();
          setIsOpen(activeBubble?.id);
        }}
      >
        <CircleImage
          className="z-10 cursor-pointer "
          src="/plus.svg"
          alt="Plus"
          isSmall={!!bubble}
        />
      </div>
      {isOpen === activeBubble?.id && (
        <div className="absolute top-[100%]  left-0 h-auto py-2 w-[150px] rounded-xl z-10 bg-dark shadow-sm shadow-gray-300 flex  flex-col">
          {lists.map((list, idx) => {
            const isActive =
              (watchListsBubble.find(({ id }) => id === activeBubble.id) &&
                idx !== 0 &&
                idx !== lists.length - 1) ||
              (favorites.find(({ id }) => id === activeBubble.id) &&
                list.name === "Favorites") ||
              (blockLists.find(({ id }) => id === activeBubble.id) &&
                list.name === "Blocklist");
            return (
              <div
                onClick={(e) => {
                  list.add(list.value);
                  e.stopPropagation();
                  setIsOpen("");
                }}
                key={list.name}
                className={`flex  cursor-pointer hover:bg-lightDark duration-300  py-2 px-2 justify-between items-center w-full ${
                  lists.length !== idx + 1 ? "border-b" : ""
                }`}
              >
                <div className="flex items-center text-white gap-x-3">
                  {list.logo}
                  <p>{list.name}</p>
                </div>
                {isActive ? (
                  <FaCheck className="text-xl text-white" />
                ) : (
                  <img src="/plus.svg" alt="Plus icon" width={20} height={20} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function CircleImage({
  setMenuOpen,
  menuOpen,
  src,
  rotate,
  alt,
  isSmall,
  className,
}) {
  return (
    <div
      onClick={() => setMenuOpen && setMenuOpen(!menuOpen)}
      className={`${
        isSmall ? "size-[1.8vw] p-0" : "p-[10px] xl:p-[.8vw] max-w-fit"
      } bg-lightGray rounded-full flex justify-center  items-center  ${className}`}
    >
      <img
        src={src}
        className={`${
          menuOpen && rotate
            ? "rotate-0"
            : !menuOpen && rotate
            ? "rotate-180"
            : "rotate-180"
        }   duration-300 ${
          isSmall ? " w-[80%]  " : "size-[22px] xl:size-[1.5vw]"
        }`}
        alt={alt}
      />
    </div>
  );
}

export function CustomInput({ className, type = "text", ...props }) {
  return (
    <section
      className={`relative  w-[70%] md:w-[55%] lg:w-[40%]  ${className}`}
    >
      <img
        src="/edit.svg"
        alt="Edit icon"
        className="absolute top-[25%] size-[20px] xl:size-[1.5vw] left-[3%]"
      />
      <input
        type={type}
        // placeholder="24h Volume & Market Cap"
        className=" w-full   bg-lightDark focus:!outline-none  placeholder:text-lightGray text-white py-2 xl:py-[.6vw] pl-10 xl:pl-[2.5vw]  rounded-md xl:rounded-[.4vw]  text-[1.2vw]"
        {...props}
      />
    </section>
  );
}

function Tab({ time, setTime }) {
  return (
    <div className="absolute bottom-0 left-0 flex items-center justify-between w-full px-4 ">
      <Data
        onClick={() => setTime("Hour")}
        header="Hour"
        value="0.5%"
        className="text-red-500"
        applyHover
        activeHeader={time}
      />
      <Data
        onClick={() => setTime("Day")}
        header="Day"
        value="2.4%"
        className="text-red-500"
        applyHover
        activeHeader={time}
      />
      <Data
        onClick={() => setTime("Week")}
        header="Week"
        value="0.7%"
        className="text-red-500"
        applyHover
        activeHeader={time}
      />
      <Data
        onClick={() => setTime("Month")}
        header="Month"
        value="0.8%"
        className="text-green-500"
        applyHover
        activeHeader={time}
      />
      <Data
        onClick={() => setTime("Year")}
        header="Year"
        value="53.5%"
        className="text-red-500"
        applyHover
        activeHeader={time}
      />
    </div>
  );
}

function Data({ header, value, className, applyHover, onClick, activeHeader }) {
  const isGreen = activeHeader === header && +value.split("%")[0] >= 0;
  const isRed = activeHeader === header && +value.split("%")[0] < 0;

  return (
    <div
      onClick={onClick}
      className={`flex flex-col items-center justify-center duration-300  cursor-pointer  ${
        applyHover ? "px-3 py-1 rounded-md hover:bg-lightGray" : ""
      } ${activeHeader === header ? "px-3 py-1 rounded-md bg-lightGray" : ""}`}
    >
      <p
        className={` py-1 xl:py-[.4vw] min-[1700px]:py-[.8vw] min-[2000px]:py-[1.2vw] text-sm xl:text-[1.05vw] ${
          isGreen
            ? "bg-green-500 rounded-md px-2 text-white"
            : isRed
            ? "bg-red-500 rounded-md  px-2 text-white"
            : "text-gray-400 px-1"
        }`}
      >
        {header}
      </p>
      <p
        className={`text-lg xl:text-[1.4vw] font-bold text-white ${className}`}
      >
        {value}
      </p>
    </div>
  );
}

function Trade({ exchangeInfo }) {
  const uniqueExchanges = [];
  let exchanges = [...exchangeInfo];

  // exchangeInfo?.forEach((exchange) => {
  //   const data = {
  //     img: `https://s2.coinmarketcap.com/static/img/coins/64x64/${exchange.exchange.id}.png`,
  //     market_url: exchange.market_url,
  //     name: exchange.exchange.name,
  //   };

  //   if (!uniqueExchanges.includes(data.name)) {
  //     exchanges.push(data);
  //     uniqueExchanges.push(data.name);
  //   }
  // });
  const [isOpen, setIsOpen] = useState(false);

  if (!exchangeInfo) return;
  return (
    <div className="flex items-center justify-center w-full gap-2 xl:gap-[.6vw]">
      <CircleImage src={exchanges[0]?.img} />
      <CircleImage src={exchanges[1]?.img} />

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 px-2 py-2 xl:p-[.6vw] font-bold text-white rounded-md bg-lightGray xl:rounded-[.4vw]"
      >
        Trade
        <div className="relative flex items-center gap-x-2">
          {exchanges.map((exchange) => (
            <img
              key={exchange.img}
              src={exchange.img}
              alt=""
              className="size-[22px] xl:size-[1.5vw]"
            />
          ))}

          {isOpen && (
            <div className="absolute top-[100%] mt-2   left-0 h-auto py-2 w-[150px] rounded-xl z-10 bg-dark shadow-sm shadow-gray-300 flex  flex-col">
              {exchanges.map((exchange, idx) => (
                <a
                  onClick={() => setIsOpen(!isOpen)}
                  href={exchange.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={exchange.img}
                  className={`${
                    idx === 4 ? "" : "border-b"
                  } py-2 px-2 flex hover:bg-lightGray items-center gap-x-2`}
                >
                  <img src={exchange.img} alt="" width={20} height={20} />
                  <p className="text-lg  xl:text-[1.4vw] font-bold text-white ">
                    {exchange.name.split(" ")[0]}
                  </p>
                </a>
              ))}
            </div>
          )}
        </div>
      </button>
    </div>
  );
}

function TradeSkeleton() {
  return (
    <div className="flex items-center justify-center w-full gap-2">
      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
      <div className="w-[40%] h-10 bg-gray-200 animate-pulse"></div>
    </div>
  );
}
export default BubbleModal;
