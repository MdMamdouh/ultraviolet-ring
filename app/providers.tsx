'use client';

import React from 'react';

import { LanguageProvider } from "@/contexts/LanguageContext";
import { ContentProvider } from "@/contexts/ContentContext";
import { JobsProvider } from "@/contexts/JobsContext";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            <ContentProvider>
                <JobsProvider>
                    {children}
                </JobsProvider>
            </ContentProvider>
        </LanguageProvider>
    );
}
