import React, { memo, useContext, useEffect } from "react";
import { Skeleton, TableBody, TableCell, TableRow, Box } from "@mui/material";
import BodyRow from "./BodyRow";
export const BodySkeleton = ({ rows, heads }) => {
  const rowArray = Array(rows).fill(null);
  const cellArray = Array(heads).fill(null);
  return rowArray.map((_, index) => (
    <TableRow key={index}>
      {cellArray.map((_, index) => (
        <TableCell key={index} align={index === 1 ? "left" : "right"}>
          {index === 1 ? (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Skeleton
                variant="circular"
                width={25}
                height={25}
                sx={{ mr: 1 }}
              />
              <Skeleton width={100} />
            </Box>
          ) : (
            <Skeleton />
          )}
        </TableCell>
      ))}
    </TableRow>
  ));
};

// const CoinTableBody = memo(
//   ({ rowsPerPage, page, setDataLength, keys, loading, dataSliced }) => {
//     // const { data, isLoading } = useCoinMarket();

//     return (
//       <TableBody>
//         {loading ? (
//           <BodySkeleton rows={rowsPerPage} heads={12} />
//         ) : (
//           dataSliced?.map((row) => (
//             <BodyRow key={row.id} row={row} keys={keys} />
//           ))
//         )}
//       </TableBody>
//     );
//   }
// );

const CoinTableBody = ({
  rowsPerPage,

  keys,
  loading,
  dataSliced,
}) => {
  // const { data, isLoading } = useCoinMarket();

  // console.log({ dataSliced });

  return (
    <TableBody>
      {loading ? (
        <BodySkeleton rows={rowsPerPage} heads={12} />
      ) : (
        dataSliced?.map((row) => <BodyRow key={row.id} row={row} keys={keys} />)
      )}
    </TableBody>
  );
};

export default CoinTableBody;
