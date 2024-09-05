"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchData = async () => {
  const { data } = await axios.get(
    process.env.NEXT_PUBLIC_BASE_URL + "/cryptos"
  );
  // console.log({ data });
  return data?.result;
};

export const useFetchCryptos = () => {
  // ["data"], fetchData,
  return useQuery({
    queryKey: ["data"],
    queryFn: fetchData,
    cacheTime: 50000, // 60s
    refetchInterval: 60000, // 60s
  });
};
