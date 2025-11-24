import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronRight } from '@fortawesome/free-solid-svg-icons';
import styles from './styles/guide-link.module.css';
import Link from 'next/link';

type GuideLinkProps = {
    heading: string,
    url: string,
};

export default function GuideLink({ heading, url }: GuideLinkProps) {
    return (
        <div className={styles.heading}>
            <h3>
                <Link href={url} className={styles.link}>
                    {heading}
                    <FontAwesomeIcon icon={faCircleChevronRight} className={styles.icon} />
                </Link>
            </h3>
        </div>
    );
}