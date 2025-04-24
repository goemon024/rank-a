'use client'

import Link from 'next/link'
import styles from './Header.module.css'

interface NavItem {
    label: string
    href: string
}

interface NavigationMenuProps {
    items: NavItem[]
}

export default function NavigationMenu({ items }: NavigationMenuProps) {

    return (
        <nav className={styles.NavigationMenu}>
            {items.map(({ label, href }) => (
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