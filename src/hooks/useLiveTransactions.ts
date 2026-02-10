import { useSuiClient } from '@mysten/dapp-kit';
import { useQuery } from '@tanstack/react-query';
import { SUI_PACKAGE_ID } from '@/config/sui';

interface LiveTransaction {
  type: 'funding' | 'payment' | 'created';
  from: string;
  to?: string;
  amount: number;
  timestamp: number;
  txDigest: string;
  status: 'success' | 'pending' | 'failed';
}

export const useLiveTransactions = (roleId: string | undefined) => {
  const client = useSuiClient();

  return useQuery({
    queryKey: ['role-live-transactions', roleId],
    queryFn: async () => {
      if (!roleId) return [];

      const transactions: LiveTransaction[] = [];

      try {
        // NEW APPROACH: Query only role-specific events directly
        // This avoids fetching individual transaction blocks (much more efficient)
        
        // Query FundEvent for this role
        const fundEvents = await client.queryEvents({
          query: {
            MoveEventType: `${SUI_PACKAGE_ID}::role::FundEvent`,
          },
          limit: 50,
        });

        // Query PaymentExecuted for this role
        const paymentEvents = await client.queryEvents({
          query: {
            MoveEventType: `${SUI_PACKAGE_ID}::role::PaymentExecuted`,
          },
          limit: 50,
        });

        // Query RoleCreated to find creation event
        const createdEvents = await client.queryEvents({
          query: {
            MoveEventType: `${SUI_PACKAGE_ID}::role::RoleCreated`,
          },
          limit: 20,
        });

        // Process FundEvent
        for (const event of fundEvents.data) {
          const parsedJson = event.parsedJson as any;
          if (parsedJson?.role_id === roleId) {
            const amount = parsedJson?.amount || 0;
            const parsedAmount = typeof amount === 'string' ? parseInt(amount) : amount;
            
            let timestamp = Date.now();
            if (event.timestampMs) {
              const tsValue = typeof event.timestampMs === 'string' ? parseInt(event.timestampMs) : event.timestampMs;
              timestamp = tsValue < 10000000000 ? tsValue * 1000 : tsValue;
            }
            
            transactions.push({
              type: 'funding',
              from: parsedJson?.sender || '',
              amount: parsedAmount,
              timestamp,
              txDigest: event.id.txDigest,
              status: 'success', // Events only fire on successful transactions
            });
          }
        }

        // Process PaymentExecuted
        for (const event of paymentEvents.data) {
          const parsedJson = event.parsedJson as any;
          if (parsedJson?.role_id === roleId) {
            const amount = parsedJson?.amount || 0;
            const parsedAmount = typeof amount === 'string' ? parseInt(amount) : amount;
            
            let timestamp = Date.now();
            if (event.timestampMs) {
              const tsValue = typeof event.timestampMs === 'string' ? parseInt(event.timestampMs) : event.timestampMs;
              timestamp = tsValue < 10000000000 ? tsValue * 1000 : tsValue;
            }
            
            transactions.push({
              type: 'payment',
              from: parsedJson?.role_id || '',
              to: parsedJson?.recipient || '',
              amount: parsedAmount,
              timestamp,
              txDigest: event.id.txDigest,
              status: 'success',
            });
          }
        }

        // Process RoleCreated
        for (const event of createdEvents.data) {
          const parsedJson = event.parsedJson as any;
          if (parsedJson?.role_id === roleId) {
            let timestamp = Date.now();
            if (event.timestampMs) {
              const tsValue = typeof event.timestampMs === 'string' ? parseInt(event.timestampMs) : event.timestampMs;
              timestamp = tsValue < 10000000000 ? tsValue * 1000 : tsValue;
            }
            
            transactions.push({
              type: 'created',
              from: parsedJson?.creator || '',
              amount: 0,
              timestamp,
              txDigest: event.id.txDigest,
              status: 'success',
            });
          }
        }

      } catch (error: any) {
        console.error('Error fetching transactions:', error);
        // Return empty array on error instead of throwing
        return [];
      }

      // Sort by timestamp (most recent first)
      transactions.sort((a, b) => b.timestamp - a.timestamp);
      
      return transactions;
    },
    enabled: !!roleId,
    refetchInterval: 30000, // 30 seconds - balanced for live updates without rate limiting
    staleTime: 20000, // Data fresh for 20 seconds
    gcTime: 300000, // Cache for 5 minutes
    retry: 2, // Retry twice on failure
    retryDelay: (attemptIndex) => Math.min(3000 * Math.pow(2, attemptIndex), 10000), // 3s, 6s, 10s
  });
}

