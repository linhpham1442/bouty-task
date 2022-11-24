import { tokenPriceFromWei } from "@/common/utils";
import { useEffect, useState } from "react";
import NumberFormat from "../NumberFormat";

interface NumberFormatAsync {
  tokenAddress: string;
  wrapTokenAddress: string;
  valueFormat: (value: string) => string;
  [key: string]: any;
}
const NumberFormatAsync = (props: NumberFormatAsync) => {
  const { valueFormat, tokenAddress, wrapTokenAddress, ...otherProps } = props;
  const [price, setPrice] = useState("0");

  useEffect(() => {
    const get = async (value: any, token_address: string, wrap_token_address: string) => {
      const price = await tokenPriceFromWei(value, token_address, wrap_token_address);
      let priceFormat = valueFormat(price);
      setPrice(priceFormat);
    };

    if (props.value && tokenAddress && wrapTokenAddress) {
      get(props.value, tokenAddress, wrapTokenAddress);
    }
  }, [props.value, tokenAddress, wrapTokenAddress, valueFormat]);

  return <NumberFormat {...otherProps} value={price} />;
};

export default NumberFormatAsync;
