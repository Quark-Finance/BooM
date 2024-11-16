import React from 'react';
import { ExternalLink } from 'lucide-react';
import { shortenAddress } from '@/lib/shortenAddress';
import { getChainUrl } from '@/lib/getChainUrl';

interface ShortAddressLinkProps {
  address: string;
  chain: string;
  chars?: number;
  className?: string; // Optional for styling
}

export const ShortAddressLink: React.FC<ShortAddressLinkProps> = ({
  address,
  chain,
  chars = 6,
  className,
}) => {
  const explorerUrl = getChainUrl(address, chain);
  const shortAddress = shortenAddress(address, chars);

  return (
    <a
      href={explorerUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center ${className}`}
      title={address} // Tooltip with full address
    >
      {shortAddress}
      <ExternalLink className="ml-1 w-4 h-4 text-primary" />
    </a>
  );
};
