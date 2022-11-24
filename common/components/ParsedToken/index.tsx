import React, { useState, useEffect, useCallback, memo } from "react";
import { ContractToken } from "@/common/services/token";
import classNames from "classnames";
import { NULL_ADDRESS } from "@/common/utils/constants";
import { SymbolChainMapping } from "@/common/utils";
import useChainId from "@/common/hooks/useChainId";

function ParsedToken({
  address,
  src,
  showSymbol = true,
  showName = false,
  classNameSymbol = "",
  defaultNullAddressAsNative = false,
  chainId = "",
}: {
  address: string;
  src?: string;
  showSymbol?: boolean;
  showName?: boolean;
  classNameSymbol?: string;
  defaultNullAddressAsNative?: boolean;
  chainId?: string;
}) {
  const chainIdDefault = useChainId();
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");

  const chain = chainId ? chainId : chainIdDefault;

  const getSymbol = useCallback(async (address: string) => {
    try {
      let contractToken = new ContractToken(address);
      let symbol = await contractToken.getSymbol();
      // console.log("symbol :>> ", symbol);
      setSymbol(symbol);
    } catch (error) {
      // console.log("GetSymbolByTokenAddress error", error);
    }
  }, []);

  const getName = useCallback(async (address: string) => {
    try {
      let contractToken = new ContractToken(address);
      let name = await contractToken.getName();
      setName(name);
    } catch (error) {
      // console.log("GetSymbolByTokenAddress error", error);
    }
  }, []);

  useEffect(() => {
    if (address) {
      getSymbol(address);
      getName(address);
    }
  }, [address, getSymbol, getName]);

  if (defaultNullAddressAsNative && address === NULL_ADDRESS) {
    return (
      <div className="inline-flex items-center flex-shrink-0 mr-1">
        {showSymbol && (
          <img
            className={classNames("inline-block flex-shrink-0 basis-0 w-4", {
              [classNameSymbol]: classNameSymbol,
            })}
            src={src ?? `/svg/coin/${SymbolChainMapping[chain]}.svg`}
            alt=""
          />
        )}
        {showName && <span className="whitespace-nowrap min-w-4">{SymbolChainMapping[chain]}</span>}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center flex-shrink-0 mr-1">
      {showSymbol && (
        <div
          className={classNames("inline-block flex-shrink-0 basis-0 whitespace-nowrap min-w-4", {
            [classNameSymbol]: classNameSymbol,
          })}
        >
          {symbol}
        </div>
      )}
      {showName && <span className="whitespace-nowrap min-w-4">{name}</span>}
    </div>
  );
}

export default memo(ParsedToken);
