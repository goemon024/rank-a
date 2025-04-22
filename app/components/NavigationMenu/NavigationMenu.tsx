'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './NavigationMenu.module.css'

interface NavItem {
    label: string
    href: string
}

interface NavigationMenuProps {
    items: NavItem[]
}

export default function NavigationMenu({ items }: NavigationMenuProps) {
    const pathname = usePathname()

    return (
        <nav className={styles.NavigationMenu}>
            {items.map(({ label, href }) => (
                <Link
                    key={href}
                    href={href}
                //   className={`text-blue-600 font-semibold hover:underline ${
                //     pathname === href ? 'border-b-2 border-blue-600' : ''
                //   }`}
                >
                    {label}
                </Link>
            ))}
        </nav>
    )
}
