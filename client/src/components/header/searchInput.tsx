"use client";

import { useState } from "react";
import styles from "./header.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function SearchInput() {
    const [value, setValue] = useState("");

    return (
        <form className={styles.searchInputDiv}>
            <input
            type='text'
            name='商品検索'
            placeholder='検索'
            className={styles.searchInput}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            />
            <FontAwesomeIcon
            icon={faSearch} 
            className={`${styles.searchIcon} ${value ? styles.activeIcon : ""}`} 
            />
        </form>
    );
};