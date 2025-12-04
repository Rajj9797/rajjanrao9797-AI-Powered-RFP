
import React, { useState } from "react";
import styles from "./Navbar.module.css";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleToggle = () => {
        setMenuOpen((prev) => !prev);
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.logo}>RFP Dashboard</div>
            <button
                className={styles.hamburger}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                aria-expanded={menuOpen}
                onClick={handleToggle}
            >
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
                <span className={styles.bar}></span>
            </button>
            <ul className={`${styles.navList} ${menuOpen ? styles.open : ""}`}>
                <li>
                    <a href="/addVendor" className={styles.navItem} aria-label="addVendor">
                        Add Vendor
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;