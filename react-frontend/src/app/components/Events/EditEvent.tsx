'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './createEvent.module.css';
import { Event, EventType } from '@/models/event';
import { getEventById, updateEvent, getEventTypes } from '@/apiCalls/event';
import AccessTypes from '@/enums/accessTypes';

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

interface EditEventProps {
  eventId: string;
}

function toLocalDatetimeInputValue(dateStr: string): string {
  const date = new Date(dateStr);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function toUtcISOStringFromLocal(localDateTime: string): string {
  const local = new Date(localDateTime);
  return local.toISOString();
}

export default function EditEvent({ eventId }: EditEventProps) {
  const router = useRouter();
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [form, setForm] = useState<EventRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const eventData: Event = await getEventById(eventId);
        setForm({
          name: eventData.name,
          description: eventData.description,
          location: eventData.location,
          startDateTime: toLocalDatetimeInputValue(eventData.startDateTime.toString()),
          endDateTime: toLocalDatetimeInputValue(eventData.endDateTime.toString()),
          maxParticipants: eventData.maxParticipants,
          eventType: eventData.eventType,
          accessType: eventData.accessType,
        });
      } catch (err) {
        setError('Failed to load event.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchEventTypes = async () => {
      try {
        const types = await getEventTypes();
        setEventTypes(types);
      } catch (error) {
        console.error('Failed to fetch event types:', error);
      }
    };

    fetchEventTypes();
    fetchEvent();
  }, [eventId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!form) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => prev ? ({
      ...prev,
      [name]: name === 'maxParticipants' ? parseInt(value) : value,
    }) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const eventRequest: Event = {
        ...form,
        id: eventId,
        startDateTime: toUtcISOStringFromLocal(form.startDateTime),
        endDateTime: toUtcISOStringFromLocal(form.endDateTime),
        organizerId: localStorage.getItem('userId') || ''
      };

      await updateEvent(eventId, eventRequest);

      window.dispatchEvent(new CustomEvent('global-success', { detail: "Event updated successfully!" }));
      router.push('/mySphere');
    } catch (err) {
      console.error('Failed to update event:', err);
      window.dispatchEvent(new CustomEvent('global-error', { detail: "Failed to update event." }));
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Edit Event</h1>
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

        <button type="submit" className={styles.button}>Update Event</button>
      </form>
    </div>
  );
}