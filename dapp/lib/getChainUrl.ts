export function getChainUrl(address: string, chain: string): string {
  if (!address) {
    throw new Error("Address is required");
  }
  if (!chain) {
    throw new Error("Chain is required");
  }

  let baseUrl: string;

  switch (chain.toLowerCase()) {
    case "ethereum":
      baseUrl = "https://etherscan.io/address/";
      break;
    case "ethereum sepolia":
    case "sepolia":
      baseUrl = "https://sepolia.etherscan.io/address/";
      break;
    case "polygon":
      baseUrl = "https://amoy.polygonscan.com/address/";
      break;
    case "arbitrum":
    case "arbitrum one":
    // baseUrl = "https://arbiscan.io/address/"; // FOR NOW ONLY THE TESTNET
    // break;
    case "arbitrum sepolia":
      baseUrl = "https://sepolia.arbiscan.io/address/";
      break;
    case "skale":
      baseUrl = "https://explorer.skale.network/address/";
      break;
    case "story":
      baseUrl = "https://explorer.story.foundation/address/";
      break;
    case "unichain":
      baseUrl = "https://unichain-sepolia.blockscout.com/address/";
      break;
    default:
      baseUrl = "https://unichain-sepolia.blockscout.com/address/"; //for now, unichain is the default
      break;
    // throw new Error(`Unsupported chain: ${chain}`);
  }

  return `${baseUrl}${address}`;
}
