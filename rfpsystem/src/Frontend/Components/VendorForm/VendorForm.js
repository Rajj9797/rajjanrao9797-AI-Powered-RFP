import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './VendorForm.module.css';

const VendorForm = () => {
    const navigate = useNavigate();

    const [vendor, setVendor] = useState({
        name: '',
        contact: '',
        email: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch('/api/vendors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vendor),
            });
            if (!res.ok) throw new Error('Failed to save');
            const data = await res.json();
            console.log('Vendor saved to server:', data);
            navigate('/');
        } catch (err) {
            console.error('Failed to save vendor to server:', err);
            alert('Failed to save vendor to server. See console for details.');
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Add New Vendor</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Vendor Name</label>
                    <input
                        className={styles.input}
                        type="text"
                        value={vendor.name}
                        onChange={(e) => setVendor({ ...vendor, name: e.target.value })}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Contact Number</label>
                    <input
                        className={styles.input}
                        type="tel"
                        value={vendor.contact}
                        onChange={(e) => setVendor({ ...vendor, contact: e.target.value })}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Email Address</label>
                    <input
                        className={styles.input}
                        type="email"
                        value={vendor.email}
                        onChange={(e) => setVendor({ ...vendor, email: e.target.value })}
                    />
                </div>
                <button className={styles.submitButton} type="submit">
                    Save Vendor
                </button>
                </form>
        </div>
    );
}

export default VendorForm;