import { SwitchTransition } from "react-transition-group";
import {
  Fade,
  TableCell,
  TableRow,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Icon,
} from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { numberFormat } from "./hooks-helpers";
import { SettingAndFilterOptionsContext } from "../providers/SettingAndFilterOptionsProvider";
import { useContext, useState } from "react";
import { AddTo, CircleImage } from "../components/Bubbles/BubbleModal";

export const exchanges = [
  {
    img: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png", // Binance
    market_url: "https://www.binance.com/",
    name: "Binance",
  },
  {
    img: "https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png", // Coinbase Exchange
    market_url: "https://www.coinbase.com/",
    name: "Coinbase",
  },
  {
    img: "https://s2.coinmarketcap.com/static/img/coins/64x64/2469.png", // OKX
    market_url: "https://www.okx.com/",
    name: "OKX",
  },
  {
    img: "https://s2.coinmarketcap.com/static/img/coins/64x64/5864.png", // Bybit
    market_url: "https://www.bybit.com/",
    name: "Bybit",
  },
  {
    img: "https://s2.coinmarketcap.com/static/img/coins/64x64/1896.png", // Upbit
    market_url: "https://www.upbit.com/",
    name: "Upbit",
  },
  {
    img: "https://s2.coinmarketcap.com/static/img/coins/64x64/2.png", // Kraken
    market_url: "https://www.kraken.com/",
    name: "Kraken",
  },
  {
    img: "https://s2.coinmarketcap.com/static/img/coins/64x64/2.png", // Kraken
    market_url: "https://www.kraken.com/",
    name: "Kraken",
  },
];
export const formatNumber = (number) => {
  // const [sign, number] = num.split("$");
  // // console.log({
  //   num: number,
  //   format: parseFloat(number),
  // });

  let valueToShow;
  const absValue = Math.abs(parseFloat(number));

  if (absValue >= 1000000000000) {
    valueToShow = (absValue / 1000000000000).toFixed(1) + "T";
  } else if (absValue >= 1000000000) {
    valueToShow = (absValue / 1000000000).toFixed(1) + "B";
  } else if (absValue >= 1000000) {
    valueToShow = (absValue / 1000000).toFixed(1) + "M"; // For millions
  } else {
    valueToShow = number;
  }
  return valueToShow;
};

const BodyRow = ({ row, keys }) => {
  const getId = (id) => {
    keys(id);
    // // console.log(id)
  };
  const {
    filterOptions: { language },
  } = useContext(SettingAndFilterOptionsContext);

  const { name, quote, market_urls } = row;
  const curLanguage = quote.USD;
  const price = numberFormat(curLanguage.price, "currency");
  const percent_24 = curLanguage.percent_change_24h.toFixed(2);
  const percent_7d = curLanguage.percent_change_7d.toFixed(2);
  const percent_1h = curLanguage.percent_change_1h.toFixed(2);
  const percent_1m = curLanguage.percent_change_30d.toFixed(2);
  const percent_1y = curLanguage?.yearPercentage.toFixed(2);
  // const circulating_supply = numberFormat(row.circulating_supply, {
  //   style: "decimal",
  // });
  const circulating_supply = formatNumber(row.circulating_supply);
  const marketCap = numberFormat(curLanguage.market_cap, {
    notation: "compact",
    compactDisplay: "short",
  });

  const volume_24 = formatNumber(curLanguage.volume_24h);
  // const volume_24 = numberFormat(v_24);
  let isCalled = false;
  const renderPercentage = (num, index, border = {}) => {
    const isLeft = index === 0;
    const isRight = index === 4;

    const isNone = !isLeft && !isRight;

    if (!isCalled) {
      isCalled = index === 4;
      // console.log({
      //   index,
      //   isNone,
      //   isLeft,
      //   isRight,
      // });
    }

    return num > 0 ? (
      <Box
        display="flex"
        justifyContent="flex-end"
        alignItems="center"
        color={"success.main"}
        sx={{
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          padding: ".5vw",
          // borderRadius: "0.3vw",

          borderRadius: "0.3vw 0 0 0.3vw",
        }}
      >
        <ArrowDropUpIcon
          color={"success"}
          sx={{ width: "1.4vw", height: "auto" }}
        />
        <span>{num}%</span>
      </Box>
    ) : (
      <Box
        display={"flex"}
        justifyContent="flex-end"
        alignItems="center"
        color={"error.main"}
        sx={{
          backdropFilter: "blur(5px)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          padding: ".5vw",
          borderRadius: "0.3em",
        }}
      >
        <ArrowDropDownIcon sx={{ width: "1.4vw", height: "auto" }} />
        <span> {num.replace("-", "")}%</span>
      </Box>
    );
  };

  const [anchorEl, setAnchorEl] = useState(null);

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
            className="  w-[60%]"
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
    <TableRow sx={{ "& td": { width: 20 } }}>
      <TableCell
        sx={(theme) => ({
          [theme.breakpoints.down("md")]: {
            position: "sticky",
            left: 0,
            zIndex: 10,
            backgroundColor: "#121212",
          },
        })}
      >
        {row.cmc_rank}
      </TableCell>
      <TableCell
        padding="none"
        sx={(theme) => ({
          [theme.breakpoints.down("md")]: {
            position: "sticky",
            left: 48,
            zIndex: 10,
            backgroundColor: "#121212",
          },
        })}
        onClick={() => getId(row?.id)}
        style={{ cursor: "pointer" }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: ".3vw" }}>
          <AddTo bubble={row} />
          <Avatar
            src={`https://s2.coinmarketcap.com/static/img/coins/64x64/${row.id}.png`}
            sx={{
              width: 25,
              height: 25,
              mr: 1,
            }}
          />
          <span>
            {name}&nbsp;{row.symbol}
          </span>
        </Box>
      </TableCell>
      <SwitchTransition>
        <Fade key={price}>
          <TableCell align="right">{price}</TableCell>
        </Fade>
      </SwitchTransition>
      <TableCell align="right">{marketCap}</TableCell>

      <TableCell align="right">{formatNumber(volume_24)}</TableCell>
      <SwitchTransition>
        <Fade key={percent_1h}>
          <TableCell
            sx={{
              padding: "0.15vw",
            }}
            align="right"
          >
            {renderPercentage(percent_1h, 0, {
              borderTopRightRadius: "none",
              borderTopLeftRadius: "0.3vw",
              borderBottomLeftRadius: "0.3vw",
              borderBottomRightRadius: "none",
            })}
          </TableCell>
        </Fade>
      </SwitchTransition>
      <SwitchTransition>
        <Fade key={percent_24}>
          <TableCell
            sx={{
              padding: "0.15vw",
            }}
            align="right"
          >
            {renderPercentage(percent_24, 1, {
              borderRadius: "0px",
            })}
          </TableCell>
        </Fade>
      </SwitchTransition>
      <SwitchTransition>
        <Fade key={percent_7d}>
          <TableCell
            sx={{
              padding: "0.15vw",
            }}
            align="right"
          >
            {renderPercentage(percent_7d, 2, {
              borderRadius: "0px",
            })}
          </TableCell>
        </Fade>
      </SwitchTransition>
      <SwitchTransition>
        <Fade key={percent_1m}>
          <TableCell
            sx={{
              padding: "0.15vw",
            }}
            align="right"
          >
            {renderPercentage(percent_1m, {
              borderTopRightRadius: "0.3vw",
              borderTopLeftRadius: "none",
              borderBottomLeftRadius: "none",
              borderBottomRightRadius: "0.3vw",
            })}
          </TableCell>
        </Fade>
      </SwitchTransition>
      <SwitchTransition>
        <Fade key={percent_1y}>
          <TableCell
            sx={{
              padding: "0.15vw",
            }}
            align="right"
          >
            {renderPercentage(percent_1y, 4)}
          </TableCell>
        </Fade>
      </SwitchTransition>

      <TableCell align="right">
        {circulating_supply}&nbsp;{row.symbol}
      </TableCell>
      <SwitchTransition>
        <Fade key={percent_1y}>
          <TableCell align="right">{renderLinks()}</TableCell>
        </Fade>
      </SwitchTransition>
    </TableRow>
  );
};

export default BodyRow;
