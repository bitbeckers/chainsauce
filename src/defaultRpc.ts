const getDefaultRpcUrl = (chainName: string) => {
  switch (chainName) {
    case "mainnet":
      console.warn(
        "Using default RPC URL for mainnet. This is not recommended."
      );
      return "https://ethereum.publicnode.com";

    case "goerli":
      console.warn(
        "Using default RPC URL for goerli. This is not recommended."
      );
      return "https://ethereum-goerli.publicnode.com";

    case "gnosis":
      console.warn(
        "Using default RPC URL for gnosis. This is not recommended."
      );
      return "https://rpc.gnosischain.com";

    case "sepolia":
      console.warn(
        "Using default RPC URL for sepolia. This is not recommended."
      );
      return "https://rpc.sepolia.org";

    case "polygon-mainnet":
      console.warn(
        "Using default RPC URL for polygon-mainnet. This is not recommended."
      );
      return "https://polygon-rpc.com";

    case "polygon-mumbai":
      return "https://rpc-mumbai.maticvigil.com";

    default:
      throw new Error(`Unknown network: ${chainName}`);
  }
};

export { getDefaultRpcUrl };
