'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useJobs } from '@/contexts/JobsContext';
import { useContent } from '@/contexts/ContentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';

export default function ContactPage() {
    const { t, language } = useLanguage();
    const { submitMessage } = useJobs();
    const { content } = useContent();

    const addressAr = content['contact_address']?.content_ar || 'القاهرة، مصر';
    const addressEn = content['contact_address']?.content_en || 'Cairo, Egypt';
    const companyEmail = content['contact_email']?.content_en || 'support@jahez.com';
    const companyPhone = content['contact_phone']?.content_en || '+20 123 456 7890';
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await submitMessage(name, email, message);
            setSuccess(true);
            setName('');
            setEmail('');
            setMessage('');
        } catch (error) {
            console.error('Error submitting message:', error);
            alert('حدث خطأ أثناء الإرسال');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-[#1A3B5F] text-white py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-black mb-4">{t('contact')}</h1>
                    <p className="text-xl text-white/80">{language === 'ar' ? 'نحن هنا لمساعدتك والإجابة على استفساراتك' : 'We are here to help and answer your questions'}</p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl lg:col-span-1 border-t-4 border-[#00A3A3]">
                        <h3 className="text-2xl font-bold text-[#1A3B5F] mb-6">{language === 'ar' ? 'معلومات التواصل' : 'Contact Information'}</h3>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 rounded-lg text-[#1A3B5F]">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{language === 'ar' ? 'العنوان' : 'Address'}</h4>
                                    <p className="text-gray-600 mt-1">{language === 'ar' ? addressAr : addressEn}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 rounded-lg text-[#1A3B5F]">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</h4>
                                    <p className="text-gray-600 mt-1">{companyEmail}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-blue-50 rounded-lg text-[#1A3B5F]">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">{language === 'ar' ? 'الهاتف' : 'Phone'}</h4>
                                    <p className="text-gray-600 mt-1" dir="ltr">{companyPhone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl lg:col-span-2">
                        {success ? (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Send size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-[#1A3B5F] mb-2">{t('requestSuccess')}</h3>
                                <p className="text-gray-600 mb-8">{t('requestSuccessMsg')}</p>
                                <Button onClick={() => setSuccess(false)} variant="outline">
                                    {language === 'ar' ? 'إرسال رسالة أخرى' : 'Send Another Message'}
                                </Button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('fullName')}</label>
                                        <Input
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder={language === 'ar' ? 'الاسم بالكامل' : 'Full Name'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">{t('email')}</label>
                                        <Input
                                            required
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="example@domain.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{language === 'ar' ? 'الرسالة' : 'Message'}</label>
                                    <Textarea
                                        required
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                                        className="h-32"
                                    />
                                </div>

                                <Button type="submit" className="w-full md:w-auto min-w-[200px]" size="lg" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t('submitting') || 'جاري الإرسال...'}
                                        </>
                                    ) : (
                                        <>
                                            {t('submitRequest') || 'إرسال'}
                                            <Send className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
