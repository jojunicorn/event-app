'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './navbar.module.css';
import { Roles } from '../../../enums/roles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const { isLoggedIn, userRole, logout, hasUnreadNotifications } = useAuth();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    router.push('/login');
  };

  const renderLinks = () => {
    const links = [];

    if (!isLoggedIn) {
      links.push(<Link href="/login" key="login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>);
    }

    if (isLoggedIn) {
      links.push(<Link href="/events" key="events" onClick={() => setIsMobileMenuOpen(false)}>Browse</Link>);

      if (userRole === Roles.ADMIN) {
        links.push(<Link href="/admin/users" key="admin" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>);
      }

      links.push(<Link href="/mySphere" key="mysphere" onClick={() => setIsMobileMenuOpen(false)}>MySphere</Link>);

      links.push(
        <Link href="/notifications" key="notifications" onClick={() => setIsMobileMenuOpen(false)}>
          <div className={styles.notificationIcon}>
            <FontAwesomeIcon icon={faEnvelope} />
            {hasUnreadNotifications && <span className={styles.unreadDot}></span>}
          </div>
        </Link>
      );

      links.push(
        <button onClick={handleLogout} key="logout" className={styles.logoutButton}>
          <FontAwesomeIcon icon={faRightFromBracket} />
        </button>
      );
    }

    return links;
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        <Link href="/" className={styles.brand}>EventSphere</Link>
        <div className={styles.navLinks}>{renderLinks()}</div>
        <button className={styles.menuButton} onClick={() => setIsMobileMenuOpen(prev => !prev)}>☰</button>
      </div>

      {isMobileMenuOpen && (
        <div className={styles.mobileLinks}>{renderLinks()}</div>
      )}
    </nav>
  );
}
