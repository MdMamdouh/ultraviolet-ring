'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface SiteContent {
    key: string;
    content_ar: string;
    content_en: string;
    is_published?: boolean;
}

interface ContentContextType {
    content: Record<string, SiteContent>;
    loading: boolean;
    updateContent: (key: string, content_ar: string, content_en: string, is_published?: boolean) => Promise<void>;
    refreshContent: () => Promise<void>;
}

const ContentContext = createContext<ContentContextType | null>(null);

export const ContentProvider = ({ children }: { children: React.ReactNode }) => {
    const [content, setContent] = useState<Record<string, SiteContent>>({});
    const [loading, setLoading] = useState(true);

    const fetchContent = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('site_content')
                .select('*');

            if (error) {
                // If table doesn't exist yet (might happen if SQL failed silently), handle gracefully
                console.error('Error fetching content:', error);
            } else if (data) {
                const contentMap: Record<string, SiteContent> = {};
                data.forEach((item: SiteContent) => {
                    contentMap[item.key] = item;
                });
                setContent(contentMap);
            }
        } catch (error) {
            console.error('Error in fetchContent:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateContent = async (key: string, content_ar: string, content_en: string, is_published: boolean = true) => {
        try {
            const { error } = await supabase
                .from('site_content')
                .upsert({ key, content_ar, content_en, is_published })
                .select();

            if (error) throw error;

            setContent(prev => ({
                ...prev,
                [key]: { key, content_ar, content_en, is_published }
            }));
        } catch (error) {
            console.error('Error updating content:', error);
            throw error;
        }
    };

    useEffect(() => {
        fetchContent();
    }, []);

    return (
        <ContentContext.Provider value={{ content, loading, updateContent, refreshContent: fetchContent }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => {
    const context = useContext(ContentContext);
    if (!context) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
};
