'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBlogs } from '@/contexts/BlogContext';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function BlogPostPage() {
    const { language } = useLanguage();
    const { blogs, loading } = useBlogs();
    const params = useParams();
    const router = useRouter();

    const decodedSlug = params.slug ? decodeURIComponent(params.slug as string) : '';
    const post = blogs.find(b => b.slug === decodedSlug && b.is_published);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-32 text-center min-h-screen">
                <div className="animate-spin w-12 h-12 border-4 border-[#00A3A3] border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500">جاري تحميل المقال...</p>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="container mx-auto px-4 py-32 text-center min-h-screen">
                <h1 className="text-3xl font-bold text-[#1A3B5F] mb-4">المقال غير موجود</h1>
                <p className="text-gray-500 mb-8">عفواً، لم نتمكن من العثور على المقال الذي تبحث عنه.</p>
                <Button onClick={() => router.push('/blog')}>العودة للمدونة</Button>
            </div>
        );
    }

    const title = language === 'ar' ? post.title_ar : post.title_en;
    const content = language === 'ar' ? post.content_ar : post.content_en;

    return (
        <div className="container mx-auto px-4 lg:px-8 py-12 min-h-screen">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 lg:p-12 shadow-sm border">
                <Button variant="ghost" onClick={() => router.push('/blog')} className="mb-6 text-gray-500 hover:text-[#1A3B5F]" icon={language === 'ar' ? ArrowRight : ArrowLeft}>
                    العودة للمدونة
                </Button>

                {post.image_url && (
                    <img src={post.image_url} alt={title} className="w-full h-[300px] lg:h-[400px] object-cover rounded-3xl mb-10 shadow-md" />
                )}

                <div className="text-[#00A3A3] font-bold mb-4">{new Date(post.created_at).toLocaleDateString()} • {post.author}</div>
                <h1 className="text-3xl lg:text-5xl font-black text-[#1A3B5F] mb-8 leading-tight">{title}</h1>

                <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
    );
}
