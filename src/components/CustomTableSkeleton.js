import { Cell } from "./CustomTable";

const CustomTableSkeleton = () => {
  return (
    <section
      className={`text-white  !h-fit  scrollbar-none  text-[1vw]  bg-transparent   shadow-sm  my-[.4vw] px-[.4vw]`}
    >
      <div className=" bg-transparent border-b text-white  text-[1vw] py-[.9vw]  flex justify-between items-center w-full ">
        <Cell className={"pl-[.8vw] w-fit"}>
          {" "}
          <p className="h-[1vw] w-[.5vw] ">#</p>
        </Cell>
        <Cell className="gap-x-[.2vw]  min-w-[12vw] !justify-start">
          <div className="size-[25px] xl:size-[1.8vw]  rounded-full">Name</div>
          <div className="size-[25px] xl:size-[1.8vw]  rounded-full"></div>
          <div className="h-[1vw] w-[60%] "></div>
        </Cell>
        <Cell className={"min-w-[7vw] ml-[.7vw]"}>
          <p className="h-[1vw] w-full ">Price</p>
        </Cell>
        <Cell className={"min-w-[8vw]"}>
          {" "}
          <p className="h-[1vw] w-full ">Market Cap</p>
        </Cell>
        <Cell className={"min-w-[7vw]"}>
          {" "}
          <p className="h-[1vw] w-full ">Volume(24h)</p>
        </Cell>
        <div className="flex   items-center gap-x-[.2vw]">
          <Cell className={"min-w-[4vw] flex justify-center items-center"}>
            <p className="h-[1vw] w-full ">Hour</p>
          </Cell>

          <Cell className={"min-w-[4vw] flex justify-center items-center"}>
            <p className="h-[1vw] w-full ">Day</p>
          </Cell>
          <Cell className={"min-w-[4vw] flex justify-center items-center"}>
            <p className="h-[1vw] w-full ">Week</p>
          </Cell>

          <Cell className={"min-w-[4vw] flex justify-center items-center"}>
            <p className="h-[1vw] w-full ">Month</p>
          </Cell>

          <Cell className={"min-w-[4vw] flex justify-center items-center"}>
            <p className="h-[1vw] w-full ">Year</p>
          </Cell>
        </div>

        <Cell className={`min-w-[16vw]`}>
          <p className="h-[1vw] w-full ">Circulating supply</p>
        </Cell>
        <Cell>
          {" "}
          <p className="h-[1vw] w-full ">Links</p>
        </Cell>
      </div>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((v) => (
        <div className=" bg-transparent border-b text-white  text-[1vw] py-[.9vw]  flex justify-between items-center w-full ">
          <Cell className={"pl-[.8vw] w-fit"}>
            {" "}
            <p className="h-[1vw] w-[.5vw] bg-gray-200 animate-pulse"></p>
          </Cell>
          <Cell className="gap-x-[.2vw] min-w-[12vw] !justify-start">
            <div className="size-[25px] xl:size-[1.8vw] bg-gray-200 animate-pulse rounded-full"></div>
            <div className="size-[25px] xl:size-[1.8vw] bg-gray-200 animate-pulse rounded-full"></div>
            <div className="h-[1vw] w-[60%] bg-gray-200 animate-pulse"></div>
          </Cell>
          <Cell className={"min-w-[7vw]"}>
            <p className="h-[1vw] w-full bg-gray-200 animate-pulse"></p>
          </Cell>
          <Cell className={"min-w-[8vw]"}>
            {" "}
            <p className="h-[1vw] w-full bg-gray-200 animate-pulse"></p>
          </Cell>
          <Cell className={"min-w-[7vw]"}>
            {" "}
            <p className="h-[1vw] w-full bg-gray-200 animate-pulse"></p>
          </Cell>
          <div className="flex   items-center gap-x-[.2vw]">
            <Cell className={"min-w-[4vw] flex justify-center items-center"}>
              <p className="h-[1vw] w-full bg-gray-200 animate-pulse"></p>
            </Cell>

            <Cell className={"min-w-[4vw] flex justify-center items-center"}>
              <p className="h-[1vw] w-full bg-gray-200 animate-pulse"></p>
            </Cell>
            <Cell className={"min-w-[4vw] flex justify-center items-center"}>
              <p className="h-[1vw] w-full bg-gray-200 animate-pulse"></p>
            </Cell>

            <Cell className={"min-w-[4vw] flex justify-center items-center"}>
              <p className="h-[1vw] w-full bg-gray-200 animate-pulse"></p>
            </Cell>

            <Cell className={"min-w-[4vw] flex justify-center items-center"}>
              <p className="h-[1vw] w-full bg-gray-200 animate-pulse"></p>
            </Cell>
          </div>

          <Cell className={`min-w-[16vw]`}>
            <p className="h-[1vw] w-full bg-gray-200 animate-pulse"></p>
          </Cell>
          <Cell>
            {" "}
            <p className="h-[1vw] w-full bg-gray-200 animate-pulse"></p>
          </Cell>
        </div>
      ))}
    </section>
  );
};

export default CustomTableSkeleton;
