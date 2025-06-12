'use client';

import { useEffect, useState } from 'react';
import styles from './profile.module.css';
import { getUserById, changeUserRole } from '@/apiCalls/user';
import { User } from '@/models/user';
import { Roles } from '@/enums/roles';



export default function ProfileSection() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [requestSent, setRequestSent] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userId = localStorage.getItem('userId');
                if (!userId) throw new Error('No user ID found');
                const data = await getUserById(userId);
                setUser(data);

                // ✅ Check from `data` instead of `user`
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

        fetchUser();
    }, []);


    const handleRequestOrganizer = async () => {
        try {
            if (!user?.id) return;
            const role: Roles = Roles.REQUESTED_ORGANIZER;
            console.log(role)

            await changeUserRole(user.id, Roles.REQUESTED_ORGANIZER);
            setRequestSent(true);
        } catch (err) {
            console.error(err);
            setError('Failed to send organizer request.');
        }
    };

    if (loading) return <p className={styles.loading}>Loading...</p>;
    if (error) return <p className={styles.error}>{error}</p>;

    return (
        <div className={styles.profileCard}>
            <h2 className={styles.heading}>My Profile</h2>
            <p className={styles.text}><strong>Name:</strong> {user?.name}</p>
            <p className={styles.text}><strong>Email:</strong> {user?.email}</p>
            <p className={styles.text}><strong>Role:</strong> {user?.role}</p>


            {user?.role === 'USER' && !requestSent && (
                <button className={styles.button} onClick={handleRequestOrganizer}>
                    Request Organizer Account
                </button>
            )}

            {requestSent && <p className={styles.success}>Request sent! We’ll get back to you soon.</p>}
        </div>
    );
}
