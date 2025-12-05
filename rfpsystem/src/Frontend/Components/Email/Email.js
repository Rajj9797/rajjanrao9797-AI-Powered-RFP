import react, { useState, useEffect } from "react";

export default function Email() {
    const [sent, setSent] = useState([]);
    const [received, setReceived] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;

        async function fetchLists() {
            setLoading(true);
            setError(null);
            try {
                const [sentRes, recvRes] = await Promise.all([
                    fetch('/api/emails/sent'),
                    fetch('/api/emails/received'),
                ]);

                if (!sentRes.ok || !recvRes.ok) {
                    throw new Error('Failed to fetch email lists');
                }

                const [sentData, recvData] = await Promise.all([
                    sentRes.json(),
                    recvRes.json(),
                ]);

                if (!mounted) return;
                setSent(Array.isArray(sentData) ? sentData : []);
                setReceived(Array.isArray(recvData) ? recvData : []);
            } catch (err) {
                if (!mounted) return;
                setError(err.message || 'Unknown error while loading emails');

                setSent([
                    { id: 's1', to: 'vendor1@example.com', subject: 'RFP: Product A', date: '2025-12-01', snippet: 'Please find attached...' },
                    { id: 's2', to: 'vendor2@example.com', subject: 'RFP: Service B', date: '2025-11-28', snippet: 'Following up on our request...' },
                ]);
                setReceived([
                    { id: 'r1', from: 'vendor1@example.com', subject: 'Re: RFP: Product A', date: '2025-12-02', snippet: 'Thanks for the details...' },
                    { id: 'r2', from: 'vendor3@example.com', subject: 'Questions about RFP', date: '2025-11-29', snippet: 'Could you clarify...' },
                ]);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        fetchLists();
        return () => {
            mounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div>
                <h1>Email Component</h1>
                <p>Loading emails...</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Email Component</h1>
            {error && (
                <div style={{ color: 'crimson', marginBottom: 12 }}>
                    Error loading emails: {error}
                </div>
            )}

            <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                <section style={{ flex: 1 }}>
                    <h2>Sent to Vendors ({sent.length})</h2>
                    {sent.length === 0 ? (
                        <p>No sent emails.</p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {sent.map((e) => (
                                <li key={e.id} style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
                                    <div style={{ fontWeight: 600 }}>{e.subject}</div>
                                    <div style={{ color: '#555', fontSize: 13 }}>
                                        To: {e.to} — {e.date}
                                    </div>
                                    {e.snippet && <div style={{ marginTop: 6 }}>{e.snippet}</div>}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section style={{ flex: 1 }}>
                    <h2>Received from Vendors ({received.length})</h2>
                    {received.length === 0 ? (
                        <p>No received emails.</p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {received.map((e) => (
                                <li key={e.id} style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
                                    <div style={{ fontWeight: 600 }}>{e.subject}</div>
                                    <div style={{ color: '#555', fontSize: 13 }}>
                                        From: {e.from} — {e.date}
                                    </div>
                                    {e.snippet && <div style={{ marginTop: 6 }}>{e.snippet}</div>}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}