import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../providers/DataProvider.js";
import { numberFormat } from "./hooks-helpers";
import { formatNumber } from "./BodyRow";
import { AddTo } from "../components/Bubbles/BubbleModal";
import {
  Avatar,
  Box,
  Icon,
  Menu,
  MenuItem,
  TableBody,
  TableContainer,
  Typography,
} from "@mui/material";
import { BodySkeleton } from "./CoinTableBody";
import CustomTablePagination from "../components/CustomTablePagination/CustomTablePagination";
import { SettingAndFilterOptionsContext } from "../providers/SettingAndFilterOptionsProvider";
import CustomTableSkeleton from "./CustomTableSkeleton";

const headers = [
  "#",
  "Name",
  "Price",
  "Market Cap",
  "Volume(24h)",
  "Hour",
  "Day",
  "Week",
  "Month",
  "Year",
  "Circulating supply",
  "Links",
];

const CustomTable = () => {
  const { cryptos, loading } = useContext(DataContext) || {};
  const {
    filterOptions: { activeBubbleLinkID },
    bubbleNavLinks,
  } = useContext(SettingAndFilterOptionsContext);

  const curBubble =
    bubbleNavLinks?.find(({ id }) => {
      // console.log({
      //   activeBubbleLinkID,
      //   id,
      // });
      return activeBubbleLinkID === id;
    }) || {};

  const { period } = curBubble;

  const [dataSliced, setDataSliced] = useState([]);
  const [dif, setDif] = useState(100);
  const [startEnd, setStartEnd] = useState({
    start: 1,
    end: dif,
  });

  // console.log({ loading });

  const {
    filterOptions: {
      pages: { min, max },
      lists,
      exchanges: curActiveExchange,
    },
  } = useContext(SettingAndFilterOptionsContext);

  // console.log({ dif, curActiveExchange });

  useEffect(() => {
    if (curActiveExchange) {
      setDif(100);
      setStartEnd({
        start: 0,
        end: 101,
      });
      // setDataSliced(cryptos?.slice(0, 101));
    } else {
      setDif(100);
      setStartEnd({
        start: 0,
        end: 100,
      });
      // setDataSliced(cryptos?.slice(0, 10));
    }
  }, [cryptos, curActiveExchange, period]);

  useEffect(() => {
    const { start, end } = startEnd;
    // // console.log({ start, end });
    setDataSliced(cryptos?.slice(start, end));
  }, [startEnd, cryptos, period]);

  // console.log({ total: dataSliced?.length, ...startEnd });

  // if (loading) return <CustomTableSkeleton />;
  if (loading) return null;

  // ${
  //   dif === 100
  //     ? "!h-[calc(100vh+5500px)]  xl:!h-[calc(100vh+6000px)] 2xl:!h-[calc(100vh+7000px)] min-[1600px]:!h-[calc(100vh+9500px) min-[1700px]:!h-[calc(100vh+9500px) min-[1800px]:!h-[calc(100vh+11000px)] min-[2000px]:!h-[calc(100vh+9000px)] min-[2500px]:!h-[calc(100vh+9000px)]"
  //     : dif === 10
  //     ? "!h-[calc(100vh+300px)] min-[1700px]:!h-[calc(100vh+400px) min-[2000px]:!h-[calc(100vh+700px)] min-[2500px]:!h-[calc(100vh+900px)]"
  //     : dif === 20
  //     ? "!h-[calc(100vh+800px)] min-[1700px]:!h-[calc(100vh+1000px) min-[2000px]:!h-[calc(100vh+2000px)] min-[2500px]:!h-[calc(100vh+2400px)]"
  //     : "!h-[calc(60vh+150px)] min-[1700px]:!h-[calc(60vh+200px) min-[2000px]:!h-[calc(60vh+350px)] min-[2500px]:!h-[calc(60vh+450px)]"
  // }
  return (
    <section
      className={`text-white  scrollbar-none  text-[1vw]  bg-transparent   shadow-sm  my-[.4vw] px-[.4vw] ${
        dif === 100
          ? "h-[6200px] xl:h-[7000px] 2xl:h-[7500px] min-[1650px]:h-[8000px] min-[1800px]:h-[8500px] min-[1900px]:h-[9000px] min-[2000px]:h-[9500px] min-[2100px]:h-[10000px] min-[2200px]:h-[10500px] min-[2300px]:h-[11000px] min-[2400px]:h-[11500px] min-[2500px]:h-[12000px] min-[2600px]:h-[12500px] min-[2700px]:h-[13000px] min-[2800px]:h-[13500px] min-[2900px]:h-[14000px] min-[3000px]:h-[14500px] min-[3100px]:h-[15000px] min-[3200px]:h-[15500px] min-[3300px]:h-[16000px] min-[3400px]:h-[16500px] min-[3500px]:h-[17000px] min-[3600px]:h-[17500px] min-[3700px]:h-[18000px] min-[3800px]:h-[18500px] min-[3900px]:h-[19000px] min-[4000px]:h-[19500px] min-[4100px]:h-[20000px] min-[4200px]:h-[20500px] min-[4300px]:h-[21000px] min-[4400px]:h-[21500px] min-[4500px]:h-[22000px] min-[4600px]:h-[22500px] min-[4700px]:h-[23000px] min-[4800px]:h-[23500px] min-[4900px]:h-[24000px] min-[5000px]:h-[24500px]"
          : dif === 10
          ? "!h-[calc(100vh+300px)] min-[1700px]:!h-[calc(100vh+400px) min-[2000px]:!h-[calc(100vh+700px)] min-[2500px]:!h-[calc(100vh+900px)]"
          : dif === 20
          ? "!h-[calc(100vh+800px)] min-[1700px]:!h-[calc(100vh+1000px) min-[2000px]:!h-[calc(100vh+2000px)] min-[2500px]:!h-[calc(100vh+2400px)]"
          : "!h-[calc(60vh+150px)] min-[1700px]:!h-[calc(60vh+200px) min-[2000px]:!h-[calc(60vh+350px)] min-[2500px]:!h-[calc(60vh+450px)]"
      } `}
    >
      {/* Header  */}
      <div className="flex justify-between scrollbar-none items-center py-[.9vw]  bg-dark w-full">
        <div className={`pl-[.8vw] text-[1.1vw]  w-fit`}>{headers[0]}</div>
        <div className={` min-w-[10vw] `}>{headers[1]}</div>
        <div className={` min-w-[5vw] text-end`}>{headers[2]}</div>
        <div className={` min-w-[6vw] text-end`}>{headers[3]}</div>
        <div className={` min-w-[7vw] text-end`}>{headers[4]}</div>
        <div className="flex items-center ">
          <div className={` min-w-[6.1vw] text-end`}>{headers[5]}</div>
          <div className={` min-w-[6.1vw] text-end`}>{headers[6]}</div>
          <div className={` min-w-[6.1vw] text-end`}>{headers[7]}</div>
          <div className={` min-w-[6.1vw] text-end`}>{headers[8]}</div>
          <div className={`  min-w-[6.1vw] text-end`}>{headers[9]}</div>
        </div>
        <div className={` min-w-[8vw] `}>{headers[10]}</div>
        <div className={`min-w-[18vw] text-end `}>{headers[11]}</div>
      </div>

      <div className="flex flex-col">
        {dataSliced?.map((row) => (
          <Row row={row} key={row?.id} />
        ))}
      </div>

      <CustomTablePagination
        handleChange={(v) => {
          setDif(v);
          setStartEnd({
            start: 0,
            end: v,
          });
        }}
        options={[5, 10, 20, 100]}
        setStartEnd={setStartEnd}
        total={cryptos?.length || 0}
        start={startEnd.start}
        end={startEnd.end}
        dif={dif}
      />
    </section>
  );
};

