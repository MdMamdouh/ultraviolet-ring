'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Eye, X } from 'lucide-react';

interface Question {
    id: string;
    text: string;
    type: string;
    options?: string[];
}

interface Job {
    id: number;
    title_ar: string;
    title_en: string;
    custom_questions?: Question[];
}

interface Application {
    id: number;
    job_id: number;
    full_name: string;
    email: string;
    phone: string;
    city: string;
    status: string;
    created_at: string;
    cv_url?: string;
    cover_letter?: string;
    answers?: Record<string, string>;
}

interface DashboardApplicationsProps {
    applications: Application[];
    jobs: Job[];
    updateApplicationStatus: (id: number, status: 'new' | 'viewed' | 'shortlisted' | 'rejected' | 'reviewed' | 'hired') => Promise<void>;
}

export function DashboardApplications({ applications, jobs, updateApplicationStatus }: DashboardApplicationsProps) {
    const { language, t } = useLanguage();
    const [selectedJobId, setSelectedJobId] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [answerFilters, setAnswerFilters] = useState<Record<string, string>>({});
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const selectedJob = jobs.find(j => j.id === Number(selectedJobId));

    const filteredApplications = applications.filter(app => {
        // 1. Filter by Job
        if (selectedJobId !== 'all' && app.job_id !== Number(selectedJobId)) return false;

        // 2. Filter by Status
        if (selectedStatus !== 'all' && app.status !== selectedStatus) return false;

        // 3. Filter by Custom Answers
        if (selectedJobId !== 'all') {
            for (const [questionId, filterText] of Object.entries(answerFilters)) {
                if (filterText.trim() === '') continue;
                const answer = app.answers?.[questionId] || '';
                if (!answer.toLowerCase().includes(filterText.toLowerCase().trim())) {
                    return false;
                }
            }
        }

        return true;
    });

    const getEmbedUrl = (url: string | null) => {
        if (!url || !url.startsWith('http')) return null;
        if (url.toLowerCase().endsWith('.pdf') || url.toLowerCase().match(/\.(doc|docx)$/)) {
            return `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`;
        }
        return url;
    };

    const exportToCSV = () => {
        const headers = ['Full Name', 'Email', 'Phone', 'City', 'Job Title', 'Status', 'Date', 'CV Link', 'Raw Link', 'Cover Letter', 'Custom Answers'];
        const csvContent = [
            headers.join(','),
            ...filteredApplications.map(app => {
                const job = jobs.find(j => j.id === app.job_id);
                const row = [
                    `"${app.full_name}"`,
                    `"${app.email}"`,
                    `"${app.phone}"`,
                    `"${app.city}"`,
                    `"${job ? (job.title_en || job.title_ar) : 'Unknown'}"`,
                    `"${app.status}"`,
                    `"${new Date(app.created_at).toLocaleDateString()}"`,
                    app.cv_url ? `"=HYPERLINK(""${encodeURI(app.cv_url)}"",""Download CV"")"` : '""',
                    app.cv_url ? `"${app.cv_url}"` : '""',
                    `"${(app.cover_letter || '').replace(/"/g, '""')}"`,
                    `"${JSON.stringify(app.answers || {}).replace(/"/g, '""')}"`
                ];
                return row.join(',');
            })
        ].join('\n');

        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `applications_export_${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h3 className="font-bold text-lg">{t('allApplications')}</h3>
                    <div className="text-sm text-gray-500">{filteredApplications.length} {t('applicants')}</div>
                </div>

                <div className="flex gap-2 items-center w-full md:w-auto">
                    <select
                        aria-label="Filter by Status"
                        className="border rounded-lg px-3 py-2 text-sm bg-white flex-1 md:flex-none w-32"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="all">حالة الطلب</option>
                        <option value="new">جديد</option>
                        <option value="reviewed">تمت المراجعة</option>
                        <option value="shortlisted">مؤهل</option>
                        <option value="hired">تعيين</option>
                        <option value="rejected">مرفوض</option>
                    </select>

                    <select
                        aria-label="Select Job Filter"
                        className="border rounded-lg px-3 py-2 text-sm bg-white flex-1 md:flex-none max-w-xs"
                        value={selectedJobId}
                        onChange={(e) => {
                            setSelectedJobId(e.target.value);
                            setAnswerFilters({}); // Clear custom filters when job changes
                        }}
                    >
                        <option value="all">{t('allJobs')}</option>
                        {jobs.map(j => (
                            <option key={j.id} value={j.id}>{language === 'ar' ? j.title_ar : j.title_en}</option>
                        ))}
                    </select>

                    <Button
                        size="sm"
                        variant="outline"
                        icon={FileText}
                        onClick={exportToCSV}
                        className="flex-shrink-0"
                    >
                        Export
                    </Button>
                </div>
            </div>

            {/* Dynamic Filters based on selected job questions */}
            {selectedJobId !== 'all' && selectedJob?.custom_questions && selectedJob.custom_questions.length > 0 && (
                <div className="p-4 border-b bg-gray-50 flex flex-wrap gap-4 items-center">
                    <span className="text-sm font-bold text-[#1A3B5F] flex items-center gap-1">
                        <Eye size={16} /> تصفية بالأسئلة:
                    </span>
                    {selectedJob.custom_questions.map(q => (
                        <div key={q.id} className="relative w-full sm:w-auto min-w-[200px]">
                            <input
                                type="text"
                                placeholder={`... ${q.text.substring(0, 30)}${q.text.length > 30 ? '...' : ''}`}
                                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-full outline-none focus:ring-2 focus:ring-[#00A3A3]"
                                value={answerFilters[q.id] || ''}
                                onChange={(e) => setAnswerFilters({ ...answerFilters, [q.id]: e.target.value })}
                                title={q.text}
                            />
                            {answerFilters[q.id] && (
                                <button
                                    onClick={() => setAnswerFilters({ ...answerFilters, [q.id]: '' })}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
                                    title="مسح الفلتر"
                                    aria-label={`مسح فلتر ${q.text}`}
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-sm font-bold text-gray-500">{t('fullName')}</th>
                            <th className="p-4 text-sm font-bold text-gray-500 hidden sm:table-cell">{t('jobTitle')}</th>
                            <th className="p-4 text-sm font-bold text-gray-500 hidden md:table-cell">{t('email')}</th>
                            <th className="p-4 text-sm font-bold text-gray-500">CV</th>
                            <th className="p-4 text-sm font-bold text-gray-500 hidden lg:table-cell">{t('date')}</th>
                            <th className="p-4 text-sm font-bold text-gray-500">{t('status')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredApplications.length > 0 ? (
                            filteredApplications.map(app => {
                                const job = jobs.find(j => j.id === app.job_id);
                                return (
                                    <tr key={app.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4">
                                            <div className="font-bold text-[#1A3B5F]">{app.full_name}</div>
                                            <div className="text-xs text-gray-500 sm:hidden">{job ? (job.title_ar || job.title_en) : 'Unknown Job'}</div>
                                            <div className="text-xs text-gray-500 md:hidden">{app.email}</div>
                                        </td>
                                        <td className="p-4 text-gray-600 hidden sm:table-cell">{job ? (job.title_ar || job.title_en) : 'Unknown Job'}</td>
                                        <td className="p-4 text-gray-600 hidden md:table-cell">{app.email}</td>
                                        <td className="p-4 text-gray-600">
                                            {app.cv_url && (
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => setPreviewUrl(app.cv_url as string)} title="Preview" className="h-8 w-8 px-0">
                                                        <Eye size={16} className="text-[#00A3A3] hover:text-[#1A3B5F]" />
                                                    </Button>
                                                    <a href={app.cv_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600" title="Download">
                                                        <FileText size={16} />
                                                    </a>
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-600 hidden lg:table-cell">{new Date(app.created_at).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <select
                                                className={`border rounded-lg text-sm px-2 py-1 outline-none focus:ring-2 focus:ring-[#00A3A3] font-bold shadow-sm cursor-pointer ${app.status === 'new' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    app.status === 'shortlisted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                        app.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                                            app.status === 'hired' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                                                                'bg-gray-50 text-gray-700 border-gray-200'
                                                    }`}
                                                value={app.status || 'new'}
                                                onChange={(e) => updateApplicationStatus(app.id, e.target.value as any)}
                                                title="تغيير حالة الطلب"
                                                aria-label="تغيير حالة الطلب"
                                            >
                                                <option value="new">جديد (New)</option>
                                                <option value="reviewed">تمت المراجعة (Reviewed)</option>
                                                <option value="shortlisted">مؤهل (Shortlisted)</option>
                                                <option value="rejected">غير مناسب (Rejected)</option>
                                                <option value="hired">تعيين (Hired)</option>
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-500">
                                    {t('noResults')}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Resume Preview Modal */}
            {previewUrl && (
                <div
                    className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 lg:p-10"
                    onClick={() => setPreviewUrl(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
                            <h3 className="font-bold text-[#1A3B5F]">Resume Preview</h3>
                            <button onClick={() => setPreviewUrl(null)} className="text-gray-400 hover:text-gray-600 p-2" title="Close Preview" aria-label="Close Preview">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-hidden p-4 bg-gray-100 rounded-b-2xl relative flex items-center justify-center">
                            {getEmbedUrl(previewUrl) ? (
                                <iframe
                                    src={getEmbedUrl(previewUrl)!}
                                    className="w-full h-full rounded border bg-white shadow-sm"
                                    title="Resume Preview"
                                />
                            ) : (
                                <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-sm">
                                    <div className="text-gray-400 mb-4 flex justify-center">
                                        <FileText size={64} />
                                    </div>
                                    <h3 className="font-bold text-[#1A3B5F] text-xl mb-2">تعذر فتح المعاينة</h3>
                                    <p className="text-gray-500 mb-6">الرابط المرفق للسيرة الذاتية لا يدعم المعاينة المباشرة أو غير صالح.</p>

                                    {previewUrl && previewUrl.length > 0 && (
                                        <a
                                            href={previewUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-[#00A3A3] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#008282] transition-colors"
                                        >
                                            <Eye size={20} />
                                            محاولة فتح الملف في تبويب جديد
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
