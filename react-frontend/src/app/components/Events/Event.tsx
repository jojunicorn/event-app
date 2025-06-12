'use client';

import { useEffect, useState } from 'react';
import styles from './event.module.css';
import { getEvents, getEventTypes } from '@/apiCalls/event';
import { addUserToEvent, getNrOfSpotsLeft } from '@/apiCalls/eventUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faCircleXmark } from '@fortawesome/free-solid-svg-icons';


import AccessTypes from '@/enums/accessTypes';
import { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

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
  const [startDateFilter, setStartDateFilter] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);

  const canCreateEvent = userRole === 'ADMIN' || userRole === 'ORGANIZER';
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [error, setError] = useState('');


  useEffect(() => {
    setUserRole(getUserRole());
  }, []);


  const getUserRole = (): string | null => {
    return localStorage.getItem("role");
  };



  useEffect(() => {
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

      // Fetch spots left for each event in parallel
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


  const handleJoinEvent = async (eventId: string) => {
    try {
      // Replace this with an actual API call
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('User not logged in.');
        return;
      }
      await addUserToEvent(eventId, userId);
      alert("You have successfully joined the event.");
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;

      const errorMessage =
      error.response?.data?.message || 
      error.response?.data ||
      error.message ||
      "An unexpected error occurred.";

      console.error("Failed to join event:", errorMessage);
      setError('Failed to load events or event types: ' + errorMessage)
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesType =
      selectedType === 'ALL' || event.eventType === selectedType;

    const matchesLocation = event.location
      .toLowerCase()
      .includes(locationFilter.toLowerCase());

    const matchesStartDate =
      !startDateFilter ||
      new Date(event.startDateTime) >= new Date(startDateFilter);

    return matchesType && matchesLocation && matchesStartDate;
  });


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
      <h1 className={styles.heading}>Upcoming Events</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.filtersContainer}>
        <div className={styles.filterWrapper}>
          <label htmlFor="typeFilter" className={styles.filterLabel}>
            Type:
          </label>
          <select
            id="typeFilter"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="ALL">All</option>
            {eventTypes.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterWrapper}>
          <label htmlFor="locationFilter" className={styles.filterLabel}>
            Location:
          </label>
          <input
            id="locationFilter"
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className={styles.filterInput}
            placeholder="Enter location"
          />
        </div>

        <div className={styles.filterWrapper}>
          <label htmlFor="startDateFilter" className={styles.filterLabel}>
            Start Date:
          </label>
          <input
            id="startDateFilter"
            type="datetime-local"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
            className={styles.filterInput}
          />
        </div>
      </div>

      {canCreateEvent && (
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <button
            className={styles.createEventButton}
            onClick={() => {
              // navigate to event creation page or open a modal
              window.location.href = '/events/createEvent';
            }}
          >
            Create New Event
          </button>
        </div>
      )}


      <div className={styles.cardGrid}>
        {filteredEvents.map((event) => (
          <div key={event.id} className={styles.card} onClick={() => setSelectedEvent(event)}>
            <h2 className={styles.name}>{event.name}</h2>
            <p className={styles.location}>
              <strong>Location:</strong> {event.location}
            </p>
            <p className={styles.date}>
              <strong>Date:</strong> {formatDate(event.startDateTime)}
            </p>
            <p className={styles.time}>
              <strong>Starts at:</strong> {formatTime(event.startDateTime)}
            </p>
          </div>
        ))}
        {selectedEvent && (
          <div className={styles.modalOverlay} onClick={() => setSelectedEvent(null)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeButton} onClick={() => setSelectedEvent(null)}>
                &times;
              </button>
              <h2>{selectedEvent.name}</h2>
              <p><strong>Description:</strong> {selectedEvent.description}</p>
              <p><strong>Location:</strong> {selectedEvent.location}</p>
              <p><strong>Date:</strong> {formatDate(selectedEvent.startDateTime)}</p>
              <p><strong>Time:</strong> {formatTime(selectedEvent.startDateTime)}</p>
              <p><strong>Type:</strong> {selectedEvent.eventType}</p>
              <p><strong>Max Participants:</strong> {selectedEvent.maxParticipants}</p>

              {selectedEvent.nrOfSpotsLeft !== undefined && (
                <>
                  {selectedEvent.nrOfSpotsLeft <= 10 && selectedEvent.nrOfSpotsLeft > 0 && (
                    <p className={styles.warningMessage}>
                      <FontAwesomeIcon icon={faTriangleExclamation} style={{ marginRight: '0.5rem', color: '#ffcc00' }} />
                      Only {selectedEvent.nrOfSpotsLeft} spot{selectedEvent.nrOfSpotsLeft === 1 ? '' : 's'} left! Hurry up!
                    </p>
                  )}

                  {selectedEvent.nrOfSpotsLeft > 0 && (
                    <>
                      {selectedEvent.accessType === AccessTypes.public_access && (
                        <button className={styles.joinButton} onClick={() => handleJoinEvent(selectedEvent.id)}>
                          Join Event
                        </button>
                      )}

                      {selectedEvent.accessType === AccessTypes.approval_needed && (
                        <button className={styles.joinButton} onClick={() => handleJoinEvent(selectedEvent.id)}>
                          Request to Join
                        </button>
                      )}
                    </>
                  )}
                  
                  {selectedEvent.nrOfSpotsLeft === 0 && (
                    <p className={styles.fullMessage}>    
                      <FontAwesomeIcon icon={faCircleXmark} style={{ marginRight: '0.5rem', color: '#ff4444' }} />
                      This event is fully booked.
                    </p>
                  )}
                </>
              )}


            </div>
          </div>
        )}

      </div>
    </div>


  );
}
