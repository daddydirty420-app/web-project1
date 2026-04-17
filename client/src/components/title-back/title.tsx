import styles from './title-back.module.css';

type Props = {
    title: string;
};

export const Title = ({ title }: Props) => {
    return (
        <div className="mb-2">
            <h1 className={styles.title}>{title}</h1>
        </div>
    );
};
