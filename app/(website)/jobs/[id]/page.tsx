'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useJobs } from '@/contexts/JobsContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useParams, useRouter } from 'next/navigation';
import { ChevronRight, Share2, Bookmark, Calendar, Users, MapPin, FileText, CheckCircle } from 'lucide-react';

export default function JobDetailsPage() {
    const { language, t } = useLanguage();
    const { jobs } = useJobs();
    const params = useParams();
    const router = useRouter();
    const [isSaved, setIsSaved] = useState(false);

    // Find job by ID from Context
    const job = jobs.find(j => j.id === Number(params.id));

    if (!job) {
        return <div className="p-20 text-center">{t('noResults')}</div>;
    }

    const title = language === 'ar' ? job.title_ar : job.title_en;
    const description = language === 'ar' ? job.description_ar : job.description_en;
    const requirements = language === 'ar' ? job.requirements_ar : job.requirements_en;

    const copyToClipboard = async () => {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(window.location.href);
            } else {
                // Fallback for non-secure contexts
                const textArea = document.createElement("textarea");
                textArea.value = window.location.href;
                textArea.style.position = "absolute";
                textArea.style.left = "-9999px";
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand("copy");
                document.body.removeChild(textArea);
            }
            alert(language === 'ar' ? 'تم نسخ الرابط للحافظة' : 'Link copied to clipboard');
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert(language === 'ar' ? 'فشل نسخ الرابط' : 'Failed to copy link');
        }
    };

    // Google Jobs (JobPosting) Schema
    const structuredData = {
        "@context": "https://schema.org/",
        "@type": "JobPosting",
        "title": title,
        "description": `${description}\n\nRequirements:\n${requirements}`,
        "datePosted": new Date(job.created_at).toISOString().split('T')[0],
        "employmentType": job.job_type === 'full-time' ? 'FULL_TIME' :
            job.job_type === 'part-time' ? 'PART_TIME' :
                job.job_type === 'contract' ? 'CONTRACTOR' : 'OTHER',
        "hiringOrganization": {
            "@type": "Organization",
            "name": job.company,
            "logo": job.logo && job.logo.startsWith('http') ? job.logo : 'https://jahez.com/logo.png' // Fallback logo
        },
        "jobLocation": {
            "@type": "Place",
            "address": {
                "@type": "PostalAddress",
                "addressLocality": job.location,
                "addressCountry": "EG" // Assuming Egypt as per base requirements
            }
        },
        "baseSalary": job.salary ? {
            "@type": "MonetaryAmount",
            "currency": "EGP", // Default currency
            "value": {
                "@type": "QuantitativeValue",
                "value": job.salary,
                "unitText": "MONTH"
            }
        } : undefined
    };

    return (
        <div className="container mx-auto px-4 lg:px-8 py-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <Button variant="ghost" icon={ChevronRight} onClick={() => router.push('/jobs')} className="mb-6">
                {t('back')}
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#00A3A3] to-[#1A3B5F] flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                                {job.logo && job.logo.startsWith('http') ? (
                                    <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                                ) : (
                                    job.logo
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h1 className="text-3xl font-black text-[#1A3B5F] mb-2">{title}</h1>
                                <p className="text-xl text-gray-600 mb-3">{job.company}</p>
                                <div className="flex flex-wrap gap-2">
                                    <Badge>{t(job.job_type)}</Badge>
                                    <Badge variant="secondary">{t(job.work_mode)}</Badge>
                                    <Badge variant="success">{job.location}</Badge>
                                </div>
                            </div>
                        </div>

                        {job.salary && (
                            <div className="bg-[#e6f7f7] rounded-lg p-4 mb-6">
                                <p className="text-sm text-gray-600 mb-1">{t('salary')}</p>
                                <p className="text-2xl font-black text-[#00A3A3]">{job.salary}</p>
                            </div>
                        )}

                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-black text-[#1A3B5F] mb-3 flex items-center gap-2">
                                    <FileText size={20} />
                                    {t('description')}
                                </h2>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{description}</p>
                            </div>

                            <div>
                                <h2 className="text-xl font-black text-[#1A3B5F] mb-3 flex items-center gap-2">
                                    <CheckCircle size={20} />
                                    {t('requirements')}
                                </h2>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{requirements}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                        <Button
                            className="w-full mb-4"
                            size="lg"
                            disabled={job.status === 'closed'}
                            onClick={() => router.push(`/apply/${job.id}`)}
                        >
                            {job.status === 'closed' ? 'التقديم مغلق' : t('applyNow')}
                        </Button>
                        <div className="flex gap-2 mb-6">
                            <Button
                                variant="outline"
                                className="flex-1"
                                icon={Share2}
                                size="sm"
                                onClick={copyToClipboard}
                            >
                                {t('share')}
                            </Button>
                        </div>

                        <div className="space-y-4 text-sm">
                            <h3 className="font-bold text-[#1A3B5F] mb-3 border-b pb-2">{t('jobDetails')}</h3>
                            <div className="flex items-center gap-3 pb-3">
                                <Calendar className="text-[#00A3A3] flex-shrink-0" size={20} />
                                <div>
                                    <p className="text-gray-500 text-xs">{t('postedOn')}</p>
                                    <p className="font-bold text-[#1A3B5F]">{new Date(job.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 pb-3">
                                <Users className="text-[#00A3A3] flex-shrink-0" size={20} />
                                <div>
                                    <p className="text-gray-500 text-xs">{t('applicants')}</p>
                                    <p className="font-bold text-[#1A3B5F]">{job.applicants}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 pb-3">
                                <MapPin className="text-[#00A3A3] flex-shrink-0" size={20} />
                                <div>
                                    <p className="text-gray-500 text-xs">{t('location')}</p>
                                    <p className="font-bold text-[#1A3B5F]">{job.location}</p>
                                </div>
                            </div>
                            {job.status === 'closed' && (
                                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-center font-bold text-sm border border-red-100">
                                    هذه الوظيفة مغلقة ولم تعد تقبل طلبات
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
