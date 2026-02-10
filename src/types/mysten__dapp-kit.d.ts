declare module '@mysten/dapp-kit' {
  import { ReactNode } from 'react';
  
  export function useCurrentAccount(): any;
  export function useConnectWallet(): any;
  export function useDisconnectWallet(): any;
  export function useWallets(): any;
  export function useSuiClient(): any;
  export function useSignAndExecuteTransaction(): any;
  export function createNetworkConfig(config: any): any;
  
  export function SuiClientProvider(props: { children: ReactNode; networks?: any; defaultNetwork?: string }): JSX.Element;
  export function WalletProvider(props: { children: ReactNode; autoConnect?: boolean }): JSX.Element;
  
  export * from '@mysten/dapp-kit/dist/index';
}
