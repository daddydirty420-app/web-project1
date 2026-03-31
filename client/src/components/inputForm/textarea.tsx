import styles from "./imputForm.module.css";
import { InputTitle } from "./inputTitle";

type Props = {
    title: string;
    hissu?: boolean;
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
    maxLength: number;
};

export const Textarea = ({
    title,
    hissu,
    value,
    onChange,
    placeholder,
    maxLength
}: Props) => {
    return (
        <div className={styles.inputDiv}>
            <InputTitle title={title} hissu={hissu} />
            <textarea
            name="introduction"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            maxLength={maxLength}
            placeholder={placeholder}
            className={styles.textarea}
            required={hissu}
            />
        </div>
    );
};