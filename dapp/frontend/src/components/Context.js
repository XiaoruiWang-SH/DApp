import React, { createContext, useState } from "react";

// Create a single context
const AppContext = createContext();

const AppProvider = ({ children }) => {
  // Define multiple states or values
  const [login, setLogin] = useState(false);
  const [address, setAddress] = useState("fake");

  // Bundle all states into one object
  const value = {
    login,
    setLogin,
    address,
    setAddress
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppProvider };
