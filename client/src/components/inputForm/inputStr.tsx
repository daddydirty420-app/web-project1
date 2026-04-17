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
    maxLength?: number;
};

export const InputStr = ({
    title,
    hissu,
    type,
    value,
    onChange,
    placeholder,
    numeric,
    patternNum,
    maxLength,
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
                maxLength={maxLength}
            />
        </div>
    );
};