const renderPercentage = (num, index, border = {}) => {
  const isLeft = index === 0;
  const isRight = index === 4;

  const isNone = !isLeft && !isRight;

  const commonStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(5px)",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: ".5vw 0",
    width: "100%",
  };

  const upStyles = {
    ...commonStyles,
    color: "white",
    borderRadius: "0.3vw",
    // backgroundColor: "#007C52",
    backgroundColor: "rgba(0, 255, 0, 0.3)",
  };

  const downStyles = {
    ...commonStyles,
    color: "white",
    borderRadius: "0.3vw",
    backgroundColor: "rgba(255, 8, 0, 0.7) ",
  };

  return num > 0 ? (
    <div style={upStyles} className="!min-w-[5vw]">
      <svg style={{ width: "1.4vw", height: "auto" }} viewBox="0 0 24 24">
        <path fill="currentColor" d="M7 14l5-5 5 5z" />
      </svg>
      <span>
        {num || "N/A"}
        {num && "%"}
      </span>
    </div>
  ) : (
    <div style={downStyles} className="min-w-[5vw]">
      <svg style={{ width: "1.4vw", height: "auto" }} viewBox="0 0 24 24">
        <path fill="currentColor" d="M7 10l5 5 5-5z" />
      </svg>
      <span>
        {num?.replace("-", "") || "N/A"}
        {num && "%"}
      </span>
    </div>
  );
};

