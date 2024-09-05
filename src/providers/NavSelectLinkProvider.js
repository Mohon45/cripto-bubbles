"use client";
import React, { createContext, useState } from "react";

export const NavSelectLinkContext = createContext(null);
const NavSelectLinkProvider = ({ children }) => {
  const [activeLink, setActiveLink] = useState(null);

  const handleActiveSelectLink = (link) => {
    setActiveLink(link);
  };

  const data = {
    handleActiveSelectLink,
    activeLink,
  };

  return (
    <NavSelectLinkContext.Provider value={data}>
      <section style={{ scrollBehavior: "smooth" }}>{children}</section>
    </NavSelectLinkContext.Provider>
  );
};

export default NavSelectLinkProvider;
