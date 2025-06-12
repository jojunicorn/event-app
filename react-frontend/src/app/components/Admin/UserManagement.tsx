'use client';

import { useEffect, useState } from 'react';
import styles from './userManagement.module.css';
import { getUsers, changeUserRole, deleteUserById } from '@/apiCalls/user';
import { User } from '@/models/user';
import { Roles } from '@/enums/roles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch users.');
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: Roles) => {
    try {
      await changeUserRole(userId, newRole);
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      setError('Failed to update user role.');
      console.error(err);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUserById(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      setError('Failed to delete user.');
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>User Management</h2>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.tableWrapper}>
        <div className={styles.tableHeader}>
          <div className={styles.cell}>Name</div>
          <div className={styles.cell}>Email</div>
          <div className={styles.cell}>Role</div>
          <div className={styles.cellCenter}></div>
        </div>
        {users.map(user => (
          <div key={user.id} className={styles.tableRow}>
            <div className={styles.cell}>{user.name}</div>
            <div className={styles.cell}>{user.email}</div>
            <div className={styles.cell}>
              <select
                className={styles.select}
                value={user.role ?? ''}
                onChange={e =>
                  handleRoleChange(user.id, e.target.value as Roles)
                }
              >
                <option value="" disabled>Select role</option>
                {Object.values(Roles).map(role => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.cellCenter}>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(user.id)}
                title="Delete user"
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
