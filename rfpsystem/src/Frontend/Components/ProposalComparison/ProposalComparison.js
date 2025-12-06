import React, { useState, useEffect } from 'react';
import styles from './ProposalComparison.module.css';

const ProposalComparison = ({ rfpId }) => {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recommendation, setRecommendation] = useState(null);

    useEffect(() => {
        fetchProposals();
    }, [rfpId]);

    const fetchProposals = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/vendor-responses');
            if (!response.ok) throw new Error('Failed to fetch proposals');
            
            const allResponses = await response.json();
            
            const scoredProposals = allResponses.map(proposal => {
                const parsed = parseProposal(proposal.response);
                const score = calculateScore(parsed);
                return {
                    ...proposal,
                    parsed,
                    score
                };
            });
            
            setProposals(scoredProposals);
            
            if (scoredProposals.length > 0) {
                const recommended = generateRecommendation(scoredProposals);
                setRecommendation(recommended);
            }
            
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const parseProposal = (responseText) => {
        
        const parsed = {
            pricing: [],
            totalPrice: 0,
            warranty: '',
            deliveryTime: '',
            paymentTerms: '',
            additionalServices: []
        };

        const priceMatches = responseText.matchAll(/\$?([\d,]+(?:\.\d{2})?)\s*(?:per|each|for)?/gi);
        for (const match of priceMatches) {
            const price = parseFloat(match[1].replace(/,/g, ''));
            if (price > 0) parsed.pricing.push(price);
        }
        
        if (parsed.pricing.length > 0) {
            parsed.totalPrice = parsed.pricing.reduce((sum, p) => sum + p, 0);
        }

        const warrantyMatch = responseText.match(/(\d+)\s*years?\s*warranty/i);
        parsed.warranty = warrantyMatch ? `${warrantyMatch[1]} years` : 'Not specified';

        const deliveryMatch = responseText.match(/(\d+)\s*(days?|weeks?)/i);
        parsed.deliveryTime = deliveryMatch ? `${deliveryMatch[1]} ${deliveryMatch[2]}` : 'Not specified';

        const paymentMatch = responseText.match(/net\s*(\d+)/i);
        parsed.paymentTerms = paymentMatch ? `Net ${paymentMatch[1]}` : 'Not specified';

        return parsed;
    };

    const calculateScore = (parsed) => {
        let score = 0;
        let maxScore = 100;

        if (parsed.totalPrice > 0) {
            const allPrices = proposals.map(p => p.parsed?.totalPrice || Infinity);
            const minPrice = Math.min(...allPrices.filter(p => p > 0));
            if (minPrice > 0) {
                score += 40 * (minPrice / parsed.totalPrice);
            }
        }

        const warrantyYears = parseInt(parsed.warranty);
        if (warrantyYears >= 3) score += 20;
        else if (warrantyYears >= 2) score += 15;
        else if (warrantyYears >= 1) score += 10;

        const deliveryDays = parseInt(parsed.deliveryTime);
        if (deliveryDays <= 14) score += 20;
        else if (deliveryDays <= 30) score += 15;
        else if (deliveryDays <= 45) score += 10;

        const netDays = parseInt(parsed.paymentTerms?.match(/\d+/)?.[0]);
        if (netDays >= 60) score += 20;
        else if (netDays >= 45) score += 15;
        else if (netDays >= 30) score += 10;

        return Math.round((score / maxScore) * 100);
    };

    const generateRecommendation = (scoredProposals) => {
        const sorted = [...scoredProposals].sort((a, b) => b.score - a.score);
        const best = sorted[0];
        
        const reasons = [];
        if (best.score >= 80) reasons.push('Highest overall score');
        if (best.parsed.totalPrice === Math.min(...scoredProposals.map(p => p.parsed.totalPrice))) {
            reasons.push('Best pricing');
        }
        if (parseInt(best.parsed.warranty) >= 2) reasons.push('Good warranty coverage');
        if (parseInt(best.parsed.deliveryTime) <= 30) reasons.push('Fast delivery');
        
        return {
            vendor: best,
            reasons: reasons.length > 0 ? reasons : ['Best available option']
        };
    };

    if (loading) return <div className={styles.container}>Loading proposals...</div>;
    if (error) return <div className={styles.error}>Error: {error}</div>;
    if (proposals.length === 0) return <div className={styles.container}>No proposals received yet.</div>;

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Proposal Comparison</h2>

            {recommendation && (
                <div className={styles.recommendation}>
                    <h3 className={styles.recTitle}>
                        <span className={styles.recIcon}>⭐</span>
                        Recommended Vendor
                    </h3>
                    <div className={styles.recContent}>
                        <div className={styles.recVendor}>
                            <strong>{recommendation.vendor.vendorName}</strong>
                            <span className={styles.score}>Score: {recommendation.vendor.score}/100</span>
                        </div>
                        <div className={styles.recReasons}>
                            <strong>Why this vendor:</strong>
                            <ul>
                                {recommendation.reasons.map((reason, idx) => (
                                    <li key={idx}>{reason}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.comparisonTable}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Vendor</th>
                            <th>Total Price</th>
                            <th>Warranty</th>
                            <th>Delivery Time</th>
                            <th>Payment Terms</th>
                            <th>Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proposals.sort((a, b) => b.score - a.score).map((proposal, idx) => (
                            <tr 
                                key={proposal.id} 
                                className={idx === 0 ? styles.topRow : ''}
                            >
                                <td className={styles.vendorCell}>
                                    {idx === 0 && <span className={styles.badge}>Best</span>}
                                    <strong>{proposal.vendorName}</strong>
                                    <div className={styles.vendorEmail}>{proposal.vendorEmail}</div>
                                </td>
                                <td className={styles.priceCell}>
                                    ${proposal.parsed.totalPrice.toLocaleString()}
                                </td>
                                <td>{proposal.parsed.warranty}</td>
                                <td>{proposal.parsed.deliveryTime}</td>
                                <td>{proposal.parsed.paymentTerms}</td>
                                <td>
                                    <div className={styles.scoreCell}>
                                        <div className={styles.scoreBar}>
                                            <div 
                                                className={styles.scoreFill} 
                                                style={{ width: `${proposal.score}%` }}
                                            />
                                        </div>
                                        <span className={styles.scoreText}>{proposal.score}</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles.detailsSection}>
                <h3>Detailed Responses</h3>
                {proposals.map((proposal) => (
                    <div key={proposal.id} className={styles.detailCard}>
                        <h4>{proposal.vendorName}</h4>
                        <p className={styles.responseText}>{proposal.response}</p>
                        <div className={styles.metadata}>
                            Received: {new Date(proposal.receivedAt).toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProposalComparison;
