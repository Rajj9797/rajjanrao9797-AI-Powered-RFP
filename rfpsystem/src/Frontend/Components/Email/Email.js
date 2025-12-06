import React, { useState, useEffect } from 'react';

import styles from './Email.module.css';

const Email = () => {
    const [emails, setEmails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEmails();
    }, []);

    const fetchEmails = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/rfp-requests');
            if (!response.ok) {
                throw new Error('Failed to fetch emails');
            }
            const data = await response.json();
            setEmails(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className={styles['email-container']}>Loading...</div>;
    }

    if (error) {
        return <div className={`${styles['email-container']} ${styles.error}`}>Error: {error}</div>;
    }

    return (
        <div>
            <div className={styles['email-container']}>
                <h2>Email List</h2>
                {emails.length === 0 ? (
                    <p>No emails found</p>
                ) : (
                    <ul className={styles['email-list']}>
                        {emails.map((email, index) => (
                            <li key={email.id || index} className={styles['email-item']}>
                                <div className={styles['email-subject']}>{email.subject || 'No Subject'}</div>
                                <div className={styles['email-from']}>To: {email.from || email.sender || email.vendorEmail || 'N/A'}</div>
                                <div className={styles['email-date']}>{email.date || email.createdAt || email.sentDate || 'N/A'}</div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Email;