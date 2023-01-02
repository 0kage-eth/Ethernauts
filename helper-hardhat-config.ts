export interface networkConfigItem {
  name?: string
  wethToken?: string
  lendingPoolAddressesProvider?: string
  daiEthPriceFeed?: string
  daiToken?: string
  blockConfirmations?: number
  ethUsdPriceFeed?: string
  vrfCoordinator?: string
  linkToken?: string
  keyHash?: string
  gasLimit?: number
  subscriptionId?: string
  callbackGasLimit?: string
  minEth?: string
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem
}

export const networkConfig: networkConfigInfo = {
  31337: {
    name: "localhost",
    wethToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    lendingPoolAddressesProvider: "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
    keyHash:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    callbackGasLimit: "500000",
    daiEthPriceFeed: "0x773616E4d11A78F511299002da57A0a94577F1f4",
    daiToken: "0x6b175474e89094c44da98b954eedeac495271d0f",
    vrfCoordinator: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
    linkToken: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
    ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    blockConfirmations: 1,
    minEth: "0.01",
    subscriptionId: "8854",
  },
  // Price Feed Address, values can be obtained at https://docs.chain.link/docs/reference-contracts
  // Default one is ETH/USD contract on Kovan
  42: {
    name: "kovan",
    ethUsdPriceFeed: "0x9326BFA02ADD2366b30bacB125260Af641031331",
    wethToken: "0xd0a1e359811322d97991e03f863a0c30c2cf029c",
    lendingPoolAddressesProvider: "0x88757f2f99175387aB4C6a4b3067c77A695b0349",
    daiEthPriceFeed: "0x22B58f1EbEDfCA50feF632bD73368b2FdA96D541",
    daiToken: "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD",
    blockConfirmations: 6,
    minEth: "0.01",
  },
  4: {
    name: "rinkeby",
    linkToken: "0x01BE23585060835E02B77ef475b0Cc51aA1e0709",
    ethUsdPriceFeed: "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e",
    keyHash:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    vrfCoordinator: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
    gasLimit: 2500000,
    blockConfirmations: 6,
    callbackGasLimit: "500000",
    subscriptionId: "8854",
    minEth: "0.01",
  },
  5: {
    name: "goerli",
    linkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
    vrfCoordinator: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
    keyHash:
      "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
    gasLimit: 2500000,
    blockConfirmations: 6,
    callbackGasLimit: "500000",
    subscriptionId: "8854",
    minEth: "0.01",
  },
  1: {
    name: "mainnet",
    linkToken: "0x514910771af9ca656af840dff83e8264ecf986ca",
    vrfCoordinator: "0x271682DEB8C4E0901D1a1550aD2e64D568E69909",
    blockConfirmations: 6,
    minEth: "0.01",
  },
}

export const developmentChains = ["hardhat", "localhost"]

export const VERIFICATION_BLOCK_CONFIRMATIONS = 6
