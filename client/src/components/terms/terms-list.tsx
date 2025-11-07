import styles from '@/styles/terms.module.css'

type TermsListProps = {
    number: number,
    text: string,
}

export default function TermsList({ number, text }: TermsListProps) {
    return (
        <div className={styles.listParent}>
            <p>{number}</p>
            <p>.</p>
            <p className='ml-[0.5em]'>{text}</p>
        </div>
    )
}