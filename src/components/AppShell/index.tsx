import { Outlet, NavLink, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import styles from './styles.module.scss'
import { useTheme } from '@/hooks/useTheme'

type AppShellProps = {
  showSavedBadge?: boolean
}

export function AppShell({ showSavedBadge = false }: AppShellProps) {
  const { theme, toggle } = useTheme()
  const [savedVisible, setSavedVisible] = useState(false)

  useEffect(() => {
    if (!showSavedBadge) return
    setSavedVisible(true)
    const t = setTimeout(() => setSavedVisible(false), 1600)
    return () => clearTimeout(t)
  }, [showSavedBadge])

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand} aria-label="Maná Pizzas & Eventos — início">
          <img src="/logo-mana.png" alt="" width={66} height={44} />
          <div>
            <div className={styles.brandName}>Maná Pizzas</div>
            <div className={styles.brandTagline}>Rodízio em casa</div>
          </div>
        </Link>

        <div className={styles.center} aria-live="polite">
          <span
            className={`${styles.savedBadge} ${savedVisible ? styles.savedBadgeVisible : ''}`}
          >
            <span className={styles.savedDot} aria-hidden="true" />
            Salvo
          </span>
        </div>

        <div className={styles.actions}>
          <nav className={styles.nav} aria-label="Navegação principal">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
              }
            >
              Editor
            </NavLink>
            <NavLink
              to="/preview"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
              }
            >
              Preview
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
              }
            >
              Histórico
            </NavLink>
          </nav>
          <button
            type="button"
            onClick={toggle}
            className={styles.navLink}
            aria-label={`Trocar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
        </div>
      </header>

      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
