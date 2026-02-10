# Rolezero - Trustless Auto-Payment Platform

**Fund once, pay automatically.** A multi-chain payment automation system where clients fund payment roles on-chain, and payments execute automatically at scheduled times. Full transparency with blockchain-verifiable funds.

## 🎯 Core Value Proposition

### The Problem
- **Traditional Payroll**: Companies hold funds, employees trust they'll get paid
- **Delayed Payments**: Manual approval processes, waiting for accounting
- **No Transparency**: Can't verify funds exist until payment arrives

### Our Solution: Trustless Auto-Payments
1. **Client Funds Role**: Deposit SUI or USDC into smart contract (visible on-chain)
2. **Schedule Payments**: Set recipients, amounts, and times (weekly, monthly, custom)
3. **Auto-Execute**: Anyone can execute ready payments - just click "Execute" button

**Result**: Recipients see funds on-chain before receiving payment. Zero trust needed.

---

## 🚀 Three Technologies, One System

### 1. **Sui Blockchain** - Smart Contract Security
- **Move Language**: Type-safe smart contracts for payment roles
- **On-Chain Transparency**: All funds visible on blockchain
- **No Custody Risk**: Smart contract holds funds, not us
- **Package ID**: `0xbac14b29ce0da91b31780afabdcc989346a5227350fab6d0c15c37b6801d0c38`

**Use Case**: DeFi payments, cryptocurrency payroll, developer compensation

### 2. **Arc Blockchain** - Real Business Payments
- **Native USDC**: Pay with real stablecoin (not test tokens)
- **EVM Compatible**: Use MetaMask, same experience as Ethereum
- **Institutional Ready**: USDC is familiar to traditional businesses
- **Contract**: `0xd91489f8De36E01E81a7a787DF3D8E1Fa78f7138`

**Use Case**: Business payroll, contractor payments, subscriptions

### 3. **ENS Integration** - Human-Readable Payments
- **No More Addresses**: Pay `alice.eth` instead of `0x742d35Cc6634C...`
- **Payment Preferences**: Recipients store preferred token, min amount in ENS profile
- **Auto-Configuration**: App automatically loads recipient preferences
- **Profile Demo**: Try `testnet-work.eth` in the app

**Use Case**: Simplified UX, professional payment profiles

---

## 💡 How All Three Work Together

```
CLIENT WORKFLOW:
1. Choose blockchain → Sui (DeFi, SUI tokens) or Arc (Business, USDC)
2. Create role → "Monthly Payroll" 
3. Fund contract → 10 SUI or 1000 USDC deposited on-chain
4. Add recipients → alice.eth (ENS resolves to 0x...)
   └── Auto-loads: Preferred token = USDC, Min = $100/payment
5. Set schedule → Every 1st of month
6. Submit → Smart contract holds funds, visible on-chain

RECIPIENT EXPERIENCE:
1. See funded role → "Marketing Payroll has 1000 USDC balance"
2. Trust established → Funds are on blockchain, not in company account
3. Payment day → Anyone executes payment (permissionless)
4. Receive payment → 100 USDC arrives automatically

ENS ADDS VALUE:
- Client types: alice.eth (not 0x742d35Cc6634C0532925a3b8...)
- App auto-fills: USDC payment, $100 minimum (from alice.eth ENS profile)
- Professional: Both parties use human-readable identities
```

---

## 🛠️ Technical Stack

### Smart Contracts
- **Sui (Move)**: [`sources/role.move`](move/sources/role.move)
  - `create_role`: Create payment role with funds
  - `execute_payment`: Execute scheduled payment permissionlessly
  - `add_payment`: Add new payment to role
  
- **Arc (Solidity)**: [`smart-contracts/arc/ArcPaymentRole.sol`](smart-contracts/arc/ArcPaymentRole.sol)
  - ERC-20 compatible (USDC)
  - Same role-based payment architecture

### Frontend
- **React + TypeScript**: Type-safe UI components
- **Wagmi v2**: Arc chain + ENS integration
- **Sui dApp Kit**: Sui blockchain wallet connection
- **Viem**: Ethereum/ENS name resolution

