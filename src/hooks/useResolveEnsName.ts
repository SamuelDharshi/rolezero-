import { useEnsAddress } from 'wagmi';
import { normalize } from 'viem/ens';

export const useResolveEnsName = (name: string | undefined) => {
  // Check if it's a valid ENS name and not empty
  const isEnsName = !!(name && name.trim() && (name.endsWith('.eth') || name.includes('.')));
  
  // Only normalize if we have a valid name
  let normalizedName: string | undefined;
  try {
    normalizedName = name && isEnsName ? normalize(name) : undefined;
  } catch (e) {
    // Handle normalization errors (invalid ENS names)
    normalizedName = undefined;
  }
  
  const { data: address, isLoading, error } = useEnsAddress({
    name: normalizedName,
    chainId: 1, // Ethereum mainnet
  });

  return {
    address: address || undefined,
    isLoading,
    error,
    isEnsName,
  };
};
