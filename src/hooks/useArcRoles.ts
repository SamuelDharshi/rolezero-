import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

export interface ArcRoleSummary {
  id: string;
  name: string;
  creator: string;
  startTime: number;
  expiryTime: number;
  totalFunded: number;
  remainingBalance: number;
  paymentCount: number;
  chain: 'arc';
}

export interface ArcScheduledPayment {
  roleId: string;
  roleName: string;
  roleCreator: string;
  recipient: string;
  amount: number;
  scheduledTime: number;
  executed: boolean;
  paymentIndex: number;
  roleBalance: number;
  roleExpiry: number;
  chain: 'arc';
}

export const useArcRoles = () => {
  const { address } = useAccount();

  return useQuery({
    queryKey: ['arcRoles', address],
    queryFn: async (): Promise<ArcRoleSummary[]> => {
      if (!address) return [];

      try {
        // Fetch from localStorage for now
        const stored = localStorage.getItem('arcRoles');
        if (!stored) return [];

        const allRoles = JSON.parse(stored);
        return allRoles.filter((role: ArcRoleSummary) => 
          role.creator.toLowerCase() === address.toLowerCase()
        );
      } catch (error) {
        console.error('Error fetching Arc roles:', error);
        return [];
      }
    },
    enabled: !!address,
    refetchInterval: 30000,
  });
};

export const useArcScheduledPayments = () => {
  const { address } = useAccount();

  return useQuery({
    queryKey: ['arcScheduledPayments', address],
    queryFn: async (): Promise<ArcScheduledPayment[]> => {
      if (!address) return [];

      try {
        // This would query Arc contract for scheduled payments
        // For now, returning empty array
        return [];
      } catch (error) {
        console.error('Error fetching Arc scheduled payments:', error);
        return [];
      }
    },
    enabled: !!address,
    refetchInterval: 30000,
  });
};
