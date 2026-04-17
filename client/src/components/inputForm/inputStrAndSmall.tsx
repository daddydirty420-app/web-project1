import styles from "./imputForm.module.css";
import { InputTitle } from "./inputTitle";

type Props = {
    title: string;
    hissu: boolean;
    type?: string;
    value: string;
    onChange: (val: string) => void;
    placeholder: string;
    numeric?: boolean;
    patternNum?: boolean;
    small: string;
};

export const InputStrAndSmall = ({
    title,
    hissu,
    type,
    value,
    onChange,
    placeholder,
    numeric,
    patternNum,
    small,
}: Props) => {
    return (
        <div className={styles.inputDiv}>
            <InputTitle title={title} hissu={hissu} />
            <input
                type={type || "text"}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={styles.inputStr}
                required={hissu}
                inputMode={numeric ? "numeric" : "text"}
                pattern={patternNum ? "[0-9]*" : ""}
            />
            <small className={styles.small}>{small}</small>
        </div>
    );
};
