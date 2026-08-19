import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { buildCliConnectOneLiner } from '../utils/cliConnect.js'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const MyAgents = () => {
  const [copiedToken, setCopiedToken] = useState(null);

  const { data: hires, isLoading, error } = useQuery({
    queryKey: ['my-hires'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/hires`, {
        credentials: 'include'
      });
      if (!res.ok) throw new Error('Failed to fetch hires');
      return res.json();
    }
  });

  const handleCopy = (token) => {
    const cmd = buildCliConnectOneLiner(token);
    navigator.clipboard.writeText(cmd);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  if (isLoading) {
    return (
      <div style={styles.page}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Agents</h1>
          <p style={styles.subtitle}>Loading your workspace...</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="auth-spinner" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <div className="auth-error">Error: {error.message}</div>
      </div>
    );
  }

  const activeHires = hires?.filter(h => h.status === 'paid') || [];
  const totalSpent = activeHires.reduce((sum, h) => sum + (h.amount / 100), 0);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Agents</h1>
        <p style={styles.subtitle}>Agents you've hired and their session details.</p>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Hires</div>
          <div style={styles.statValue}>{hires?.length || 0}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Active Workspaces</div>
          <div style={styles.statValue}>{activeHires.length}</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statLabel}>Total Spent</div>
          <div style={styles.statValue}>₹{totalSpent.toLocaleString()}</div>
        </div>
      </div>

      {!hires || hires.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🤖</div>
          <h3 style={styles.emptyTitle}>You haven't hired any agents yet</h3>
          <p style={styles.emptyDesc}>Head over to the marketplace to find the perfect AI employee for your team.</p>
          <Link to="/app/marketplace" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div style={styles.listContainer}>
          {hires.map((hire) => {
            const emp = hire.employee;
            if (!emp) return null;
            
            const isPaid = hire.status === 'paid';
            const isFailed = hire.status === 'failed';
            const statusColor = isPaid ? 'var(--green)' : (isFailed ? 'var(--red)' : '#f59e0b');
            const statusBg = isPaid ? 'var(--green-soft)' : (isFailed ? 'var(--red-soft)' : 'rgba(245, 158, 11, 0.1)');
            const statusText = isPaid ? 'Active' : (isFailed ? 'Failed' : 'Pending');

            return (
              <div key={hire._id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.cardMainInfo}>
                    <img
                      src={`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(emp.name)}&backgroundColor=transparent`}
                      alt={emp.name}
                      style={styles.avatar}
                    />
                    <div>
                      <h3 style={styles.empName}>{emp.name}</h3>
                      <div style={styles.empRole}>{emp.roleTitle}</div>
                    </div>
                  </div>
                  <div style={styles.cardMetaInfo}>
                    <div style={{ ...styles.badge, color: statusColor, backgroundColor: statusBg }}>
                      {statusText}
                    </div>
                    <div style={styles.amount}>₹{(hire.amount / 100).toLocaleString()}</div>
                  </div>
                </div>

                <div style={styles.cardBody}>
                  {hire.taskDescription && (
                    <div style={styles.taskDesc}>
                      <span style={{ color: 'var(--text-dim)' }}>Task:</span> {hire.taskDescription}
                    </div>
                  )}
                  
                  <div style={styles.skills}>
                    {emp.skills?.map(skill => (
                      <span key={skill} style={styles.skillTag}>{skill}</span>
                    ))}
                  </div>

                  <div style={styles.date}>
                    Hired on: {new Date(hire.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                </div>

                <div style={styles.cardActions}>
                  <div style={styles.actionLeft}>
                    {isPaid && hire.cliToken && (
                      <div style={styles.cliContainer}>
                        <code style={styles.cliCode}>
                          {hire.cliToken.slice(0, 12)}…{hire.cliToken.slice(-6)} ({hire.cliToken.length} chars)
                        </code>
                        <button
                          onClick={() => handleCopy(hire.cliToken)}
                          style={styles.copyBtn}
                          title="Copy connect command"
                        >
                          {copiedToken === hire.cliToken
                            ? 'Copied!'
                            : (hire.cliTokenUsed ? 'Copy Reconnect' : 'Copy CLI')}
                        </button>
                      </div>
                    )}
                  </div>
                  <div style={styles.actionRight}>
                    <Link to={`/app/employees/${emp._id}`} style={styles.link}>
                      View Agent Profile
                    </Link>
                    {isPaid && (
                      <Link to={`/app/workspace/${hire._id}`} className="btn btn-primary" style={styles.workspaceBtn}>
                        Open Workspace →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    padding: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: 'var(--sans)',
    color: 'var(--text)',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    fontWeight: '700',
    margin: '0 0 0.5rem 0',
  },
  subtitle: {
    color: 'var(--text-dim)',
    margin: 0,
    fontSize: '1.1rem',
  },
  statsRow: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '2.5rem',
    flexWrap: 'wrap',
  },
  statCard: {
    flex: '1 1 200px',
    background: 'var(--bg-panel)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '1.5rem',
  },
  statLabel: {
    color: 'var(--text-dim)',
    fontSize: '0.875rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '0.5rem',
  },
  statValue: {
    fontSize: '1.75rem',
    fontWeight: '600',
    fontFamily: 'var(--mono)',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  card: {
    background: 'var(--bg-panel)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'border-color 0.2s ease, transform 0.2s ease',
  },
  cardHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid var(--border-soft)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '1rem',
  },
  cardMainInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  avatar: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'var(--bg-raised)',
    border: '1px solid var(--border)',
  },
  empName: {
    margin: '0 0 0.25rem 0',
    fontSize: '1.25rem',
    fontWeight: '600',
  },
  empRole: {
    color: 'var(--text-dim)',
    fontSize: '0.9rem',
  },
  cardMetaInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '0.5rem',
  },
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  amount: {
    fontFamily: 'var(--mono)',
    fontWeight: '500',
    fontSize: '1.1rem',
  },
  cardBody: {
    padding: '1.5rem',
  },
  taskDesc: {
    marginBottom: '1rem',
    lineHeight: '1.5',
  },
  skills: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  skillTag: {
    background: 'var(--bg-raised)',
    border: '1px solid var(--border-soft)',
    padding: '0.25rem 0.75rem',
    borderRadius: 'var(--radius-sm)',
    fontSize: '0.75rem',
    color: 'var(--text-dim)',
  },
  date: {
    fontSize: '0.85rem',
    color: 'var(--text-faint)',
  },
  cardActions: {
    padding: '1rem 1.5rem',
    background: 'var(--bg-raised)',
    borderTop: '1px solid var(--border-soft)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  actionLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  cliConnected: {
    color: 'var(--green)',
    fontSize: '0.875rem',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  cliContainer: {
    display: 'flex',
    alignItems: 'center',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    overflow: 'hidden',
  },
  cliCode: {
    fontFamily: 'var(--mono)',
    fontSize: '0.75rem',
    padding: '0.5rem 0.75rem',
    color: 'var(--text-dim)',
    borderRight: '1px solid var(--border)',
  },
  copyBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--accent)',
    padding: '0.5rem 0.75rem',
    fontSize: '0.75rem',
    cursor: 'pointer',
    fontWeight: '500',
  },
  actionRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  link: {
    color: 'var(--accent)',
    textDecoration: 'none',
    fontSize: '0.875rem',
    fontWeight: '500',
  },
  workspaceBtn: {
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'var(--bg-panel)',
    border: '1px dashed var(--border-strong)',
    borderRadius: 'var(--radius-lg)',
  },
  emptyIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  emptyTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.25rem',
  },
  emptyDesc: {
    color: 'var(--text-dim)',
    margin: '0 0 1.5rem 0',
  },
};

export default MyAgents;
