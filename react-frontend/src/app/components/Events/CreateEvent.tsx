'use client';

import { useState, useEffect } from 'react';
import styles from './createEvent.module.css';
import { getEventTypes, createEvent } from '@/apiCalls/event';
import AccessTypes from "@/enums/accessTypes";
import { Event, EventType } from "@/models/event";
import { useRouter } from 'next/navigation';

interface EventRequest {
    name: string;
    description: string;
    location: string;
    startDateTime: string;
    endDateTime: string;
    eventType: string;
    maxParticipants: number;
    accessType: AccessTypes;
}

export default function CreateEvent() {
    const router = useRouter();
    const [eventTypes, setEventTypes] = useState<EventType[]>([]);
    const [form, setForm] = useState<EventRequest>({
        name: '',
        description: '',
        location: '',
        startDateTime: '',
        endDateTime: '',
        maxParticipants: 0,
        eventType: '',
        accessType: AccessTypes.public_access
    });

    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useEffect(() => {
        const fetchEventTypes = async () => {
            try {
                const types = await getEventTypes();
                setEventTypes(types);
            } catch (error) {
                console.error('Failed to fetch event types:', error);
            }
        };

        fetchEventTypes();
    }, []);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]:
                name === 'maxParticipants'
                    ? parseInt(value)
                    : value,
        }));
    };

    function toLocalDatetimeInputValue(dateStr: string): string {
        const date = new Date(dateStr);
        const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
        return local.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:mm'
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const userId = localStorage.getItem('userId');
        if (!userId) {
            router.push('/login');
            return;
        }

        const eventToSend: Event = {
            ...form,
            id: undefined,
            startDateTime: toLocalDatetimeInputValue(form.startDateTime),
            endDateTime: toLocalDatetimeInputValue(form.endDateTime),

            organizerId: userId
        };

        try {
            const createdEvent = await createEvent(eventToSend);
            console.log('Event created successfully:', createdEvent);

            setShowSuccessPopup(true);

            setForm({
                name: '',
                description: '',
                location: '',
                startDateTime: '',
                endDateTime: '',
                maxParticipants: 0,
                eventType: '',
                accessType: AccessTypes.public_access
            });

            setTimeout(() => {
                setShowSuccessPopup(false);
                router.push('/mySphere');
            }, 2000);

        } catch (error) {
            console.error('Failed to create event:', error);
            window.dispatchEvent(new CustomEvent('global-error', { detail: "Failed to create event." }));
        }
    };


    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Create New Event</h1>

            {showSuccessPopup && (
                <div className={styles.successPopup}>
                    Event created successfully!
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                {/* form fields as before */}
                <label className={styles.label}>
                    Name:
                    <input name="name" type="text" value={form.name} onChange={handleChange} className={styles.input} required />
                </label>

                <label className={styles.label}>
                    Description:
                    <textarea name="description" value={form.description} onChange={handleChange} className={styles.textarea} required />
                </label>

                <label className={styles.label}>
                    Location:
                    <input name="location" type="text" value={form.location} onChange={handleChange} className={styles.input} required />
                </label>

                <label className={styles.label}>
                    Start Date & Time:
                    <input
                        name="startDateTime"
                        type="datetime-local"
                        value={form.startDateTime}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </label>

                <label className={styles.label}>
                    End Date & Time:
                    <input
                        name="endDateTime"
                        type="datetime-local"
                        value={form.endDateTime}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </label>

                <label className={styles.label}>
                    Max Participants:
                    <input name="maxParticipants" type="number" min="1" value={form.maxParticipants} onChange={handleChange} className={styles.input} required />
                </label>

                <label className={styles.label}>
                    Event Type:
                    <select
                        name="eventType"
                        value={form.eventType}
                        onChange={handleChange}
                        className={styles.select}
                        required
                    >
                        <option value="" disabled>
                            Select an event type
                        </option>
                        {eventTypes.map((type) => (
                            <option key={type.id} value={type.name}>
                                {type.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className={styles.label}>
                    Access Type:
                    <select
                        name="accessType"
                        value={form.accessType}
                        onChange={handleChange}
                        className={styles.select}
                    >
                        <option value={AccessTypes.public_access}>Public</option>
                        <option value={AccessTypes.approval_needed}>Approval needed</option>
                        <option value={AccessTypes.invite_only}>Invite Only</option>

                    </select>
                </label>

                <button type="submit" className={styles.button}>Create Event</button>
            </form>
        </div>
    );
}
