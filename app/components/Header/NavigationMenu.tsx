'use client'

import Link from 'next/link'
import styles from './Header.module.css'
import { NavLinks } from '@/types'

export default function NavigationMenu({ links }: { links: NavLinks[] }) {

    return (
        <nav className={styles.NavigationMenu}>
            {links.map(({ label, href }) => (
                <Link
                    key={href}
                    href={href}
                >
                    {label}
                </Link>
            ))}
        </nav>
    )
}