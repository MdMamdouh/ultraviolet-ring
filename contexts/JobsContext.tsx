/* eslint-disable */
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// Define the Job type matches the DB schema
export interface Job {
    id: number;
    title_ar: string;
    title_en: string;
    company: string;
    logo: string;
    location: string;
    category: string;
    job_type: string;
    work_mode: string;
    salary: string;
    description_ar: string;
    description_en: string;
    requirements_ar: string;
    requirements_en: string;
    created_at: string;
    status: 'published' | 'draft' | 'archived' | 'rejected' | 'pending_review' | 'closed';
    applicants: number;
    is_new?: boolean;
    is_featured?: boolean;
    custom_questions?: Question[];
    application_fields?: Record<string, boolean>;
}

export interface Question {
    id: string;
    text: string;
    type: 'text' | 'textarea' | 'select';
    options?: string[]; // For select type
}

// Define Application type
export interface Application {
    id: number;
    job_id: number;
    full_name: string;
    email: string;
    phone: string;
    cv_url: string;
    cover_letter: string;
    status: 'new' | 'viewed' | 'shortlisted' | 'rejected';
    created_at: string;
    city: string;
    answers?: Record<string, string>; // question_id -> answer
}

interface JobsContextType {
    jobs: Job[];
    applications: Application[];
    messages: ContactMessage[];
    loading: boolean;
    addJob: (job: Omit<Job, 'id' | 'created_at' | 'applicants'>) => Promise<void>;
    updateJob: (id: number, job: Partial<Job>) => Promise<void>;
    updateJobStatus: (id: number, status: Job['status']) => Promise<void>;
    updateApplicationStatus: (id: number, status: Application['status']) => Promise<void>;
    deleteJob: (id: number) => Promise<void>;
    submitApplication: (data: any, file?: File) => Promise<void>;
    submitMessage: (name: string, email: string, message: string) => Promise<void>;
    uploadLogo: (file: File) => Promise<string>;
    refreshJobs: () => Promise<void>;
}

const JobsContext = createContext<JobsContextType | null>(null);

export interface ContactMessage {
    id: number;
    name: string;
    email: string;
    message: string;
    status: 'new' | 'read' | 'archived';
    created_at: string;
}

