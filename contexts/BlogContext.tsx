'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Blog {
    id: number;
    title_ar: string;
    title_en: string;
    slug: string;
    content_ar: string;
    content_en: string;
    image_url: string;
    is_published: boolean;
    author: string;
    created_at: string;
}

interface BlogContextType {
    blogs: Blog[];
    loading: boolean;
    addBlog: (blog: Omit<Blog, 'id' | 'created_at'>) => Promise<void>;
    updateBlog: (id: number, blog: Partial<Blog>) => Promise<void>;
    deleteBlog: (id: number) => Promise<void>;
    uploadImage: (file: File) => Promise<string>;
}

const BlogContext = createContext<BlogContextType | null>(null);

export function BlogProvider({ children }: { children: React.ReactNode }) {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            const { data, error } = await supabase
                .from('blogs')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching blogs:', error);
            } else {
                setBlogs(data || []);
            }
            setLoading(false);
        };
        fetchBlogs();
    }, []);

    const uploadImage = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `blog-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('public-assets')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from('public-assets')
            .getPublicUrl(filePath);

        return data.publicUrl;
    };

    const addBlog = async (blog: Omit<Blog, 'id' | 'created_at'>) => {
        const { data, error } = await supabase
            .from('blogs')
            .insert([blog])
            .select();

        if (error) throw error;
        if (data) setBlogs([data[0], ...blogs]);
    };

    const updateBlog = async (id: number, updatedBlog: Partial<Blog>) => {
        const { data, error } = await supabase
            .from('blogs')
            .update(updatedBlog)
            .eq('id', id)
            .select();

        if (error) throw error;
        if (data) {
            setBlogs(blogs.map(b => b.id === id ? { ...b, ...updatedBlog } : b));
        }
    };

    const deleteBlog = async (id: number) => {
        const { error } = await supabase
            .from('blogs')
            .delete()
            .eq('id', id);

        if (error) throw error;
        setBlogs(blogs.filter(b => b.id !== id));
    };

    return (
        <BlogContext.Provider value={{ blogs, loading, addBlog, updateBlog, deleteBlog, uploadImage }}>
            {children}
        </BlogContext.Provider>
    );
}

export const useBlogs = () => {
    const context = useContext(BlogContext);
    if (!context) throw new Error('useBlogs must be used within BlogProvider');
    return context;
};
