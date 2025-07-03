'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './event.module.css';
import { getEvents, getEventTypes } from '@/apiCalls/event';
import { getNrOfSpotsLeft } from '@/apiCalls/eventUser';
import AccessTypes from '@/enums/accessTypes';


interface Event {
  id: string;
  name: string;
  description: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  eventType: string;
  maxParticipants: number;
  accessType: AccessTypes;
  organizerId: string;
  nrOfSpotsLeft: number | undefined;
}

interface EventTypeItem {
  id: string;
  name: string;
}

export default function EventsList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventTypes, setEventTypes] = useState<EventTypeItem[]>([]);
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [locationFilter, setLocationFilter] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUserRole(localStorage.getItem('role'));
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const now = new Date();
      const timeNow = now.toISOString().slice(0, 19);

      const [eventData, typesData] = await Promise.all([
        getEvents({ startDateTime: timeNow }),
        getEventTypes()
      ]);

      const fetchedEvents: Event[] = eventData.content || eventData;

      const eventsWithSpots = await Promise.all(
        fetchedEvents.map(async (event) => {
          try {
            const spotsLeft = await getNrOfSpotsLeft(event.id);
            return { ...event, nrOfSpotsLeft: spotsLeft };
          } catch (err) {
            console.error(`Failed to fetch spots for event ${event.id}:`, err);
            return { ...event, nrOfSpotsLeft: undefined };
          }
        })
      );

      setEvents(eventsWithSpots);
      setEventTypes(typesData);
    } catch (error) {
      console.error('Failed to load events or event types:', error);
    }
  };


  const filteredEvents = events.filter((event) => {
    const matchesType = selectedType === 'ALL' || event.eventType === selectedType;
    const matchesLocation = event.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesType && matchesLocation;
  });

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canCreateEvent = userRole === 'ADMIN' || userRole === 'ORGANIZER';

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Upcoming Events</h1>

      <div className={styles.filtersContainer}>
        <div className={styles.filterWrapper}>
          <label htmlFor="typeFilter" className={styles.filterLabel}>Type:</label>
          <select id="typeFilter" value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className={styles.filterSelect}>
            <option value="ALL">All</option>
            {eventTypes.map((type) => (
              <option key={type.id} value={type.name}>{type.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.filterWrapper}>
          <label htmlFor="locationFilter" className={styles.filterLabel}>Location:</label>
          <input id="locationFilter" type="text" value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className={styles.filterInput} placeholder="Enter location" />
        </div>
      </div>

      {canCreateEvent && (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button className={styles.createEventButton} onClick={() => router.push('/events/createEvent')}>Create New Event</button>
        </div>
      )}

      <div className={styles.cardGrid}>
        {filteredEvents.map((event) => (
          <Link key={event.id} href={`/events/${event.id}`} className={styles.card}>
            <h2 className={styles.name}>{event.name}</h2>
            <p className={styles.location}><strong>Location:</strong> {event.location}</p>
            <p className={styles.date}><strong>Date:</strong> {formatDate(event.startDateTime)}</p>
            <p className={styles.time}><strong>Starts at:</strong> {formatTime(event.startDateTime)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
