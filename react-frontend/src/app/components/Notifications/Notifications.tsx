'use client';

import { useEffect, useState } from 'react';
import styles from './notifications.module.css';
import { getNotificationsForUser, updateStatus, deleteNotificationById } from '@/apiCalls/notification';
import { Notification } from '@/models/notification'

export default function Notifications() {
    const [userId, setUserId] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const id = localStorage.getItem('userId');
        if (!id) {
            setError('User not logged in.');
            return;
        }
        setUserId(id);
    }, []);

    useEffect(() => {
        if (!userId) return;

        const fetchNotifications = async () => {
            try {
                const data = await getNotificationsForUser(userId);
                setNotifications(data);
            } catch (err) {
                setError('Failed to load notifications.');
                console.error(err);
            }
        };

        fetchNotifications();
    }, [userId]);

    const handleNotificationClick = async (notification: Notification) => {
        try {
            if (!notification.readStatus) {
                await updateStatus(notification.id);
                setNotifications(prev =>
                    prev.map(n => (n.id === notification.id ? { ...n, readStatus: true } : n))
                );
            }

            if (notification.actionUrl) {
                const fullUrl = `${window.location.origin}${notification.actionUrl}`;
                window.location.href = fullUrl;
            }
        } catch (err) {
            console.error('Error handling notification click:', err);
        }
    };



    const handleDelete = async (id: string) => {
        try {
            await deleteNotificationById(id);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error('Failed to delete notification', err);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>My Notifications</h2>
            {error && <p className={styles.error}>{error}</p>}

            {notifications.length === 0 ? (
                <p>No notifications.</p>
            ) : (
                <ul className={styles.list}>
                    {notifications.map(notification => (
                        <li
                            key={notification.id}
                            className={`${styles.notification} ${!notification.readStatus ? styles.unread : ''
                                }`}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <div className={styles.notificationContent}>
                                <h3 className={styles.notificationTitle}>{notification.title}</h3>
                                <p className={styles.notificationMessage}>{notification.message}</p>
                                <small className={styles.timestamp}>
                                    {new Date(notification.createdAt).toLocaleString()}
                                </small>
                            </div>
                            <button
                                className={styles.deleteButton}
                                onClick={e => {
                                    e.stopPropagation();
                                    handleDelete(notification.id);
                                }}
                            >
                                ×
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
