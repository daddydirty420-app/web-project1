/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import styles from "./confirmcard.module.css";
import { useState } from "react";
import DatePicker from "react-datepicker";
import { ja } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css"; 

type RadioOption = {
    label: string;
    value: string | number;
};

type Props = {
    title: string;
    content: string;
    link?: string;
    input?: boolean;
    date?: boolean;
    radio?: boolean;
    value?: string | number | Date | null;
    radioOptions?: RadioOption[];
    onChange?: (v: any) => void;
    onSubmit?: () => void;
};

export const ConfirmSection = ({ title, content, link, input, date, radio, value, radioOptions, onChange, onSubmit }: Props) => {
    const [inputVisible, setInputVisible] = useState(false);
    const [dateVisible, setDateVisible] = useState(false);
    const [radioVisible, setRadioVisible] = useState(false);
    const router = useRouter();

    const handleClick = () => {
        if (!link) {
           if (input) {
            setInputVisible(!inputVisible);
           } else if (radio) {
            setRadioVisible(!radioVisible);
           } else if (date) {
            setDateVisible(!dateVisible);
           }
        } else if (link) {
            router.push(link);
        }
    };

    return (
        <section className={styles.confirmCard}>
            <div className={styles.header}>
                <h3 className={styles.title}>{title}</h3>

                <button
                type="button"
                onClick={handleClick}
                className={styles.editButton}
                >
                    編集
                </button>
            </div>
            
            <p className={styles.content}>
                {(content ?? "").split("\n").map((line, i) => (
                    <span key={i} className="mt-0">
                        {line}
                        <br />
                    </span>
                ))}
            </p>

            {input && inputVisible && onChange && onSubmit && (
                <label className={styles.inputFlex}>
                    <input
                    type="text"
                    name={title}
                    value={value as string}
                    onChange={(e) => onChange(e.target.value)}
                    className={styles.input}
                    />

                    <button
                    type="button"
                    className={styles.inputButton}
                    onClick={() => {
                        onSubmit();
                        setInputVisible(false);
                    }}
                    >
                        登録
                    </button>
                </label>
            )}

            {date && dateVisible && onChange && onSubmit && (
                <label className={styles.inputFlex}>
                    <DatePicker
                    value={content}
                    selected={value instanceof Date ? value : null}
                    onChange={(date) => onChange(date)}
                    dateFormat="yyyy年MM月dd日"
                    locale={ja}
                    className={styles.input}
                    maxDate={new Date()}
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    />

                    <button
                        type="button"
                        className={styles.inputButton}
                        onClick={() => {
                            onSubmit();
                            setDateVisible(false);
                        }}
                    >
                        登録
                    </button>
                </label>
            )}

            {radio && radioVisible && radioOptions && onChange && onSubmit && (
                <div className={styles.inputFlex}>
                    <div className={styles.radioFlex}>
                        <div className={styles.radioColumn}>
                            {radioOptions.map((opt) => (
                                <label key={opt.value} className={styles.radioLabel}>
                                    <input
                                    type="radio"
                                    name={title}
                                    value={opt.value}
                                    checked={String(value) === String(opt.value)}
                                    onChange={() => onChange(String(opt.value))}
                                    className={styles.radio}
                                    />
                                    <p className={styles.radioText}>{opt.label}</p>
                                </label>
                            ))}
                        </div>

                        <button
                        type="button"
                        className={styles.inputButton}
                        onClick={() => {
                            onSubmit();
                            setRadioVisible(false);
                        }}
                        >
                            登録
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
};