/* eslint-disable */
'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useJobs } from '@/contexts/JobsContext';
import { useContent } from '@/contexts/ContentContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Menu, X, Upload, Trash2, Plus, LogOut } from 'lucide-react';
import { Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

// Import refactored components
import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
import { DashboardOverview } from '@/components/dashboard/DashboardOverview';
import { DashboardJobs } from '@/components/dashboard/DashboardJobs';
import { DashboardApplications } from '@/components/dashboard/DashboardApplications';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import { DashboardMessages } from '@/components/dashboard/DashboardMessages';
import { DashboardBlog } from '@/components/dashboard/DashboardBlog';

export default function DashboardPage() {
    const { language, t } = useLanguage();
    const { jobs, applications, messages, updateJobStatus, updateApplicationStatus, deleteJob, addJob, updateJob, uploadLogo } = useJobs();
    const { content, updateContent } = useContent();
    const router = useRouter();

    const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'applications' | 'content' | 'messages' | 'blog'>('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Modal state
    const [showAddJobModal, setShowAddJobModal] = useState(false);
    const [editingJobId, setEditingJobId] = useState<number | null>(null);

    // Initial State for Job Form
    const initialJobState = {
        title_ar: '',
        title_en: '',
        company: '',
        location: '',
        job_type: 'fullTime',
        work_mode: 'onsite',
        description_ar: '',
        description_en: '',
        requirements_ar: '',
        requirements_en: '',
        salary: '',
        logo: '',
        category: 'General',
        status: 'published' as const,
        custom_questions: [] as any[],
        application_fields: { fullName: true, email: true, phone: true, city: true, cv: true }
    };

    const [newJob, setNewJob] = useState(initialJobState);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    // Authentication State
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [emailStr, setEmailStr] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    // Check auth on mount
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setIsAuthenticated(true);
            }
            setIsCheckingAuth(false);
        };
        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setIsAuthenticated(!!session);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Content Management State
    const [aboutAr, setAboutAr] = useState('');
    const [aboutEn, setAboutEn] = useState('');
    const [aboutIsPublished, setAboutIsPublished] = useState(true);

    // Vision & Values State
    const [visionAr, setVisionAr] = useState('');
    const [visionEn, setVisionEn] = useState('');
    const [valuesAr, setValuesAr] = useState('');
    const [valuesEn, setValuesEn] = useState('');

    // Contact Info Content Management State
    const [addressAr, setAddressAr] = useState('');
    const [addressEn, setAddressEn] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Statistics Management State
    const [statCompanies, setStatCompanies] = useState('80+');
    const [statHires, setStatHires] = useState('2,500+');

    // Load Content
    useEffect(() => {
        if (content['about_us']) {
            setAboutAr(content['about_us'].content_ar || '');
            setAboutEn(content['about_us'].content_en || '');
            setAboutIsPublished(content['about_us'].is_published !== false);
        }
        if (content['about_vision']) {
            setVisionAr(content['about_vision'].content_ar || '');
            setVisionEn(content['about_vision'].content_en || '');
        }
        if (content['about_values']) {
            setValuesAr(content['about_values'].content_ar || '');
            setValuesEn(content['about_values'].content_en || '');
        }
        // Load contact info
        if (content['contact_address']) {
            setAddressAr(content['contact_address'].content_ar || '');
            setAddressEn(content['contact_address'].content_en || '');
        }
        if (content['contact_email']) {
            setContactEmail(content['contact_email'].content_en || ''); // Using en field for email
        }
        if (content['contact_phone']) {
            setPhone(content['contact_phone'].content_en || ''); // Using en field for phone
        }
        // Load Statistics
        if (content['stat_companies']) {
            setStatCompanies(content['stat_companies'].content_en || '80+');
        }
        if (content['stat_hires']) {
            setStatHires(content['stat_hires'].content_en || '2,500+');
        }
    }, [content]);

    // Handlers
    const handleSaveContent = async () => {
        try {
            await updateContent('about_us', aboutAr, aboutEn, aboutIsPublished);
            await updateContent('about_vision', visionAr, visionEn, true);
            await updateContent('about_values', valuesAr, valuesEn, true);
            // Save contact info
            await updateContent('contact_address', addressAr, addressEn, true);
            await updateContent('contact_email', contactEmail, contactEmail, true);
            await updateContent('contact_phone', phone, phone, true);

            // Save Statistics
            await updateContent('stat_companies', statCompanies, statCompanies, true);
            await updateContent('stat_hires', statHires, statHires, true);

            alert(t('requestSuccess') || 'تم حفظ المحتوى بنجاح');
        } catch (error) {
            alert('حدث خطأ أثناء الحفظ');
        }
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSaveJob = async () => {
        let logoUrl = newJob.logo || '🏢';

        if (logoFile) {
            try {
                logoUrl = await uploadLogo(logoFile);
            } catch (error) {
                console.error("Logo upload failed", error);
                alert('فشل رفع الشعار، يرجى المحاولة مرة أخرى.');
                return;
            }
        }

        const jobData = { ...newJob, logo: logoUrl };

        if (editingJobId) {
            await updateJob(editingJobId, jobData);
        } else {
            await addJob(jobData);
        }
        setShowAddJobModal(false);
        setEditingJobId(null);
        setNewJob(initialJobState);
        setLogoFile(null);
        setLogoPreview(null);
    };

    const openEditModal = (job: any) => {
        setNewJob({
            title_ar: job.title_ar,
            title_en: job.title_en,
            company: job.company,
            location: job.location,
            job_type: job.job_type,
            work_mode: job.work_mode,
            description_ar: job.description_ar,
            description_en: job.description_en,
            requirements_ar: job.requirements_ar,
            requirements_en: job.requirements_en,
            salary: job.salary,
            logo: job.logo,
            category: job.category,
            status: job.status,
            custom_questions: job.custom_questions || [],
            application_fields: job.application_fields || { fullName: true, email: true, phone: true, city: true, cv: true }
        });
        setEditingJobId(job.id);
        setLogoPreview(job.logo && job.logo.startsWith('http') ? job.logo : null);
        setLogoFile(null);
        setShowAddJobModal(true);
    };

    const handleAddNewJob = () => {
        setEditingJobId(null);
        setNewJob(initialJobState);
        setLogoPreview(null);
        setLogoFile(null);
        setShowAddJobModal(true);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(null);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: emailStr.trim(),
                password: password,
            });
            if (error) {
                console.error("Login Error:", error);

                // Show localized error messages based on Supabase codes/messages
                if (error.message.includes("Invalid login credentials")) {
                    setLoginError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
                } else {
                    setLoginError(`خطأ فني: ${error.message}`);
                }
            } else if (data?.user) {
                // Verify admin status
                const { data: adminData, error: adminError } = await supabase
                    .from('admin_users')
                    .select('id')
                    .eq('id', data.user.id)
                    .single();

                if (adminError || !adminData) {
                    setLoginError("عذراً، هذا الحساب ليس لديه صلاحيات الإدارة");
                    await supabase.auth.signOut();
                } else {
                    setIsAuthenticated(true);
                }
            }
        } catch (err: any) {
            setLoginError(`حدث خطأ غير متوقع: ${err.message}`);
        }
    };

    if (isCheckingAuth) {
        return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
                    <div className="w-16 h-16 bg-[#00A3A3]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg viewBox="0 0 48 48" className="w-8 h-8">
                            <path fill="#00A3A3" d="M 8 24 L 8 40 L 24 40 L 24 24 Z" />
                            <path fill="#1A3B5F" d="M 24 8 L 24 24 L 40 24 L 40 8 Z" opacity="0.9" />
                            <rect fill="#00A3A3" x="24" y="24" width="16" height="16" opacity="0.6" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-black text-[#1A3B5F] mb-2">تسجيل الدخول للإدارة</h1>
                    <p className="text-gray-500 mb-8">أدخل بريدك الإلكتروني وكلمة المرور للوصول</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input
                            type="email"
                            placeholder="البريد الإلكتروني"
                            value={emailStr}
                            onChange={(e) => setEmailStr(e.target.value)}
                            className="text-center"
                            dir="ltr"
                            required
                        />
                        <Input
                            type="password"
                            placeholder="كلمة المرور"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="text-center"
                            dir="ltr"
                            required
                        />
                        {loginError && <p className="text-red-500 text-sm font-bold">{loginError}</p>}
                        <Button type="submit" className="w-full">دخول</Button>
                    </form>
                    <Button variant="ghost" className="mt-4 w-full text-gray-400" onClick={() => router.push('/')}>
                        العودة للموقع
                    </Button>
                </div>
            </div>
        );
    }
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row" dir="rtl">

            {/* Sidebar Component */}
            <DashboardSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            {/* Main Content */}
            <div className="flex-1 lg:ms-64 p-4 lg:p-8 w-full">

                {/* Header Navbar */}
                <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <button
                            className="p-2 lg:hidden text-gray-500 hover:text-[#00A3A3] hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <h1 className="text-xl lg:text-2xl font-bold text-[#1A3B5F]">
                            {activeTab === 'overview' && t('dashboard')}
                            {activeTab === 'jobs' && t('manageJobs')}
                            {activeTab === 'applications' && t('allApplications')}
                            {activeTab === 'content' && 'إدارة المحتوى'}
                            {activeTab === 'blog' && 'إدارة المقالات'}
                            {activeTab === 'messages' && 'الرسائل الواردة'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-3">
                            <span className="font-bold text-[#1A3B5F]">Admin</span>
                            <div className="w-10 h-10 rounded-full bg-[#e6f7f7] border border-[#00A3A3]/20 flex items-center justify-center text-[#00A3A3] font-bold">
                                AD
                            </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="text-gray-500 hover:text-red-500 hover:bg-red-50" icon={LogOut}>
                            <span className="hidden sm:inline">رجوع للموقع</span>
                        </Button>
                    </div>
                </div>

                {/* Tab Views */}
                {activeTab === 'overview' && (
                    <DashboardOverview
                        jobs={jobs as any}
                        applications={applications as any}
                        updateJobStatus={updateJobStatus}
                    />
                )}

                {activeTab === 'jobs' && (
                    <DashboardJobs
                        jobs={jobs as any}
                        updateJobStatus={updateJobStatus}
                        deleteJob={deleteJob}
                        openEditModal={openEditModal}
                        onAddNew={handleAddNewJob}
                    />
                )}

                {activeTab === 'applications' && (
                    <DashboardApplications
                        applications={applications as any}
                        jobs={jobs as any}
                        updateApplicationStatus={updateApplicationStatus}
                    />
                )}


                {activeTab === 'content' && (
                    <DashboardContent
                        aboutAr={aboutAr} setAboutAr={setAboutAr}
                        aboutEn={aboutEn} setAboutEn={setAboutEn}
                        aboutIsPublished={aboutIsPublished} setAboutIsPublished={setAboutIsPublished}
                        visionAr={visionAr} setVisionAr={setVisionAr}
                        visionEn={visionEn} setVisionEn={setVisionEn}
                        valuesAr={valuesAr} setValuesAr={setValuesAr}
                        valuesEn={valuesEn} setValuesEn={setValuesEn}
                        // Contact Props
                        addressAr={addressAr} setAddressAr={setAddressAr}
                        addressEn={addressEn} setAddressEn={setAddressEn}
                        email={contactEmail} setEmail={setContactEmail}
                        phone={phone} setPhone={setPhone}
                        // Statistics Props
                        statCompanies={statCompanies} setStatCompanies={setStatCompanies}
                        statHires={statHires} setStatHires={setStatHires}

                        handleSaveContent={handleSaveContent}
                    />
                )}

                {activeTab === 'messages' && (
                    <DashboardMessages messages={messages as any} />
                )}

                {activeTab === 'blog' && (
                    <DashboardBlog />
                )}
            </div>

            {/* Add/Edit Job Modal (Kept inside page to avoid excessive prop drilling for now) */}
            {showAddJobModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto py-10 px-4"
                    onClick={() => setShowAddJobModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-2xl m-auto relative my-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button onClick={() => setShowAddJobModal(false)} className="absolute top-4 end-4 text-gray-400 hover:text-gray-600"><X /></button>
                        <h2 className="text-2xl font-black text-[#1A3B5F] mb-6">{editingJobId ? t('edit') : t('createNew')}</h2>

                        {/* Logo Upload */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <label className="block text-sm font-bold text-[#1A3B5F] mb-2">{t('companyLogo') || 'شعار الشركة'}</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-lg bg-white border flex items-center justify-center overflow-hidden shrink-0">
                                        {logoPreview ? (
                                            <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <ImageIcon className="text-gray-300" size={32} />
                                        )}
                                    </div>
                                    <div className="relative flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoChange}
                                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                        />
                                        <Button size="sm" variant="outline" icon={Upload} className="w-full sm:w-auto relative z-0 pointer-events-none">
                                            {t('uploadLogo') || 'رفع شعار'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <Input label="عنوان الوظيفة (عربي)" value={newJob.title_ar} onChange={e => setNewJob({ ...newJob, title_ar: e.target.value })} />
                            <Input label="Job Title (English)" value={newJob.title_en} onChange={e => setNewJob({ ...newJob, title_en: e.target.value })} />
                            <Input label={t('company')} value={newJob.company} onChange={e => setNewJob({ ...newJob, company: e.target.value })} />
                            <Input label={t('location')} value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} />
                            <Select label={t('jobType')} options={[{ value: 'fullTime', label: 'Full Time' }, { value: 'partTime', label: 'Part Time' }]} value={newJob.job_type} onChange={e => setNewJob({ ...newJob, job_type: e.target.value })} />
                            <Input label={t('salary')} value={newJob.salary} onChange={e => setNewJob({ ...newJob, salary: e.target.value })} />
                        </div>

                        <div className="space-y-4 mb-6">
                            <Textarea label="الوصف الوظيفي (عربي)" value={newJob.description_ar} onChange={e => setNewJob({ ...newJob, description_ar: e.target.value })} />
                            <Textarea label="Job Description (English)" value={newJob.description_en} onChange={e => setNewJob({ ...newJob, description_en: e.target.value })} />

                            {/* Dynamic Form Builder */}
                            <div className="border-t pt-4 mt-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                                    <h3 className="font-bold text-[#1A3B5F]">{t('customQuestions')}</h3>
                                    <Button size="sm" variant="outline" onClick={() => {
                                        const newQ = { id: Date.now().toString(), text: '', type: 'text' as const };
                                        setNewJob({ ...newJob, custom_questions: [...(newJob.custom_questions || []), newQ] });
                                    }} icon={Plus}>{t('createNew')}</Button>
                                </div>
                                <div className="flex gap-2 mb-4 flex-wrap">
                                    {[
                                        { text: 'كم عدد سنوات الخبرة لديك؟', type: 'text' },
                                        { text: 'لماذا تريد العمل معنا؟', type: 'textarea' },
                                        { text: 'ما هو الراتب المتوقع؟', type: 'text' },
                                        { text: 'رابط معرض الأعمال (Portfolio)', type: 'text' },
                                        { text: 'متى يمكنك البدء للعمل؟', type: 'text' },
                                        { text: 'هل لديك رخصة قيادة؟', type: 'text' }
                                    ].map((suggestion, i) => (
                                        <Badge
                                            key={i}
                                            variant="secondary"
                                            className="cursor-pointer hover:bg-[#00A3A3] hover:text-white transition-colors px-3 py-1"
                                            onClick={() => {
                                                const newQ = {
                                                    id: Date.now().toString() + i,
                                                    text: suggestion.text,
                                                    type: suggestion.type as any
                                                };
                                                setNewJob({ ...newJob, custom_questions: [...(newJob.custom_questions || []), newQ] });
                                            }}
                                        >
                                            + {suggestion.text}
                                        </Badge>
                                    ))}
                                </div>
                                <div className="space-y-3">
                                    {newJob.custom_questions?.map((q, idx) => (
                                        <div key={idx} className="flex flex-col sm:flex-row gap-2 items-start bg-gray-50 p-3 rounded-lg border">
                                            <Input
                                                placeholder={t('questionText')}
                                                value={q.text}
                                                onChange={e => {
                                                    const updated = [...(newJob.custom_questions || [])];
                                                    updated[idx].text = e.target.value;
                                                    setNewJob({ ...newJob, custom_questions: updated });
                                                }}
                                                className="w-full sm:flex-1"
                                            />
                                            <div className="flex w-full sm:w-auto gap-2">
                                                <Select
                                                    options={[
                                                        { value: 'text', label: 'Text' },
                                                        { value: 'textarea', label: 'Long Text' },
                                                    ]}
                                                    value={q.type}
                                                    onChange={e => {
                                                        const updated = [...(newJob.custom_questions || [])];
                                                        updated[idx].type = e.target.value as any;
                                                        setNewJob({ ...newJob, custom_questions: updated });
                                                    }}
                                                    className="flex-1 sm:w-32"
                                                />
                                                <button
                                                    onClick={() => {
                                                        const updated = [...(newJob.custom_questions || [])];
                                                        updated.splice(idx, 1);
                                                        setNewJob({ ...newJob, custom_questions: updated });
                                                    }}
                                                    className="text-red-500 hover:bg-red-50 p-2 rounded shrink-0 h-[42px] mt-7 sm:mt-0 flex items-center justify-center border sm:border-transparent"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Standard Application Fields Control */}
                            <div className="border-t pt-4 mt-4 bg-gray-50 p-4 rounded-xl">
                                <h3 className="font-bold text-[#1A3B5F] mb-3">الحقول المطلوبة في نموذج التقديم</h3>
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                    {[
                                        { key: 'fullName', label: 'الاسم الكامل' },
                                        { key: 'email', label: 'البريد الإلكتروني' },
                                        { key: 'phone', label: 'رقم الهاتف' },
                                        { key: 'city', label: 'المدينة' },
                                        { key: 'cv', label: 'السيرة الذاتية (CV)' },
                                    ].map(field => (
                                        <label key={field.key} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newJob.application_fields[field.key as keyof typeof newJob.application_fields] !== false}
                                                onChange={(e) => {
                                                    setNewJob({
                                                        ...newJob,
                                                        application_fields: {
                                                            ...newJob.application_fields,
                                                            [field.key]: e.target.checked
                                                        }
                                                    });
                                                }}
                                                className="w-4 h-4 text-[#00A3A3] rounded border-gray-300 focus:ring-[#00A3A3]"
                                            />
                                            <span className="text-sm font-bold text-[#1A3B5F]">{field.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Status Control for Editing */}
                        {editingJobId && (
                            <div className="mb-6 bg-gray-50 p-4 rounded-xl border">
                                <label className="block text-sm font-bold text-[#1A3B5F] mb-2">{t('status')}</label>
                                <Select
                                    value={newJob.status}
                                    options={[
                                        { value: 'published', label: 'منشور (Published)' },
                                        { value: 'archived', label: 'مخفي (Archived)' },
                                        { value: 'closed', label: 'مغلق - لا يقبل طلبات (Closed)' },
                                    ]}
                                    onChange={(e) => setNewJob({ ...newJob, status: e.target.value as any })}
                                />
                                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                                    * <strong>منشور:</strong> يظهر للجميع ويقبل الطلبات.<br />
                                    * <strong>مخفي:</strong> لا يظهر في الموقع.<br />
                                    * <strong>مغلق:</strong> يظهر ولكن زر التقديم معطل.<br />
                                </p>
                            </div>
                        )}

                        <Button onClick={handleSaveJob} className="w-full py-6 text-lg">{editingJobId ? t('confirm') : t('publish')}</Button>
                    </div>
                </div>
            )}
        </div >
    );
}
