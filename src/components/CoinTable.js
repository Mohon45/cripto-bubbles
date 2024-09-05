import { useContext, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import {
  Paper,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableContainer,
} from "@mui/material";

import CoinTableBody from "./CoinTableBody";
import { DataContext } from "../providers/DataProvider.js";
import CustomTablePagination from "../components/CustomTablePagination/CustomTablePagination";
export default function CoinTable({ keys }) {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [dataLength, setDataLength] = useState(0);
  // console.log("table");

  const { allCryptos: data, loading } = useContext(DataContext) || {};

  const allCryptos = data || [];

  // const dataSliced = allCryptos.slice(
  //   page * rowsPerPage,
  //   (page + 1) * rowsPerPage
  // );

  const [dataSliced, setDataSliced] = useState([]);
  const [dif, setDif] = useState(10);
  const [startEnd, setStartEnd] = useState({
    start: 1,
    end: dif,
  });

  useEffect(() => {
    setDataLength(allCryptos?.length);
  }, [allCryptos?.length]);

  useEffect(() => {
    const { start, end } = startEnd;
    setDataSliced(allCryptos.slice(start - 1, end));
  }, [allCryptos, startEnd]);

  // // console.log('body');
  const handleShowMore = () => {
    const curLength = dataSliced?.length;

    const increase =
      allCryptos?.length - curLength < 10 ? allCryptos?.length - curLength : 10;

    setDataSliced([
      ...dataSliced,
      ...allCryptos.slice(curLength, curLength + increase),
    ]);
  };

  const handleShowLess = () => {
    setDataSliced(dataSliced.slice(0, dataSliced?.length - 10));
  };

  if (!loading) return null;

  return (
    <section
      className={`${
        dif === 10
          ? "h-[calc(100vh+300px)] min-[1700px]:h-[calc(100vh+400px) min-[2000px]:h-[calc(100vh+700px)] min-[2500px]:h-[calc(100vh+900px)]"
          : dif === 20
          ? "h-[calc(100vh+800px)] min-[1700px]:h-[calc(100vh+1000px) min-[2000px]:h-[calc(100vh+2000px)] min-[2500px]:h-[calc(100vh+2400px)]"
          : "h-[calc(60vh+150px)] min-[1700px]:h-[calc(60vh+200px) min-[2000px]:h-[calc(60vh+350px)] min-[2500px]:h-[calc(60vh+450px)]"
      }`}
    >
      <TableContainer>
        <Table sx={{ minWidth: 700, "& td": { fontWeight: 600 } }}>
          <TableHead
            sx={{
              backdropFilter: "blur(5px)",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }}
          >
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>name</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Market Cap</TableCell>
              <TableCell align="right">Volume(24h)</TableCell>
              <TableCell align="right">Hour</TableCell>
              <TableCell align="right">Day</TableCell>
              <TableCell align="right">Week</TableCell>
              <TableCell align="right">Month</TableCell>
              <TableCell align="right">Year</TableCell>
              <TableCell align="right">Circulating supply</TableCell>
              <TableCell align="right">Links</TableCell>
            </TableRow>
          </TableHead>
          <CoinTableBody
            rowsPerPage={rowsPerPage}
            page={page}
            setDataLength={setDataLength}
            keys={keys}
            loading={loading}
            dataSliced={dataSliced}
          />
        </Table>
      </TableContainer>
      {/* <TablePagination
        component={"div"}
        rowsPerPageOptions={[5, 10, 20]}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value));
          setPage(0);
        }}
        count={dataLength}
        page={page}
        onPageChange={(e, newPage) => {
          setPage(newPage);
        }}
      /> */}
      <CustomTablePagination
        handleChange={(v) => {
          setDif(v);
          setStartEnd({
            start: 1,
            end: v,
          });
        }}
        options={[5, 10, 20]}
        setStartEnd={setStartEnd}
        total={allCryptos?.length || 0}
        start={startEnd.start}
        end={startEnd.end}
        dif={dif}
      />
      {/* <div className="w-full  flex justify-center items-center  gap-x-[1vw]">
        <button
          onClick={handleShowMore}
          className="  bg-pink mt-[1.2vw] py-[.6vw] px-[.8vw] rounded-[.4vw] font-bold text-[1vw] text-white w-max"
        >
          Show More
        </button>
        {dataSliced?.length > 10 && (
          <button
            onClick={handleShowLess}
            className="  bg-dark mt-[1.2vw] py-[.6vw] px-[.8vw] rounded-[.4vw] font-bold text-[1vw] text-white w-max"
          >
            Show Less
          </button>
        )}
      </div> */}
    </section>
  );
}
