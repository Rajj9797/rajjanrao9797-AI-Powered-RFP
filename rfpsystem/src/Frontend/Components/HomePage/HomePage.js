import React, { useState } from "react";
import styles from "./HomePage.module.css";
import VendorList from "../VendorList/VendorList";

const HomePage = () => {
    const [isRequestSaved, setIsRequestSaved] = useState(false);

    const [request, setRequest] = useState(() => {
        const saved = localStorage.getItem("rfp_request");
        return saved ? JSON.parse(saved) : {
            title: "",
            description: "",
            products: [{
                name: "",
                quantity: 0,
                specifications: ""
            }],
            deliveryTimeline: Date.now(),
            budget: 0
        };
    });

    
    const saveRequest = () => {
        localStorage.setItem("rfp_request", JSON.stringify(request));
        setIsRequestSaved(true);
    };

    const handleAIGenerated = (aiRFP) => {
        setRequest(aiRFP);
        localStorage.setItem("rfp_request", JSON.stringify(aiRFP));
        setIsRequestSaved(true);
    };



    const res = localStorage.getItem("rfp_request");

    let data = null;
    if (res) {
        try {
            const parsed = JSON.parse(res);
            data = {
                title: parsed.title ?? "",
                description: parsed.description ?? "",
                products: Array.isArray(parsed.products)
                    ? parsed.products.map((p) => ({
                          name: p?.name ?? "",
                          quantity: Number.isFinite(p?.quantity) ? p.quantity : Number(p?.quantity) || 0,
                          specifications: p?.specifications ?? "",
                      }))
                    : [],
                deliveryDate: parsed.deliveryTimeline ? new Date(parsed.deliveryTimeline).toISOString().split("T")[0] : null,
                deliveryTimestamp: parsed.deliveryTimeline ? Number(parsed.deliveryTimeline) : null,
                budget: parsed.budget != null ? Number(parsed.budget) : 0,
                budgetFormatted: `$${(Number(parsed.budget) || 0).toFixed(2)}`,
                raw: parsed,
            };
        } catch (err) {
            console.error("Failed to parse rfp_request from localStorage:", err);
            data = null;
        }
    }
    

    console.log("RFP Request data:", data);

    return (
        <div className={styles.container}>
            
            <h1 className={styles.heading}>RFP Dashboard</h1>

            <div className={styles.modeSelector}>
                <button 
                    className={styles.modeButtonActive}
                >
                    📝 Manual Entry
                </button>
            </div>
            <form
                className={styles.form}
                onSubmit={(e) => {
                    e.preventDefault();
                    console.log("Saved request:", request);
                }}
            >
                <div className={styles.formGroup}>
                    <label className={styles.label}>Title</label>
                    <input
                        className={styles.input}
                        type="text"
                        value={request.title}
                        onChange={(e) =>
                            setRequest((prev) => ({ ...prev, title: e.target.value }))
                        }
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Description</label>
                    <textarea
                        className={styles.textarea}
                        value={request.description}
                        onChange={(e) =>
                            setRequest((prev) => ({ ...prev, description: e.target.value }))
                        }
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Products</label>
                    <div className={styles.productsSection}>
                        {request.products.map((product, idx) => (
                            <div key={idx} className={styles.productItem}>
                                <input
                                    type="text"
                                    placeholder="Product name"
                                    value={product.name}
                                    onChange={(e) =>
                                        setRequest((prev) => {
                                            const products = prev.products.map((p, i) =>
                                                i === idx ? { ...p, name: e.target.value } : p
                                            );
                                            return { ...prev, products };
                                        })
                                    }
                                />
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Quantity"
                                    value={product.quantity}
                                    onChange={(e) => {
                                        const q = parseInt(e.target.value || "0", 10);
                                        setRequest((prev) => {
                                            const products = prev.products.map((p, i) =>
                                                i === idx ? { ...p, quantity: q } : p
                                            );
                                            return { ...prev, products };
                                        });
                                    }}
                                />
                                <input
                                    type="text"
                                    placeholder="Specifications"
                                    value={product.specifications}
                                    onChange={(e) =>
                                        setRequest((prev) => {
                                            const products = prev.products.map((p, i) =>
                                                i === idx ? { ...p, specifications: e.target.value } : p
                                            );
                                            return { ...prev, products };
                                        })
                                    }
                                />
                                <button
                                    type="button"
                                    className={styles.removeButton}
                                    onClick={() =>
                                        setRequest((prev) => ({
                                            ...prev,
                                            products: prev.products.filter((_, i) => i !== idx),
                                        }))
                                    }
                                >
                                    Remove
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className={styles.addProductButton}
                            onClick={() =>
                                setRequest((prev) => ({
                                    ...prev,
                                    products: [...prev.products, { name: "", quantity: 0 }],
                                }))
                            }
                        >
                            Add Product
                        </button>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Expected Delivery</label>
                            <input
                                className={styles.input}
                                type="date"
                                value={request.deliveryTimeline ? new Date(request.deliveryTimeline).toISOString().split('T')[0] : ""}
                                onChange={(e) =>
                                    setRequest((prev) => ({ ...prev, deliveryTimeline: new Date(e.target.value).getTime() }))
                                }
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Budget</label>
                            <input
                                className={styles.input}
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder="Budget amount"
                                value={request.budget}
                                onChange={(e) =>
                                    setRequest((prev) => ({ ...prev, budget: parseFloat(e.target.value || "0") }))
                                }
                            />
                        </div>
                    </div>
                </div>

                <button type="button" className={styles.submitButton} onClick={saveRequest}>Select vendor</button>
            </form>

            {isRequestSaved && <VendorList requestData={data} />}

        </div>
    );
};

export default HomePage;