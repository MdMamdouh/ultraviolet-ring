'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useJobs } from '@/contexts/JobsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { JobCard } from '@/components/ui/job-card';
import { LoadingSkeleton } from '@/components/ui/loading-skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Search, Filter, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function JobsPage() {
    const { language, t } = useLanguage();
    const { jobs } = useJobs();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        jobType: '',
        workMode: '',
        location: '',
    });
    const [showFilters, setShowFilters] = useState(true);

    const filteredJobs = jobs.filter(job => {
        // Show only published or closed jobs (hide drafted/archived/pending from public view)
        if (job.status !== 'published' && job.status !== 'closed') return false;

        if (filters.search) {
            const title = language === 'ar' ? job.title_ar : job.title_en;
            if (!title.toLowerCase().includes(filters.search.toLowerCase())) return false;
        }
        if (filters.jobType && job.job_type !== filters.jobType) return false;
        if (filters.workMode && job.work_mode !== filters.workMode) return false;
        if (filters.location && job.location !== filters.location) return false;
        return true;
    });

    return (
        <div className="container mx-auto px-4 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-4xl font-black text-[#1A3B5F]">{t('jobs')}</h1>
                <Button variant="ghost" icon={Filter} onClick={() => setShowFilters(!showFilters)}>
                    {t('filters')}
                </Button>
            </div>

            {showFilters && (
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                        <div className="lg:col-span-2">
                            <Input
                                icon={Search}
                                placeholder={t('searchPlaceholder')}
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>
                        <Select
                            options={[
                                { value: '', label: t('allTypes') },
                                { value: 'fullTime', label: t('fullTime') },
                                { value: 'partTime', label: t('partTime') },
                                { value: 'contract', label: t('contract') },
                            ]}
                            value={filters.jobType}
                            onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                        />
                        <Select
                            options={[
                                { value: '', label: t('allModes') },
                                { value: 'onsite', label: t('onsite') },
                                { value: 'remote', label: t('remote') },
                                { value: 'hybrid', label: t('hybrid') },
                            ]}
                            value={filters.workMode}
                            onChange={(e) => setFilters({ ...filters, workMode: e.target.value })}
                        />
                        <Select
                            options={[
                                { value: '', label: t('allLocations') },
                                { value: 'القاهرة', label: 'القاهرة' },
                                { value: 'الإسكندرية', label: 'الإسكندرية' },
                                { value: 'الجيزة', label: 'الجيزة' },
                            ]}
                            value={filters.location}
                            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                        />
                        <Button icon={Search}>{t('search')}</Button>
                    </div>
                </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-[#1A3B5F]">
                    {filteredJobs.length} {t('activeJobs')}
                </h2>
            </div>

            {/* Jobs Grid */}
            {loading ? (
                <LoadingSkeleton />
            ) : filteredJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.map(job => (
                        <JobCard key={job.id} job={job} onClick={() => router.push(`/jobs/${job.id}`)} />
                    ))}
                </div>
            ) : (
                <EmptyState
                    icon={Briefcase}
                    title={t('noResults')}
                    description={t('noResultsDesc')}
                    action={<Button onClick={() => setFilters({ search: '', category: '', jobType: '', workMode: '', location: '' })}>{t('clearFilters')}</Button>}
                />
            )}
        </div>
    );
}
