import React from 'react';
import { createPortal } from 'react-dom';

type Props = {
    children: React.ReactNode;
};

export default function Portial({ children }: Props) {
    if (typeof window === 'undefined') return null;
    return createPortal(children, document.body);
}
