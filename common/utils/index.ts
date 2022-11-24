import { AxiosResponse } from "axios";
import Web3 from "web3";
import { ContractToken, ContractTokenEthers } from "@/common/services/token";
import { CacheManager } from "./cacheStorage";
import { NULL_ADDRESS } from "./constants";
import request from "@/common/utils/fetch";
import { ethers } from "ethers";

// import { ethers } from "ethers";

export interface ApiResponse<T> {
  success: string;
  message: string;
  data: T;
}

export const handleApi = async (func: Function, speadData = true): Promise<{ success: boolean; data?: any; error?: any }> => {
  if (!func) return { success: false };
  try {
    let data = await func();
    if (!speadData) {
      return { success: true, data };
    }
    return { success: true, ...data };
  } catch (error) {
    let dataError = error?.response?.data;
    return { success: false, error: dataError };
  }
};

export const fetchApi = async <T>(
  endPoint = "",
  data: any = null,
  method = "get",
  headers = {},
  isCache = false
): Promise<AxiosResponse<ApiResponse<T>, any>> => {
  const body = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    data: data,
  };

  // handleCache
  const keyCache = `$api_${endPoint}_${JSON.stringify(body)}`;
  if (isCache) {
    const { result, wait } = await CacheManager.wait<AxiosResponse<ApiResponse<T>, any>>(keyCache);
    if (result) return result;
    if (wait) {
      const data = await CacheManager.get<AxiosResponse<ApiResponse<T>, any>>(keyCache);
      return data;
    }
  }

  const response = await request(endPoint, body);

  if (isCache) {
    CacheManager.set<AxiosResponse<ApiResponse<T>, any>>(keyCache, response, 300000);
  }

  return response;
};

export const smartTrim = (string: string, maxLength: number) => {
  if (!string) return "";
  if (maxLength < 1) return string;
  if (string.length <= maxLength) return string;
  if (maxLength === 1) return `${string.substring(0, 1)}...`;

  const midpoint = Math.ceil(string.length / 2);
  const toremove = string.length - maxLength;
  const lstrip = Math.ceil(toremove / 2);
  const rstrip = toremove - lstrip;
  return `${string.substring(0, midpoint - lstrip)}...${string.substring(midpoint + rstrip)}`;
};

export const smartTrimCurrency = (string: string, maxLength: number) => {
  if (!string) return "";
  if (maxLength < 1) return string;
  if (string.length <= maxLength) return string;
  if (maxLength === 1) return `${string.substring(0, 1)}...`;

  let arrString = string.split(".");
  let rightDot = smartTrim(arrString[1], maxLength);
  return `${arrString[0]}${rightDot.length > 0 ? "." + rightDot : ""}`;
};

export const parseEther = (value: string, fixed: number = 2) => {
  if (value === null || value === undefined) {
    return value;
  }
  const balanceInWei = (+value).toLocaleString("fullwide", {
    useGrouping: false,
  });
  const etherNum = Web3.utils.fromWei(balanceInWei, "ether");
  return (+etherNum).toFixed(fixed);
};

export const formatShortNumber = (num: number, fix: number = 2) => {
  if (typeof num !== "number") {
    return num;
  }

  if (num > 1e19) {
    return num.toString();
  }

  if (num < -1e19) {
    return num.toString();
  }

  if (Math.abs(num) < 1000) {
    return num.toFixed(fix);
  }

  let shortNumber;
  let exponent;
  let size;
  let sign = num < 0 ? "-" : "";
  let suffixes = {
    K: 6,
    M: 9,
    B: 12,
    T: 16,
  } as { [key: string]: number };

  num = Math.abs(num);
  size = Math.floor(num).toString().length;

  exponent = size % 3 === 0 ? size - 3 : size - (size % 3);
  shortNumber = Math.round(10 * (num / Math.pow(10, exponent))) / 10;
  shortNumber = shortNumber.toFixed(fix);

  for (let suffix in suffixes) {
    if (exponent < suffixes[suffix]) {
      shortNumber += suffix;
      break;
    }
  }

  return sign + shortNumber;
};

export function longAddress(address: string) {
  return address.substring(0, 8) + "..." + address.substring(address.length - 12, address.length);
}

export const formatNumber = (number: string | number) => {
  return new Intl.NumberFormat().format(+number);
};

export const getTotalPage = (totalItem: number, itemPerPage: number): number => {
  return Math.ceil(totalItem / itemPerPage);
};

export const sliceItemsByPage = (itemList: any[], currentPage: number, itemPerPage: number) => {
  if (!itemList) return [];
  return itemList.slice((currentPage - 1) * itemPerPage, currentPage * itemPerPage);
};

export const formatCurrency = (amount: number | string) => {
  return amount
    .toString()
    .replace(/(\,)(\d+)$/g, ".$2")
    .replace(/(\d)(?=(\d{3})+\b)/g, "$1,");
};

export const isValidURL = (value: string) => {
  var res = value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  return res !== null;
};

