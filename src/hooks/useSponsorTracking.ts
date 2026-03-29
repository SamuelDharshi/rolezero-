import { useMemo } from 'react';
import { useRoleData } from './useRoleData';

export interface SponsorRecord {
  address: string;
  total: number;
}

export const useSponsorTracking = (roleId?: string) => {
  const { data: roleData, isLoading } = useRoleData(roleId);

  const sponsorships = useMemo(() => {
    if (!roleData) return [];

    const sponsorsMap = new Map<string, number>();
    roleData.fundingHistory.forEach(funding => {
      const current = sponsorsMap.get(funding.from) || 0;
      sponsorsMap.set(funding.from, current + funding.amount / 1_000_000_000);
    });

    return Array.from(sponsorsMap.entries())
      .map(([address, total]) => ({
        address,
        total
      }))
      .sort((a, b) => b.total - a.total);
  }, [roleData]);

  return {
    sponsorships,
    isLoading
  };
};
