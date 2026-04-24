"use client";

import { faCircleChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useEffect, useRef, useState } from "react";
import styles from "./styles/accordion.module.css";

type accordionProps = {
    heading: string;
    children: ReactNode;
};

export const Accordion = ({ heading, children }: accordionProps) => {
    const [textIsOpen, setTextIsOpen] = useState(false);
    const refText = useRef<HTMLDivElement>(null);

    const toggleText = () => {
        setTextIsOpen((prev) => !prev);
    };

    useEffect(() => {
        const el = refText.current;
        if (!el) return;

        if (textIsOpen) {
            el.style.height = `${el.scrollHeight}px`;
            const timeout = setTimeout(() => {
                el.style.height = "auto";
            }, 500);
            return () => clearTimeout(timeout);
        } else {
            el.style.height = `${el.scrollHeight}px`;
            requestAnimationFrame(() => {
                el.style.height = "0px";
            });
        }
    }, [textIsOpen]);

    return (
        <div className={textIsOpen ? styles.open : styles.close}>
            <h3 className={styles.heading}>
                <button onClick={toggleText}>
                    {heading}
                    <FontAwesomeIcon icon={faCircleChevronDown} className={styles.icon} />
                </button>
            </h3>
            <div className={styles.text} ref={refText}>
                <div className={styles.textInner}>{children}</div>
            </div>
        </div>
    );
};
