import { WalletModal } from '@/components/WalletModal/WalletModal';

interface ProWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProWalletModal: React.FC<ProWalletModalProps> = ({ isOpen, onClose }) => {
  return <WalletModal isOpen={isOpen} onClose={onClose} />;
};
