export function shortenAddress(address: string, chars: number = 6): string {
  return `
      ${address.substring(0, chars)}...${address.substring(address.length - chars)}
    `;
}
