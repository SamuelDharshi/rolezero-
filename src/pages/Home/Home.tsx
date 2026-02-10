import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Shield, Zap, Coins } from 'lucide-react';
import { AnimatedBackground } from '@/components/AnimatedBackground/AnimatedBackground';
import './Home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to roles page with search query
      navigate(`/roles?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="home-page">
      <AnimatedBackground />
      <div className="container">
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              Trustless Auto-Payment System
            </h1>
            <p className="hero-description">
              <strong>Fund once, pay automatically.</strong> Clients fund payment roles on-chain, payments execute automatically at scheduled times. 
              Full transparency - funds are visible on blockchain, no central custody.
            </p>
            
            {/* Value Proposition Pills */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', margin: '2rem 0' }}>
              <div style={{ 
                padding: '8px 20px', 
                background: 'rgba(34, 197, 94, 0.1)', 
                border: '1px solid rgba(34, 197, 94, 0.3)',
                borderRadius: '100px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#22c55e',
              }}>
                ✓ Client Funds On-Chain
              </div>
              <div style={{ 
                padding: '8px 20px', 
                background: 'rgba(59, 130, 246, 0.1)', 
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '100px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#3b82f6',
              }}>
                ✓ Auto-Execute Payments
              </div>
              <div style={{ 
                padding: '8px 20px', 
                background: 'rgba(168, 85, 247, 0.1)', 
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '100px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#a855f7',
              }}>
                ✓ 100% Transparent
              </div>
            </div>
            
            {/* ENS-Style Search Bar */}
            <form onSubmit={handleSearch} className="search-wrapper">
              <input
                type="text"
                className="search-input-hero"
                placeholder="Search for a role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Tech Stack Banner */}
            <div className="info-banner">
              🎉 Powered by <strong>Sui</strong> (Move Smart Contracts) • <strong>Arc</strong> (USDC Payments) • <strong>ENS</strong> (Human-Readable)
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
              <button
                onClick={() => navigate('/create')}
                className="btn btn-primary"
              >
                <span className="flex items-center gap-2">
                  Create Role <ArrowRight size={18} />
                </span>
              </button>
              
              <button
                onClick={() => navigate('/roles')}
                className="btn btn-secondary"
              >
                View All Roles
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="features">
          <div className="feature">
            <div className="feature-check"><Shield size={20} /></div>
            <h3>Sui: Smart Contract Trust</h3>
            <p>
              Move language smart contracts hold funds securely. Clients can see their balance on-chain. No custody risk.
            </p>
          </div>

          <div className="feature">
            <div className="feature-check"><Coins size={20} /></div>
            <h3>Arc: Real USDC Payments</h3>
            <p>
              Deploy on Arc blockchain for native USDC payments. Perfect for payroll, contractors, and business payments.
            </p>
          </div>

          <div className="feature">
            <div className="feature-check"><Check size={20} /></div>
            <h3>ENS: Human-Readable</h3>
            <p>
              Pay alice.eth instead of 0x742d35Cc... Recipients set payment preferences (USDC, min amount) in their ENS profile.
            </p>
          </div>

          <div className="feature">
            <div className="feature-check"><Zap size={20} /></div>
            <h3>Auto-Execute: Click Approve</h3>
            <p>
              Anyone can execute ready payments. Just click "Execute" button when payment time arrives. Fully permissionless.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div style={{
          marginTop: '6rem',
          padding: '4rem 3rem',
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(16, 185, 129, 0.1))',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(34, 197, 94, 0.3)',
          borderRadius: '32px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            background: 'linear-gradient(135deg, #22c55e 0%, #10b981 100%)',
            color: 'white',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '1.5rem',
          }}>
            <Shield size={16} />
            <span>How Trustful Auto-Payments Work</span>
          </div>

          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            marginBottom: '1rem',
          }}>
            Client Funds → Smart Contract Holds → Auto-Execute
          </h2>
          
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
            maxWidth: '700px',
            margin: '0 auto 2.5rem',
            lineHeight: '1.7',
          }}>
            Clients fund a payment role once. Funds are held in blockchain smart contract (visible on-chain). 
            When payment time arrives, anyone clicks "Execute" and recipient gets paid automatically.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginTop: '3rem',
            textAlign: 'left',
          }}>
            <div style={{
              padding: '2rem',
              background: 'white',
              borderRadius: '16px',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '1rem',
              }}>1️⃣</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                marginBottom: '0.5rem',
                color: '#22c55e',
              }}>Client Funds Role</h3>
              <p style={{
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: '1.6',
              }}>
                Create a payment role on Sui or Arc. Fund it with SUI or USDC. Funds are locked in smart contract - client can see balance anytime.
              </p>
            </div>

            <div style={{
              padding: '2rem',
              background: 'white',
              borderRadius: '16px',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '1rem',
              }}>2️⃣</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                marginBottom: '0.5rem',
                color: '#3b82f6',
              }}>Schedule Payments</h3>
              <p style={{
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: '1.6',
              }}>
                Add recipients using ENS names (alice.eth). Set amounts, schedules (weekly/monthly). Their ENS preferences auto-fill (preferred token, min amount).
              </p>
            </div>

            <div style={{
              padding: '2rem',
              background: 'white',
              borderRadius: '16px',
              border: '1px solid rgba(34, 197, 94, 0.2)',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '1rem',
              }}>3️⃣</div>
              <h3 style={{
                fontSize: '1.25rem',
                fontWeight: '700',
                marginBottom: '0.5rem',
                color: '#a855f7',
              }}>Click Execute = Paid</h3>
              <p style={{
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                margin: 0,
                lineHeight: '1.6',
              }}>
                When payment time arrives, anyone can execute it. Just click "Execute" button. Smart contract automatically sends funds to recipient.
              </p>
            </div>
          </div>
        </div>

        {/* ENS Integration Highlight */}
        <div style={{
          marginTop: '6rem',
          padding: '4rem 3rem',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(102, 126, 234, 0.3)',
          borderRadius: '32px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 20px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '1.5rem',
          }}>
            <Zap size={16} />
            <span>ENS Payment Preferences</span>
          </div>

          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: 'var(--text-primary)',
            marginBottom: '1rem',
          }}>
            Pay <span style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>alice.eth</span> with Her Preferred Settings
          </h2>
          
          <p style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
            maxWidth: '700px',
            margin: '0 auto 2.5rem',
            lineHeight: '1.7',
          }}>
            Recipients store payment preferences in their ENS profile. When you create a payment to alice.eth, 
            the app automatically loads: preferred token (USDC/SUI), minimum amount, timezone.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginTop: '3rem',
            textAlign: 'left',
          }}>
            <div style={{
              padding: '1.5rem',
              background: 'white',
              borderRadius: '16px',
              border: '1px solid rgba(102, 126, 234, 0.2)',
            }}>
              <div style={{
                fontSize: '2rem',
                marginBottom: '0.75rem',
              }}>👤</div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                marginBottom: '0.5rem',
              }}>No More Addresses</h3>
              <p style={{
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                margin: 0,
              }}>
                Type alice.eth instead of copying 0x742d35Cc6634C0532925a3b8...
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              background: 'white',
              borderRadius: '16px',
              border: '1px solid rgba(102, 126, 234, 0.2)',
            }}>
              <div style={{
                fontSize: '2rem',
                marginBottom: '0.75rem',
              }}>⚙️</div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                marginBottom: '0.5rem',
              }}>Auto-Fill Preferences</h3>
              <p style={{
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                margin: 0,
              }}>
                Recipient's preferred token (USDC/SUI) and minimum amount load automatically
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              background: 'white',
              borderRadius: '16px',
              border: '1px solid rgba(102, 126, 234, 0.2)',
            }}>
              <div style={{
                fontSize: '2rem',
                marginBottom: '0.75rem',
              }}>✅</div>
              <h3 style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                marginBottom: '0.5rem',
              }}>One-Click Apply</h3>
              <p style={{
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                margin: 0,
              }}>
                Click "Apply ENS Preferences" and all fields auto-populate with recipient's settings
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/ens')}
            className="btn btn-primary"
            style={{ marginTop: '2rem' }}
          >
            <span className="flex items-center gap-2">
              Try ENS Demo <ArrowRight size={18} />
            </span>
          </button>
        </div>

        {/* Transparency Section - Redesigned with ENS Colors */}
        <div style={{
          marginTop: '6rem',
          padding: '3rem 2.5rem',
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(56, 136, 255, 0.2)',
          borderRadius: '32px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-lg)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}>
            <Shield size={48} style={{ color: 'var(--ens-primary)' }} />
            <h2 style={{
              fontSize: '2.25rem',
              fontWeight: '800',
              color: 'var(--text-primary)',
              margin: 0,
            }}>
              Complete Transparency
            </h2>
          </div>
          
          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: '2rem',
            maxWidth: '800px',
            margin: '0 auto 3rem',
            lineHeight: '1.8',
          }}>
            Every transaction is permanently recorded on the Sui blockchain. From developer fees to payment executions,
            nothing is hidden or deleted. Full audit trail for complete trust.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginTop: '2rem',
          }}>
            <div style={{
              padding: '2rem',
              background: 'var(--bg-secondary)',
              borderRadius: '24px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: '900',
                background: 'linear-gradient(135deg, var(--ens-primary), var(--ens-primary-light))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.75rem',
              }}>1%</div>
              <div style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '0.75rem',
              }}>Developer Fee</div>
              <div style={{
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
              }}>
                Transparent 1% fee (0.01 SUI) per role. Visible in every transaction.
              </div>
            </div>

            <div style={{
              padding: '2rem',
              background: 'var(--bg-secondary)',
              borderRadius: '24px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: '900',
                background: 'linear-gradient(135deg, var(--ens-primary), var(--ens-primary-light))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.75rem',
              }}>100%</div>
              <div style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '0.75rem',
              }}>Transaction History</div>
              <div style={{
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
              }}>
                All funding and payments permanently stored. Nothing deleted.
              </div>
            </div>

            <div style={{
              padding: '2rem',
              background: 'var(--bg-secondary)',
              borderRadius: '24px',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              <div style={{
                fontSize: '3rem',
                fontWeight: '900',
                color: 'var(--ens-primary)',
                marginBottom: '0.75rem',
              }}>
                <Shield size={48} />
              </div>
              <div style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '0.75rem',
              }}>Blockchain Verified</div>
              <div style={{
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
              }}>
                Every transaction verifiable on Sui Explorer. Immutable proof.
              </div>
            </div>
          </div>

          <div style={{
            marginTop: '3rem',
            padding: '1.5rem 2rem',
            background: 'linear-gradient(135deg, rgba(56, 136, 255, 0.05), rgba(56, 136, 255, 0.02))',
            border: '2px solid rgba(56, 136, 255, 0.15)',
            borderRadius: '20px',
          }}>
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: '1.7',
            }}>
              <Shield size={18} style={{ verticalAlign: 'middle', marginRight: '0.75rem', color: 'var(--ens-primary)' }} />
              <strong style={{ color: 'var(--text-primary)' }}>Trust Through Transparency:</strong> Every role tracks who funded it, 
              who received payments, and where leftover funds went. The developer fee is clearly shown in the transaction history. 
              All data is stored on-chain and can be independently verified. We don't hide anything.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
