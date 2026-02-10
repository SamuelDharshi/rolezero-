# 🚀 Complete User Flow Guide

## Overview
This application allows users to create roles with scheduled payments on the Sui blockchain, fund them, and execute payments automatically or manually.

### ⚡ Quick Execution Methods Comparison

| Method | Who Can Use | When Available | Setup Required | Cost | Speed |
|--------|-------------|----------------|----------------|------|-------|
| **Client-Side Auto-Executor** 🌐 | Wallet holder | Browser open + connected | None - automatic | Gas only (~0.001 SUI) | Every 30s |
| **Manual Button** 🔘 | Anyone with wallet | Anytime | None | Gas only (~0.001 SUI) | Instant |
| **Permissionless Community** 🤝 | Anyone | Anytime | None | Gas only (~0.001 SUI) | On-demand |

**Recommendation:** Keep browser open for automatic execution, but rest assured - if you close it, anyone can still execute payments permissionlessly!

---

## 🌐 Hybrid Architecture Explained

### Two Modes of Operation:

**🟢 Mode 1: Automated (Browser Open + Wallet Connected)**
```
✅ Client-side auto-executor runs every 30 seconds
✅ Automatically detects ready payments
✅ Executes using your connected wallet
✅ Shows status widget in bottom-right corner
✅ Zero infrastructure - runs in browser
✅ Perfect for active management
```

**🔵 Mode 2: Permissionless (Browser Closed or No Auto-Executor)**
```
✅ Anyone can execute ready payments anytime
✅ True decentralization - no single point of failure
✅ Recipients, sponsors, or third parties can trigger execution
✅ Executor pays only gas fees (~0.001 SUI)
✅ All ready payments execute together
✅ Perfect for community-driven systems
```

### Why This Hybrid Approach?

| Feature | Benefit |
|---------|---------|
| **Browser-based automation** | No servers, no maintenance, no costs |
| **Permissionless fallback** | Never stuck waiting - anyone can execute |
| **Client-side execution** | Fully decentralized, no centralized infrastructure |
| **Gas-efficient** | Only execute when payments are actually ready |
| **Transparent** | All actions visible on blockchain |

---

## � Payment Execution Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     ROLE CREATED                            │
│              (with scheduled payments)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
            ┌────────────────────────┐
            │   Payment Time Arrives  │
            │   (scheduledTime <= now)│
            └────────────┬───────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
         ▼                               ▼
┌─────────────────┐            ┌─────────────────┐
│  AUTOMATED      │            │  PERMISSIONLESS │
│  (Browser Open) │            │  (Manual)       │
└────────┬────────┘            └────────┬────────┘
         │                               │
         ▼                               ▼
┌─────────────────┐            ┌─────────────────┐
│ Auto-Executor   │            │ Any User        │
│ checks every    │            │ clicks          │
│ 30 seconds      │            │ "Execute        │
│                 │            │ Payments"       │
└────────┬────────┘            └────────┬────────┘
         │                               │
         │   Detects ready payment       │ User initiates
         │                               │
         └───────────┬───────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Transaction Created    │
        │  moveCall:             │
        │  execute_payments()    │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Sign with Wallet      │
        │  (Auto or Manual)      │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  Blockchain Execution  │
        │  - Verify time         │
        │  - Check balance       │
        │  - Transfer funds      │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  ✅ PAYMENT EXECUTED   │
        │  - Recipient gets SUI   │
        │  - Status updated       │
        │  - Event emitted        │
        └─────────────────────────┘

Key Points:
🟢 Auto-execution: Runs when browser open + wallet connected
🔵 Permissionless: Works even if nobody has browser open
⚡ Hybrid: Best of both worlds - automated + decentralized
```

---

## �👥 User Types & Capabilities

### 1. **Role Creator** (Person who creates the role)
- ✅ Create new roles with scheduled payments
- ✅ View their created roles
- ✅ Extend expiry time
- ✅ Fund roles
- ✅ Execute payments (when ready)
- ✅ Monitor live transactions
- ✅ View scheduled payments

### 2. **Sponsors** (Anyone who wants to fund a role)
- ✅ View all roles
- ✅ Fund any role with SUI tokens
- ✅ Extend expiry time of any role
- ✅ Execute payments (when ready)
- ✅ Monitor live transactions

### 3. **Recipients** (People receiving payments)
- ✅ View all roles
- ✅ Execute their own payments when ready
- ✅ Monitor when they'll receive funds
- ✅ Extend expiry time

### 4. **Client-Side Auto-Executor** (Browser-Based)
- ✅ Executes payments automatically every 30 seconds when browser open
- ✅ Runs in your browser - no servers, no bots
- ✅ Uses your connected wallet
- ✅ Fully decentralized automation

---

## 📋 Complete User Flows

### Flow 1: Creating a Role with Scheduled Payments

**Step 1: Connect Wallet**
```
1. Open application: http://localhost:5173
2. Click "Connect Wallet" in header
3. Select Sui wallet (e.g., Sui Wallet, Suiet)
4. Approve connection
```

**Step 2: Navigate to Create Role**
```
1. Click "Create Role" in navigation
2. Or go directly to: /create
```

**Step 3: Fill Role Details**
```
Basic Information:
├── Role Name: e.g., "Marketing Team"
├── Description: e.g., "Monthly payments for marketing expenses"
├── Start Time: When role becomes active (future date/time)
└── Expiry Time: When role ends (must be after start time)

