'use client';

import { useState, useEffect } from 'react';
import styles from './createEvent.module.css';
import { getEventTypes, createEvent } from '@/apiCalls/event';
import AccessTypes from "@/enums/accessTypes";
import { Event } from "@/models/event";
import { useRouter } from 'next/navigation';

interface EventTypeItem {
    id: string;
    name: string;
}

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
    const [eventTypes, setEventTypes] = useState<EventTypeItem[]>([]);
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
            startDateTime: new Date(form.startDateTime),
            endDateTime: new Date(form.endDateTime),
            organizerId: userId
        };

        try {
            const createdEvent = await createEvent(eventToSend);
            console.log('Event created successfully:', createdEvent);
            alert('Event created successfully!');
            //TODO push to my events page
        } catch (error) {
            console.error('Failed to create event:', error);
            alert('Failed to create event. Please try again.');
        }
    };


    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>Create New Event</h1>
            <form onSubmit={handleSubmit} className={styles.form}>
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
                        value={(form.endDateTime)}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                </label>

                <label className={styles.label}>
                    Max Participants:
                    <input name="maxParticipants" type="number" value={form.maxParticipants} onChange={handleChange} className={styles.input} required />
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
