'use client'

import { useEffect, useState } from 'react';
import styles from '../Admin/eventManagement.module.css';
import { Event } from '@/models/event';
import EventUserStatus from '@/enums/eventUserStatus';
import { getEvents, deleteEventById } from '@/apiCalls/event';
import { getUsersWaitingForApproval, sendInvitationCode, changeEventUserStatus } from '@/apiCalls/eventUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen, faUser, faThumbsUp, faX } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { getUsers } from '@/apiCalls/user';

export default function EventManagement() {
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState('');
  const [isUserPopupOpen, setUserPopupOpen] = useState(false);
  const [users, setUsers] = useState<{ id: string; name: string; email: string }[]>([]);
  const [usersForApproval, setUsersForApproval] = useState<{ id: string; name: string; email: string }[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('User not logged in.');
          return;
        }

        const organizerId = userId;
        const data = await getEvents({ organizerId });

        if (data.length === 0) {
          setEvents([]);
          setError('');
        } else {
          setEvents(data);
          setError('');
        }
      } catch (err) {
        setError('Failed to fetch events.');
        console.error(err);
      }
    };

    fetchEvents();
  }, []);


  const handleEdit = (eventId: string | undefined) => {
    if (!eventId) return;
    router.push(`/events/edit/${eventId}`);
  };

  useEffect(() => {
    if (!isUserPopupOpen) return;

    const fetchUsers = async () => {
      try {
        const userList = await getUsers();
        setUsers(userList);
      } catch (err) {
        console.error('Failed to load users', err);
      }
    };

    fetchUsers();
  }, [isUserPopupOpen]);

  const filteredUsers = searchTerm
    ? users.filter(
      user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  const loadUsersForApproval = async (eventId: string) => {
    try {
      const waitingUsers = await getUsersWaitingForApproval(eventId);
      setUsersForApproval(waitingUsers);
    } catch (err) {
      console.error('Failed to load users for approval', err);
    }
  };

  const handleUserIconClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setUserPopupOpen(true);
    loadUsersForApproval(eventId);
  };


  const handleUserSelect = async (userId: string) => {
    if (!selectedEventId) {
      console.error('No event selected.');
      return;
    }
    await sendInvitationCode(selectedEventId, userId);

    window.dispatchEvent(new CustomEvent('global-error', { detail: "Selected user invited" }));

    setUserPopupOpen(false);
  };

  const closePopup = () => {
    setUserPopupOpen(false);
    setSearchTerm('');
  };

  const approveUser = async (userId: string) => {
    if (!selectedEventId) {
      console.error('No event selected.');
      return;
    }
    await changeEventUserStatus(selectedEventId, userId, EventUserStatus.approved);
    await loadUsersForApproval(selectedEventId); // refresh the list
  };

  const rejectUser = async (userId: string) => {
    if (!selectedEventId) {
      console.error('No event selected.');
      return;
    }
    await changeEventUserStatus(selectedEventId, userId, EventUserStatus.denied);
    await loadUsersForApproval(selectedEventId); // refresh the list
  };


  const confirmDelete = async () => {
    if (!eventToDelete) return;
    try {
      await deleteEventById(eventToDelete);
      setEvents(prev => prev.filter(event => event.id !== eventToDelete));
      setShowConfirmPopup(false);
      setEventToDelete(null);
    } catch (err) {
      setError('Failed to delete event.');
      console.error(err);
      setShowConfirmPopup(false);
      setEventToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmPopup(false);
    setEventToDelete(null);
  };


  return (
    <div className={styles.container}>

      {showConfirmPopup && (
        <div className={styles.popupOverlay}>
          <div className={styles.confirmPopup}>
            <p>Are you sure you want to cancel this event?</p>
            <div className={styles.popupButtons}>
              <button onClick={confirmDelete} className={styles.confirmButton}>Yes, delete</button>
              <button onClick={cancelDelete} className={styles.cancelButton}>Cancel</button>
            </div>
          </div>
        </div>
      )}


      <h2 className={styles.heading}>My Organized Events</h2>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Dates</th>
              <th>Location</th>
              <th>Type</th>
              <th>Access</th>
              <th>Max</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td>{event.name}</td>
                <td>
                  {new Date(event.startDateTime).toLocaleString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })} -{' '}
                  {new Date(event.endDateTime).toLocaleString('de-DE', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td>{event.location}</td>
                <td>{event.eventType}</td>
                <td>{event.accessType}</td>
                <td>{event.maxParticipants}</td>
                <td className={styles.actions}>
                  <button className={styles.edit} onClick={() => handleEdit(event.id)}>
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button
                    className={styles.delete}
                    onClick={() => {
                      setEventToDelete(event.id ?? null);
                      setShowConfirmPopup(true);
                    }}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  {/* User icon button */}
                  <button
                    className={styles.userButton}
                    onClick={() => handleUserIconClick(event.id!)}
                    title="Manage users"
                  >
                    <FontAwesomeIcon icon={faUser} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User popup */}
      {isUserPopupOpen && (
        <div className={styles.popupOverlay} onClick={closePopup}>
          <div className={styles.popup} onClick={e => e.stopPropagation()}>
            {usersForApproval.length > 0 && (
              <div className={styles.approvalContainer}>
                <h4 className={styles.heading}>Users Waiting for Approval</h4>
                <ul className={styles.userList}>
                  {usersForApproval.map(user => (
                    <li key={user.id} className={styles.userItem}>
                      <div className={styles.userInfo}>
                        <div className={styles.userText}>
                          <strong>{user.name}</strong>
                          <span className={styles.userEmail}>{user.email}</span>
                        </div>
                        <div className={styles.actionButtons}>
                          <button className={styles.approveButton} onClick={() => approveUser(user.id)} title="Approve">
                            <FontAwesomeIcon icon={faThumbsUp} />
                          </button>
                          <button className={styles.rejectButton} onClick={() => rejectUser(user.id)} title="Reject">
                            <FontAwesomeIcon icon={faX} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <h3>Invite User</h3>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />

            <ul className={styles.userList}>
              {searchTerm === '' ? (
                <li>Start typing to search users...</li>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <li
                    key={user.id}
                    className={styles.userItem}
                    onClick={() => handleUserSelect(user.id)}
                  >
                    <strong>{user.name}</strong> - {user.email}
                  </li>
                ))
              ) : (
                <li>No users found.</li>
              )}
            </ul>

            <button onClick={closePopup} className={styles.closeButton}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
