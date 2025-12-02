import styles from "../../lp.module.css";

type Props = {
    number: number;
    text: string;
};

export default function CampaignH3({ number, text }: Props) {
    return (
        <div className={styles.campaignTitleDiv}>
            <p className={styles.campaignNumber}>{number}</p>
            <h3 className={styles.campaignTitle}>{text}</h3>
        </div>
    );
};