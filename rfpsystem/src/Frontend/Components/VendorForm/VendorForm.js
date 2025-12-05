import React, { useState } from 'react';

import styles from './VendorForm.module.css';

const VendorForm = () => {
    const [vendor, setVendor] = useState({
        name: '',
        contact: 0,
        email: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Vendor submitted:', vendor);
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