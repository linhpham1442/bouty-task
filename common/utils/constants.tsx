// api
export const METHOD = {
  POST: "post",
  GET: "get",
  PATH: "path",
  PUT: "put",
  DELETE: "delete",
};

export const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";
export const MAX_UNIT = "115792089237316195423570985008687907853269984665640564039357584007913129639935";

export const connectors = [
  {
    id: "metamask",
    name: "Metamask",
    options: {
      chainId: 97,
      chainName: "Binance Smart Chain Testnet",
      rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
      blockExplorerUrls: ["https://testnet.bscscan.com"],
    },
  },

  // {
  //   id: 'walletconnect',
  //   name: 'WalletConnect',
  //   options: {
  //     rpc: {
  //       97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  //     },
  //     chainId: 97,
  //     networkId: 97,
  //   },
  // },
  // {
  //   id: 'trustwallet',
  //   name: 'Trust Wallet',
  //   options: {
  //     chainId: 97,
  //     chainName: 'Binance Smart Chain Testnet',
  //     rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
  //     blockExplorerUrls: ['https://testnet.bscscan.com'],
  //   },
  // },
  // {
  //   id: 'bsc',
  //   name: 'Binance Chain Wallet',
  //   options: {
  //     supportedChainIds: [97],
  //   },
  // },
];

export const PROPOSAL_STATUS = ["Pending", "Active", "Canceled", "Failed", "Succeeded", "Queued", "Expired", "Executed"];

export const PROPOSAL_STATUS_COLOR = ["#FFB627", "#3E74FF", "#EB5757", "#EB5757", "#34C77B", "#FFB627", "#EB5757", "#807E98"];

export const COLORS = {
  primary: "#6966FF",
};

export const DEFAULT_CLUB_AVATAR = {
  path: "/svg/avatar1.svg",
  size: 96,
  alt: "club-avatar",
};

export const DEBOUNCE_DURATION: number = 300; // Unit: ms

export const APP_TOKEN_KEY = "spinel_token";
