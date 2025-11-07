import styles from '@/styles/terms.module.css'

type TermsListSecondProps = {
    alfabet: string,
    text: string,
}

export default function TermsListSecond({ alfabet, text }: TermsListSecondProps) {
    return (
        <div className={styles.listParent}>
            <p>{alfabet}</p>
            <p>.</p>
            <p className='ml-[0.5em]'>{text}</p>
        </div>
    )
}