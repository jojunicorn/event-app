'use client';

import { useEffect, useState } from 'react';
import styles from './myEvents.module.css';
import { getEventsForUser } from '@/apiCalls/event';
import { unjoinEvent } from '@/apiCalls/eventUser';
import { Event } from '@/models/event'

export default function VisitedEvents() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);

  const [error, setError] = useState('');

  useEffect(() => {
    fetchVisitedEvents();
  }, []);

  const fetchVisitedEvents = async () => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User not logged in.');
        return;
      }

      const userEvents = await getEventsForUser(userId);
      const now = new Date();

      const upcoming = userEvents.filter((e: Event) => new Date(e.endDateTime) >= now);
      const past = userEvents.filter((e: Event) => new Date(e.endDateTime) < now);


      setUpcomingEvents(upcoming);
      setPastEvents(past);
    } catch (err) {
      setError('Failed to fetch your events.');
      console.error(err);
    }
  };

  const handleUnjoin = async (eventId?: string) => {
    if (!eventId) return;

    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      await unjoinEvent(eventId, userId);
      setUpcomingEvents((prev) => prev.filter((e) => e.id !== eventId));
      window.dispatchEvent(new CustomEvent('global-success', { detail: 'You left the event.' }));
    } catch (err) {
      console.error(err);
      window.dispatchEvent(new CustomEvent('global-error', { detail: 'Failed to leave event.' }));
    }
  };




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
      <h1 className={styles.heading}>My Events</h1>
      {error && <p className={styles.error}>{error}</p>}

      <section>
        <h2 className={styles.sectionTitle}>Upcoming</h2>
        <div className={styles.cardGrid}>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(event => (
              <div key={event.id} className={styles.card}>
                <h3>{event.name}</h3>
                <p>{formatDate(event.startDateTime)} @ {formatTime(event.startDateTime)}</p>
                <p>{event.location}</p>
                <span className={styles.tag}>{event.eventType}</span>
                <button onClick={() => handleUnjoin(event.id)} className={styles.unjoinButton}>
                  Leave Event
                </button>

              </div>
            ))
          ) : (
            <p className={styles.empty}>No upcoming events</p>
          )}
        </div>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>Past Events</h2>
        <div className={styles.cardGrid}>
          {pastEvents.length > 0 ? (
            pastEvents.map(event => (
              <div key={event.id} className={styles.cardPast}>
                <h3>{event.name}</h3>
                <p>{formatDate(event.startDateTime)} @ {formatTime(event.startDateTime)}</p>
                <p>{event.location}</p>
                <span className={styles.tagMuted}>{event.eventType}</span>
              </div>
            ))
          ) : (
            <p className={styles.empty}>No past events yet</p>
          )}
        </div>
      </section>
    </div>

  );
}
