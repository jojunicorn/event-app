'use client';

import { useEffect, useState } from 'react';
import styles from './profile.module.css';
import { getUserById, changeUserRole, updateUser } from '@/apiCalls/user';
import { getEventTypes } from '@/apiCalls/event';
import { User } from '@/models/user';
import { Roles } from '@/enums/roles';
import { EventType } from '@/models/event';

export default function ProfileSection() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [requestSent, setRequestSent] = useState(false);
    const [error, setError] = useState('');
    const [editableLocation, setEditableLocation] = useState('');
    const [eventCategories, setEventCategories] = useState<EventType[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<EventType[]>([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) throw new Error('No user ID found');
                const data = await getUserById(userId);
                setUser(data);
                setEditableLocation(data.location || '');

                if (data.preferences) {
                    setSelectedCategories(data.preferences.slice(0, 3));
                }

                if (data.role === Roles.REQUESTED_ORGANIZER) {
                    setRequestSent(true);
                }
            } catch (err) {
                setError('Failed to fetch user info.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const types = await getEventTypes();
                setEventCategories(types);
            } catch (err) {
                console.error('Failed to fetch event types', err);
            }
        };

        fetchUser();
        fetchCategories();
    }, []);

    const handleRequestOrganizer = async () => {
        try {
            if (!user?.id) return;
            await changeUserRole(user.id, Roles.REQUESTED_ORGANIZER);
            setRequestSent(true);
        } catch (err) {
            console.error(err);
            setError('Failed to send organizer request.');
        }
    };

    const toggleCategory = (category: EventType) => {
        setSelectedCategories((prev) => {
            const exists = prev.find((c) => c.id === category.id);
            if (exists) {
                return prev.filter((c) => c.id !== category.id);
            } else if (prev.length < 3) {
                return [...prev, category];
            }
            return prev;
        });
    };


    const handleSave = async () => {
        if (!user) return;
        try {
            await updateUser(user.id, {
                location: editableLocation,
                preferences: selectedCategories
            });
            window.dispatchEvent(new CustomEvent('global-success', { detail: 'Profile updated successfully!' }));
        } catch (err) {
            console.error(err);
            setError('Failed to update profile.');
        }
    };

    if (loading) return <p className={styles.loading}>Loading...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <div className={styles.profileWrapper}>
            <h2 className={styles.heading}>My Profile</h2>

            <div className={styles.profileCard}>
                <div className={styles.profileContent}>
                    {/* LEFT COLUMN */}
                    <div className={styles.leftColumn}>
                        <p className={styles.text}><strong>Name:</strong> {user?.name}</p>
                        <p className={styles.text}><strong>Email:</strong> {user?.email}</p>
                        <p className={styles.text}><strong>Role:</strong> {user?.role}</p>

                        <label className={styles.label}>
                            Location:
                            <input
                                type="text"
                                value={editableLocation}
                                onChange={(e) => setEditableLocation(e.target.value)}
                                className={styles.input}
                                placeholder="Your city or region"
                            />
                        </label>

                        {user?.role === 'USER' && !requestSent && (
                            <button className={styles.buttonSmall} onClick={handleRequestOrganizer}>
                                Request Organizer Account
                            </button>
                        )}

                        {requestSent && <p className={styles.success}>Request sent! We’ll get back to you soon.</p>}
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className={styles.rightColumn}>
                        <p className={styles.subheading}>Select up to 3 Event Categories:</p>
                        <div className={styles.categoryList}>

                            {eventCategories.map((cat) => {
                                const isChecked = selectedCategories.some((c) => c.id === cat.id);
                                const isDisabled = !isChecked && selectedCategories.length >= 3;

                                return (
                                    <label key={cat.id} className={styles.categoryItem}>
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => toggleCategory(cat)}
                                            disabled={isDisabled}
                                        />
                                        {cat.name}
                                    </label>
                                );
                            })}

                        </div>
                    </div>
                </div>

                {/* Single Submit Button for Both */}
                <button onClick={handleSave} className={styles.button}>
                    Save Changes
                </button>
            </div>
        </div>


    );
}
