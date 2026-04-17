import styles from './imputForm.module.css';

type Props = {
    title: string;
    hissu?: boolean;
};

export const InputTitle = ({ title, hissu }: Props) => {
    return (
        <label className={styles.titleFlex}>
            <p className={styles.title}>{title}</p>
            {hissu && <span className={styles.hissuMark}>*</span>}
        </label>
    );
};
