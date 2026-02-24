'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface DashboardContentProps {
    aboutAr: string;
    setAboutAr: (val: string) => void;
    aboutEn: string;
    setAboutEn: (val: string) => void;
    aboutIsPublished: boolean;
    setAboutIsPublished: (val: boolean) => void;
    visionAr: string;
    setVisionAr: (val: string) => void;
    visionEn: string;
    setVisionEn: (val: string) => void;
    valuesAr: string;
    setValuesAr: (val: string) => void;
    valuesEn: string;
    setValuesEn: (val: string) => void;

    // Contact Info States
    addressAr: string;
    setAddressAr: (val: string) => void;
    addressEn: string;
    setAddressEn: (val: string) => void;
    email: string;
    setEmail: (val: string) => void;
    phone: string;
    setPhone: (val: string) => void;

    // Statistics States
    statCompanies: string;
    setStatCompanies: (val: string) => void;
    statHires: string;
    setStatHires: (val: string) => void;

    handleSaveContent: () => void;
}

export function DashboardContent({
    aboutAr, setAboutAr, aboutEn, setAboutEn, aboutIsPublished, setAboutIsPublished,
    visionAr, setVisionAr, visionEn, setVisionEn, valuesAr, setValuesAr, valuesEn, setValuesEn,
    addressAr, setAddressAr, addressEn, setAddressEn, email, setEmail, phone, setPhone,
    statCompanies, setStatCompanies, statHires, setStatHires,
    handleSaveContent
}: DashboardContentProps) {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-xl font-bold text-[#1A3B5F]">إدارة محتوى الموقع</h3>
                <Button size="sm" onClick={handleSaveContent} className="w-full sm:w-auto">حفظ التغييرات</Button>
            </div>

            <div className="space-y-8">
                {/* About Us Section */}
                <div>
                    <h4 className="font-bold text-lg text-[#00A3A3] mb-4 border-b pb-2">قسم من نحن (About Us)</h4>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h4 className="font-bold text-[#1A3B5F]">حالة الصفحة</h4>
                            <p className="text-sm text-gray-500">تحكم في ظهور صفحة &quot;من نحن&quot; على الموقع</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`text-sm font-bold ${aboutIsPublished ? 'text-[#00A3A3]' : 'text-gray-400'}`}>
                                {aboutIsPublished ? 'منشورة (Visible)' : 'مخفية (Hidden)'}
                            </span>
                            <button
                                aria-label="Toggle Published Status"
                                onClick={() => setAboutIsPublished(!aboutIsPublished)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${aboutIsPublished ? 'bg-[#00A3A3]' : 'bg-gray-300'}`}
                            >
                                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${aboutIsPublished ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <h4 className="font-bold text-gray-700 mb-2">النص العربي (Main Description)</h4>
                            <Textarea
                                className="min-h-[150px]"
                                value={aboutAr}
                                onChange={(e) => setAboutAr(e.target.value)}
                                placeholder="اكتب المحتوى العربي هنا..."
                            />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-700 mb-2">English Text (Main Description)</h4>
                            <Textarea
                                className="min-h-[150px] text-left"
                                dir="ltr"
                                value={aboutEn}
                                onChange={(e) => setAboutEn(e.target.value)}
                                placeholder="Write English content here..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-bold text-[#1A3B5F] mb-4">رؤيتنا (Our Vision)</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">عربي</label>
                                    <Textarea value={visionAr} onChange={(e) => setVisionAr(e.target.value)} placeholder="رؤية الشركة..." className="h-24" />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">English</label>
                                    <Textarea value={visionEn} onChange={(e) => setVisionEn(e.target.value)} placeholder="Company Vision..." dir="ltr" className="h-24" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1A3B5F] mb-4">قيمنا (Our Values)</h4>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">عربي</label>
                                    <Textarea value={valuesAr} onChange={(e) => setValuesAr(e.target.value)} placeholder="قيم الشركة..." className="h-24" />
                                </div>
                                <div>
                                    <label className="text-sm font-semibold text-gray-600">English</label>
                                    <Textarea value={valuesEn} onChange={(e) => setValuesEn(e.target.value)} placeholder="Company Values..." dir="ltr" className="h-24" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* Contact Info Section */}
                <div>
                    <h4 className="font-bold text-lg text-[#00A3A3] mb-4 border-b pb-2">بيانات التواصل (Contact Info)</h4>
                    <p className="text-sm text-gray-500 mb-4">هذه البيانات تظهر في صفحة &quot;تواصل معنا&quot; وفي أسفل الموقع (Footer).</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <Input
                                label="العنوان (عربي)"
                                value={addressAr}
                                onChange={(e) => setAddressAr(e.target.value)}
                                placeholder="مثال: القاهرة، مصر"
                            />
                            <Input
                                label="البريد الإلكتروني"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="support@jahez.com"
                                type="email"
                                dir="ltr"
                            />
                        </div>
                        <div className="space-y-4">
                            <Input
                                label="Address (English)"
                                value={addressEn}
                                onChange={(e) => setAddressEn(e.target.value)}
                                placeholder="e.g. Cairo, Egypt"
                                dir="ltr"
                            />
                            <Input
                                label="رقم الهاتف"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+20 123 456 7890"
                                dir="ltr"
                            />
                        </div>
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* Statistics Info Section */}
                <div>
                    <h4 className="font-bold text-lg text-[#00A3A3] mb-4 border-b pb-2">إحصائيات الصفحة الرئيسية (Home Page Statistics)</h4>
                    <p className="text-sm text-gray-500 mb-4">هذه الأرقام تظهر في الصفحة الرئيسية للزوار لتعزيز الثقة في الموقع.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="الشركات الموظِفة (Companies Hiring)"
                            value={statCompanies}
                            onChange={(e) => setStatCompanies(e.target.value)}
                            placeholder="مثال: 80+"
                            dir="ltr"
                        />
                        <Input
                            label="التوظيفات الناجحة (Successful Hires)"
                            value={statHires}
                            onChange={(e) => setStatHires(e.target.value)}
                            placeholder="مثال: 2,500+"
                            dir="ltr"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
