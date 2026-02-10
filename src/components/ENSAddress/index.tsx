import { useEnsName } from 'wagmi';

interface ENSAddressProps {
  address: string;
  showFull?: boolean;
  showAvatar?: boolean;
  showCopy?: boolean;
  maxLength?: number;
  className?: string;
}

export const ENSAddress: React.FC<ENSAddressProps> = ({ 
  address, 
  showFull = false,
  showAvatar = false,
  maxLength,
  className = '' 
}) => {
  const { data: ensName } = useEnsName({
    address: address as `0x${string}`,
    chainId: 1,
  });

  const formatAddress = (addr: string) => {
    if (showFull) return addr;
    if (maxLength) {
      return `${addr.slice(0, maxLength)}...`;
    }
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <span className={`font-mono ${className}`}>
      {ensName || formatAddress(address)}
    </span>
  );
};
