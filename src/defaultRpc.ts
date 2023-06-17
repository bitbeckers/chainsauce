import {
  MAINNET_RPC_URL,
  GOERLI_RPC_URL,
  GNOSIS_RPC_URL,
  SEPOLIA_RPC_URL,
  POLYGON_MAINNET_RPC_URL,
  POLYGON_MUMBAI_RPC_URL,
} from "./constants";

const getDefaultRpcUrl = (chainName: string) => {
  switch (chainName) {
    case "mainnet":
      console.warn(
        "Using default RPC URL for mainnet. This is not recommended."
      );
      return MAINNET_RPC_URL;

    case "goerli":
      console.warn(
        "Using default RPC URL for goerli. This is not recommended."
      );
      return GOERLI_RPC_URL;

    case "gnosis":
      console.warn(
        "Using default RPC URL for gnosis. This is not recommended."
      );
      return GNOSIS_RPC_URL;

    case "sepolia":
      console.warn(
        "Using default RPC URL for sepolia. This is not recommended."
      );
      return SEPOLIA_RPC_URL;

    case "polygon-mainnet":
      console.warn(
        "Using default RPC URL for polygon-mainnet. This is not recommended."
      );
      return POLYGON_MAINNET_RPC_URL;

    case "polygon-mumbai":
      return POLYGON_MUMBAI_RPC_URL;

    default:
      throw new Error(`Unknown network: ${chainName}`);
  }
};

export { getDefaultRpcUrl };
