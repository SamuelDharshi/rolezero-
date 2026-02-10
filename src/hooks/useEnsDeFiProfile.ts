import { useEnsText } from 'wagmi';
import { normalize } from 'viem/ens';

export interface ENSDeFiProfile {
  // Payment preferences
  preferredToken?: string;
  notification?: string;
  paymentFrequency?: 'weekly' | 'biweekly' | 'monthly' | 'custom';
  timezone?: string;
  minPaymentAmount?: string;
  
  // Professional info for payroll
  title?: string;
  company?: string;
  rate?: string; // hourly/monthly rate
  
  // Social & contact
  twitter?: string;
  discord?: string;
  email?: string;
  
  // DeFi settings
  swapTolerance?: string; // e.g. "0.5%" for DEX swaps
  multisig?: string; // multisig wallet address
  treasury?: string; // treasury contract
  
  // Payment automation
  autoExecute?: 'true' | 'false';
  webhookUrl?: string;
  
  // Sui roles specific
  defaultNetwork?: 'sui' | 'arc' | 'ethereum';
  profileImage?: string;
}

/**
 * Advanced ENS DeFi Profile Hook
 * Retrieves comprehensive DeFi payment and professional information from ENS text records
 */
export const useEnsDeFiProfile = (ensName: string | undefined) => {
  // Check if it's a valid ENS name and not empty
  const isValidEns = !!(ensName && ensName.trim() && (ensName.endsWith('.eth') || ensName.includes('.')));
  
  // Safely normalize the ENS name
  let normalizedName: string | undefined;
  try {
    normalizedName = ensName && isValidEns ? normalize(ensName) : undefined;
  } catch (e) {
    // Handle normalization errors
    normalizedName = undefined;
  }

  // Payment preferences
  const { data: preferredToken } = useEnsText({
    name: normalizedName,
    key: 'defi.preferredToken',
    chainId: 1,
  });

  const { data: paymentFrequency } = useEnsText({
    name: normalizedName,
    key: 'defi.frequency',
    chainId: 1,
  });

  const { data: timezone } = useEnsText({
    name: normalizedName,
    key: 'defi.timezone',
    chainId: 1,
  });

  const { data: minPaymentAmount } = useEnsText({
    name: normalizedName,
    key: 'defi.minAmount',
    chainId: 1,
  });

  // Professional info
  const { data: title } = useEnsText({
    name: normalizedName,
    key: 'job',
    chainId: 1,
  });

  const { data: company } = useEnsText({
    name: normalizedName,
    key: 'com.company',
    chainId: 1,
  });

  const { data: rate } = useEnsText({
    name: normalizedName,
    key: 'defi.hourlyRate',
    chainId: 1,
  });

  // Social links
  const { data: twitter } = useEnsText({
    name: normalizedName,
    key: 'com.twitter',
    chainId: 1,
  });

  const { data: discord } = useEnsText({
    name: normalizedName,
    key: 'com.discord',
    chainId: 1,
  });

  const { data: email } = useEnsText({
    name: normalizedName,
    key: 'email',
    chainId: 1,
  });

  // DeFi automation settings
  const { data: autoExecute } = useEnsText({
    name: normalizedName,
    key: 'defi.autoExecute',
    chainId: 1,
  });

  const { data: swapTolerance } = useEnsText({
    name: normalizedName,
    key: 'defi.swapTolerance',
    chainId: 1,
  });

  const { data: defaultNetwork } = useEnsText({
    name: normalizedName,
    key: 'defi.network',
    chainId: 1,
  });

  const { data: notification } = useEnsText({
    name: normalizedName,
    key: 'defi.notification',
    chainId: 1,
  });

  const { data: webhookUrl } = useEnsText({
    name: normalizedName,
    key: 'defi.webhook',
    chainId: 1,
  });

  const { data: profileImage } = useEnsText({
    name: normalizedName,
    key: 'avatar',
    chainId: 1,
  });

  const profile: ENSDeFiProfile = {
    preferredToken: preferredToken || undefined,
    paymentFrequency: (paymentFrequency as any) || undefined,
    timezone: timezone || undefined,
    minPaymentAmount: minPaymentAmount || undefined,
    title: title || undefined,
    company: company || undefined,
    rate: rate || undefined,
    twitter: twitter || undefined,
    discord: discord || undefined,
    email: email || undefined,
    autoExecute: (autoExecute as any) || undefined,
    swapTolerance: swapTolerance || undefined,
    defaultNetwork: (defaultNetwork as any) || undefined,
    notification: notification || undefined,
    webhookUrl: webhookUrl || undefined,
    profileImage: profileImage || undefined,
  };

  // Check if profile has any data
  const hasProfile = Object.values(profile).some(value => value !== undefined);

  return {
    profile,
    hasProfile,
    isValidEns,
  };
};

/**
 * Helper function to get smart payment suggestions based on ENS profile
 */
export const getENSPaymentSuggestions = (profile: ENSDeFiProfile) => {
  const suggestions: string[] = [];

  if (profile.preferredToken) {
    suggestions.push(`💰 Prefers ${profile.preferredToken} payments`);
  }

  if (profile.paymentFrequency) {
    suggestions.push(`📅 Payment frequency: ${profile.paymentFrequency}`);
  }

  if (profile.timezone) {
    suggestions.push(`🌍 Timezone: ${profile.timezone}`);
  }

  if (profile.rate) {
    suggestions.push(`💵 Rate: ${profile.rate}`);
  }

  if (profile.autoExecute === 'true') {
    suggestions.push(`🤖 Auto-execution enabled`);
  }

  if (profile.company) {
    suggestions.push(`🏢 Works at ${profile.company}`);
  }

  return suggestions;
};
