import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../stores/useAuthStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const fetchHires = async () => {
  const res = await fetch(`${API_URL}/hires`, { credentials: 'include' });
  if (!res.ok) throw new Error('Failed to fetch hires');
  return res.json();
};

export default function Account() {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const navigate = useNavigate();

  const { data: hires = [], isLoading } = useQuery({
    queryKey: ['hires'],
    queryFn: fetchHires,
    enabled: !!user
  });

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalHired = hires.length;
  const activeSessions = hires.filter(h => h.status === 'paid').length;
  const totalInvested = hires.reduce((sum, h) => sum + (h.amount || 0), 0) / 100;

  const initials = user.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <div style={{ padding: '2rem 1rem', display: 'flex', justifyContent: 'center' }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '600px', 
        backgroundColor: 'var(--bg-panel)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        
        {/* Profile Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent)',
            color: 'var(--bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            fontWeight: 'bold',
            fontFamily: 'var(--mono)',
            overflow: 'hidden',
            flexShrink: 0
          }}>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              initials
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <h1 style={{ margin: 0, fontFamily: 'var(--mono)', fontSize: '1.5rem', color: 'var(--text)' }}>
              {user.name}
            </h1>
            <span style={{ color: 'var(--text-dim)' }}>{user.email}</span>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', alignItems: 'center' }}>
              <span style={{ 
                backgroundColor: 'var(--accent-soft)', 
                color: 'var(--accent)', 
                padding: '0.125rem 0.5rem', 
                borderRadius: 'var(--radius-sm)', 
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase'
              }}>
                {user.role}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-faint)' }}>Member</span>
            </div>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '1rem',
          padding: '1.5rem',
          backgroundColor: 'var(--bg-raised)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-soft)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>Total Agents</span>
            <span style={{ fontSize: '1.25rem', fontFamily: 'var(--mono)', fontWeight: 'bold' }}>{totalHired}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>Active Sessions</span>
            <span style={{ fontSize: '1.25rem', fontFamily: 'var(--mono)', fontWeight: 'bold' }}>{activeSessions}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>Total Invested</span>
            <span style={{ fontSize: '1.25rem', fontFamily: 'var(--mono)', fontWeight: 'bold' }}>₹{totalInvested.toLocaleString()}</span>
          </div>
        </div>

        {/* Quick Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-dim)' }}>Quick Links</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/app/my-agents" style={{ 
              display: 'flex', justifyContent: 'space-between', padding: '1rem', 
              backgroundColor: 'var(--bg-raised)', border: '1px solid var(--border-soft)',
              borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text)',
              transition: 'all 0.2s'
            }}>
              <span>My Agents</span>
              <span style={{ color: 'var(--text-faint)' }}>→</span>
            </Link>
            <Link to="/app/marketplace" style={{ 
              display: 'flex', justifyContent: 'space-between', padding: '1rem', 
              backgroundColor: 'var(--bg-raised)', border: '1px solid var(--border-soft)',
              borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text)',
              transition: 'all 0.2s'
            }}>
              <span>Marketplace</span>
              <span style={{ color: 'var(--text-faint)' }}>→</span>
            </Link>
            <Link to="/app/cli" style={{ 
              display: 'flex', justifyContent: 'space-between', padding: '1rem', 
              backgroundColor: 'var(--bg-raised)', border: '1px solid var(--border-soft)',
              borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text)',
              transition: 'all 0.2s'
            }}>
              <span>CLI Guide</span>
              <span style={{ color: 'var(--text-faint)' }}>→</span>
            </Link>
          </div>
        </div>

        {/* Actions */}
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
          <button 
            className="btn" 
            onClick={handleLogout}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '1px solid var(--border)',
              backgroundColor: 'transparent',
              color: 'var(--text)',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontFamily: 'var(--sans)',
              fontWeight: 500
            }}
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
