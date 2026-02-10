import { useSuiClient } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';
import { SUI_PACKAGE_ID } from '@/config/sui';

export interface RoleSummary {
  id: string;
  name: string;
  creator: string;
  startTime: number;
  expiryTime: number;
  totalFunded: number;
  remainingBalance: number;
  sponsorCount: number;
  paymentCount: number;
}

export const useAllRoles = () => {
  const client = useSuiClient();

  return useQuery({
    queryKey: ['allRoles'],
    queryFn: async () => {
      try {
        // Get all objects of Role type
        const response = await client.queryEvents({
          query: {
            MoveEventType: `${SUI_PACKAGE_ID}::role::RoleCreated`,
          },
          limit: 100,
        });

        // Parse role data from events
        const rolePromises = await Promise.all(
          response.data.map(async (event: any) => {
            const eventData = event.parsedJson as any;
            try {
              return {
                id: eventData.id,
                name: eventData.name,
                creator: eventData.creator,
                startTime: eventData.start_time,
                expiryTime: eventData.expiry_time,
                totalFunded: eventData.total_funded,
                remainingBalance: eventData.remaining_balance,
                sponsorCount: 0, // Would be calculated from sponsor events
                paymentCount: eventData.payment_count,
              } as RoleSummary;
            } catch (error) {
              console.error('Error parsing role data:', error);
              return null;
            }
          })
        );

        // Filter out null values and ensure type safety
        const roles: RoleSummary[] = rolePromises.filter((role: any): role is RoleSummary => role !== null);
        
        // Filter out expired roles (only return active roles)
        const currentTime = Date.now();
        const activeRoles = roles.filter(role => {
          const expiryMs = role.expiryTime < 10000000000 ? role.expiryTime * 1000 : role.expiryTime;
          return expiryMs > currentTime;
        });
        
        console.log(`[useAllRoles] Total: ${roles.length}, Active: ${activeRoles.length}, Expired: ${roles.length - activeRoles.length}`);
        
        // Sort by creation time (most recent first)
        return activeRoles.sort((a, b) => b.startTime - a.startTime);
      } catch (error) {
        console.error('Error fetching roles:', error);
        return [];
      }
    },
    refetchInterval: 30000, // Increased from 15s to 30s to prevent rate limiting
    staleTime: 15000, // Data fresh for 15 seconds
    gcTime: 600000, // Cache for 10 minutes
  });
};
