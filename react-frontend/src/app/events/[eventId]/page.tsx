'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from '../../components/Events/event.module.css';
import { getEventById } from '@/apiCalls/event';
import { addUserToEvent, getNrOfSpotsLeft } from '@/apiCalls/eventUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faCircleXmark, faArrowLeft, faShareNodes } from '@fortawesome/free-solid-svg-icons';
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

export default function EventDetailPage() {
    const { eventId } = useParams();
    const router = useRouter();
    const [event, setEvent] = useState<Event>();
    const [spotsLeft, setSpotsLeft] = useState<number | undefined>(undefined);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const fetched = await getEventById(eventId as string);
                setEvent(fetched);
                const spots = await getNrOfSpotsLeft(eventId as string);
                setSpotsLeft(spots);
            } catch (err) {
                setError('Event not found.');
                console.error(err);
            }
        };

        fetchEvent();
    }, [eventId]);

    const handleJoinEvent = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('User not logged in.');
                return;
            }
            await addUserToEvent(eventId as string, userId);
            window.dispatchEvent(new CustomEvent('global-success', { detail: "You have successfully joined the event." }));
        } catch (err) {
            const error = err as AxiosError<ErrorResponse>;
            const errorMessage =
                error.response?.data?.message ||
                error.response?.data ||
                error.message ||
                "An unexpected error occurred.";

            console.error("Failed to join event:", errorMessage);

            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('global-error', { detail: errorMessage }));
            }
        }

    };

    const formatDate = (dateStr: string) =>
        new Date(dateStr).toLocaleDateString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

    const formatTime = (dateStr: string) =>
        new Date(dateStr).toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
        });

    if (error) return <p className={styles.error}>{error}</p>;
    if (!event) return <p>Loading...</p>;

    return (
        <div className={styles.container}>

            {error && <p className={styles.error}>{error}</p>}


            <button onClick={() => router.back()} className={styles.backButton}>
                <FontAwesomeIcon icon={faArrowLeft} /> Back to Events
            </button>
            <button
                onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    window.dispatchEvent(new CustomEvent('global-success', { detail: 'Link copied to clipboard!' }));
                }}
                className={styles.shareButton}
            >
                <FontAwesomeIcon icon={faShareNodes} /> Share
            </button>

            <h1 className={styles.name}>{event.name}</h1>
            <p className={styles.location}><strong>Description:</strong> {event.description}</p>
            <p className={styles.location}><strong>Location:</strong> {event.location}</p>
            <p className={styles.date}><strong>Date:</strong> {formatDate(event.startDateTime)}</p>
            <p className={styles.time}><strong>Time:</strong> {formatTime(event.startDateTime)}</p>
            <p className={styles.location}><strong>Type:</strong> {event.eventType}</p>
            <p className={styles.location}><strong>Max Participants:</strong> {event.maxParticipants}</p>

            {spotsLeft !== undefined && (
                <>
                    {spotsLeft <= 10 && spotsLeft > 0 && (
                        <p className={styles.warningMessage}>
                            <FontAwesomeIcon icon={faTriangleExclamation} style={{ marginRight: '0.5rem', color: '#ffcc00' }} />
                            Only {spotsLeft} spot{spotsLeft === 1 ? '' : 's'} left!
                        </p>
                    )}
                    {spotsLeft === 0 && (
                        <p className={styles.fullMessage}>
                            <FontAwesomeIcon icon={faCircleXmark} style={{ marginRight: '0.5rem', color: '#ff4444' }} />
                            This event is fully booked.
                        </p>
                    )}
                    {spotsLeft > 0 && (
                        <>
                            {event.accessType === AccessTypes.public_access && (
                                <button className={styles.joinButton} onClick={handleJoinEvent}>
                                    Join Event
                                </button>
                            )}
                            {event.accessType === AccessTypes.approval_needed && (
                                <button className={styles.joinButton} onClick={handleJoinEvent}>
                                    Request to Join
                                </button>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