Example:
- Start: Feb 5, 2026 at 00:00
- Expiry: Dec 31, 2026 at 23:59
```

**Step 4: Add Scheduled Payments**
```
For each payment:
├── Recipient Address: Sui wallet address (0x...)
├── Amount: In SUI tokens (e.g., 100 SUI)
└── Scheduled Time: When payment executes (between start and expiry)

Example Payments:
Payment 1:
- Recipient: 0xabc123...
- Amount: 100 SUI
- Schedule: Feb 10, 2026 at 10:00

Payment 2:
- Recipient: 0xdef456...
- Amount: 50 SUI
- Schedule: Feb 20, 2026 at 10:00

Payment 3:
- Recipient: 0xabc123...
- Amount: 100 SUI
- Schedule: Mar 10, 2026 at 10:00
```

**Step 5: Submit & Fund**
```
1. Click "Create Role" button
2. Approve transaction in wallet
3. Initial funding: Total of all scheduled payments (250 SUI in example)
4. Wait for blockchain confirmation (~5 seconds)
5. Redirected to Role Dashboard
```

**Result:**
- ✅ Role created on Sui blockchain
- ✅ Funded with initial amount
- ✅ Scheduled payments registered
- ✅ Role ID generated (0x...)

---

### Flow 2: Funding an Existing Role

**Option A: From Dashboard**
```
1. Navigate to Role Dashboard: /role/{roleId}/live
2. Click "Sponsor Now" button
3. Redirected to sponsor page
```

**Option B: From Roles List**
```
1. Go to "Roles" page: /roles
2. Find desired role
3. Click "View Details"
4. Click "Sponsor Now"
```

**Option C: Direct Link**
```
Go directly to: /sponsor/{roleId}
```

**Funding Process:**
```
1. See role information (name, description)
2. Choose payment method:
   
   Method 1: Sui Wallet
   ├── Enter amount in SUI
   ├── Click "Pay from Sui Wallet"
   ├── Approve transaction
   └── Get transaction digest
   
   Method 2: QR Code
   ├── Scan QR code with mobile wallet
   ├── Enter amount in wallet
   └── Confirm payment

3. Success! Payment recorded on blockchain
4. View live dashboard to see transaction
```

**Result:**
- ✅ Role balance increased
- ✅ Transaction appears in live feed
- ✅ More payments can now be executed

---

### Flow 3: Executing Payments (3 Methods)

#### Method 1: Manual Button Execution ⚡

**Who can execute:** Anyone with a Sui wallet

```
1. Navigate to Role Dashboard: /role/{roleId}/live
2. Check "Scheduled Payments" section
3. Look for payments with status:
   - 🟢 "Ready to Execute" = Can execute NOW
   - 🟡 "Scheduled" = Wait for scheduled time
   - ⚪ "Executed" = Already completed

4. Click "Execute Payments" button (top right)
5. Approve transaction in wallet
6. Wait ~5 seconds for confirmation

Result:
- All ready payments executed simultaneously
- Recipients receive SUI in their wallets
- Status changes to "Executed"
- Live feed updates with payment transactions
```

**Best for:**
- One-time payments
- Manual control
- Testing purposes

---

#### Method 2: Client-Side Auto-Executor 🌐

**Setup:** ZERO! Just connect your wallet.

**How it works:**
```
1. Open the application in your browser
2. Connect your Sui wallet
3. Auto-Executor starts automatically!

Every 30 seconds while browser is open:
1. Scans all roles for ready payments
2. Automatically executes using YOUR wallet when:
   - Current time >= Scheduled time
   - Role is active (between start and expiry)
   - Payment not already executed
   - Sufficient balance in role

3. Shows real-time status in bottom-right widget
4. Logs actions to browser console
```

**Status Widget (Bottom-Right):**
```
┌───────────────────────────┐
│ ⚡ Auto-Executor Active   │
│                           │
│ ⏰ Every 30s              │
│ 🕐 Last: 10:34:21        │
│ ⚡ 3 executed             │
└───────────────────────────┘