export const shortenAddress = (address: string, number = -4) => {
  if (address) {
    const first = address.slice(0, 4);
    const last = address.slice(number);
    return `${first}...${last}`;
  }
  return;
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getBase64Image = (url: string) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.setAttribute("crossOrigin", "anonymous");
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL();
      resolve(dataURL);
    };
    img.src = url;
  });
};
export const getFileFromURL = (url: string) => {
  return new Promise((resolve) => {
    let blob = null;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.onload = function () {
      blob = xhr.response;
      resolve(blob);
    };
    xhr.send();
  });
};

export const fixedEncodeURIComponent = (str: string) => {
  return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
    return "%" + c.charCodeAt(0).toString(16);
  });
};

export const SymbolChainMapping = {
  "0x4": "ETH",
  "0x61": "BNB",
  "0x13881": "MATIC",
  "0x1": "ETH",
  "0x38": "BNB",
  "0x89": "MATIC",
} as any;

export const NameChainMapping = {
  "0x4": "Rinkeby",
  "0x61": "BNB Smart Chain",
  "0x13881": "Polygon",
  "0x1": "Ethereum",
  "0x38": "BNB Smart Chain",
  "0x89": "Polygon",
} as any;

export const tokenPriceToWei = async (price: string | number, token_address: string, wrap_token_address: string) => {
  if (typeof price !== "string") {
    price = price.toString();
  }

  // handleCache
  const keyCache = `$tokenPriceToWei_${price}_${token_address}`;
  const { result, wait } = await CacheManager.wait<string>(keyCache);
  if (result) return result;
  if (wait) {
    const data = await CacheManager.get<string>(keyCache);
    return data;
  }

  let tokenTemp = token_address;
  if (token_address === NULL_ADDRESS) {
    tokenTemp = wrap_token_address;
  }
  let contractToken = new ContractToken(tokenTemp);
  let decimals = await contractToken.getDecimals();
  let tokenDecimals = parseInt(decimals);
  let resultWei = parseFloat(price) * Math.pow(10, tokenDecimals);

  // setCache
  CacheManager.set<string>(keyCache, resultWei.toString(), 300000);

  return resultWei.toString();
};

export const tokenPriceFromWei = async (price: string | number, token_address: string, wrap_token_address: string) => {
  if (typeof price !== "string") {
    price = price.toString();
  }

  // handleCache
  const keyCache = `$tokenPriceFromWei_${price}_${token_address}`;
  const { result, wait } = await CacheManager.wait<string>(keyCache);
  if (result) return result;
  if (wait) {
    const data = await CacheManager.get<string>(keyCache);
    return data;
  }

  let tokenTemp = token_address;
  if (token_address === NULL_ADDRESS) {
    tokenTemp = wrap_token_address;
  }
  let contractToken = new ContractToken(tokenTemp);
  let decimals = await contractToken.getDecimals();
  let tokenDecimals = parseInt(decimals);
  let resultFormated = parseFloat(price) / Math.pow(10, tokenDecimals);

  // setCache
  CacheManager.set<string>(keyCache, resultFormated.toString(), 300000);

  return resultFormated.toString();
};

export const tokenPriceToWeiEthers = async (price: string | number, token_address: string, rpc_url: string, wrap_token_address: string) => {
  if (typeof price !== "string") {
    price = price.toString();
  }

  // handleCache
  const keyCache = `$tokenPriceToWeiEthers_${price}_${token_address}`;
  const { result, wait } = await CacheManager.wait<string>(keyCache);
  if (result) return result;
  if (wait) {
    const data = await CacheManager.get<string>(keyCache);
    return data;
  }

  let tokenTemp = token_address;
  if (token_address === NULL_ADDRESS) {
    tokenTemp = wrap_token_address;
  }
  let contractToken = new ContractTokenEthers(tokenTemp, rpc_url);
  let decimals = await contractToken.getDecimals();
  let tokenDecimals = parseInt(decimals);
  let resultWei = parseFloat(price) * Math.pow(10, tokenDecimals);

  // setCache
  CacheManager.set<string>(keyCache, resultWei.toString(), 300000);

  return resultWei.toString();
};

export const tokenPriceFromWeiEthers = async (
  price: string | number,
  token_address: string,
  rpc_url: string,
  wrap_token_address: string
) => {
  if (typeof price !== "string") {
    price = price.toString();
  }

  // handleCache
  const keyCache = `$tokenPriceFromWeiEthers_${price}_${token_address}`;
  const { result, wait } = await CacheManager.wait<string>(keyCache);
  if (result) return result;
  if (wait) {
    const data = await CacheManager.get<string>(keyCache);
    return data;
  }

  let tokenTemp = token_address;
  if (token_address === NULL_ADDRESS) {
    tokenTemp = wrap_token_address;
  }
  let contractToken = new ContractTokenEthers(tokenTemp, rpc_url);
  let decimals = await contractToken.getDecimals();
  let tokenDecimals = parseInt(decimals);
  let resultFormated = parseFloat(price) / Math.pow(10, tokenDecimals);

  // setCache
  CacheManager.set<string>(keyCache, resultFormated.toString(), 300000);

  return resultFormated.toString();
};

