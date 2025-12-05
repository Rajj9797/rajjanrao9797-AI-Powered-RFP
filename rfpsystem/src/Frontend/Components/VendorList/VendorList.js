import React, { useEffect, useState } from "react";
import VendorCard from "../VendorCard/VendorCard";

export default function VendorList({ requestData }) {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        const controller = new AbortController();

        async function fetchVendors() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch("/api/vendors", {
                    signal: controller.signal,
                });
                if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);
                const data = await res.json();
                const list = Array.isArray(data) ? data : data?.vendors ?? [];
                if (mounted) setVendors(list);
            } catch (err) {
                if (mounted) setError(err.message || "Failed to fetch vendors");
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchVendors();
        return () => {
            mounted = false;
            controller.abort();
        };
    }, []);

    return (
        <div>
            <h2>Vendors</h2>

            {loading && <p>Loading vendors…</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            {!loading && !error && vendors.length === 0 && <p>No vendors found.</p>}

            {!loading && !error && vendors.length > 0 && (
                <div style={{ display: 'grid', gap: 12 }}>
                    {vendors.map((v, idx) => (
                        <VendorCard key={v.id ?? idx} {...v} />
                    ))}
                </div>
            )}
        </div>
    );
}