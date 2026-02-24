/* eslint-disable */
'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Check, Building2, Mail, Phone, Briefcase, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useJobs } from '@/contexts/JobsContext';
import { useContent } from '@/contexts/ContentContext';

export default function PostJobPage() {
    const { t, language } = useLanguage();
    const { addJob, uploadLogo } = useJobs();
    const { content } = useContent();
    const router = useRouter();
    const [formData, setFormData] = useState({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        jobTitle: '',
        jobDescription: '',
        requirements: '',
        location: '',
        jobType: '',
        workMode: '',
        salary: '',
        companyBrief: '',
        companyWebsite: '',
        companyLogo: null as File | null,
    });
    const [customAnswers, setCustomAnswers] = useState<Record<string, string>>({});
    const [errors, setErrors] = useState<any>({});
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    let customQuestions: any[] = [];
    if (content['company_post_questions']?.content_ar) {
        try {
            customQuestions = JSON.parse(content['company_post_questions'].content_ar);
        } catch (e) {
            console.error(e);
        }
    }

    let fieldsConfig: Record<string, boolean> = {
        contactPerson: true,
        companyBrief: true,
        companyWebsite: true,
        companyLogo: true,
        requirements: true,
        jobType: true,
        workMode: true,
        salary: true,
    };
    if (content['company_post_fields']?.content_ar) {
        try {
            fieldsConfig = { ...fieldsConfig, ...JSON.parse(content['company_post_fields'].content_ar) };
        } catch (e) {
            console.error(e);
        }
    }

    const validate = () => {
        const newErrors: any = {};
        if (!formData.companyName) newErrors.companyName = t('required');
        if (fieldsConfig.contactPerson !== false && !formData.contactPerson) newErrors.contactPerson = t('required');
        if (!formData.email) newErrors.email = t('required');
        if (!formData.phone) newErrors.phone = t('required');
        if (!formData.jobTitle) newErrors.jobTitle = t('required');
        if (!formData.jobDescription) newErrors.jobDescription = t('required');
        if (!formData.location) newErrors.location = t('required');
        if (fieldsConfig.jobType !== false && !formData.jobType) newErrors.jobType = t('required');
        if (fieldsConfig.workMode !== false && !formData.workMode) newErrors.workMode = t('required');
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setSubmitting(true);
        try {
            let logoUrl = '';
            if (formData.companyLogo) {
                logoUrl = await uploadLogo(formData.companyLogo);
            }

            let appendedDescriptionArray = [formData.jobDescription];

            if (customQuestions.length > 0) {
                appendedDescriptionArray.push('\n\n--- أسئلة إضافية من الإدارة ---\n');
                customQuestions.forEach(q => {
                    appendedDescriptionArray.push(`**${q.text}**\n${customAnswers[q.id] || 'لم يتم الإجابة'}\n`);
                });
            }

            const finalDescription = appendedDescriptionArray.join('\n');

            await addJob({
                title_ar: formData.jobTitle,
                title_en: formData.jobTitle,
                company: formData.companyName,
                logo: logoUrl || 'https://via.placeholder.com/150',
                location: formData.location,
                category: formData.jobType,
                job_type: formData.jobType,
                work_mode: formData.workMode,
                salary: formData.salary,
                description_ar: finalDescription,
                description_en: finalDescription,
                requirements_ar: formData.requirements,
                requirements_en: formData.requirements,
                status: 'pending_review',
                company_brief: formData.companyBrief,
                company_website: formData.companyWebsite
            } as any);

            setSubmitted(true);
        } catch (error) {
            console.error('Error submitting job request:', error);
            alert('Something went wrong. Please try again later.');
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
                    <h2 className="text-3xl font-black text-[#1A3B5F] mb-3">{t('requestSuccess')}</h2>
                    <p className="text-gray-600 mb-6">{t('requestSuccessMsg')}</p>
                    <Button onClick={() => router.push('/')} className="w-full">{t('browseJobs')}</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h1 className="text-3xl font-black text-[#1A3B5F] text-center mb-2">{t('postJobTitle')}</h1>
                    <p className="text-gray-600 text-center mb-8">{t('postJobSubtitle')}</p>

                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg font-black text-[#1A3B5F] mb-4 flex items-center gap-2">
                                <Building2 size={20} />
                                {t('companyInfo')}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label={t('companyName')}
                                    placeholder={t('companyName')}
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    error={errors.companyName}
                                />
                                {fieldsConfig.contactPerson !== false && (
                                    <Input
                                        label={t('contactPerson')}
                                        placeholder={t('contactPerson')}
                                        value={formData.contactPerson}
                                        onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                        error={errors.contactPerson}
                                    />
                                )}
                                <Input
                                    label={t('email')}
                                    icon={Mail}
                                    type="email"
                                    placeholder="company@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    error={errors.email}
                                />
                                <Input
                                    label={t('phone')}
                                    icon={Phone}
                                    type="tel"
                                    placeholder="+20 1XX XXX XXXX"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    error={errors.phone}
                                />
                                {(fieldsConfig.companyLogo !== false || fieldsConfig.companyWebsite !== false || fieldsConfig.companyBrief !== false) && (
                                    <div className="md:col-span-2 space-y-4 pt-4 border-t">
                                        <h4 className="text-sm font-bold text-[#1A3B5F] mb-2 flex items-center gap-2">شعار الشركة ونبذة عنها (اختياري)</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                            {fieldsConfig.companyLogo !== false && (
                                                <div className="bg-gray-50 border p-4 rounded-xl flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-lg bg-white border flex items-center justify-center shrink-0">
                                                        {formData.companyLogo ? (
                                                            <img src={URL.createObjectURL(formData.companyLogo)} alt="Logo" className="w-full h-full object-contain rounded-lg" />
                                                        ) : (
                                                            <Building2 className="text-gray-300" size={24} />
                                                        )}
                                                    </div>
                                                    <div className="relative flex-1">
                                                        <input
                                                            type="file"
                                                            title="Upload Logo"
                                                            placeholder="Upload Logo"
                                                            accept="image/*"
                                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                                            onChange={(e) => {
                                                                if (e.target.files && e.target.files[0]) {
                                                                    setFormData({ ...formData, companyLogo: e.target.files[0] });
                                                                }
                                                            }}
                                                        />
                                                        <Button type="button" variant="outline" size="sm" className="w-full relative z-0 pointer-events-none">
                                                            رفع الشعار
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                            {fieldsConfig.companyWebsite !== false && (
                                                <Input
                                                    label="رابط موقع الشركة أو حساب التواصل الاجتماعي"
                                                    placeholder="https://"
                                                    value={formData.companyWebsite}
                                                    onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                                                />
                                            )}
                                        </div>
                                        {fieldsConfig.companyBrief !== false && (
                                            <Textarea
                                                label="نبذة بسيطة عن الشركة"
                                                placeholder="اكتب نبذة مختصرة عن مجال عمل الشركة..."
                                                value={formData.companyBrief}
                                                onChange={(e) => setFormData({ ...formData, companyBrief: e.target.value })}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-black text-[#1A3B5F] mb-4 flex items-center gap-2">
                                <Briefcase size={20} />
                                {t('jobDetails')}
                            </h3>
                            <div className="space-y-4">
                                <Input
                                    label={t('jobTitle')}
                                    placeholder={t('jobTitle')}
                                    value={formData.jobTitle}
                                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                                    error={errors.jobTitle}
                                />
                                <Textarea
                                    label={t('jobDescription')}
                                    placeholder={t('jobDescription')}
                                    value={formData.jobDescription}
                                    onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                                    error={errors.jobDescription}
                                />
                                {fieldsConfig.requirements !== false && (
                                    <Textarea
                                        label={t('jobRequirements')}
                                        placeholder={t('jobRequirements')}
                                        value={formData.requirements}
                                        onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                    />
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <Input
                                        label={t('location')}
                                        placeholder={t('location')}
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        error={errors.location}
                                    />
                                    {fieldsConfig.jobType !== false && (
                                        <Select
                                            label={t('jobType')}
                                            options={[
                                                { value: '', label: t('jobType') },
                                                { value: 'fullTime', label: t('fullTime') },
                                                { value: 'partTime', label: t('partTime') },
                                                { value: 'contract', label: t('contract') },
                                            ]}
                                            value={formData.jobType}
                                            onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}
                                            error={errors.jobType}
                                        />
                                    )}
                                    {fieldsConfig.workMode !== false && (
                                        <Select
                                            label={t('workMode')}
                                            options={[
                                                { value: '', label: t('workMode') },
                                                { value: 'onsite', label: t('onsite') },
                                                { value: 'remote', label: t('remote') },
                                                { value: 'hybrid', label: t('hybrid') },
                                            ]}
                                            value={formData.workMode}
                                            onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
                                            error={errors.workMode}
                                        />
                                    )}
                                    {fieldsConfig.salary !== false && (
                                        <Input
                                            label={t('salary')}
                                            placeholder="15,000 - 20,000"
                                            value={formData.salary}
                                            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {customQuestions.length > 0 && (
                            <div>
                                <h3 className="text-lg font-black text-[#1A3B5F] mb-4 flex items-center gap-2">
                                    <Check size={20} />
                                    أسئلة إضافية
                                </h3>
                                <div className="space-y-4">
                                    {customQuestions.map(q => (
                                        <div key={q.id}>
                                            <label className="text-sm font-bold text-[#1A3B5F] mb-2 block">{q.text}</label>
                                            {q.type === 'textarea' ? (
                                                <Textarea
                                                    placeholder="إجابتك..."
                                                    value={customAnswers[q.id] || ''}
                                                    onChange={e => setCustomAnswers({ ...customAnswers, [q.id]: e.target.value })}
                                                />
                                            ) : (
                                                <Input
                                                    placeholder="إجابتك..."
                                                    value={customAnswers[q.id] || ''}
                                                    onChange={e => setCustomAnswers({ ...customAnswers, [q.id]: e.target.value })}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button
                            onClick={handleSubmit}
                            size="lg"
                            className="w-full"
                            disabled={submitting}
                        >
                            {submitting && <Loader className="animate-spin" size={20} />}
                            {submitting ? t('submitting') : t('submitRequest')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
