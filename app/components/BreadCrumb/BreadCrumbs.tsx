
import Link from 'next/link'
import styles from "./BreadCrumbs.module.css"; // 必要ならCSSを用意

type Crumb = {
    label: string
    href?: string
}

type BreadcrumbProps = {
    hierarchy: Crumb[],       // サイト構造ベースの階層
    pageCategory: "detail" | "profile" | "overview" | "home"
}

const Breadcrumbs = ({ hierarchy, pageCategory }: BreadcrumbProps) => {
    return (
        <nav aria-label="breadcrumb" className={
            pageCategory === "detail" ? styles.BreadCrumbsDetail
                : pageCategory === "profile" ? styles.BreadCrumbsProfile
                    : pageCategory === "overview" ? styles.BreadCrumbsOverview
                        : styles.BreadCrumbsHome
        }>

            {hierarchy.map((item, idx) => (
                <span key={idx}>
                    {item.href && idx !== hierarchy.length - 1 ? (
                        <Link href={item.href}>{item.label}</Link>
                    ) : (
                        <span aria-current="page">{item.label}</span>
                    )}
                    {idx < hierarchy.length - 1 && <span className={styles.separator}> &gt; </span>}
                </span>
            ))}

        </nav>
    )
}

export default Breadcrumbs;
