'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, Monitor, ChevronRight } from 'lucide-react';
import { Job } from '@/contexts/JobsContext';

interface JobCardProps {
    job: Job;
    onClick: () => void;
}

export const JobCard = ({ job, onClick }: JobCardProps) => {
    const { language, t } = useLanguage();
    const title = language === 'ar' ? job.title_ar : job.title_en;

    return (
        <div className="bg-white rounded-xl border-2 border-gray-100 hover:border-[#00A3A3] hover:shadow-xl transition-all duration-300 p-6 cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#00A3A3] to-[#1A3B5F] flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                        {job.logo && job.logo.startsWith('http') ? (
                            <img src={job.logo} alt={job.company} className="w-full h-full object-cover" />
                        ) : (
                            job.logo
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-[#1A3B5F] mb-1 group-hover:text-[#00A3A3] transition-colors line-clamp-1">
                            {title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">{job.company}</p>
                    </div>
                </div>
                {(job.is_new || job.is_featured) && (
                    <Badge variant={job.is_new ? 'success' : 'warning'}>
                        {job.is_new ? t('new') : t('featured')}
                    </Badge>
                )}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <MapPin size={16} />
                    {job.location}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Briefcase size={16} />
                    {t(job.job_type)}
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Monitor size={16} />
                    {t(job.work_mode)}
                </div>
            </div>

            {job.salary && (
                <p className="text-[#00A3A3] font-bold text-sm mb-4">{job.salary}</p>
            )}

            <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-xs text-gray-500">
                    {job.applicants} {t('applicants')}
                </span>
                <Button size="sm" onClick={onClick} icon={ChevronRight}>
                    {t('viewDetails')}
                </Button>
            </div>
        </div>
    );
};
