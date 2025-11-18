"use client";

import { usePathname } from "next/navigation";
import styles from "./stepBar.module.css";

const steps = [
    { label: "事業者情報", path: "/shop-signup/1" },
    { label: "口座登録", path: "/shop-signup/2" },
    { label: "身分証・証明書", path: "/shop-signup/3" },
    { label: "オプション", path: "/shop-signup/4" },
];

export default function StepBar() {
    const pathname = usePathname();
    const activeIndex = steps.findIndex((s) => pathname.startsWith(s.path));

    return (
        <div className={styles.wrapper}>
            {steps.map((step, index) => {
                const isActive = index === activeIndex;
                const isCompleted = index < activeIndex;

                return (
                    <div key={step.label} className={styles.stepItem}>
                        <div className={`${styles.circle} ${
                            isActive ? styles.active : ""
                        } ${isCompleted ? styles.completed : ""}`}
                        >
                            {isCompleted ? "✓" : index + 1}
                        </div>

                        <span className={`${styles.label} ${
                            isActive ? styles.labelActive : ""
                        }`}>
                            {step.label}
                        </span>

                        {index < steps.length - 1 && <div className={styles.line} />}
                    </div>
                );
            })}
        </div>
    );
};