'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Check, X, Users, Briefcase, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface Job {
    id: number;
    title_ar: string;
    title_en: string;
    company: string;
    status: 'published' | 'pending_review' | 'closed' | 'archived' | 'rejected';
    logo?: string;
}

interface DashboardOverviewProps {
    jobs: Job[];
    applications: any[];
    updateJobStatus: (jobId: number, status: 'published' | 'pending_review' | 'closed' | 'archived' | 'rejected' | 'draft') => void;
}

export function DashboardOverview({ jobs, applications, updateJobStatus }: DashboardOverviewProps) {
    const { t } = useLanguage();

    const pendingJobs = jobs.filter(j => j.status === 'pending_review');

    // Prepare Data for Bar Chart (Applications per Job)
    const applicationsPerJob = jobs.map(job => {
        const count = applications.filter(app => app.job_id === job.id).length;
        // Use a short title for the chart to keep it clean
        const shortTitle = job.title_ar.length > 20 ? job.title_ar.substring(0, 20) + '...' : job.title_ar;
        return { name: shortTitle, count };
    }).filter(data => data.count > 0).sort((a, b) => b.count - a.count).slice(0, 5); // Top 5 jobs

    // Prepare Data for Pie Chart (Application Statuses)
    const statusCounts = applications.reduce((acc: Record<string, number>, app) => {
        const status = app.status || 'new';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const statusData = [
        { name: 'جديد', value: statusCounts['new'] || 0, color: '#00A3A3' },
        { name: 'تمت المراجعة', value: statusCounts['reviewed'] || 0, color: '#FCD34D' },
        { name: 'مؤهل', value: statusCounts['shortlisted'] || 0, color: '#3B82F6' },
        { name: 'تعيين', value: statusCounts['hired'] || 0, color: '#8B5CF6' },
        { name: 'مرفوض', value: statusCounts['rejected'] || 0, color: '#EF4444' }
    ].filter(item => item.value > 0);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                        <Briefcase size={28} />
                    </div>
                    <div>
                        <div className="text-gray-500 mb-1">{t('totalJobs')}</div>
                        <div className="text-3xl font-black text-[#1A3B5F]">{jobs.length}</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-[#e6f7f7] flex items-center justify-center text-[#00A3A3] shrink-0">
                        <Users size={28} />
                    </div>
                    <div>
                        <div className="text-gray-500 mb-1">{t('totalApplications')}</div>
                        <div className="text-3xl font-black text-[#00A3A3]">{applications.length}</div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
                        <FileText size={28} />
                    </div>
                    <div>
                        <div className="text-gray-500 mb-1">{t('pendingReview')}</div>
                        <div className="text-3xl font-black text-orange-500">{pendingJobs.length}</div>
                    </div>
                </div>
            </div>

            {/* Analytics Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart: Applications per Job */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-[#1A3B5F] mb-6">أكثر الوظائف إقبالاً</h3>
                    {applicationsPerJob.length > 0 ? (
                        <div className="h-64 w-full" dir="ltr">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={applicationsPerJob} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                                    <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <RechartsTooltip
                                        cursor={{ fill: '#F3F4F6' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="count" fill="#00A3A3" radius={[4, 4, 0, 0]} maxBarSize={50} name="الطلبات" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">لا توجد بيانات كافية</div>
                    )}
                </div>

                {/* Pie Chart: Application Status */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-[#1A3B5F] mb-6">توزيع حالات سير الطلبات</h3>
                    {statusData.length > 0 ? (
                        <div className="h-64 w-full" dir="ltr">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ textAlign: 'right' }}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        formatter={(value) => <span className="text-gray-600 font-medium px-1">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">لا توجد طلبات بعد</div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-bold text-[#1A3B5F] mb-6">{t('pendingRequests')}</h3>
                <div className="space-y-4">
                    {pendingJobs.length > 0 ? (
                        pendingJobs.map(job => (
                            <div key={job.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-xl hover:bg-gray-50 gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded bg-[#e6f7f7] flex items-center justify-center text-xl overflow-hidden shrink-0">
                                        {job.logo && job.logo.startsWith('http') ? <img src={job.logo} alt="Logo" className="w-full h-full object-cover" /> : (job.logo || '🏢')}
                                    </div>
                                    <div>
                                        <div className="font-bold text-[#1A3B5F]">{job.title_ar}</div>
                                        <div className="text-sm text-gray-500">{job.company}</div>
                                    </div>
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                    <Button size="sm" variant="success" className="flex-1 sm:flex-none" onClick={() => updateJobStatus(job.id, 'published')}>
                                        <Check size={16} className="me-1" /> {t('approve')}
                                    </Button>
                                    <Button size="sm" variant="danger" className="flex-1 sm:flex-none" onClick={() => updateJobStatus(job.id, 'rejected')}>
                                        <X size={16} className="me-1" /> {t('reject')}
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">لا توجد طلبات معلقة</p>
                    )}
                </div>
            </div>
        </div>
    );
}
