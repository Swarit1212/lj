import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axios";

export const MetalRateContext = createContext();

export const MetalRateProvider = ({ children }) => {
  const [rates, setRates] = useState({
    gold24k: 7250,
    gold22k: 6650,
    gold18k: 5440,
    silver: 88,
    lastUpdated: new Date().toLocaleTimeString(),
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const res = await API.get("/rates");
      if (res?.data) {
        const { gold, silver } = res.data;
        setRates({
          gold24k: gold,
          gold22k: Math.round(gold * 22 / 24),
          gold18k: Math.round(gold * 18 / 24),
          silver: silver,
          lastUpdated: new Date().toLocaleTimeString(),
        });
      }
    } catch (err) {
      console.warn("Metal rate fetch fallback active:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 60000); // refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <MetalRateContext.Provider value={{ rates, isLoading, refreshRates: fetchRates }}>
      {children}
    </MetalRateContext.Provider>
  );
};

export const useMetalRates = () => useContext(MetalRateContext);
