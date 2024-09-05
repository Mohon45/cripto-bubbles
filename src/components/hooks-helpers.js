import { useState, useEffect } from "react";
import axios from "axios";

function useCoinMarket() {
  const [state, setState] = useState({ data: [], isLoading: true });
  const updateState = (data) => {
    setState({
      data: data,
      isLoading: false,
    });
  };
  useEffect(() => {
    async function init() {
      try {
        const result = await axios.post(
          "http://localhost:5000/user/cryptodatalocal"
        );
        //const res = await fetch("http://localhost:5000/user/cryptodatalocal");
        // console.log(result?.data?.data);
        //const data = await result?.data.json();
        updateState(result?.data?.data);
      } catch (err) {
        // console.log(err);
      }
    }
    // TODO: uncomment this and fix the AggregateError in backend
    init();
    const id = setInterval(() => {
      init();
    }, 1 * 60 * 1000);
    return () => clearInterval(id);
  }, []);
  return state;
}

function numberFormat(num, options) {
  let temp = 2;
  if (num < 1 && num > 0.0001) {
    temp = 4;
  }
  if (num < 0.0001) {
    temp = 8;
  }
  let defaultOptions = {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: temp,
    minimumFractionDigits: 2,
    notation: "standard",
    compactDisplay: "long",
  };
  return new Intl.NumberFormat("en-US", {
    ...defaultOptions,
    ...options,
  }).format(num);
}

export { useCoinMarket, numberFormat };
