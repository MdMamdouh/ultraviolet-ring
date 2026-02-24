'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Trash2 } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';

interface PostJobSettingsModalProps {
    onClose: () => void;
}

export function PostJobSettingsModal({ onClose }: PostJobSettingsModalProps) {
    const { content, updateContent } = useContent();
    const [questions, setQuestions] = useState<{ id: string, text: string, type: 'text' | 'textarea' }[]>([]);
    const [saving, setSaving] = useState(false);
    const [fieldsConfig, setFieldsConfig] = useState<Record<string, boolean>>({
        contactPerson: true,
        companyBrief: true,
        companyWebsite: true,
        companyLogo: true,
        requirements: true,
        jobType: true,
        workMode: true,
        salary: true,
    });

    useEffect(() => {
        if (content['company_post_questions']?.content_ar) {
            try {
                setQuestions(JSON.parse(content['company_post_questions'].content_ar));
            } catch (e) {
                console.error("Failed to parse questions", e);
            }
        }
        if (content['company_post_fields']?.content_ar) {
            try {
                setFieldsConfig({ ...fieldsConfig, ...JSON.parse(content['company_post_fields'].content_ar) });
            } catch (e) {
                console.error("Failed to parse fields config", e);
            }
        }
    }, [content]);

    const addQuestion = () => {
        setQuestions([...questions, { id: Date.now().toString(), text: '', type: 'text' }]);
    };

    const updateQuestion = (id: string, text: string) => {
        setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
    };

    const updateType = (id: string, type: 'text' | 'textarea') => {
        setQuestions(questions.map(q => q.id === id ? { ...q, type } : q));
    };

    const deleteQuestion = (id: string) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await updateContent('company_post_questions', JSON.stringify(questions), JSON.stringify(questions), true);
            await updateContent('company_post_fields', JSON.stringify(fieldsConfig), JSON.stringify(fieldsConfig), true);
            alert('تم حفظ الإعدادات بنجاح!');
            onClose();
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('حدث خطأ أثناء الحفظ.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
                <div className="p-6 border-b flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#1A3B5F]">إعدادات أسئلة نموذج طلب الوظيفة (للشركات)</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="إغلاق" aria-label="إغلاق">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-bold text-[#1A3B5F] mb-4">البيانات الأساسية للنموذج</h3>
                        <p className="text-sm text-gray-500 mb-4">قم بتفعيل أو تعطيل الحقول التي تظهر للشركة أثناء نشر الوظيفة. (بعض الحقول الأساسية مثل اسم الشركة والايميل لا يمكن إخفاؤها).</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { key: 'contactPerson', label: 'اسم مسؤول التوظيف' },
                                { key: 'companyBrief', label: 'نبذة عن الشركة' },
                                { key: 'companyWebsite', label: 'موقع الشركة الإلكتروني' },
                                { key: 'companyLogo', label: 'شعار الشركة' },
                                { key: 'requirements', label: 'متطلبات الوظيفة' },
                                { key: 'jobType', label: 'نوع الوظيفة' },
                                { key: 'workMode', label: 'نظام العمل' },
                                { key: 'salary', label: 'الراتب المربع' }
                            ].map((field) => (
                                <label key={field.key} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border cursor-pointer hover:bg-gray-100 transition-colors">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-[#00A3A3] rounded"
                                        checked={fieldsConfig[field.key] !== false}
                                        onChange={(e) => setFieldsConfig({ ...fieldsConfig, [field.key]: e.target.checked })}
                                    />
                                    <span className="font-bold text-sm text-gray-700">{field.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <h3 className="text-lg font-bold text-[#1A3B5F] mb-4">الأسئلة الإضافية المخصصة</h3>
                        <p className="text-sm text-gray-500 mb-4">سيتم عرض هذه الأسئلة كنصوص تطلب من الشركة الإجابة عليها، وستظهر إجاباتهم داخل تفاصيل الوظيفة في لوحة التحكم.</p>

                        <div className="space-y-4 mb-4">
                            {questions.map((q, index) => (
                                <div key={q.id} className="flex gap-4 items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="flex-1 space-y-3">
                                        <Input
                                            placeholder={`سؤال ${index + 1}`}
                                            value={q.text}
                                            onChange={(e) => updateQuestion(q.id, e.target.value)}
                                        />
                                        <select
                                            className="w-full text-sm border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#00A3A3]"
                                            value={q.type}
                                            title="نوع السؤال"
                                            aria-label="نوع السؤال"
                                            onChange={(e) => updateType(q.id, e.target.value as any)}
                                        >
                                            <option value="text">إجابة قصيرة (نص)</option>
                                            <option value="textarea">إجابة طويلة (فقرة)</option>
                                        </select>
                                    </div>
                                    <button onClick={() => deleteQuestion(q.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0 mt-1" title="حذف السؤال" aria-label="حذف السؤال">
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <Button variant="outline" onClick={addQuestion} className="w-full border-dashed" icon={Plus}>
                            إضافة سؤال جديد
                        </Button>
                    </div>
                </div>

                <div className="p-6 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>إلغاء</Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
