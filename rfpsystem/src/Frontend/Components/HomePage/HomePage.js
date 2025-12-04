import React, { useState } from "react";
import styles from "./HomePage.module.css";

const HomePage = () => {

    const [request, setRequest] = useState({
        title: "",
        description: "",
        products: [{
            name: "",
            quantity: 0,
        }]
    });

    return (
        <div className={styles.container}>
            
            <h1 className={styles.heading}>RFP Dashboard</h1>

            <p className={styles.subtitle}>Welcome to the RFP Dashboard. Use the navigation bar to add vendors and manage your RFPs.</p>

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
                            + Add Product
                        </button>
                    </div>
                </div>

                <button type="submit" className={styles.submitButton}>Save Request</button>
            </form>

        </div>
    );
};

export default HomePage;