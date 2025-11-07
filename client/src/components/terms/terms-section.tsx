import { ReactNode } from "react"
import styles from 'styles/terms.module.css'

type TermsSectionProps = {
    number: number,
    heading: string,
    children: ReactNode
}

export default function TermsSection({ number, heading, children }:TermsSectionProps) {
    return (
        <section className={styles.sectionBox}>
            <h2 className={styles.sectionTitle}>第 {number} 章　{heading}</h2>
            {children}
        </section>
    )
}