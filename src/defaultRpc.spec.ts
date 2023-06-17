import { getDefaultRpcUrl } from "./defaultRpc";

describe("getDefaultRpcUrl", () => {
  it("should return the default RPC URL for mainnet", () => {
    const chainName = "mainnet";
    const expectedUrl = "https://ethereum.publicnode.com";
    const result = getDefaultRpcUrl(chainName);
    expect(result).toEqual(expectedUrl);
  });

  it("should return the default RPC URL for goerli", () => {
    const chainName = "goerli";
    const expectedUrl = "https://ethereum-goerli.publicnode.com";
    const result = getDefaultRpcUrl(chainName);
    expect(result).toEqual(expectedUrl);
  });

  it("should return the default RPC URL for gnosis", () => {
    const chainName = "gnosis";
    const expectedUrl = "https://rpc.gnosischain.com";
    const result = getDefaultRpcUrl(chainName);
    expect(result).toEqual(expectedUrl);
  });

  it("should return the default RPC URL for sepolia", () => {
    const chainName = "sepolia";
    const expectedUrl = "https://rpc.sepolia.org";
    const result = getDefaultRpcUrl(chainName);
    expect(result).toEqual(expectedUrl);
  });

  it("should return the default RPC URL for polygon-mainnet", () => {
    const chainName = "polygon-mainnet";
    const expectedUrl = "https://polygon-rpc.com";
    const result = getDefaultRpcUrl(chainName);
    expect(result).toEqual(expectedUrl);
  });

  it("should return the RPC URL for polygon-mumbai", () => {
    const chainName = "polygon-mumbai";
    const expectedUrl = "https://rpc-mumbai.maticvigil.com";
    const result = getDefaultRpcUrl(chainName);
    expect(result).toEqual(expectedUrl);
  });

  it("should throw an error for unknown network", () => {
    const chainName = "unknown";
    expect(() => getDefaultRpcUrl(chainName)).toThrow(
      `Unknown network: ${chainName}`
    );
  });
});
