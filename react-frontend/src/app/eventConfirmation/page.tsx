'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { validateCodeAndAddUser, deleteInvitation } from '@/apiCalls/eventUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faExclamationTriangle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import styles from './eventConfirmation.module.css';

export default function EventConfirmationPage() {
    const searchParams = useSearchParams();
    const code = searchParams.get('notificationCode');
    const [status, setStatus] = useState<'ready' | 'loading' | 'confirmed' | 'denied' | 'error'>(code ? 'ready' : 'error');
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const storedId = localStorage.getItem('userId');
        if (storedId) {
            setUserId(storedId);
        }
    }, []);

    const handleConfirm = async () => {
        if (!code || !userId) return;
        setStatus('loading');
        try {
            await validateCodeAndAddUser('', userId, code);
            setStatus('confirmed');
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };


    const handleDeny = async () => {
        if (!code) return;
        setStatus('loading');
        try {
            await deleteInvitation(code);
            setStatus('denied');
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    };

    if (status === 'loading') {
        return (
            <div className={styles.statusMessage}>
                <FontAwesomeIcon icon={faSpinner} spin /> Loading...
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className={styles.statusMessage}>
                <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: '#f87171' }} /> Invalid or expired invitation.
            </div>
        );
    }

    if (status === 'confirmed') {
        return (
            <div className={styles.statusMessage}>
                <FontAwesomeIcon icon={faCheckCircle} style={{ color: '#22c55e' }} /> Your attendance has been confirmed.
            </div>
        );
    }

    if (status === 'denied') {
        return (
            <div className={styles.statusMessage}>
                <FontAwesomeIcon icon={faTimesCircle} style={{ color: '#ef4444' }} /> You’ve declined the invitation.
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Event Invitation</h2>
            <p>Would you like to confirm your attendance?</p>
            <div className={styles.buttonGroup}>
                <button className={styles.confirm} onClick={handleConfirm}>Confirm</button>
                <button className={styles.deny} onClick={handleDeny}>Deny</button>
            </div>
        </div>
    );
}
