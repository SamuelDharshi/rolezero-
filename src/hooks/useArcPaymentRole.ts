import { useState } from 'react';
import { useAccount, usePublicClient, useWalletClient } from 'wagmi';
import { parseEther } from 'viem';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Arc Payment Role Contract ABI (minimal)
const ARC_PAYMENT_ROLE_ABI = [
  {
    name: 'createRole',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'name', type: 'string' },
      { name: 'recipients', type: 'address[]' },
      { name: 'amounts', type: 'uint256[]' },
      { name: 'scheduledTimes', type: 'uint256[]' },
      { name: 'expiryTime', type: 'uint256' }
    ],
    outputs: [{ name: 'roleId', type: 'bytes32' }]
  }
] as const;

const ARC_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890'; // Replace with actual

export const useArcCreateRole = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const queryClient = useQueryClient();

  const createRole = useMutation({
    mutationFn: async ({
      name,
      recipients,
      amounts,
      scheduledTimes,
      expiryTime,
      totalAmount,
    }: {
      name: string;
      recipients: string[];
      amounts: string[];
      scheduledTimes: number[];
      expiryTime: number;
      totalAmount: string;
    }) => {
      if (!walletClient || !address) {
        throw new Error('Wallet not connected');
      }

      // Convert amounts to BigInt
      const amountsBigInt = amounts.map(a => parseEther(a));

      // Simulate transaction first
      const { request } = await publicClient!.simulateContract({
        address: ARC_CONTRACT_ADDRESS,
        abi: ARC_PAYMENT_ROLE_ABI,
        functionName: 'createRole',
        args: [name, recipients as `0x${string}`[], amountsBigInt, scheduledTimes.map(BigInt), BigInt(expiryTime)],
        value: parseEther(totalAmount),
        account: address,
      });

      // Execute transaction
      const hash = await walletClient.writeContract(request);

      // Wait for confirmation
      const receipt = await publicClient!.waitForTransactionReceipt({ hash });

      return {
        hash,
        digest: hash,
        receipt,
      };
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['arcRoles'] });
    },
  });

  return {
    createRole: createRole.mutate,
    createRoleAsync: createRole.mutateAsync,
    isLoading: createRole.isPending,
    isSuccess: createRole.isSuccess,
    error: createRole.error,
  };
};
