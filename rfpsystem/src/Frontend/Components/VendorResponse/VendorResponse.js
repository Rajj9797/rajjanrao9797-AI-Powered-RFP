import React, { useState } from 'react';
import styles from './VendorResponse.module.css';

const VendorResponse = ({ vendorId, vendorName, vendorEmail, rfpRequestId, onSuccess }) => {
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!response.trim()) {
            setError('Please enter a response');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/vendor-responses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    vendorId: vendorId || 'sampleVendorId',
                    vendorName: vendorName || 'Sample Vendor',
                    vendorEmail: vendorEmail || 'sample@vendor.com',
                    response: response.trim() || 'This is a sample vendor response.',
                    rfpRequestId: rfpRequestId || 'sampleRfpRequestId',
                    attachments: []
                })
            });

            let data;
            try {
                data = await res.json();
            } catch (jsonErr) {
                throw new Error('Invalid JSON response from backend');
            }

            if (!res.ok) {
                setError(data?.message || `Failed to save response: ${res.status}`);
                setLoading(false);
                return;
            }

            setSuccess(true);
            setResponse('');
            
            if (onSuccess) {
                onSuccess(data);
            }

            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err.message || 'Failed to save vendor response');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.heading}>Submit Vendor Response</h3>
            {vendorName && <p className={styles.vendor}>Vendor: {vendorName}</p>}
            
            {success && <div className={styles.success}>Response saved successfully!</div>}
            {error && <div className={styles.error}>{error}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
                <textarea
                    className={styles.textarea}
                    placeholder="Enter vendor response here..."
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    rows={8}
                    disabled={loading}
                />
                
                <button 
                    type="submit" 
                    className={styles.submitBtn}
                    disabled={loading || !response.trim()}
                >
                    {loading ? 'Saving...' : 'Save Response'}
                </button>
            </form>
        </div>
    );
};

export default VendorResponse;