function Row({ row }) {
  // console.log({ row });
  const [anchorEl, setAnchorEl] = useState(null);
  if (!row) return;

  const { name, quote, market_urls } = row || {};
  const curLanguage = quote?.USD;
  const price = numberFormat(curLanguage?.price, "currency");
  const percent_24 = curLanguage?.percent_change_24h?.toFixed(2);
  const percent_7d = curLanguage?.percent_change_7d?.toFixed(2);
  const percent_1h = curLanguage?.percent_change_1h?.toFixed(2);
  const percent_1m = curLanguage?.percent_change_30d?.toFixed(2);
  const percent_1y = curLanguage?.yearPercentage?.toFixed(2);
  const circulating_supply = formatNumber(row?.circulating_supply);
  const marketCap = numberFormat(curLanguage?.market_cap, {
    notation: "compact",
    compactDisplay: "short",
  });

  const volume_24 = formatNumber(curLanguage?.volume_24h);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderLinks = () => {
    const limit = Math.floor(Math.random() * (8 - 3 + 1)) + 3;
    const missing_urls = 7 - market_urls?.length;
    return (
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}
      >
        <a
          href={`https://coinmarketcap.com/currencies/${row.slug}`}
          target="_blank"
          rel="noreferrer"
          className=" bg-lightGray  size-[2vw] rounded-full flex justify-center items-center"
        >
          <img
            src={`/coin-market-logo.png`}
            alt="Coin market logo"
            className="w-full "
          />
        </a>
        <a
          href={`https://www.coingecko.com/en/coins/${row.slug}`}
          target="_blank"
          rel="noreferrer"
          className=" bg-lightGray mx-[.5vw]  size-[2vw] rounded-full flex justify-center items-center"
        >
          <img
            src={`/coingecko.png`}
            alt="CoinGecko Logo"
            className="  w-[70%]"
          />
        </a>
        <Box
          position="relative"
          display="flex"
          alignItems="center"
          sx={{
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            padding: ".5vw",
            borderRadius: "0.3vw",
            cursor: "pointer",
            gap: ".1vw",
            minWidth: "4vw",
          }}
        >
          <Typography
            variant="body1"
            fontWeight="bold"
            sx={{
              fontSize: { xs: "1rem", lg: "1vw" },
              color: "white",
              marginRight: ".2vw",
            }}
            onClick={handleClick}
          >
            {"Trade"}
          </Typography>
          {market_urls?.map((exchange) => (
            <Avatar
              key={exchange.img}
              src={exchange.img}
              alt=""
              sx={{
                width: { xs: 22, lg: "1.2vw" },
                height: { xs: 22, lg: "1.2vw" },
                cursor: "pointer",
              }}
              onClick={handleClick}
            />
          ))}
          {Array.from({ length: missing_urls }, (_, index) => index + 1).map(
            (v) => (
              <p
                onClick={handleClick}
                className="w-[1.2vw] bg-transparent h-full"
              ></p>
            )
          )}

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            sx={{
              marginLeft: ".4vw",
            }}
          >
            {market_urls?.map((exchange, idx) => (
              <MenuItem
                key={exchange.img}
                onClick={handleClose}
                component="a"
                href={exchange.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: ".6vw",
                  borderRadius: ".8vw",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".3vw",
                  }}
                >
                  <Avatar
                    src={exchange.img}
                    alt=""
                    sx={{ width: "1.2vw", height: "1.2vw" }}
                  />
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{ fontSize: { xs: "1rem", lg: "1vw" }, color: "white" }}
                  >
                    {exchange.name.split(" ")[0]}
                  </Typography>
                </Box>
                <Icon sx={{ width: "1.2vw", height: "1.2vw" }}>
                  <img
                    src="/down-arrow.svg"
                    alt="arrow icon"
                    style={{ width: "100%", height: "100%" }}
                    className="-rotate-90"
                  />
                </Icon>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>
    );
  };

  return (
    <div className=" bg-transparent border-b text-white  text-[1vw] py-[.9vw]  flex justify-between items-center w-full ">
      <Cell className={"pl-[.8vw] w-fit"}>{row?.cmc_rank}</Cell>
      <Cell className="gap-x-[.2vw]  min-w-[10vw] !justify-start">
        <AddTo bubble={row} />
        <img
          src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${row?.id}.png`}
          alt={row?.name}
          className="size-[25px] xl:size-[1.8vw]"
        />
        {row?.name?.split(" ")[0]} {row?.symbol}
      </Cell>
      <Cell className={"min-w-[5vw]"}>{price}</Cell>
      <Cell className={"min-w-[6vw]"}>{marketCap}</Cell>
      <Cell className={"min-w-[7vw]"}>{formatNumber(volume_24)}</Cell>
      <div className="flex   items-center gap-x-[.2vw]">
        <Cell className={"min-w-[6vw] flex justify-center items-center"}>
          {renderPercentage(percent_1h)}
        </Cell>

        <Cell className={"min-w-[6vw] flex justify-center items-center"}>
          {renderPercentage(percent_24)}
        </Cell>
        <Cell className={"min-w-[6vw] flex justify-center items-center"}>
          {renderPercentage(percent_7d)}
        </Cell>

        <Cell className={"min-w-[6vw] flex justify-center items-center"}>
          {renderPercentage(percent_1m)}
        </Cell>

        <Cell className={"min-w-[6vw] flex justify-center items-center"}>
          {renderPercentage(percent_1y)}
        </Cell>
      </div>

      <Cell className={`min-w-[8vw]`}>
        {circulating_supply}&nbsp;{row?.symbol}
      </Cell>
      <Cell>{renderLinks()}</Cell>
    </div>
  );
}

export function Cell({ children, className }) {
  return (
    <div
      className={`flex  items-center font-semibold justify-end  ${className}`}
    >
      {children}
    </div>
  );
}

export default CustomTable;
