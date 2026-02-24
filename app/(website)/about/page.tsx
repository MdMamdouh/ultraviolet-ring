'use client';

import { useContent } from '@/contexts/ContentContext';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { useLanguage } from '@/contexts/LanguageContext'; // Assuming useLanguage is imported from here
import { Target, Shield } from 'lucide-react'; // Assuming these icons are used and need importing
import { Button } from '@/components/ui/button'; // Assuming Button component is from shadcn/ui or similar

export default function AboutPage() {
    const { t, language } = useLanguage();
    const { content, loading } = useContent();

    if (loading) {
        return <LoadingSkeleton />;
    }

    const aboutContent = content['about_us'];

    // Check if content is explicitly unpublished
    if (aboutContent?.is_published === false) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-[#1A3B5F] mb-4">404</h1>
                    <p className="text-xl text-gray-600">{t('pageNotFound') || 'Page Not Found'}</p>
                    <Button className="mt-6" onClick={() => window.location.href = '/'}>{t('backToHome') || 'Back to Home'}</Button>
                </div>
            </div>
        );
    }

    const displayText = aboutContent
        ? (language === 'ar' ? (aboutContent.content_ar || "أهلاً بكم في جاهز...") : (aboutContent.content_en || "Welcome to Jahez..."))
        : t('aboutUsDescription') || 'نحن منصة "جاهز"، المنصة الرائدة لربط الكفاءات المصرية بأفضل فرص العمل في الشرق الأوسط.';

    return (
        <div className="container mx-auto px-4 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-black text-[#1A3B5F] mb-6 text-center">{t('aboutUs')}</h1>

                {loading ? <LoadingSkeleton /> : (
                    <div className="text-xl text-gray-600 text-center mb-12 whitespace-pre-line leading-relaxed">
                        {displayText}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <div className="w-12 h-12 bg-[#e6f7f7] rounded-lg flex items-center justify-center text-[#00A3A3] mb-4">
                            <Target size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-[#1A3B5F] mb-3">رؤيتنا</h2>
                        <p className="text-gray-600 whitespace-pre-line">
                            {content['about_vision']
                                ? (language === 'ar' ? content['about_vision'].content_ar : content['about_vision'].content_en)
                                : "تمكين كل محترف من الوصول إلى الوظيفة التي يستحقها، ومساعدة الشركات على بناء فرق عمل استثنائية."}
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <div className="w-12 h-12 bg-[#e6f7f7] rounded-lg flex items-center justify-center text-[#00A3A3] mb-4">
                            <Shield size={24} />
                        </div>
                        <h2 className="text-2xl font-bold text-[#1A3B5F] mb-3">قيمنا</h2>
                        <p className="text-gray-600 whitespace-pre-line">
                            {content['about_values']
                                ? (language === 'ar' ? content['about_values'].content_ar : content['about_values'].content_en)
                                : "الشفافية، المصداقية، والابتكار هي الأسس التي نبني عليها كل ما نقدمه في منصة جاهز."}
                        </p>
                    </div>
                </div>

                <div className="bg-[#1A3B5F] text-white rounded-3xl p-12 text-center">
                    <h2 className="text-3xl font-bold mb-6">لماذا تختار جاهز؟</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="text-4xl font-black text-[#00A3A3] mb-2">500+</div>
                            <p className="font-semibold">شركة شريكة</p>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-[#00A3A3] mb-2">10K+</div>
                            <p className="font-semibold">باحث عن عمل</p>
                        </div>
                        <div>
                            <div className="text-4xl font-black text-[#00A3A3] mb-2">95%</div>
                            <p className="font-semibold">نسبة رضا العملاء</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
