import React, { useContext, useState } from "react";
import { SettingAndFilterOptionsContext } from "../../providers/SettingAndFilterOptionsProvider";

const CustomTablePagination = ({
  options,
  handleChange,
  setStartEnd,
  total,
  start,
  end,
  dif,
}) => {
  const handleNext = () => {
    if (end >= total) return;
    // console.log("Next Called");

    setStartEnd({
      start: start + dif,
      end: end + dif > total ? total : end + dif,
    });
  };

  const handlePrev = () => {
    if (start <= 1) return;
    setStartEnd({
      start: start - dif < 1 ? 1 : start - dif,
      end: end - dif,
    });
  };

  return (
    <section className="w-full text-[1.1vw] mt-[.5vw]  flex justify-end text-white">
      <div className="flex items-center gap-x-[1.2vw]">
        <p>Rows per page</p>
        <Select options={options} handleChange={handleChange} selected={dif} />

        <p>
          {start}-{end} of {total}
        </p>
        <div onClick={handlePrev}>
          <img
            src="/down-arrow.svg"
            alt=""
            className="rotate-90  size-[1.2vw] cursor-pointer"
          />
        </div>
        <div onClick={handleNext}>
          <img
            src="/down-arrow.svg"
            alt=""
            className="-rotate-90 size-[1.2vw] cursor-pointer"
          />
        </div>
      </div>
    </section>
  );
};

function Select({ handleChange, options = [], selected }) {
  const { isOpen, setIsOpen } = useContext(SettingAndFilterOptionsContext);
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setIsOpen(true);
      }}
      className="flex relative cursor-pointer gap-x-[.1vw] w-max  justify-between items-center"
    >
      <p>{selected}</p>
      <img src="/down-arrow.svg" alt="" className=" mt-[.1vw] size-[1.2vw] " />

      <ul
        className={`absolute flex flex-col  justify-center top-[110%] left-0 text-white  w-full h-auto py-[.6vw] text-center  bg-dark gap-y-[.6vw]  duration-300 ${
          isOpen ? "  h-auto opacity-100 z-50" : " opacity-0  -z-10 h-0"
        }`}
      >
        {options?.map((v) => (
          <li
            key={v}
            className="hover:!bg-dark/20 bg-dark duration-300"
            onClick={(e) => {
              e.stopPropagation();
              handleChange(v);
              setIsOpen(false);
            }}
          >
            {v}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CustomTablePagination;
