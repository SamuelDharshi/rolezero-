import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

const client = new SuiClient({ url: getFullnodeUrl('testnet') });

/**
 * Resolves a .sui name to a Sui address using the Name Service.
 * @param name The .sui name to resolve (e.g., 'example.sui')
 * @returns The resolved Sui address or null if resolution fails
 */
export const resolveSuiName = async (name: string): Promise<string | null> => {
  if (!name.endsWith('.sui')) return null;
  
  try {
    const address = await client.resolveNameServiceAddress({ name });
    return address;
  } catch (error) {
    console.error('Error resolving Sui name:', error);
    return null;
  }
};
