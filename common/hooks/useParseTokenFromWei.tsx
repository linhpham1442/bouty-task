import { useEffect, useState } from "react";
import { ContractToken } from "../services/token";
import { NULL_ADDRESS } from "../utils/constants";

export default function useParseTokenFromWei(value: number, token: string) {
  const [valueFormat, setValueFormat] = useState(0);

  const formatValue = async (value: any, token: string) => {
    try {
      if (value === null || value === undefined || !token) {
        return value;
      }

      let decimals = 18;
      if (token !== NULL_ADDRESS) {
        const contract = new ContractToken(token);
        decimals = +(await contract.getDecimals());
      }

      const etherNum = value / Math.pow(10, +decimals);
      setValueFormat(etherNum);
    } catch (error) {
      console.log("formatValue error", error);
    }
  };

  useEffect(() => {
    if (value && token) {
      formatValue(value, token);
    }
  }, [value, token]);

  return valueFormat;
}
