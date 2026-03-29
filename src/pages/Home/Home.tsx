import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Globe, 
  CheckCircle, 
  Terminal, 
  Search,
  Activity,
  Smartphone,
  Fingerprint,
  Layers,
  Award,
  Lock,
  Coins
} from 'lucide-react';
import { motion } from 'framer-motion';
import './Home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/roles?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="home-page">
      <div className="ens-bg" />
      
      {/* Hero Section */}
      <section className="hero-section section-padding">
        <div className="container hero-container">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <div className="badge flex-center">
              <span className="status-dot status-active" />
              <span>Trustless Auto-Payment Platform</span>
            </div>
            <h1>
              Fund once, <br />
              <span className="gradient-text">Pay automatically.</span>
            </h1>
            <p className="hero-description text-secondary">
              A multi-chain payment automation system where clients fund payment roles on-chain, 
              and payments execute automatically at scheduled times. Full transparency, zero custody risk.
            </p>

            <div className="hero-actions">
              <button onClick={() => navigate('/create')} className="btn btn-primary">
                Get Started <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate('/roles')} className="btn btn-secondary">
                Explore Roles <Globe size={18} />
              </button>
            </div>

            <div className="hero-search-wrapper card">
              <Search className="search-icon" size={20} />
              <form onSubmit={handleSearch}>
                <input
                  type="text"
                  placeholder="Search by role ID or recipient address..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="search-btn">Search</button>
              </form>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="hero-visual"
          >
            <div className="visual-card card card-luxe">
              <div className="visual-header flex-between">
                <span className="mono text-muted">Role: Marketing_Payroll</span>
                <span className="status-badge active">Funded</span>
              </div>
              <div className="visual-body">
                <div className="visual-row flex-between">
                  <span>Balance</span>
                  <span className="visual-value">1,000 USDC</span>
                </div>
                <div className="visual-row flex-between">
                  <span>Next Payment</span>
                  <span className="visual-value">Apr 01, 2026</span>
                </div>
                <div className="visual-progress">
                  <div className="progress-bar" style={{ width: '75%' }} />
                </div>
              </div>
              <div className="visual-footer">
                <div className="recipient-list">
                  <div className="recipient flex-between">
                    <span className="mono">alice.eth</span>
                    <span className="text-secondary">100 USDC</span>
                  </div>
                  <div className="recipient flex-between">
                    <span className="mono">bob.sui</span>
                    <span className="text-secondary">50 SUI</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="tech-section section-padding">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="gradient-text">Three Technologies, One System</h2>
            <p className="text-secondary max-600">
              Rolezero integrates the best of Web3 to deliver a seamless and secure payment experience.
            </p>
          </div>

          <div className="tech-grid grid-3">
            <motion.div variants={itemVariants} className="tech-card card">
              <div className="tech-icon flex-center sui">
                <Shield size={32} />
              </div>
              <h3>Sui Blockchain</h3>
              <p className="text-secondary">
                Move-powered security for high-performance DeFi payments. 
                Full on-chain transparency with sub-second finality.
              </p>
              <ul className="tech-list">
                <li><CheckCircle size={16} /> Move Smart Contracts</li>
                <li><CheckCircle size={16} /> Permissionless Execution</li>
                <li><CheckCircle size={16} /> Low Gas Fees</li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="tech-card card">
              <div className="tech-icon flex-center arc">
                <Coins size={32} />
              </div>
              <h3>Arc Blockchain</h3>
              <p className="text-secondary">
                Institutional-ready payments using native USDC. 
                The familiar EVM experience for real business payroll.
              </p>
              <ul className="tech-list">
                <li><CheckCircle size={16} /> Native Stablecoins</li>
                <li><CheckCircle size={16} /> EVM Compatible</li>
                <li><CheckCircle size={16} /> Business Focused</li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants} className="tech-card card">
              <div className="tech-icon flex-center ens">
                <Globe size={32} />
              </div>
              <h3>ENS Integration</h3>
              <p className="text-secondary">
                Human-readable payments. Automatically load recipient 
                preferences like preferred token and minimum amount.
              </p>
              <ul className="tech-list">
                <li><CheckCircle size={16} /> Resolve alice.eth</li>
                <li><CheckCircle size={16} /> Payment Profiles</li>
                <li><CheckCircle size={16} /> Decentralized Data</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="workflow-section section-padding">
        <div className="container">
          <div className="grid-2 align-center">
            <div className="workflow-visual">
              <div className="workflow-steps">
                <div className="step-item card active">
                  <span className="step-num">01</span>
                  <div className="step-info">
                    <h4>Create Role</h4>
                    <p>Select chain and define payment rules.</p>
                  </div>
                </div>
                <div className="step-item card">
                  <span className="step-num">02</span>
                  <div className="step-info">
                    <h4>Fund Contract</h4>
                    <p>Deposit SUI or USDC on-chain.</p>
                  </div>
                </div>
                <div className="step-item card">
                  <span className="step-num">03</span>
                  <div className="step-info">
                    <h4>Auto-Execute</h4>
                    <p>Payments deliver exactly on time.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="workflow-content">
              <h2>How it Works</h2>
              <p className="text-secondary">
                Rolezero removes the friction and trust required in traditional payroll systems. 
                By locking funds in smart contracts, employees have absolute certainty of payment.
              </p>
              <div className="feature-rows">
                <div className="feature-row">
                  <div className="icon-box sui"><Zap size={20} /></div>
                  <div>
                    <h5>Permissionless Execution</h5>
                    <p className="text-muted">Anyone can trigger a ready payment, ensuring zero downtime.</p>
                  </div>
                </div>
                <div className="feature-row">
                  <div className="icon-box arc"><Lock size={20} /></div>
                  <div>
                    <h5>Non-Custodial</h5>
                    <p className="text-muted">We never hold your funds. They stay in the chain's protocol.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section-padding">
        <div className="container">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="cta-card card card-luxe text-center"
          >
            <h3>Ready to Automate Your Payments?</h3>
            <p className="text-secondary max-600 center">
              Join the future of trustless business operations globally. 
              Start building your first payment role today.
            </p>
            <div className="flex-center gap-16">
              <button onClick={() => navigate('/create')} className="btn btn-primary">
                Create First Role
              </button>
              <button onClick={() => navigate('/roles')} className="btn btn-secondary">
                View Live Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="footer-main">
        <div className="container">
          <div className="footer-top flex-between">
            <div className="logo-group">
              <Zap size={24} className="text-primary" />
              <span className="brand-name">Rolezero</span>
            </div>
            <div className="footer-links flex-center gap-24">
              <a href="#" className="text-muted">Documentation</a>
              <a href="#" className="text-muted">Security</a>
              <a href="#" className="text-muted">Github</a>
            </div>
          </div>
          <div className="footer-bottom text-center">
            <p className="text-dim">© 2026 Rolezero Autonomous Distribution Engine. Built for HackMoney 2026.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

