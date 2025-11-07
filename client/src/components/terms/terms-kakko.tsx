import { ReactNode } from 'react'
import styles from '@/styles/terms.module.css'

type TermsKakkoProps = {
    number: number,
    heading: string,
    children: ReactNode
}

export default function TermsKakko ({ number, heading, children }: TermsKakkoProps) {
    return (
        <div>
            <h4 className={styles.kakkoTitle}>（ {number} ）　「{heading}」</h4>
            {children}
        </div>
    )
}