'use client';

import { useEffect, useState } from 'react';
import styles from './eventManagement.module.css';
import { Event } from '@/models/event';
import { getEvents, deleteEventById } from '@/apiCalls/event';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';

export default function EventManagement() {
    const [events, setEvents] = useState<Event[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await getEvents({});
                setEvents(data);
            } catch (err) {
                setError('Failed to fetch events.');
                console.error(err);
            }
        };

        fetchEvents();
    }, []);

    const handleDelete = async (eventId: string | undefined) => {
        if (!eventId) return;
        try {
            await deleteEventById(eventId);
            setEvents(prev => prev.filter(event => event.id !== eventId));
        } catch (err) {
            setError('Failed to delete event.');
            console.error(err);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Event Management</h2>
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Dates</th>
                            <th>Location</th>
                            <th>Type</th>
                            <th>Access</th>
                            <th>Max</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(event => (
                            <tr key={event.id}>
                                <td>{event.name}</td>
                                <td>
                                    {new Date(event.startDateTime).toLocaleString('de-DE', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })} -{' '}
                                    {new Date(event.endDateTime).toLocaleString('de-DE', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </td>

                                <td>{event.location}</td>
                                <td>{event.eventType}</td>
                                <td>{event.accessType}</td>
                                <td>{event.maxParticipants}</td>
                                <td className={styles.actions}>
                                    <button className={styles.edit}>
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>
                                    <button
                                        className={styles.delete}
                                        onClick={() => handleDelete(event.id)}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
