'use client'

import React from 'react'
import styles from './SorterFilter.module.css'

export default function SorterFilter() {
    return (
        <div className={styles.sorterFilter}>
            <select className={styles.select}>
                <option value="newest">新着順</option>
                <option value="popular">人気順</option>
                <option value="unanswered">未回答</option>
            </select>
        </div>
    )
}
