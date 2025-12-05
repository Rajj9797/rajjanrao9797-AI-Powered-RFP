import React from "react";
import styles from "./VendorCard.module.css";

const VendorCard = ({ id, name = 'Unnamed Vendor', contact = '', email = '' }) => {
    const handleSendRequest = () => {
        const subject = encodeURIComponent('Request for Proposal');
        const rfpRaw = localStorage.getItem('rfp_request');
        let rfpDetails = '';
        if (rfpRaw) {
            try {
                const rfpObj = JSON.parse(rfpRaw);
                for (const [k, v] of Object.entries(rfpObj)) {
                    rfpDetails += `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}\n`;
                }
            } catch (e) {
                rfpDetails = rfpRaw;
            }
        } else {
            rfpDetails = 'No RFP details found in localStorage.';
        }

        const today = new Date();
        const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
        const selectedKeysRaw = localStorage.getItem('rfp_selected_keys'); 
        let selectedDetails = '';

        if (rfpRaw) {
            try {
            const rfpObj = JSON.parse(rfpRaw);
            let selectedKeys = ['title', 'description', 'products', 'budget'];

            if (selectedKeysRaw) {
                try {
                selectedKeys = JSON.parse(selectedKeysRaw);
                if (!Array.isArray(selectedKeys)) selectedKeys = [];
                } catch (e) {
                selectedKeys = selectedKeysRaw.split(',').map(s => s.trim()).filter(Boolean);
                }
            }

            if (selectedKeys.length === 0) {
                // no selection provided — include all fields
                for (const [k, v] of Object.entries(rfpObj)) {
                selectedDetails += `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}\n`;
                }
            } else {
                // include only selected keys, if present
                for (const key of selectedKeys) {
                if (Object.prototype.hasOwnProperty.call(rfpObj, key)) {
                    const v = rfpObj[key];
                    selectedDetails += `${key}: ${typeof v === 'object' ? JSON.stringify(v) : v}\n`;
                }
                }
            }
            } catch (e) {
            selectedDetails = rfpRaw;
            }
        } else {
            selectedDetails = 'No RFP details found in localStorage.';
        }

        const body = encodeURIComponent(
            `Dear ${name},\n\nI am reaching out to request a detailed proposal for your services as part of our ongoing vendor selection process.\n\nRFP Details:\n${selectedDetails}\n\nPlease provide your response and any relevant documentation at your earliest convenience.\n\nDate of Request: ${formattedDate}\n\nThank you,\n`
        );

        const mailto = `mailto:${email || ''}?subject=${subject}&body=${body}`;
        window.location.href = mailto;
    };

    return (
        <div className={styles.card} data-id={id}>
            <h3 className={styles.name}>{name}</h3>
            {contact ? <p className={styles.contact}>Contact: {contact}</p> : null}
            {email ? <p className={styles.email}>Email: {email}</p> : null}
            <button className={styles.selectButton} onClick={handleSendRequest}>
                Send Request
            </button>
        </div>
    );
};

export default VendorCard;