export const JobsProvider = ({ children }: { children: React.ReactNode }) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<Application[]>([]);
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Jobs
            const { data: jobsData, error: jobsError } = await supabase
                .from('jobs')
                .select('*')
                .order('created_at', { ascending: false });

            if (jobsError) throw jobsError;
            setJobs(jobsData || []);

            // Fetch Applications
            const { data: appsData, error: appsError } = await supabase
                .from('applications')
                .select('*')
                .order('created_at', { ascending: false });

            if (appsError) throw appsError;
            setApplications(appsData || []);

            // Fetch Messages
            const { data: msgsData, error: msgsError } = await supabase
                .from('contact_messages')
                .select('*')
                .order('created_at', { ascending: false });

            if (msgsError) throw msgsError;
            setMessages(msgsData || []);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const addJob = async (newJobData: Omit<Job, 'id' | 'created_at' | 'applicants'>) => {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .insert([{
                    applicants: 0,
                    ...newJobData
                }])
                .select();

            if (error) throw error;
            if (data) {
                setJobs([data[0], ...jobs]);
            }
        } catch (error) {
            console.error('Error adding job:', error);
        }
    };

    const updateJob = async (id: number, updatedJobData: Partial<Job>) => {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .update(updatedJobData)
                .eq('id', id)
                .select();

            if (error) throw error;
            if (data) {
                setJobs(jobs.map(job => job.id === id ? { ...job, ...updatedJobData } : job));
            }
        } catch (error) {
            console.error('Error updating job:', error);
            throw error;
        }
    };

    const updateJobStatus = async (id: number, status: Job['status']) => {
        try {
            const { error } = await supabase
                .from('jobs')
                .update({ status })
                .eq('id', id);

            if (error) throw error;
            setJobs(jobs.map(job => job.id === id ? { ...job, status } : job));
        } catch (error) {
            console.error('Error updating job status:', error);
            throw error;
        }
    };

    const updateApplicationStatus = async (id: number, status: Application['status']) => {
        try {
            const { data, error } = await supabase
                .from('applications')
                .update({ status })
                .eq('id', id)
                .select();

            if (error) throw error;
            if (data) {
                setApplications(applications.map(app => app.id === id ? { ...app, status } : app));

                // Automate Emails for specific statuses
                if (status === 'shortlisted' || status === 'rejected') {
                    const targetApp = applications.find(a => a.id === id) || data[0];
                    const targetJob = jobs.find(j => j.id === targetApp?.job_id);

                    if (targetApp && targetJob && targetApp.email) {
                        const isArabic = targetJob.title_ar ? true : false;
                        const jobTitle = isArabic ? targetJob.title_ar : targetJob.title_en;

                        let subject = '';
                        let html = '';

                        if (status === 'shortlisted') {
                            subject = isArabic ? `تحديث بخصوص طلبكم لوظيفة ${jobTitle}` : `Update regarding your application for ${jobTitle}`;
                            html = isArabic ? `
                                <div dir="rtl" style="font-family: sans-serif; line-height: 1.6; color: #333;">
                                    <h2>مرحباً ${targetApp.full_name}،</h2>
                                    <p>نتمنى أن تكون بخير.</p>
                                    <p>يسعدنا إبلاغك بأنه تم <strong>ترشيحك للمرحلة التالية (Shortlisted)</strong> بخصوص طلبك لوظيفة <strong>${jobTitle}</strong> عبر منصة جاهز.</p>
                                    <p>سيقوم فريق التوظيف بالتواصل معك قريباً لتحديد الخطوات القادمة.</p>
                                    <p>مع أطيب التحيات،<br>فريق جاهز</p>
                                </div>
                            ` : `
                                <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                                    <h2>Hello ${targetApp.full_name},</h2>
                                    <p>We hope this email finds you well.</p>
                                    <p>We are pleased to inform you that you have been <strong>shortlisted</strong> for the <strong>${jobTitle}</strong> position.</p>
                                    <p>Our hiring team will be in touch with you shortly with the next steps.</p>
                                    <p>Best regards,<br>The Jahez Team</p>
                                </div>
                            `;
                        } else if (status === 'rejected') {
                            subject = isArabic ? `تحديث بخصوص طلبكم لوظيفة ${jobTitle}` : `Update regarding your application for ${jobTitle}`;
                            html = isArabic ? `
                                <div dir="rtl" style="font-family: sans-serif; line-height: 1.6; color: #333;">
                                    <h2>مرحباً ${targetApp.full_name}،</h2>
                                    <p>شكراً لاهتمامك بالانضمام لفريقنا والتقديم على وظيفة <strong>${jobTitle}</strong> عبر منصة جاهز.</p>
                                    <p>بعد المراجعة الدقيقة لطلبك، نأسف لإبلاغك بأننا لن نتمكن من المضي قدماً في طلبك في الوقت الحالي، حيث أننا اخترنا مرشحين تتوافق خبراتهم بشكل أكبر مع متطلباتنا الحالية.</p>
                                    <p>نتمنى لك التوفيق في مسيرتك المهنية.</p>
                                    <p>مع أطيب التحيات،<br>فريق جاهز</p>
                                </div>
                            ` : `
                                <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
                                    <h2>Hello ${targetApp.full_name},</h2>
                                    <p>Thank you for your interest in the <strong>${jobTitle}</strong> position.</p>
                                    <p>After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.</p>
                                    <p>We wish you the best of luck in your job search.</p>
                                    <p>Best regards,<br>The Jahez Team</p>
                                </div>
                            `;
                        }

                        // Fire and forget email API
                        fetch('/api/send-email', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                to: targetApp.email,
                                subject,
                                html
                            })
                        }).catch(console.error);
                    }
                }
            }
        } catch (error) {
            console.error('Error updating application status:', error);
            throw error;
        }
    };

    const deleteJob = async (id: number) => {
        try {
            const { error } = await supabase
                .from('jobs')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setJobs(jobs.filter(job => job.id !== id));
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };

    const submitApplication = async (applicationData: any, file?: File) => {
        try {
            let cvUrl = applicationData.cv_url;

            // 1. Upload File if exists
            if (file) {
                // Generate a safe filename: timestamp-random.extension
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

                const { data, error: uploadError } = await supabase.storage
                    .from('resumes')
                    .upload(`${fileName}`, file);

                if (uploadError) throw uploadError;

                // 2. Get Public URL
                const { data: publicUrlData } = supabase.storage
                    .from('resumes')
                    .getPublicUrl(`${fileName}`);

                cvUrl = publicUrlData.publicUrl;
            }

            // 3. Save Application Record
            const { data, error } = await supabase
                .from('applications')
                .insert([{
                    ...applicationData,
                    cv_url: cvUrl
                }])
                .select();

            if (error) throw error;
            if (data) {
                setApplications([data[0], ...applications]);
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            throw error;
        }
    };

    const submitMessage = async (name: string, email: string, message: string) => {
        try {
            const { data, error } = await supabase
                .from('contact_messages')
                .insert([{ name, email, message }])
                .select();

            if (error) throw error;
            if (data) {
                setMessages([data[0], ...messages]);
            }
        } catch (error) {
            console.error('Error submitting message:', error);
            throw error;
        }
    };

    const uploadLogo = async (file: File): Promise<string> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `logo-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('company-logos')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('company-logos')
                .getPublicUrl(fileName);

            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading logo:', error);
            throw error;
        }
    };

    return (
        <JobsContext.Provider value={{ jobs, applications, messages, loading, addJob, updateJob, updateJobStatus, updateApplicationStatus, deleteJob, submitApplication, submitMessage, uploadLogo, refreshJobs: fetchData }}>
            {children}
        </JobsContext.Provider>
    );
};

export const useJobs = () => {
    const context = useContext(JobsContext);
    if (!context) {
        throw new Error('useJobs must be used within a JobsProvider');
    }
    return context;
};
