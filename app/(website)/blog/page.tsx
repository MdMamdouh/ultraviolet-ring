'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBlogs } from '@/contexts/BlogContext';
import { Button } from '@/components/ui/button';
import { ChevronRight, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BlogPage() {
    const { t, language } = useLanguage();
    const { blogs } = useBlogs();
    const router = useRouter();

    const publishedBlogs = blogs.filter(b => b.is_published);

    return (
        <div className="container mx-auto px-4 lg:px-8 py-12 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-black text-[#1A3B5F] mb-6 text-center">المدونة</h1>
                <p className="text-xl text-gray-600 text-center mb-12">
                    مقالات ونصائح مهنية لمساعدتك في مسيرتك الوظيفية.
                </p>

                <div className="grid grid-cols-1 gap-8">
                    {publishedBlogs.map((post) => (
                        <div key={post.id} onClick={() => router.push(`/blog/${post.slug}`)} className="bg-white rounded-2xl shadow-sm border overflow-hidden flex flex-col md:flex-row hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="bg-gray-100 md:w-64 flex items-center justify-center shrink-0">
                                {post.image_url ? (
                                    <img src={post.image_url} alt={language === 'ar' ? post.title_ar : post.title_en} className="w-full h-full object-cover" />
                                ) : (
                                    <FileText size={48} className="text-gray-300 my-10" />
                                )}
                            </div>
                            <div className="p-8 flex-1">
                                <div className="text-sm text-[#00A3A3] font-bold mb-2">{new Date(post.created_at).toLocaleDateString()}</div>
                                <h2 className="text-2xl font-bold text-[#1A3B5F] mb-3">{language === 'ar' ? post.title_ar : post.title_en}</h2>
                                <p className="text-gray-600 mb-4 line-clamp-2">
                                    {(language === 'ar' ? post.content_ar : post.content_en)?.replace(/<[^>]+>/g, '').substring(0, 150)}...
                                </p>
                                <Button variant="ghost" className="px-0" icon={language === 'ar' ? ChevronRight : undefined}>
                                    اقرأ المزيد
                                </Button>
                            </div>
                        </div>
                    ))}

                    {publishedBlogs.length === 0 && (
                        <div className="text-center text-gray-500 p-12 border border-dashed rounded-2xl bg-gray-50">
                            لا توجد مقالات منشورة حالياً، يرجى العودة لاحقاً.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
