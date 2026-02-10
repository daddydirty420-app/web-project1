'use client';

import React, { useState, useRef, useEffect } from 'react';
import AcStyle from './styles/accordion.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleChevronDown } from '@fortawesome/free-solid-svg-icons';
import { ReactNode } from 'react';

type accordionProps = {
    heading: string,
    children: ReactNode
};

export const Accordion = ({ heading, children }: accordionProps) => {
    const [textIsOpen, setTextIsOpen] = useState(false);
    const refText = useRef<HTMLDivElement>(null);

    const toggleText = () => {
        setTextIsOpen((prev) => !prev)
    };

    useEffect(() => {
        const el = refText.current
        if (!el) return

        if (textIsOpen) {
            el.style.height = `${el.scrollHeight}px`
            const timeout = setTimeout(() => {
                el.style.height = 'auto'
            }, 500)
            return () => clearTimeout(timeout)
        } else {
            el.style.height = `${el.scrollHeight}px`
            requestAnimationFrame(() => {
                el.style.height = '0px'
            })
        }
    }, [textIsOpen]);

    return (
        <div className={textIsOpen ? AcStyle.open : AcStyle.close}>
            <h3 className={AcStyle.heading}>
                <button onClick={toggleText}>
                    {heading}
                    <FontAwesomeIcon icon={faCircleChevronDown} className={AcStyle.icon} />
                </button>
            </h3>
            <div 
            className={AcStyle.text}
            ref={refText}
            >
                <div className={AcStyle.textInner}>{children}</div>
            </div>
        </div>
    );
}