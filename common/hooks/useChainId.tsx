import { useState, useEffect } from "react";
import Web3 from "web3";
import { checkMetamaskInstalled } from "../utils";

export const useChainId = () => {
  const [chainId, setChainId] = useState("");

  useEffect(() => {
    if (!checkMetamaskInstalled()) return;
    const fetch = async () => {
      try {
        const web3 = new Web3(Web3.givenProvider);
        const chainId = await web3.eth.getChainId();
        setChainId(`0x${chainId.toString(16)}`);
      } catch (error) {}
    };
    fetch();
  }, []);

  return chainId;
};

export default useChainId;