### ENS Integration Files
- [`useResolveEnsName.ts`](src/hooks/useResolveEnsName.ts) - ENS → Address resolution
- [`useEnsDeFiProfile.ts`](src/hooks/useEnsDeFiProfile.ts) - Payment preference loading
- [`ENSShowcase.tsx`](src/pages/ENSShowcase/ENSShowcase.tsx) - Live demo page

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Connect Wallets
- **Sui**: Install [Sui Wallet Extension](https://chrome.google.com/webstore/detail/sui-wallet)
- **Arc**: Use MetaMask, add Arc Testnet:
  - RPC: `https://testnet.node.arc.network`
  - Chain ID: `93094681`
  - Symbol: `ETH`

### 4. Try the Flow
1. **Homepage**: See how all three technologies work together
2. **Create Role**: Choose Sui or Arc, create payment role
3. **ENS Demo**: Visit `/ens`, try `testnet-work.eth`
4. **Execute**: Find ready payments, click "Execute"

---

## 📝 What You Need to Do Manually

### 1. **Set ENS Payment Preferences** (Optional but Recommended)

If you have an ENS domain, add payment preferences for better demo:

**Visit**: [`app.ens.domains/your-name.eth`](https://app.ens.domains) → **Records** tab

Add these text records:
```
Key: payment.preferredToken      Value: USDC
Key: payment.minAmount           Value: 100
Key: payment.autoExecute         Value: true
Key: payment.timezone            Value: America/New_York
```

Save and wait 5-10 minutes for propagation. Your payment preferences will now auto-load in the app!

### 2. **Deploy to Production** (For HackMoney Submission)

```bash
# Build production bundle
npm run build

# Deploy to Vercel
vercel deploy

# Or Netlify
netlify deploy
```

### 3. **Fund Test Wallets**

- **Sui Testnet**: Get SUI from [Sui Faucet](https://discord.gg/sui)
- **Arc Testnet**: Request ETH in Arc Discord

---

## 🎥 Demo Script (For Video)

1. **Homepage** (20s): "This is a trustless auto-payment platform using Sui, Arc, and ENS..."
2. **How It Works** (30s): "Client funds smart contract, recipients see funds on-chain, payments auto-execute..."
3. **ENS Demo** (30s): "Instead of addresses, use alice.eth. Her payment preferences auto-load from ENS..."
4. **Create Role** (45s): "Choose Sui or Arc, add recipient with ENS, schedule payments..."
5. **Execute Payment** (30s): "Anyone can execute ready payments - fully permissionless..."
6. **Blockchain Verification** (20s): "All funds visible on Sui Explorer / Arc Explorer..."

**Total**: ~3 minutes

---

## 🏆 HackMoney Prize Alignment

### ENS Prize Track
- ✅ ENS → Address resolution across all payment flows
- ✅ Payment preference schema (payment.preferredToken, payment.minAmount)
- ✅ DeFi identity layer innovation
- ✅ Live demo at `/ens`
- 📄 Documentation: [`ENS-COMPLETE-GUIDE.md`](ENS-COMPLETE-GUIDE.md)

### Arc Prize Track
- ✅ Arc testnet smart contract deployed
- ✅ USDC-native payments
- ✅ EVM compatibility (MetaMask support)
- ✅ Production business use case
- 📄 Documentation: [`ARC-INTEGRATION-GUIDE.md`](ARC-INTEGRATION-GUIDE.md)

### Sui Foundation
- ✅ Move smart contracts with role-based payment model
- ✅ Permissionless execution architecture
- ✅ On-chain transparency and trustless design
- ✅ Testnet deployment with working demo
- 📄 Original project, enhanced with multi-chain

---

## 📂 Project Structure

```
d:\ethereum/
├── move/                          # Sui Move smart contracts
│   ├── sources/role.move          # Payment role logic
│   └── tests/role_tests.move      # Move tests
├── smart-contracts/arc/           # Arc Solidity contracts
│   └── ArcPaymentRole.sol         # ERC-20 payment roles
├── src/
│   ├── pages/
│   │   ├── Home/                  # Landing page (explains all 3 techs)
│   │   ├── CreateRole/            # Create payment role (Sui + Arc)
│   │   ├── ENSShowcase/           # ENS demo page
│   │   └── ENSSettings/           # ENS preference config
│   ├── hooks/
│   │   ├── useCreateRole.ts       # Sui role creation
│   │   ├── useArcPaymentRole.ts   # Arc role creation
│   │   ├── useResolveEnsName.ts   # ENS → Address
│   │   └── useEnsDeFiProfile.ts   # ENS payment prefs
│   └── config/
│       ├── sui.ts                 # Sui package config
│       ├── arc.ts                 # Arc contract config
│       └── wagmi.ts               # ENS + Arc config
├── README.md                      # This file
├── ENS-COMPLETE-GUIDE.md          # ENS integration docs
└── ARC-INTEGRATION-GUIDE.md       # Arc integration docs
```

---

## 🔗 Live Links

- **Sui Package**: [`0xbac14b29...1d0c38`](https://suiexplorer.com/object/0xbac14b29ce0da91b31780afabdcc989346a5227350fab6d0c15c37b6801d0c38?network=testnet)
- **Arc Contract**: [`0xd91489f8...8f7138`](https://testnet.arcscan.io/address/0xd91489f8De36E01E81a7a787DF3D8E1Fa78f7138)
- **ENS Demo Domain**: [`testnet-work.eth`](https://app.ens.domains/testnet-work.eth)

---

## 🎓 Key Innovation

**ENS as a DeFi Payment Profile Layer**: Instead of just name resolution, we use ENS as a decentralized payment preference database. Recipients set their preferences once in ENS, and all payment systems can read them automatically. This creates portable payment identities across the entire web3 ecosystem.

---

Built for HackMoney 2026 🚀  
Multi-Chain • Trustless • Auto-Executed
