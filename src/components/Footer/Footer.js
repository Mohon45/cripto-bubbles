import React, { useState } from "react";
import { BsTwitterX } from "react-icons/bs";
import { AiFillInstagram } from "react-icons/ai";
import { CiMail } from "react-icons/ci";
import { IoLogoGooglePlaystore } from "react-icons/io5";
import { PiTelegramLogo } from "react-icons/pi";

const images = [
  {
    src: "/bybit-logo.png",
    name: "Bybit",
    url: "https://www.bybit.com/register?affiliate_id=46162&group_id=69922&group_type=1",
  },
  {
    src: "/gate-io-logo.png",
    name: "Gate.io",
    url: "https://www.gate.io/signup/UFEQVV1c",
  },
  {
    src: "/okx-logo.svg",
    name: "OKX",
    url: "https://www.okx.com/join/61710443",
  },
  {
    src: "/mexc-logo.webp",
    name: "MEXC",
    url: "https://www.mexc.com/register?inviteCode=mexc-1WaJ1",
  },
  {
    src: "/binance-logo.png",
    name: "Binance",
    url: "https://www.binance.com/register?ref=BRM28YZ5",
  },
];

const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <footer className="w-full my-8 xl:my-[2.5vw] xl px-[5vw] grid  grid-cols-1 md:grid-cols-3">
      <div className="flex flex-col text-white gap-y-2 xl:gap-y-[.6vw]">
        <h2 className="text-lg font-semibold xl:text-[1.4vw]">Crypto Bubble</h2>
        <p className="text-2xl xl:text-[1.8vw] font-bold  leading-[2vw]">
          Interactive bubble chart for the TOP 1000 cryptocurrencies
        </p>

        <div className="flex items-center gap-x-2">
          <CircleImage icon={<IoLogoGooglePlaystore />} />
          <CircleImage icon={<AiFillInstagram />} />

          <CircleImage icon={<BsTwitterX />} />

          <CircleImage icon={<CiMail />} />

          <CircleImage icon={<PiTelegramLogo />} />
        </div>
      </div>
      <div className="text-white  flex flex-col  gap-y-[.8vw]    line">
        <p className="text-sm xl:text-[1.05vw] leading-[1.2vw]">
          Crypto Bubbles is available as a website at cryptobubbles.net and as
          an app for your phone. No financial advice. Do your own research!
        </p>
        <p className="text-sm xl:text-[1.05vw] leading-[1.2vw]">
          No financial advice. Do your own research! Ulrich Stark, 92637 Weiden,
          Germanycontact@cryptobubbles.net
        </p>
      </div>

      <div className="w-[80%]  place-self-end flex flex-col items-center gap-y-2 justify-center xl:gap-y-[.6vw] min-[1700px]:gap-y-[1vw] min-[2000px]:gap-y-[1.5vw]">
        <h3 className="text-2xl xl:text-[1.8vw] font-bold text-white">
          Support my work
        </h3>
        <div className="flex items-center justify-between p-3 xl:p-[.8vw] text-xl xl:text-[1.45vw] text-white gap-x-2 xl:gap-x-[.6vw] rounded-xl xl:rounded-[1vw] bg-lightGray">
          <p>Follow Crypto Bubbles on</p>
          <BsTwitterX />
        </div>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex items-center p-3 xl:p-[.8vw] mt-2 xl:mt-[.6vw]  justify-evenly gap-x-4 xl:gap-x-[1.2vw] bg-lightGray rounded-xl xl:rounded-[1vw]"
        >
          {images.map((img) => (
            <div>
              <img
                src={img.src}
                alt={img.name}
                className="size-[25px] xl:size-[1.7vw]"
              />
            </div>
          ))}

          {isOpen && (
            <div className=" absolute flex flex-col w-[80%] bg-dark text-white   bottom-[100%] rounded-md left-0">
              {images.map((img) => (
                <a
                  href={img.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-2 xl:p-[.6vw] duration-300 border-b cursor-pointer hover:bg-lightGray border-b-gray-200 gap-x-4 "
                >
                  <img
                    src={img.src}
                    alt=""
                    className="size-[25px] xl:size-[1.7vw]"
                  />
                  <p>{img.name}</p>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

function CircleImage({ icon }) {
  return (
    <div className="p-3 xl:p-[.8vw] text-xl xl:text-[1.45vw] rounded-full bg-lightGray">
      {icon}
    </div>
  );
}
export default Footer;
