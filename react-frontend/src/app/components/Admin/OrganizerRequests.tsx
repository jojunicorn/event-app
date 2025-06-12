'use client';

import { useEffect, useState } from 'react';
import styles from './organizerRequest.module.css';
import { getAllOrganizerRequests, changeUserRole } from '@/apiCalls/user';
import { User } from '@/models/user';
import { Roles } from '@/enums/roles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

export default function OrganizerRequests() {
  const [requests, setRequests] = useState<User[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getAllOrganizerRequests();
        setRequests(data);
      } catch (err) {
        setError('Failed to fetch organizer requests.');
        console.error(err);
      }
    };

    fetchRequests();
  }, []);

  const handleDecision = async (userId: string, approve: boolean) => {
    try {
      const newRole = approve ? Roles.ORGANIZER : Roles.USER;
      await changeUserRole(userId, newRole);
      setRequests((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      setError('Failed to update user role.');
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Organizer Requests</h2>

      {error && <p className={styles.error}>{error}</p>}

      {requests.length === 0 ? (
        <p className={styles.empty}>No pending requests.</p>
      ) : (
        <ul className={styles.requestList}>
          {requests.map((user) => (
            <li key={user.id} className={styles.card}>
              <div>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
              </div>
              <div className={styles.actions}>
                <button
                  className={styles.approve}
                  data-tooltip-id="tooltip"
                  data-tooltip-content="Approve request"
                  onClick={() => handleDecision(user.id, true)}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </button>

                <button
                  className={styles.deny}
                  data-tooltip-id="tooltip"
                  data-tooltip-content="Deny request"
                  onClick={() => handleDecision(user.id, false)}
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>

              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
