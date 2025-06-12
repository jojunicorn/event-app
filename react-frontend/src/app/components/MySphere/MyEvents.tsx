'use client';

import { useEffect, useState } from 'react';
import styles from './visitedEvents.module.css'; // create this CSS module if not exists
import { getEventsForUser } from '@/apiCalls/event';

interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  eventType: string;
  maxParticipants: number;
  accessType: string;
  organizerId: string;
}

export default function VisitedEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVisitedEvents = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('User not logged in.');
          return;
        }

        const userEvents = await getEventsForUser(userId);
        setEvents(userEvents);
      } catch (err) {
        setError('Failed to fetch your events.');
        console.error(err);
      }
    };

    fetchVisitedEvents();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>My Visited Events</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.cardGrid}>
        {events.map((event) => (
          <div key={event.id} className={styles.card}>
            <h2>{event.name}</h2>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Date:</strong> {formatDate(event.startDateTime)}</p>
            <p><strong>Time:</strong> {formatTime(event.startDateTime)}</p>
            <p><strong>Type:</strong> {event.eventType}</p>
          </div>
        ))}
        {events.length === 0 && <p>No events attended yet.</p>}
      </div>
    </div>
  );
}
