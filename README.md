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

**Use Case**: DeFi payments, cryptocurrency payroll, developer compensation

### 2. **Arc Blockchain** - Real Business Payments
- **Native USDC**: Pay with real stablecoin (not test tokens)
- **EVM Compatible**: Use MetaMask, same experience as Ethereum
- **Institutional Ready**: USDC is familiar to traditional businesses

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

## 🎓 Key Innovation

**ENS as a DeFi Payment Profile Layer**: Instead of just name resolution, we use ENS as a decentralized payment preference database. Recipients set their preferences once in ENS, and all payment systems can read them automatically. This creates portable payment identities across the entire web3 ecosystem.

---

Built for HackMoney 2026 🚀  
Multi-Chain • Trustless • Auto-Executed
