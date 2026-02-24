/* eslint-disable */
'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { useJobs } from '@/contexts/JobsContext';
import { useParams, useRouter } from 'next/navigation';
import { Users, Upload, AlertCircle, Loader, ChevronRight, Check, FileText } from 'lucide-react';

export default function ApplyPage() {
    const { language, t } = useLanguage();
    const { jobs, submitApplication } = useJobs();
    const params = useParams();
    const router = useRouter();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        city: '',
        cv: null as File | null,
        coverLetter: '',
    });
    const [errors, setErrors] = useState<any>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [refNumber, setRefNumber] = useState('');

    // Find job by ID from Context
    const job = jobs.find(j => j.id === Number(params.id));

    // Add custom answers state
    const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
    const [cvFile, setCvFile] = useState<File | null>(null);

    // If job doesn't exist, handling gracefully (though in real app would redirect or show 404)
    const title = job ? (language === 'ar' ? job.title_ar : job.title_en) : '';

    const validate = () => {
        const newErrors: any = {};
        if (job?.application_fields?.fullName !== false && !formData.fullName) newErrors.fullName = t('required');
        if (job?.application_fields?.email !== false) {
            if (!formData.email) newErrors.email = t('required');
            else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = t('invalidEmail');
        }
        if (job?.application_fields?.phone !== false && !formData.phone) newErrors.phone = t('required');
        if (job?.application_fields?.city !== false && !formData.city) newErrors.city = t('required');
        if (job?.application_fields?.cv !== false && !cvFile) newErrors.cv = t('required');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate() || !job) return;
        setSubmitting(true);

        try {
            await submitApplication({
                job_id: job.id,
                full_name: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                city: formData.city,
                cover_letter: formData.coverLetter,
                answers: customAnswers,
                status: 'new'
            }, cvFile || undefined); // Pass the file

            setRefNumber('JHZ-' + Date.now());
            setSubmitted(true);
        } catch (error) {
            console.error('Submission error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-12">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="text-green-600" size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-[#1A3B5F] mb-3">{t('applicationSuccess')}</h2>
                    <p className="text-gray-600 mb-6">{t('applicationSuccessMsg')}</p>
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-500 mb-2">{t('referenceNumber')}</p>
                        <p className="text-2xl font-black text-[#00A3A3]">{refNumber}</p>
                    </div>
                    <Button onClick={() => router.push('/jobs')} className="w-full">{t('browseJobs')}</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 lg:px-8 py-12">
            <Button variant="ghost" icon={ChevronRight} onClick={() => router.push(`/jobs/${params.id}`)} className="mb-6">
                {t('back')}
            </Button>

            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h1 className="text-3xl font-black text-[#1A3B5F] text-center mb-2">{t('applyForJob')}</h1>
                    <p className="text-gray-600 text-center mb-8">{title} - {job?.company}</p>

                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-black text-[#1A3B5F] mb-4 flex items-center gap-2">
                                <Users size={20} />
                                {t('personalInfo')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {job?.application_fields?.fullName !== false && (
                                    <Input
                                        label={t('fullName')}
                                        placeholder={t('fullName')}
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                        error={errors.fullName}
                                    />
                                )}
                                {job?.application_fields?.email !== false && (
                                    <Input
                                        label={t('email')}
                                        type="email"
                                        placeholder="example@email.com"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        error={errors.email}
                                    />
                                )}
                                {job?.application_fields?.phone !== false && (
                                    <Input
                                        label={t('phone')}
                                        type="tel"
                                        placeholder="+20 1XX XXX XXXX"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        error={errors.phone}
                                    />
                                )}
                                {job?.application_fields?.city !== false && (
                                    <Input
                                        label={t('city')}
                                        placeholder={t('city')}
                                        value={formData.city}
                                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                                        error={errors.city}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Custom Questions Rendering */}
                        {job?.custom_questions && job.custom_questions.length > 0 && (
                            <div className="space-y-4 mb-6 border-t pt-6">
                                <h3 className="text-xl font-bold text-[#1A3B5F] mb-4 flex items-center gap-2">
                                    {t('additionalQuestions')} <FileText size={20} />
                                </h3>
                                {job.custom_questions.map(q => (
                                    <div key={q.id}>
                                        {q.type === 'textarea' ? (
                                            <Textarea
                                                label={q.text}
                                                value={customAnswers[q.id] || ''}
                                                onChange={e => setCustomAnswers({ ...customAnswers, [q.id]: e.target.value })}
                                            />
                                        ) : (
                                            <Input
                                                label={q.text}
                                                value={customAnswers[q.id] || ''}
                                                onChange={e => setCustomAnswers({ ...customAnswers, [q.id]: e.target.value })}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* CV Upload - Simplified for now */}
                        {/* CV Upload */}
                        {job?.application_fields?.cv !== false && (
                            <div className="mb-6">
                                <label className="block text-[#1A3B5F] font-bold mb-3 text-sm">
                                    {t('uploadCV')}
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-white transition-colors cursor-pointer relative">
                                    <input
                                        type="file"
                                        title="Upload CV"
                                        placeholder="Upload CV"
                                        accept=".pdf,.doc,.docx"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={e => {
                                            if (e.target.files && e.target.files[0]) {
                                                setCvFile(e.target.files[0]);
                                            }
                                        }}
                                    />
                                    {cvFile ? (
                                        <div className="flex items-center justify-center gap-2 text-green-600">
                                            <Check size={20} />
                                            <span>{cvFile.name}</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <Upload size={30} className="mb-2" />
                                            <p className="text-sm">{t('dragDrop')}</p>
                                            <p className="text-xs text-gray-400">PDF, DOC, DOCX (Max 5MB)</p>
                                        </div>
                                    )}
                                </div>
                                {errors.cv && (
                                    <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                                        <AlertCircle size={16} /> {errors.cv}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="mb-6">
                            <Textarea
                                label={t('coverLetter')}
                                placeholder={t('coverLetter')}
                                value={formData.coverLetter}
                                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                            />
                        </div>

                        <Button
                            onClick={handleSubmit}
                            size="lg"
                            className="w-full"
                            disabled={submitting}
                        >
                            {submitting && <Loader className="animate-spin" size={20} />}
                            {submitting ? t('submitting') : t('submitApplication')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