export const getParamFromURL = (key: string) => {
  const url = new URL(window.location.href);
  return url.searchParams.get(key);
};

export const setParamFromURL = (key: string, value: string) => {
  const query = insertParam(key, value);
  window.history.replaceState(null, null, `?${query}`);
};

export const insertParam = (key: string, value: string) => {
  key = encodeURI(key);
  value = encodeURI(value);

  let kvp = document.location.search.substr(1).split("&");

  let i = kvp.length;
  let x;
  while (i--) {
    x = kvp[i].split("=");

    if (x[0] === key) {
      x[1] = value;
      kvp[i] = x.join("=");
      break;
    }
  }

  if (i < 0) {
    kvp[kvp.length] = [key, value].join("=");
  }

  if (kvp.length === 2 && !kvp[0]) {
    return kvp[1];
  }

  return kvp.join("&");
};

export function updateQueryStringParameter(uri: string, key: string, value: string) {
  if (!value) return uri;

  let re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  let separator = uri.indexOf("?") !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, "$1" + key + "=" + value + "$2");
  } else {
    return uri + separator + key + "=" + value;
  }
}

export const getChainId = async () => {
  const web3 = new Web3(Web3.givenProvider);
  const chainId = await web3.eth.getChainId();

  return `0x${chainId}`;
};

export function getEthersProviderByChain(chainId: string) {
  const chainMapping = {
    "0x1": "https://rpc.ankr.com/eth",
    "0x4": "https://rpc.ankr.com/eth_rinkeby",
    "0x89": "https://rpc.ankr.com/polygon",
    "0x13881": "https://rpc.ankr.com/polygon_mumbai",
    "0x38": "https://rpc.ankr.com/bsc",
    "0x61": "https://rpc.ankr.com/bsc_testnet_chapel",
  } as any;
  let url = chainMapping[chainId];
  const provider = new ethers.providers.JsonRpcProvider(url);
  return provider;
}

export function getExponentialParts(num: number | string | Array<any>): string[] {
  return Array.isArray(num) ? num : String(num).split(/[eE]/);
}

export function isExponential(num: number | string | Array<any>) {
  const eParts = getExponentialParts(num);
  return !Number.isNaN(Number(eParts[1]));
}

export function fromExponential(num: number | string | Array<any>): string {
  const eParts = getExponentialParts(num);
  if (!isExponential(eParts)) {
    return eParts[0];
  }

  const sign = eParts[0][0] === "-" ? "-" : "";
  const digits = eParts[0].replace(/^-/, "");
  const digitsParts = digits.split(".");
  const wholeDigits = digitsParts[0];
  const fractionDigits = digitsParts[1] || "";
  let e = Number(eParts[1]);

  if (e === 0) {
    return `${sign + wholeDigits}.${fractionDigits}`;
  } else if (e < 0) {
    // move dot to the left
    const countWholeAfterTransform = wholeDigits.length + e;
    if (countWholeAfterTransform > 0) {
      // transform whole to fraction
      const wholeDigitsAfterTransform = wholeDigits.substr(0, countWholeAfterTransform);
      const wholeDigitsTransformedToFraction = wholeDigits.substr(countWholeAfterTransform);
      return `${sign + wholeDigitsAfterTransform}.${wholeDigitsTransformedToFraction}${fractionDigits}`;
    } else {
      // not enough whole digits: prepend with fractional zeros

      // first e goes to dotted zero
      let zeros = "0.";
      e = countWholeAfterTransform;
      while (e) {
        zeros += "0";
        e += 1;
      }
      return sign + zeros + wholeDigits + fractionDigits;
    }
  } else {
    // move dot to the right
    const countFractionAfterTransform = fractionDigits.length - e;
    if (countFractionAfterTransform > 0) {
      // transform fraction to whole
      // countTransformedFractionToWhole = e
      const fractionDigitsAfterTransform = fractionDigits.substring(e);
      const fractionDigitsTransformedToWhole = fractionDigits.substring(0, e);
      return `${sign + wholeDigits + fractionDigitsTransformedToWhole}.${fractionDigitsAfterTransform}`;
    } else {
      // not enough fractions: append whole zeros
      let zerosCount = -countFractionAfterTransform;
      let zeros = "";
      while (zerosCount) {
        zeros += "0";
        zerosCount -= 1;
      }
      return sign + wholeDigits + fractionDigits + zeros;
    }
  }
}

export function getFileInfo(file: File, mime: string = ""): { filename: string; mime: string } {
  const pos: number = String(file.name).lastIndexOf(".");

  if (mime === "image/jpeg") {
    const filename = `${String(file.name).substring(0, pos < 0 ? String(file.name).length : pos)}.jpg`;

    return {
      filename,
      mime: "image/jpeg",
    };
  }

  return {
    filename: file.name,
    mime: file.type,
  };
}

export const checkMetamaskInstalled = (): boolean => {
  const installed = window.ethereum && window.ethereum.isMetaMask;
  //TODO: Show modal install if metamask not found
  return installed;
};
