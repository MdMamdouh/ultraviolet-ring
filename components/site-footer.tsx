'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export const SiteFooter = () => {
    const { t } = useLanguage();

    return (
        <footer className="bg-[#1A3B5F] text-white mt-auto">
            <div className="container mx-auto px-4 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10">
                                <svg viewBox="0 0 48 48">
                                    <path fill="white" d="M 8 24 L 8 40 L 24 40 L 24 24 Z" opacity="0.9" />
                                    <path fill="white" d="M 24 8 L 24 24 L 40 24 L 40 8 Z" opacity="0.8" />
                                    <rect fill="white" x="24" y="24" width="16" height="16" opacity="0.7" />
                                </svg>
                            </div>
                            <span className="text-2xl font-black">JAHEZ</span>
                        </div>
                        <p className="text-gray-300 mb-4">نربط الكفاءات المصرية بأفضل فرص العمل</p>
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors">
                                <span className="text-xl">𝕏</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors">
                                <span className="text-xl">in</span>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition-colors">
                                <span className="text-xl">f</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4">{t('forJobSeekers')}</h3>
                        <ul className="space-y-2">
                            <li><Link href="/jobs" className="text-gray-300 hover:text-white transition-colors">{t('jobs')}</Link></li>
                            <li><Link href="/blog" className="text-gray-300 hover:text-white transition-colors">{t('blog')}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4">{t('forCompanies')}</h3>
                        <ul className="space-y-2">
                            <li><Link href="/post-job" className="text-gray-300 hover:text-white transition-colors">{t('postJob')}</Link></li>
                            <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">{t('contact')}</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8">
                    <p className="text-center text-gray-400">© 2025 Jahez. {t('allRightsReserved')}</p>
                </div>
            </div>
        </footer>
    );
};
