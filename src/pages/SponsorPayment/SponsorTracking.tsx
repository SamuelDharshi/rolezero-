import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  TrendingUp, 
  Activity, 
  Shield, 
  ExternalLink,
  Search,
  ArrowRight,
  Hexagon,
  Globe,
  Database,
  Cpu,
  Zap,
  Layout,
  Layers,
  Award,
  Navigation,
  ArrowUpRight,
  Clock,
  Fingerprint,
  Smartphone,
  CheckCircle2,
  Grid,
  ShieldCheck,
  Timer,
  Hash
} from 'lucide-react';
import { shortenAddress } from '@/utils/ens';
import './SponsorPayment.css';

interface SponsorData {
  address: string;
  totalSponsored: number;
  rolesSponsored: number;
  lastSponsorTime: number;
}

export const SponsorTracking: React.FC = () => {
  const { data: sponsors = [], isLoading } = useQuery({
    queryKey: ['sponsors'],
    queryFn: async (): Promise<SponsorData[]> => {
      try {
        const stored = localStorage.getItem('sponsors');
        if (!stored) return [];
        return JSON.parse(stored);
      } catch {
        return [];
      }
    },
    refetchInterval: 30000,
  });

  const totalMagnitude = sponsors.reduce((acc, s) => acc + s.totalSponsored, 0);
  const totalRoles = sponsors.reduce((acc, s) => acc + s.rolesSponsored, 0);

  return (
    <div className="sponsor-payment-page">
      <div className="ens-bg" />
      
      <div className="container" style={{ maxWidth: '1800px', paddingTop: '150px' }}>
        <motion.div 
          initial={{ opacity: 0, y: -100 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ ease: [0.16, 1, 0.3, 1], duration: 1.4 }} 
          className="tracking-hero-manifold"
          style={{ textAlign: 'center', marginBottom: '22rem' }}
        >
          <div className="hero-badge card card-glow" style={{ marginBottom: '8rem', fontSize: '1.25rem', letterSpacing: '0.8rem', padding: '1.5rem 6rem', width: 'fit-content', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--sui-blue)', border: '2px solid rgba(6, 182, 212, 0.4)', fontWeight: 950, borderRadius: '25px', boxShadow: '0 0 80px rgba(6, 182, 212, 0.3)', margin: '0 auto 10rem' }}>
            <div className="pulse" style={{ width: '18px', height: '18px', background: 'var(--sui-blue)', borderRadius: '50%', boxShadow: '0 0 25px var(--sui-blue)', marginRight: '4rem' }} />
            NEURAL_REGISTRY_v9.4_SECURE
          </div>
          <h1 className="cyber-glitch-text" style={{ fontSize: '15rem', fontWeight: 950, letterSpacing: '-0.0625em', margin: 0, lineHeight: 0.8 }}>NETWORK_NODES</h1>
          <p className="manifold-subtitle" style={{ fontSize: '4rem', color: 'var(--text-dim)', maxWidth: '1400px', margin: '10rem auto 0', lineHeight: 1.6, fontWeight: 500, opacity: 0.6 }}>
            Global registry of high-impact liquidity nodes sustaining the decentralized neural distribution architecture across the global manifold layers.
          </p>
        </motion.div>

        <div className="tracking-telemetry-grid-manifold" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15rem', marginBottom: '35rem' }}>
          {[
            { icon: Users, color: 'var(--sui-blue)', label: 'ACTIVE_NODES', value: sponsors.length, units: 'NODES' },
            { icon: TrendingUp, color: 'var(--success)', label: 'AGGREGATE_MAGNITUDE', value: totalMagnitude.toFixed(2), units: 'SUI' },
            { icon: Layers, color: '#8b5cf6', label: 'PROTOCOLS_SUSTAINED', value: totalRoles, units: 'ROLES' }
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.95, y: 100 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              whileHover={{ y: -40, scale: 1.03, borderColor: stat.color, background: 'rgba(255,255,255,0.06)', boxShadow: '0 80px 160px rgba(0,0,0,0.7)' }}
              transition={{ delay: idx * 0.1, ease: [0.16, 1, 0.3, 1], duration: 1 }}
              className="telemetry-unit-card card card-glow" 
              style={{ padding: '12rem 10rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '100px', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)', textAlign: 'center' }}
            >
              <div className="telemetry-icon-cell card card-glow" style={{ color: stat.color, background: 'var(--bg-main)', width: '220px', height: '220px', borderRadius: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10rem', border: '1px solid var(--border-light)', boxShadow: 'inset 0 0 60px rgba(0,0,0,0.7)' }}>
                <stat.icon size={130} strokeWidth={1} />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 950, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.8rem', marginBottom: '6rem', opacity: 0.4 }}>{stat.label}</div>
              <div className="tele-value cyber-glitch-text" style={{ fontSize: '13rem', fontWeight: 950, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div style={{ fontSize: '2rem', color: 'var(--text-dim)', fontWeight: 950, marginTop: '5rem', letterSpacing: '0.4rem', opacity: 0.3, textTransform: 'uppercase' }}>{stat.units}_STABLE_SYNC</div>
            </motion.div>
          ))}
        </div>

        <div className="registry-manifest-manifold">
          <div className="manifest-header-row" style={{ display: 'flex', alignItems: 'center', gap: '10rem', marginBottom: '220px', borderBottom: '1px dashed var(--border-light)', paddingBottom: '15rem' }}>
            <div className="card card-glow" style={{ padding: '5rem', color: 'var(--sui-blue)', background: 'var(--bg-main)', borderRadius: '50px', border: '1px solid var(--border-light)', boxShadow: '0 0 80px rgba(6, 182, 212, 0.25)' }}>
              <Database size={120} strokeWidth={1} />
            </div>
            <h2 className="cyber-glitch-text" style={{ fontSize: '11rem', fontWeight: 950, letterSpacing: '-0.025em', margin: 0, lineHeight: 1 }}>GLOBAL_NODE_REGISTRY</h2>
            <div className="sync-status-badge card card-glow" style={{ marginLeft: 'auto', fontSize: '2.5rem', fontWeight: 950, color: 'var(--success)', background: 'rgba(34, 197, 94, 0.15)', padding: '2.5rem 8rem', borderRadius: '35px', border: '3px solid rgba(34, 197, 94, 0.5)', letterSpacing: '0.8rem', boxShadow: '0 0 40px rgba(34, 197, 94, 0.2)' }}>
              SYNC_NOMINAL
            </div>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40rem 15rem', background: 'var(--bg-card)', border: '4px dashed var(--border-light)', borderRadius: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12rem' }}>
              <div className="card card-glow" style={{ width: '320px', height: '320px', borderRadius: '100px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--border-light)', boxShadow: '0 0 100px rgba(6, 182, 212, 0.2)' }}>
                 <Activity className="spin" size={200} color="var(--sui-blue)" strokeWidth={1} />
              </div>
              <p style={{ letterSpacing: '2rem', fontWeight: 950, fontSize: '4rem', color: 'var(--sui-blue)', textTransform: 'uppercase', margin: 0, opacity: 0.8 }}>SYNCHRONIZING_GLOBAL_LAYERS...</p>
            </div>
          ) : (
            <div className="manifest-stream-registry" style={{ display: 'flex', flexDirection: 'column', gap: '10rem', marginBottom: '35rem' }}>
              {sponsors.length > 0 ? (
                sponsors.map((sponsor, idx) => (
                  <motion.div 
                    key={sponsor.address}
                    initial={{ opacity: 0, x: -150, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    whileHover={{ x: 40, borderColor: 'var(--sui-blue)', background: 'rgba(6, 182, 212, 0.08)', boxShadow: '0 80px 160px rgba(0,0,0,0.6)' }}
                    transition={{ delay: idx * 0.08, ease: [0.16, 1, 0.3, 1], duration: 1.2 }}
                    className="manifest-item-shard card card-glow"
                    style={{ padding: '12rem 15rem', display: 'grid', gridTemplateColumns: '1fr 600px 600px 500px', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '100px', transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)', position: 'relative', overflow: 'hidden' }}
                  >
                    <div className="shard-visual-decoration" style={{ position: 'absolute', top: 0, left: 0, width: '400px', height: '100%', background: 'linear-gradient(90deg, rgba(6, 182, 212, 0.05), transparent)', pointerEvents: 'none' }} />
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10rem', position: 'relative' }}>
                      <div className="shard-type-visual card card-glow" style={{ width: '220px', height: '220px', background: 'var(--bg-main)', borderRadius: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--sui-blue)', border: '2px solid var(--border-light)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>
                        <Fingerprint size={130} strokeWidth={1.5} />
                      </div>
                      <div>
                        <div className="shard-ident-title font-bold" style={{ fontSize: '5rem', fontWeight: 950, color: 'white', fontFamily: 'JetBrains Mono', letterSpacing: '-0.02em', lineHeight: 1 }}>{shortenAddress(sponsor.address, 18).toUpperCase()}</div>
                        <div style={{ fontSize: '2.25rem', color: 'var(--text-dim)', fontWeight: 950, marginTop: '5rem', display: 'flex', alignItems: 'center', gap: '5rem', opacity: 0.4 }}>
                          <Clock size={40} strokeWidth={2.5} /> <span style={{ letterSpacing: '0.4rem', textTransform: 'uppercase' }}>LAST_ACTION:: {new Date(sponsor.lastSponsorTime).toLocaleDateString().toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'center' }}>
                      <div className="shard-label-node" style={{ fontSize: '2rem', color: 'var(--text-dim)', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.8rem', marginBottom: '5rem', opacity: 0.4 }}>INJECTION_MAGNITUDE</div>
                      <div className="shard-value-node cyber-glitch-text" style={{ fontSize: '8rem', fontWeight: 950, color: 'var(--success)', letterSpacing: '-0.02em', lineHeight: 1 }}>{sponsor.totalSponsored.toFixed(2)} <span style={{ fontSize: '2.5rem', opacity: 0.5, letterSpacing: '0.2rem' }}>SUI</span></div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div className="shard-label-node" style={{ fontSize: '2rem', color: 'var(--text-dim)', fontWeight: 950, textTransform: 'uppercase', letterSpacing: '0.8rem', marginBottom: '5rem', opacity: 0.4 }}>PROTOCOL_IMPACT</div>
                      <div className="shard-value-node cyber-glitch-text" style={{ fontSize: '8rem', fontWeight: 950, color: 'white', letterSpacing: '-0.02em', lineHeight: 1 }}>{sponsor.rolesSponsored} <span style={{ fontSize: '2.5rem', opacity: 0.5, letterSpacing: '0.2rem' }}>ROLES</span></div>
                    </div>

                    <div className="shard-action-cell" style={{ textAlign: 'right' }}>
                      <motion.button 
                        whileHover={{ scale: 1.05, background: 'var(--sui-blue)', borderColor: 'var(--sui-blue)', color: 'white', boxShadow: '0 40px 80px rgba(6, 182, 212, 0.6)' }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-secondary card card-glow" 
                        style={{ padding: '4.5rem 10rem', fontSize: '2.25rem', fontWeight: 950, background: 'transparent', letterSpacing: '0.6rem', borderRadius: '45px', border: '3px solid var(--border-light)', color: 'var(--text-dim)', cursor: 'pointer', transition: 'all 0.5s', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6rem', marginLeft: 'auto', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6)' }}
                      >
                        <Navigation size={56} strokeWidth={2} />
                        <span>INSPECT</span>
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.98, y: 50 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="empty-manifest-view card card-glow" style={{ textAlign: 'center', padding: '35rem 15rem', background: 'var(--bg-card)', border: '4px dashed var(--border-light)', borderRadius: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12rem' }}>
                  <div className="card card-glow" style={{ width: '320px', height: '320px', borderRadius: '100px', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--border-light)', opacity: 0.05, boxShadow: 'inset 0 0 60px rgba(0,0,0,0.8)' }}>
                    <TrendingUp size={220} strokeWidth={0.5} />
                  </div>
                  <div>
                    <h3 className="cyber-glitch-text" style={{ fontSize: '11rem', fontWeight: 950, color: 'var(--text-dim)', letterSpacing: '0.1em', margin: 0, opacity: 0.3 }}>GLOBAL_REGISTRY_VOID</h3>
                    <p className="empty-subtitle" style={{ color: 'var(--text-dim)', fontWeight: 500, fontSize: '4rem', marginTop: '10rem', opacity: 0.4, maxWidth: '1400px', margin: '8rem auto 0', lineHeight: 1.8 }}>The neural network currently reports zero active sponsorship nodes in this sector. Manifesto awaiting protocol initialization.</p>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 150 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          className="manifest-footer-manifold card card-glow"
          style={{ padding: '15rem', background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '120px', display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: '15rem', alignItems: 'center', marginBottom: '35rem', boxShadow: '0 40px 80px rgba(0,0,0,0.4)' }}
        >
          <div className="card card-glow" style={{ padding: '6.5rem', background: 'var(--bg-main)', color: 'var(--sui-blue)', borderRadius: '80px', border: '2px solid var(--border-light)', boxShadow: '0 0 150px rgba(6, 182, 212, 0.2)' }}>
            <ShieldCheck size={220} strokeWidth={1} />
          </div>
          <div>
            <h4 className="cyber-glitch-text" style={{ margin: '0 0 6rem', fontWeight: 950, fontSize: '8rem', letterSpacing: '-0.02em', color: 'white', lineHeight: 1.1 }}>NETWORK_INTEGRITY_REGISTRY</h4>
            <p style={{ margin: 0, fontSize: '4rem', color: 'var(--text-dim)', maxWidth: '1600px', lineHeight: 1.8, fontWeight: 500, opacity: 0.6 }}>
              The global node registry provides high-fidelity telemetry of liquidity distribution across the autonomous protocol layer. 
              All injections are mathematically verified and bounded to the target manifold identity with atomic precision.
            </p>
            <div style={{ marginTop: '10rem', display: 'flex', alignItems: 'center', gap: '6rem', color: 'var(--sui-blue)', fontSize: '2.5rem', fontWeight: 950 }}>
              <Hash size={64} strokeWidth={1.5} />
              <span style={{ letterSpacing: '0.8rem', textTransform: 'uppercase' }}>REGISTRY_RESOLVER: STABLE_NOMINAL_v9.4 // ORBITAL_EPOCH_SYNC_NOMINAL</span>
            </div>
          </div>
        </motion.div>

        <footer style={{ paddingBottom: '45rem', textAlign: 'center', opacity: 0.2, borderTop: '1px dashed var(--border-light)', paddingTop: '35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '30rem', marginBottom: '25rem' }}>
            <Globe size={120} strokeWidth={0.5} />
            <Smartphone size={100} strokeWidth={0.5} />
            <Grid size={100} strokeWidth={0.5} />
            <Shield size={100} strokeWidth={0.5} />
            <Fingerprint size={120} strokeWidth={0.5} />
            <Activity size={100} strokeWidth={0.5} />
            <Database size={120} strokeWidth={0.5} />
            <Layers size={100} strokeWidth={0.5} />
            <Award size={100} strokeWidth={0.5} />
            <Cpu size={150} strokeWidth={0.5} />
            <Clock size={100} strokeWidth={0.5} />
            <Timer size={120} strokeWidth={0.5} />
          </div>
          <div style={{ fontWeight: 950, letterSpacing: '6rem', fontSize: '5rem', textTransform: 'uppercase' }}>NETWORK_MANIFEST_v9.4.0_STABLE_ORBIT_FINAL</div>
        </footer>
      </div>
    </div>
  );
};
