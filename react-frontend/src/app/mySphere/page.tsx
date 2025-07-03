'use client';

import { useEffect, useState } from 'react';
import Profile from '../components/MySphere/Profile';
import MyOrganizedEvents from '../components/MySphere/MyOrganizedEvents';
import MyEvents from '../components/MySphere/MyEvents';
import { Roles } from '@/enums/roles';

export default function EventsPage() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  const isOrganizerOrAdmin = role === Roles.ORGANIZER || role === Roles.ADMIN;

  return (
    <main>
      <Profile />
      {isOrganizerOrAdmin && <MyOrganizedEvents />}
      <MyEvents />
    </main>
  );
}
