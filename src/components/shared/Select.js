import React from "react";

const Select = ({
  isOpen,
  activeVal,
  options,
  onChange,
  onClick,
  className,
}) => {
  const total = options?.length;
  return (
    <section
      className={`cursor-pointer font-semibold text-white rounded-md xl:rounded-[.4vw] relative min-w-fit  py-2 xl:py-[.6vw] bg-lightGray ${className}`}
    >
      <p onClick={onClick} className="cursor-pointer  text-[1.2vw]">
        {activeVal}
      </p>

      {/* Dropdown  */}
      {isOpen && (
        <ul
          className={`z-50 mt-1 bg-dark  divide-y rounded-md xl:rounded-[.4vw] w-full absolute duration-300 top-[100%] left-0 ${
            isOpen ? "h-auto opacity-100" : "h-0 opacity-0"
          }`}
        >
          {options.map((option, idx) => (
            <li
              key={option.name}
              onClick={() => onChange(option)}
              className={`w-full py-2 xl:py-[.6vw]  gap-2 xl:gap-[.6vw] grid grid-cols-4 duration-300 items-center px-2 xl:px-[.6vw]  bg-lightDark ${
                activeVal === option.value ? "text-sky" : "text-white"
              } ${isOpen ? "h-auto opacity-100" : "h-0 opacity-0"} ${
                idx === 0
                  ? "rounded-t-md"
                  : idx === total - 1
                  ? "rounded-b-md"
                  : ""
              }`}
            >
              <p
                className={` size-[20px] xl:size-[1.4vw] rounded-full border-2 duration-300 text-[1.2vw]  flex justify-center items-center ${
                  activeVal === option.value ? "border-sky" : "border-white "
                }`}
              >
                {activeVal === option.value && (
                  <p className="size-[88%] text-[1.2vw] rounded-full bg-sky"></p>
                )}
              </p>
              <p className="col-span-3 text-[.9vw]">{option.value}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Select;
