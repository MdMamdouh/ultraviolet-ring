'use client';
/* eslint-disable */
import React, { createContext, useContext, useState } from 'react';

const translations: Record<string, any> = {
    ar: {
        // Navigation
        home: 'الرئيسية',
        jobs: 'الوظائف',
        postJob: 'نشر وظيفة',
        aboutUs: 'من نحن',
        contact: 'تواصل معنا',
        blog: 'المدونة',

        // Hero
        heroTitle: 'وظيفتك القادمة تبدأ من هنا',
        heroSubtitle: 'نربط الكفاءات المصرية بأفضل فرص العمل',
        browseJobs: 'تصفّح الوظائف',
        postJobBtn: 'نشر وظيفة',

        // Stats
        activeJobs: 'وظيفة متاحة',
        companiesHiring: 'الشركات',
        successfulHires: 'توظيف ناجح',

        // Search & Filters  
        searchPlaceholder: 'ابحث عن وظيفة، مهارة، أو شركة...',
        category: 'التخصص',
        allCategories: 'كل التخصصات',
        jobType: 'نوع العمل',
        allTypes: 'كل الأنواع',
        workMode: 'مكان العمل',
        allModes: 'كل الأماكن',
        location: 'المدينة',
        allLocations: 'كل المدن',
        search: 'بحث',
        clearFilters: 'مسح الفلاتر',
        filters: 'تصفية',

        // Job Types
        fullTime: 'دوام كامل',
        partTime: 'دوام جزئي',
        contract: 'عقد',
        freelance: 'عمل حر',

        // Work Modes
        onsite: 'في المكتب',
        remote: 'عن بُعد',
        hybrid: 'مختلط',

        // Job Card
        viewDetails: 'عرض التفاصيل',
        applyNow: 'تقدم الآن',
        new: 'جديد',
        featured: 'مميز',

        // Job Details
        overview: 'نظرة عامة',
        description: 'الوصف الوظيفي',
        requirements: 'المتطلبات',
        benefits: 'المزايا',
        aboutCompany: 'عن الشركة',
        share: 'مشاركة',
        save: 'حفظ',
        saved: 'محفوظ',
        company: 'الشركة',
        postedOn: 'تاريخ النشر',
        deadline: 'آخر موعد',
        applicants: 'متقدم',

        // Apply Form
        applyForJob: 'التقديم على الوظيفة',
        personalInfo: 'البيانات الشخصية',
        fullName: 'الاسم الكامل',
        email: 'البريد الإلكتروني',
        phone: 'رقم الهاتف',
        city: 'المدينة',
        uploadCV: 'ارفع السيرة الذاتية',
        dragDrop: 'اسحب الملف هنا أو اضغط للاختيار',
        supportedFormats: 'PDF, DOC, DOCX (حد أقصى 5 ميجا)',
        additionalQuestions: 'أسئلة إضافية',
        additionalInfo: 'معلومات إضافية',
        coverLetter: 'خطاب تعريفي (اختياري)',
        submitApplication: 'إرسال الطلب',
        submitting: 'جاري الإرسال...',

        // Success Messages
        applicationSuccess: 'تم إرسال طلبك بنجاح!',
        applicationSuccessMsg: 'شكراً لتقديمك على هذه الوظيفة. سنتواصل معك قريباً.',
        referenceNumber: 'رقم المرجع',
        requestSuccess: 'تم إرسال طلبك بنجاح!',
        requestSuccessMsg: 'سنراجع طلبك ونتواصل معك خلال 24-48 ساعة.',

        // Post Job
        postJobTitle: 'نشر وظيفة',
        postJobSubtitle: 'املأ البيانات وسنتواصل معك لنشر الوظيفة',
        companyInfo: 'بيانات الشركة',
        companyName: 'اسم الشركة',
        contactPerson: 'الشخص المسؤول',
        jobDetails: 'تفاصيل الوظيفة',
        jobTitle: 'المسمى الوظيفي',
        jobDescription: 'الوصف الوظيفي',
        jobRequirements: 'المتطلبات',
        salary: 'الراتب (اختياري)',
        submitRequest: 'إرسال الطلب',

        // Validation
        required: 'هذا الحقل مطلوب',
        invalidEmail: 'البريد الإلكتروني غير صحيح',
        invalidPhone: 'رقم الهاتف غير صحيح',
        fileTooLarge: 'حجم الملف كبير جداً',
        invalidFileType: 'نوع الملف غير مدعوم',

        // Empty States
        noJobs: 'لا توجد وظائف متاحة',
        noJobsDesc: 'جرب تغيير الفلاتر أو تصفح جميع الوظائف',
        noResults: 'لم نعثر على نتائج',
        noResultsDesc: 'جرب كلمات بحث مختلفة أو فلاتر أخرى',

        // Admin
        dashboard: 'لوحة التحكم',
        manageJobs: 'إدارة الوظائف',
        pendingRequests: 'طلبات قيد المراجعة',
        allApplications: 'جميع الطلبات',
        statistics: 'الإحصائيات',
        totalJobs: 'إجمالي الوظائف',
        publishedJobs: 'وظائف منشورة',
        totalApplications: 'إجمالي الطلبات',
        pendingReview: 'قيد المراجعة',
        actions: 'الإجراءات',
        view: 'عرض',
        edit: 'تعديل',
        delete: 'حذف',
        approve: 'موافقة',
        reject: 'رفض',
        publish: 'نشر',
        archive: 'أرشفة',
        status: 'الحالة',
        draft: 'مسودة',
        published: 'منشور',
        archived: 'مؤرشف',
        pending_review: 'قيد المراجعة',
        createNew: 'إنشاء جديد',
        logout: 'تسجيل خروج',

        // Footer
        quickLinks: 'روابط سريعة',
        forJobSeekers: 'للباحثين عن عمل',
        forCompanies: 'للشركات',
        allRightsReserved: 'جميع الحقوق محفوظة',

        // Misc
        loading: 'جاري التحميل...',
        showMore: 'عرض المزيد',
        showLess: 'عرض أقل',
        back: 'رجوع',
        next: 'التالي',
        previous: 'السابق',
        cancel: 'إلغاء',
        confirm: 'تأكيد',
        close: 'إغلاق',
    },
    en: {
        // Navigation
        home: 'Home',
        jobs: 'Jobs',
        postJob: 'Publish Job',
        aboutUs: 'About Us',
        contact: 'Contact Us',
        blog: 'Blog',

        // Hero
        heroTitle: 'Your Next Job Starts Here',
        heroSubtitle: 'Connecting Egyptian talent with the best opportunities',
        browseJobs: 'Browse Jobs',
        postJobBtn: 'Post a Job',

        // Stats
        activeJobs: 'Active Jobs',
        companiesHiring: 'Companies Hiring',
        successfulHires: 'Successful Hires',

        // Search & Filters
        searchPlaceholder: 'Search for job, skill, or company...',
        category: 'Category',
        allCategories: 'All Categories',
        jobType: 'Job Type',
        allTypes: 'All Types',
        workMode: 'Work Mode',
        allModes: 'All Modes',
        location: 'Location',
        allLocations: 'All Locations',
        search: 'Search',
        clearFilters: 'Clear Filters',
        filters: 'Filters',

        // Job Types
        fullTime: 'Full Time',
        partTime: 'Part Time',
        contract: 'Contract',
        freelance: 'Freelance',

        // Work Modes
        onsite: 'On-site',
        remote: 'Remote',
        hybrid: 'Hybrid',

        // Job Card
        viewDetails: 'View Details',
        applyNow: 'Apply Now',
        new: 'New',
        featured: 'Featured',

        // Job Details
        overview: 'Overview',
        description: 'Job Description',
        requirements: 'Requirements',
        benefits: 'Benefits',
        aboutCompany: 'About Company',
        share: 'Share',
        save: 'Save',
        saved: 'Saved',
        company: 'Company',
        postedOn: 'Posted on',
        deadline: 'Deadline',
        applicants: 'Applicants',

        // Apply Form
        applyForJob: 'Apply for Job',
        personalInfo: 'Personal Information',
        fullName: 'Full Name',
        email: 'Email',
        phone: 'Phone',
        city: 'City',
        uploadCV: 'Upload CV',
        dragDrop: 'Drag & drop or click to upload',
        supportedFormats: 'PDF, DOC, DOCX (Max 5MB)',
        additionalQuestions: 'Additional Questions',
        additionalInfo: 'Additional Information',
        coverLetter: 'Cover Letter (Optional)',
        submitApplication: 'Submit Application',
        submitting: 'Submitting...',

        // Success Messages
        applicationSuccess: 'Application Submitted Successfully!',
        applicationSuccessMsg: 'Thank you for applying. We will contact you soon.',
        referenceNumber: 'Reference Number',
        requestSuccess: 'Request Submitted Successfully!',
        requestSuccessMsg: 'We will review your request and contact you within 24-48 hours.',

        // Post Job
        postJobTitle: 'Post a Job',
        postJobSubtitle: 'Fill in the details and we will contact you to publish the job',
        companyInfo: 'Company Information',
        companyName: 'Company Name',
        contactPerson: 'Contact Person',
        jobDetails: 'Job Details',
        jobTitle: 'Job Title',
        jobDescription: 'Job Description',
        jobRequirements: 'Requirements',
        salary: 'Salary (Optional)',
        submitRequest: 'Submit Request',

        // Validation
        required: 'This field is required',
        invalidEmail: 'Invalid email address',
        invalidPhone: 'Invalid phone number',
        fileTooLarge: 'File is too large',
        invalidFileType: 'File type not supported',

        // Empty States
        noJobs: 'No jobs available',
        noJobsDesc: 'Try changing filters or browse all jobs',
        noResults: 'No results found',
        noResultsDesc: 'Try different keywords or filters',

        // Admin
        dashboard: 'Dashboard',
        manageJobs: 'Manage Jobs',
        pendingRequests: 'Pending Requests',
        allApplications: 'All Applications',
        statistics: 'Statistics',
        totalJobs: 'Total Jobs',
        publishedJobs: 'Published Jobs',
        totalApplications: 'Total Applications',
        pendingReview: 'Pending Review',
        actions: 'Actions',
        view: 'View',
        edit: 'Edit',
        delete: 'Delete',
        approve: 'Approve',
        reject: 'Reject',
        publish: 'Publish',
        archive: 'Archive',
        status: 'Status',
        draft: 'Draft',
        published: 'Published',
        archived: 'Archived',
        pending_review: 'Pending Review',
        createNew: 'Create New',
        logout: 'Logout',

        // Footer
        quickLinks: 'Quick Links',
        forJobSeekers: 'For Job Seekers',
        forCompanies: 'For Companies',
        allRightsReserved: 'All rights reserved',

        // Misc
        loading: 'Loading...',
        showMore: 'Show More',
        showLess: 'Show Less',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        cancel: 'Cancel',
        confirm: 'Confirm',
        close: 'Close',
    }
};

const LanguageContext = createContext<any>(null);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
    const [language, setLanguage] = useState<'ar' | 'en'>('ar');
    const t = (key: string) => translations[language][key] || key;
    const toggleLanguage = () => setLanguage(prev => prev === 'ar' ? 'en' : 'ar');

    return (
        <LanguageContext.Provider value={{ language, t, toggleLanguage }}>
            <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="font-cairo min-h-screen flex flex-col">
                {children}
            </div>
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