When checking:
┌───────────────────────────┐
│ ⚡ Checking payments...   │
│ (pulsing animation)       │
└───────────────────────────┘
```

**Console output:**
```
[Auto-Executor] Started - checking every 30s
[Auto-Executor] Checking 12 roles for ready payments...
[Auto-Executor] Found ready payments in role 0xbac14b2... - Executing!
[Auto-Executor] ✅ Executed payments! TX: 8K9mPqN...
```

**Best for:**
- Automatic execution when you're using the app
- No infrastructure or servers needed
- Fully decentralized automation
- Zero maintenance
- Perfect for personal/team use

**Important:**
- Only runs when browser is open + wallet connected
- When browser closed, system remains permissionless (anyone can execute)
- Hybrid approach: automated when open, manual when closed

---

#### Method 3: Recipient/Third Party Execution 💰

**Who can execute:** Anyone with a Sui wallet (permissionless)

```
Anyone can:
1. Navigate to role dashboard
2. See pending payments (including yours if you're a recipient)
3. Click "Execute Payments" button
4. Pay only gas fees (~0.001 SUI)
5. All ready payments execute and reach recipients

Note: When any payment in a role is executed, ALL ready payments execute together.
```

**Best for:**
- Recipients who want immediate access
- When browser/auto-executor is closed
- True decentralization - no single point of failure
- Community-driven execution

---

### Flow 4: Extending Expiry Time ⏰

**Who can extend:** **ANYONE** (Not just creator!)

**Why extend?**
- Role is about to expire
- Want to keep it active longer
- Add more time for future payments

**Process:**
```
1. Go to Role Dashboard: /role/{roleId}/live
2. Scroll to "Extend Expiry Time" section
3. See current expiry date and status:
   - ✅ Active
   - ❌ Expired  
   - ⏳ Not Started

4. Choose new expiry date/time:
   - Must be AFTER current expiry
   - Use datetime picker
   
5. Click "Extend Expiry" button
6. Approve transaction in wallet
7. Wait for confirmation

Result:
- ✅ Expiry time updated on blockchain
- ✅ Role stays active longer
- ✅ Can execute more payments
```

**Example:**
```
Current Expiry: Dec 31, 2026 at 23:59
New Expiry: Jun 30, 2027 at 23:59
Extension: +6 months
```

**Important Notes:**
- Anyone can extend (not just creator)
- Sponsors can extend to protect their investment
- Recipients can extend to ensure they get paid
- Multiple extensions allowed

---

### Flow 5: Monitoring Live Transactions 📊

**Real-time Updates (Every 5 seconds):**

**Dashboard Features:**

1. **Live Stats**
   ```
   ┌─────────────────────────┐
   │ 💰 Total Funded: 250 SUI │
   │ 📤 Total Payments: 150 SUI│
   │ 💵 Current Balance: 100 SUI│
   │ ⏰ Expires: Dec 31, 2026  │
   └─────────────────────────┘
   ```

2. **Scheduled Payments**
   ```
   Shows each payment:
   - Recipient address
   - Amount in SUI
   - Scheduled date/time
   - Status indicator:
     🟢 Ready to Execute
     🟡 Scheduled
     ⚪ Executed
   ```

3. **Live Transaction Feed**
   ```
   Real-time list showing:
   - Type: Funding or Payment
   - From/To addresses
   - Amount
   - Time ago
   - Transaction digest
   - Status: Success/Pending/Failed
   
   Updates automatically every 5 seconds
   Shows newest transactions first
   ```

4. **Action Buttons**
   ```
   - Execute Payments (when ready)
   - Sponsor Now (add more funds)
   - Extend Expiry (increase time)
   ```

---

## 🔄 Complete End-to-End Example

### Scenario: Monthly Marketing Payments

**Cast:**
- Alice (Creator) - Marketing Manager
- Bob (Sponsor) - Company CFO  
- Carol (Recipient) - Freelance Designer
- Dave (Recipient) - Content Writer

---

**Week 1: Setup**

**Day 1 - Alice creates role:**
```
1. Alice connects Sui wallet
2. Creates "Marketing Budget 2026" role
   - Start: Feb 1, 2026
   - Expiry: Dec 31, 2026
3. Adds scheduled payments:
   - Carol: 500 SUI on 1st of each month
   - Dave: 300 SUI on 1st of each month
   - Total: 9,600 SUI (12 months × 800 SUI)
4. Funds with 1,000 SUI initially
5. Role created! ID: 0xabc123...
```

**Day 2 - Bob funds the role:**
```
1. Bob views roles list
2. Finds "Marketing Budget 2026"
3. Goes to sponsor page
4. Adds 8,600 SUI funding
5. Now fully funded: 9,600 SUI total
```

---

**Week 2: First Payment**

**Feb 1, 2026 - Automated execution:**
```
Alice has browser open with wallet connected:
├── 00:00 - First payment ready!
├── 00:00:15 - Auto-executor checks (runs every 30s)
├── 00:00:20 - Detects ready payment
├── 00:00:25 - Auto-executes using Alice's wallet
├── 00:00:30 - Carol receives 500 SUI
├── 00:00:35 - Dave receives 300 SUI
└── 00:00:40 - Live feed updates, status widget shows "1 executed"

Result:
- Remaining balance: 8,800 SUI
- Both recipients paid
- Next payment: March 1
- Gas cost: ~0.001 SUI paid by Alice
```

**Alternative scenarios:**
```
Scenario A - Browser closed:
Carol manually executes:
1. Check dashboard at 00:05
2. See "Ready to Execute"
3. Click "Execute Payments"
4. Everyone gets paid immediately
5. Carol pays gas (~0.001 SUI)

Scenario B - Bob has browser open:
Bob's auto-executor runs:
1. Bob browsing app with wallet connected
2. Auto-executor detects ready payment
3. Executes automatically using Bob's wallet
4. Everyone gets paid
5. Bob pays gas (~0.001 SUI)

Scenario C - No one has browser open:
System remains permissionless:
1. Anyone can visit dashboard
2. Click "Execute Payments"
3. Community-driven execution
```

---

**Week 20: Mid-year Extension**

**Jun 15, 2026 - Bob extends expiry:**
```
1. Bob notices role expires Dec 31
2. Company wants payments through 2027
3. Goes to dashboard
4. Extends expiry to Dec 31, 2027
5. Adds another 9,600 SUI funding
6. Now funded through 2027!
```

---

**Month 12: Final Payment**

**Dec 1, 2026:**
```
- Carol and Dave receive final 2026 payment
- Role still active (extended to 2027)
- Continues for another 12 months
- Total paid in 2026: 9,600 SUI
- Success! All payments on time
```

---

## 🎯 Testing Flow (Single User)

**For developers/testers:**

```
1. Connect ONE Sui wallet
   - Wallet connects to Sui testnet
   - Auto-Executor Status widget appears (bottom-right)

2. Check auto-executor:
   - Widget shows "⚡ Auto-Executor Active"
   - Console shows "[Auto-Executor] Started - checking every 30s"
   - Widget displays "Every 30s" check interval

3. Create role with YOUR address as recipient:
   - Creator: Your address
   - Recipient: Your address (same!)
   - Amount: 0.1 SUI
   - Schedule: 1 minute from now
   - Start time: Now
   - Expiry: 1 day from now

4. Fund role: Pay 0.1 SUI
   - Transaction confirmed
   - Balance shows on dashboard

5. Test auto-execution:
   - Wait 1 minute for payment to become ready
   - Keep browser open + wallet connected
   - Watch status widget:
     * Every 30s shows "Checking payments..." with pulse
     * Console logs: "[Auto-Executor] Checking N roles..."
   - When ready, auto-executor detects and executes
   - Console shows: "[Auto-Executor] ✅ Executed payments! TX: ..."
   - Widget updates: "⚡ 1 executed"

6. Alternative - Test manual execution:
   - Create another role (1 minute schedule)
   - Disconnect wallet (stops auto-executor)
   - Wait for payment to be ready
   - Reconnect wallet
   - Click "Execute Payments" button manually
   - Payment executes immediately

7. Check wallet: You received 0.1 SUI back!

8. Test extending:
   - Set new expiry
   - Submit transaction
   - Verify on dashboard

8. Monitor live feed:
   - See funding transaction
   - See payment transaction
   - Check timestamps
   - Verify amounts
```

---

## 🔧 Technical Components

### Frontend Pages:
1. **Home** (`/`) - Landing page with features
2. **Create Role** (`/create`) - Form to create new roles
3. **Roles List** (`/roles`) - Browse all roles
4. **Scheduled Payments** (`/scheduled`) - View all upcoming payments
5. **Completed Payments** (`/completed`) - Payment history
6. **Role Dashboard** (`/role/:id`) - Static role details
7. **Live Dashboard** (`/role/:id/live`) - Real-time monitoring
8. **Sponsor Payment** (`/sponsor/:id`) - Funding interface
9. **User Profile** (`/profile`) - User stats and activity

### Key Features:
- ✅ Wallet connection (Sui + Ethereum + Solana)
- ✅ Multi-chain support (Arc, Sui, Solana)
- ✅ Real-time updates (5-second polling)
- ✅ Client-side auto-executor (30-second checks)
- ✅ AutoExecutorStatus widget (live feedback)
- ✅ QR code generation
- ✅ Live transaction feed
- ✅ Scheduled payments with status
- ✅ Payment execution (3 methods: manual, auto, permissionless)
- ✅ Expiry extension (anyone can extend)
- ✅ Permissionless execution architecture
- ✅ ENS integration
- ✅ Dark mode DeFi UI
- ✅ Glass morphism design
- ✅ Responsive design
- ✅ Error handling

### New Components:
- `useAutoPaymentExecutor` - React hook for browser-based automation
- `AutoExecutorStatus` - Visual widget showing executor status
- `ScheduledPayments` - Dedicated page for upcoming payments
- `CompletedPayments` - Payment history with CSV export

### Smart Contract Functions:
```move
1. create_role() - Create new role
2. fund_role() - Add funds to role
3. execute_payments() - Execute ready payments
4. extend_expiry() - Extend expiry time
5. claim_payment() - Recipient claims funds
```

---

## ✅ Verification Checklist

**After setup, verify:**

- [ ] Wallet connects successfully (Sui testnet)
- [ ] AutoExecutorStatus widget appears (bottom-right)
- [ ] Console shows "[Auto-Executor] Started - checking every 30s"
- [ ] Can create role
- [ ] Role appears in list
- [ ] Can fund role
- [ ] Funding shows in live feed
- [ ] Scheduled payments visible on /scheduled page
- [ ] Payment status updates correctly (upcoming/ready/overdue)
- [ ] Can execute payments manually via button
- [ ] Auto-executor checks every 30 seconds (watch widget pulse)
- [ ] Auto-executor executes ready payments automatically
- [ ] Widget shows execution count after auto-execution
- [ ] Live feed updates every 5 seconds
- [ ] Can extend expiry (any user)
- [ ] Extension updates on blockchain
- [ ] Balance calculations correct
- [ ] Dates display properly (not 1970 or 58074)
- [ ] No console errors
- [ ] Status widget shows "Checking payments..." when scanning
- [ ] Console logs "[Auto-Executor] Checking N roles..." every 30s
- [ ] Permissionless execution works (can execute from any wallet)

---

## 🚨 Common Issues & Solutions

### Issue: Dates showing "Jan 1, 1970"
**Solution:** Data parsing fixed - should show correct dates

### Issue: Amounts showing "NaN SUI"
**Solution:** Fixed to access p.fields.amount correctly

### Issue: Live transactions not showing
**Solution:** Enhanced event matching and timestamp parsing

### Issue: Can't extend expiry
**Solution:** Now available to EVERYONE, not just creator

### Issue: Payments not executing
**Solution:** Check:
1. Current time >= Scheduled time
2. Role is active (not expired)
3. Sufficient balance
4. Wallet connected

### Issue: Auto-executor not running
**Solution:** Check:
1. Wallet connected to Sui network
2. Browser tab is active (not in background)
3. Check browser console for "[Auto-Executor] Started" message
4. Status widget should appear in bottom-right
5. Sufficient gas in your wallet for execution

---

## 📚 Additional Documentation

- [COMPLETE-README.md](./COMPLETE-README.md) - Full project documentation
- [QUICKSTART.md](./QUICKSTART.md) - Quick setup guide
- [BOT-README.md](./BOT-README.md) - Bot configuration
- [CHANGES.md](./CHANGES.md) - Change log

---

## 🎉 Success Metrics

**You'll know it's working when:**

1. ✅ Roles create successfully
2. ✅ Payments execute on schedule
3. ✅ Live feed updates in real-time
4. ✅ Anyone can extend expiry
5. ✅ Auto-executor runs when wallet connected
6. ✅ Status widget shows activity
7. ✅ Recipients receive funds correctly
8. ✅ Balances calculate accurately
9. ✅ Permissionless execution works
10. ✅ No console errors

---

## 🤝 Support

If you encounter issues:
1. Check browser console for errors
2. Verify wallet connection (Sui network)
3. Ensure sufficient gas in your wallet
4. Check blockchain confirmations
5. Look for AutoExecutorStatus widget (bottom-right)
6. Verify "[Auto-Executor] Started" message in console

---

**Last Updated:** February 7, 2026
**Version:** 3.0 - Client-Side Auto-Executor
**Status:** ✅ All Features Working
**Architecture:** Hybrid (Browser-Based Automation + Permissionless Execution)
