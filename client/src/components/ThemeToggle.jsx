import useThemeStore from '../stores/useThemeStore'

export default function ThemeToggle() {
  const { isLightMode, toggleTheme } = useThemeStore()

  return (
    <button 
      onClick={toggleTheme}
      style={{
        background: 'transparent',
        border: '1px solid var(--border-strong)',
        color: 'var(--text-dim)',
        padding: '6px 12px',
        borderRadius: 'var(--radius-md)',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
      title="Toggle Light/Dark Mode"
    >
      {isLightMode ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}
