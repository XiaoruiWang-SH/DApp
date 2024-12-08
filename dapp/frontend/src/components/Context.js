import React, { createContext, useState } from "react";

// Create a single context
const AppContext = createContext();

const AppProvider = ({ children }) => {
  // Define multiple states or values
  const [login, setLogin] = useState(false);
  const [address, setAddress] = useState("");
  const [pagetitle, setPagetitle] = useState("");

  // Bundle all states into one object
  const value = {
    login,
    setLogin,
    address,
    setAddress,
    pagetitle,
    setPagetitle,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
