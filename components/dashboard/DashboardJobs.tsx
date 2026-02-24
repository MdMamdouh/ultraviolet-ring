'use client';

/* eslint-disable */
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Settings } from 'lucide-react';
import { useState } from 'react';
import { PostJobSettingsModal } from './PostJobSettingsModal';

interface Job {
    id: number;
    title_ar: string;
    title_en: string;
    company: string;
    status: 'published' | 'pending_review' | 'closed' | 'archived' | 'rejected';
}

interface DashboardJobsProps {
    jobs: Job[];
    updateJobStatus: (id: number, status: any) => void;
    deleteJob: (id: number) => void;
    openEditModal: (job: Job) => void;
    onAddNew: () => void;
}

export function DashboardJobs({ jobs, updateJobStatus, deleteJob, openEditModal, onAddNew }: DashboardJobsProps) {
    const { t } = useLanguage();
    const [showSettings, setShowSettings] = useState(false);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-lg">{t('manageJobs')}</h3>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" icon={Settings} onClick={() => setShowSettings(true)}>
                        نموذج الشركات
                    </Button>
                    <Button size="sm" icon={Plus} onClick={onAddNew}>
                        {t('createNew')}
                    </Button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-sm font-bold text-gray-500">{t('jobTitle')}</th>
                            <th className="p-4 text-sm font-bold text-gray-500">{t('company')}</th>
                            <th className="p-4 text-sm font-bold text-gray-500">{t('status')}</th>
                            <th className="p-4 text-sm font-bold text-gray-500 text-end">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-bold text-[#1A3B5F]">{job.title_ar}</td>
                                <td className="p-4 text-gray-600">{job.company}</td>
                                <td className="p-4">
                                    <select
                                        aria-label="Update Job Status"
                                        className={`px-3 py-1 rounded-full text-xs font-bold border border-transparent cursor-pointer focus:ring-2 focus:ring-[#00A3A3] outline-none appearance-none ${job.status === 'published' ? 'bg-[#e6f7f7] text-[#00A3A3]' :
                                            job.status === 'closed' ? 'bg-red-50 text-red-700' :
                                                job.status === 'archived' ? 'bg-gray-100 text-gray-500' :
                                                    job.status === 'rejected' ? 'bg-red-50 text-red-700' :
                                                        'bg-orange-50 text-orange-700'
                                            }`}
                                        value={job.status}
                                        onChange={(e) => updateJobStatus(job.id, e.target.value)}
                                    >
                                        <option value="published">منشور</option>
                                        <option value="closed">مغلق</option>
                                        <option value="archived">مخفي</option>
                                        <option value="pending_review">قيد المراجعة</option>
                                        <option value="rejected">مرفوض</option>
                                    </select>
                                </td>
                                <td className="p-4 text-end">
                                    <div className="flex items-center justify-end gap-2">
                                        <button aria-label="Edit Job" className="p-2 text-gray-500 hover:text-[#00A3A3] transition-colors" onClick={() => openEditModal(job)}>
                                            <Edit size={18} />
                                        </button>
                                        <button aria-label="Delete Job" className="p-2 text-gray-500 hover:text-red-600 transition-colors" onClick={() => deleteJob(job.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {jobs.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">
                                    لا توجد وظائف متاحة
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showSettings && <PostJobSettingsModal onClose={() => setShowSettings(false)} />}
        </div>
    );
}
