import { useEffect, useState } from "react";
import { checkMetamaskInstalled } from "../utils";

export default function useMetamask() {
  const [account, setAccount] = useState("");

  const requestNewAccount = async () => {
    try {
      const res = await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      setAccount(res?.[0].caveats[0]?.value?.[0])
      return res?.[0].caveats[0]?.value?.[0];
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (checkMetamaskInstalled()) {
      window.ethereum.on("accountsChanged", async function (accounts: string[]) {
        await window.ethereum.enable();
        setAccount(accounts?.[0]);
      });
    }
  }, []);

  return { account, requestNewAccount };
}
