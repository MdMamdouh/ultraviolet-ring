'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { useContent } from '@/contexts/ContentContext';

export const SiteHeader = () => {
    const { language, t, toggleLanguage } = useLanguage();
    const { content } = useContent();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const router = useRouter();

    const shouldShowAbout = content['about_us']?.is_published !== false;

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 cursor-pointer">
                        <div className="w-10 h-10">
                            <svg viewBox="0 0 48 48">
                                <path fill="#00A3A3" d="M 8 24 L 8 40 L 24 40 L 24 24 Z" />
                                <path fill="#1A3B5F" d="M 24 8 L 24 24 L 40 24 L 40 8 Z" opacity="0.9" />
                                <rect fill="#00A3A3" x="24" y="24" width="16" height="16" opacity="0.6" />
                            </svg>
                        </div>
                        <span className="text-2xl font-black text-[#1A3B5F]">JAHEZ</span>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-[#1A3B5F] font-bold hover:text-[#00A3A3] transition-colors">{t('home')}</Link>
                        <Link href="/jobs" className="text-[#1A3B5F] font-bold hover:text-[#00A3A3] transition-colors">{t('jobs')}</Link>
                        {shouldShowAbout && (
                            <Link href="/about" className="text-[#1A3B5F] font-bold hover:text-[#00A3A3] transition-colors">{t('aboutUs')}</Link>
                        )}
                        <Link href="/blog" className="text-[#1A3B5F] font-bold hover:text-[#00A3A3] transition-colors">{t('blog')}</Link>
                        <Button variant="outline" size="sm" onClick={() => router.push('/post-job')}>{t('postJob')}</Button>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleLanguage}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-bold"
                        >
                            <Globe size={20} />
                            {language === 'ar' ? 'EN' : 'ع'}
                        </button>

                        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden pb-4 border-t pt-4">
                        <div className="flex flex-col gap-3">
                            <Link href="/" className="px-4 py-2 text-[#1A3B5F] font-bold hover:bg-gray-50 rounded-lg">{t('home')}</Link>
                            <Link href="/jobs" className="px-4 py-2 text-[#1A3B5F] font-bold hover:bg-gray-50 rounded-lg">{t('jobs')}</Link>
                            {shouldShowAbout && (
                                <Link href="/about" className="px-4 py-2 text-[#1A3B5F] font-bold hover:bg-gray-50 rounded-lg">{t('aboutUs')}</Link>
                            )}
                            <Link href="/blog" className="px-4 py-2 text-[#1A3B5F] font-bold hover:bg-gray-50 rounded-lg">{t('blog')}</Link>
                            <Button size="sm" onClick={() => router.push('/post-job')}>{t('postJob')}</Button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};
