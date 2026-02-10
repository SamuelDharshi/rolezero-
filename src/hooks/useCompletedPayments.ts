import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { useCurrentAccount } from '@mysten/dapp-kit';

export interface CompletedPayment {
  id: string;
  roleId: string;
  roleName: string;
  recipient: string;
  amount: number;
  executedAt: number;
  transactionHash: string;
  chain: 'arc' | 'sui' | 'solana';
}

export const useCompletedPayments = () => {
  const { address: evmAddress } = useAccount();
  const suiAccount = useCurrentAccount();

  return useQuery({
    queryKey: ['completedPayments', evmAddress, suiAccount?.address],
    queryFn: async (): Promise<CompletedPayment[]> => {
      try {
        // Fetch from localStorage for now
        const stored = localStorage.getItem('completedPayments');
        if (!stored) return [];

        const allPayments = JSON.parse(stored);
        
        // Filter by connected wallet address
        return allPayments.filter((payment: CompletedPayment) => {
          if (payment.chain === 'arc' && evmAddress) {
            return payment.recipient.toLowerCase() === evmAddress.toLowerCase();
          }
          if (payment.chain === 'sui' && suiAccount?.address) {
            return payment.recipient === suiAccount.address;
          }
          return false;
        });
      } catch (error) {
        console.error('Error fetching completed payments:', error);
        return [];
      }
    },
    enabled: !!(evmAddress || suiAccount?.address),
    refetchInterval: 30000,
  });
};
