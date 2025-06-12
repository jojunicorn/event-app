'use client';

import { useEffect, useState } from 'react';
import styles from './userManagement.module.css';
import { addEventType, deleteEventType, getEventTypes } from '@/apiCalls/event';
import { EventType } from '@/models/event';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function UserManagement() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [error, setError] = useState('');
  const [newEventType, setNewEventType] = useState<string>('');



  useEffect(() => {
    fetchEventTypes();
  }, []);

  const fetchEventTypes = async () => {
    try {
      const data = await getEventTypes();
      setEventTypes(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch event types.');
      console.error(err);
    }
  };


  const handleDelete = async (id: string) => {
    try {
      await deleteEventType(id);
      setEventTypes(prev => prev.filter(et => et.id !== id));
    } catch (err) {
      setError('Failed to delete event type.');
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventType.trim()) return;

    try {
      await addEventType(newEventType);
      setNewEventType('');
      fetchEventTypes();
    } catch (err) {
      setError('Failed to create event type.');
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Event Type Management</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="New event type name"
          value={newEventType}
          onChange={(e) => setNewEventType(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.submitButton}>
          Add
        </button>
      </form>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          <div className={styles.cell}>Name</div>
          <div className={styles.cellCenter}></div>
        </div>
        {eventTypes.map(et => (
          <div key={et.id} className={styles.tableRow}>
            <div className={styles.cell}>{et.name}</div>
            <div className={styles.cellCenter}>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(et.id)}
                title="Delete Event Type"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
