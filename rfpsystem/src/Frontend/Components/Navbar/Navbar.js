
import React, { useState } from "react";
import styles from "./Navbar.module.css";
import { Link } from "react-router-dom";


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
                    <Link
                        to="/"
                        className={styles.navItem}
                        aria-label="homepage"
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </Link>
                </li>
                <li>
                    <Link
                        to="/email"
                        className={styles.navItem}
                        aria-label="email"
                        onClick={() => setMenuOpen(false)}
                    >
                        Email
                    </Link>
                </li>
                <li>
                    <Link
                        to="/addVendor"
                        className={styles.navItem}
                        aria-label="addVendor"
                        onClick={() => setMenuOpen(false)}
                    >
                        Add Vendor
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;