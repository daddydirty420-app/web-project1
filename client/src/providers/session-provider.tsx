"use client";

import { createContext, useContext } from "react";
import type { Session } from "next-auth";

const SessionContext = createContext<Session | null>(null);

export function SessionProviderCustom({ session, children }: { session: Session | null; children: React.ReactNode }) {
    return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

export function useSessionContext() {
    return useContext(SessionContext);
}
