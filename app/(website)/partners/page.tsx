'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PartnersPage() {
    const { t } = useLanguage();

    const partners = [
        { name: 'Tech Innovators', logo: '🚀' },
        { name: 'Creative Studios', logo: '🎨' },
        { name: 'Retail Group', logo: '🏢' },
        { name: 'Future Bank', logo: '🏦' },
        { name: 'Green Energy', logo: '🌱' },
        { name: 'Edu Tech', logo: '🎓' },
    ];

    return (
        <div className="container mx-auto px-4 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl font-black text-[#1A3B5F] mb-6">شركاء النجاح</h1>
                <p className="text-xl text-gray-600 mb-12">
                    نفخر بالتعاون مع كبرى الشركات والمؤسسات لتقديم أفضل الفرص الوظيفية.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                    {partners.map((partner, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center hover:shadow-xl transition-shadow cursor-pointer group">
                            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{partner.logo}</div>
                            <h3 className="text-lg font-bold text-[#1A3B5F]">{partner.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
