'use client';

import { useState } from 'react';
import OrganizerRequests from '../../components/Admin/OrganizerRequests';
import UserManagement from '../../components/Admin/UserManagement';
import EventManagement from '../../components/Admin/EventManagement';
import EventTypeManagement from '../../components/Admin/EventTypeManagement';

import styles from './page.module.css';

const tabs = [
  { label: 'Organizer Requests', component: <OrganizerRequests /> },
  { label: 'User Management', component: <UserManagement /> },
  { label: 'Event Management', component: <EventManagement /> },
  { label: 'Event Type Management', component: <EventTypeManagement /> },
];

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <main className={styles.adminDashboard}>
      <div className={styles.tabHeader}>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`${styles.tabButton} ${activeTab === index ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.tabContent}>
        {tabs[activeTab].component}
      </div>
    </main>
  );
}
