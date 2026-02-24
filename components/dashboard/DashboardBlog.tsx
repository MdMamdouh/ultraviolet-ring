'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useBlogs } from '@/contexts/BlogContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';

export function DashboardBlog() {
    const { t } = useLanguage();
    const { blogs, addBlog, updateBlog, deleteBlog, uploadImage } = useBlogs();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const initialFormState = {
        title_ar: '',
        title_en: '',
        slug: '',
        content_ar: '',
        content_en: '',
        image_url: '',
        is_published: true,
        author: 'Admin'
    };

    const [formData, setFormData] = useState(initialFormState);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const handleOpenModal = (blog?: any) => {
        if (blog) {
            setFormData({
                title_ar: blog.title_ar,
                title_en: blog.title_en,
                slug: blog.slug,
                content_ar: blog.content_ar,
                content_en: blog.content_en,
                image_url: blog.image_url || '',
                is_published: blog.is_published,
                author: blog.author || 'Admin'
            });
            setEditingId(blog.id);
            setImagePreview(blog.image_url || null);
        } else {
            setFormData(initialFormState);
            setEditingId(null);
            setImagePreview(null);
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            let finalSlug = formData.slug;
            if (!finalSlug) {
                // Generate a slug from the title if it's empty
                finalSlug = (formData.title_en || formData.title_ar)
                    .replace(/\s+/g, '-') || `post-${Date.now()}`;
            }

            let finalImageUrl = formData.image_url;
            if (imageFile) {
                finalImageUrl = await uploadImage(imageFile);
            }

            const dataToSave = { ...formData, slug: finalSlug, image_url: finalImageUrl };

            if (editingId) {
                await updateBlog(editingId, dataToSave);
            } else {
                await addBlog(dataToSave);
            }
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving blog:', error);
            alert('حدث خطأ أثناء حفظ المقال');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('هل أنت متأكد من حذف هذا المقال؟')) {
            await deleteBlog(id);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-[#1A3B5F]">إدارة المقالات (Blog)</h2>
                <Button onClick={() => handleOpenModal()} icon={Plus}>إضافة مقال جديد</Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="p-4 text-sm font-bold text-gray-500">العنوان</th>
                                <th className="p-4 text-sm font-bold text-gray-500">الرابط (Slug)</th>
                                <th className="p-4 text-sm font-bold text-gray-500">الحالة</th>
                                <th className="p-4 text-sm font-bold text-gray-500">التاريخ</th>
                                <th className="p-4 text-sm font-bold text-gray-500 text-right">الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.length > 0 ? (
                                blogs.map((blog) => (
                                    <tr key={blog.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 font-bold text-[#1A3B5F]">{blog.title_ar}</td>
                                        <td className="p-4 text-gray-500">{blog.slug}</td>
                                        <td className="p-4">
                                            <Badge variant={blog.is_published ? 'success' : 'secondary'}>
                                                {blog.is_published ? 'منشور' : 'مسودة'}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-gray-500">{new Date(blog.created_at).toLocaleDateString()}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button variant="outline" size="sm" onClick={() => handleOpenModal(blog)}>
                                                    <Edit2 size={16} />
                                                </Button>
                                                <Button variant="outline" size="sm" onClick={() => handleDelete(blog.id)} className="text-red-500 hover:bg-red-50 hover:text-red-600">
                                                    <Trash2 size={16} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500">
                                        لا توجد مقالات حالياً
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 z-50 flex justify-center p-4 lg:p-8 overflow-y-auto">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl flex flex-col my-auto max-h-full">
                        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white rounded-t-2xl z-10">
                            <h2 className="text-2xl font-black text-[#1A3B5F]">
                                {editingId ? 'تعديل المقال' : 'إضافة مقال جديد'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors" title="Close" aria-label="Close">
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <Input
                                    label="عنوان المقال (عربي)"
                                    placeholder="اكتب العنوان بالعربية"
                                    value={formData.title_ar}
                                    onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                                />
                                <Input
                                    label="عنوان المقال (English)"
                                    placeholder="Write title in English"
                                    value={formData.title_en}
                                    dir="ltr"
                                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <Input
                                    label="الرابط المختصر (Slug)"
                                    placeholder="مثال: top-jobs-in-egypt-2024"
                                    value={formData.slug}
                                    dir="ltr"
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                />
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-bold text-[#1A3B5F]">حالة النشر</label>
                                    <select
                                        className="h-[42px] px-3 border rounded-lg bg-white w-full"
                                        aria-label="Publish Status"
                                        title="Publish Status"
                                        value={formData.is_published ? 'true' : 'false'}
                                        onChange={(e) => setFormData({ ...formData, is_published: e.target.value === 'true' })}
                                    >
                                        <option value="true">منشور (يظهر في الموقع)</option>
                                        <option value="false">مسودة (مخفي)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-6 space-y-2">
                                <label className="text-sm font-bold text-[#1A3B5F]">صورة المقال</label>
                                <div className="border-2 border-dashed rounded-xl p-6 text-center hover:bg-gray-50 transition-colors relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        title="Upload Image"
                                        placeholder="Upload Image"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                    />
                                    {imagePreview ? (
                                        <div className="flex flex-col items-center">
                                            <img src={imagePreview} alt="Preview" className="h-32 object-cover rounded-lg mb-2" />
                                            <span className="text-sm text-[#00A3A3] font-bold">تغيير الصورة</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-500">
                                            <ImageIcon size={40} className="mb-2 text-gray-400" />
                                            <span className="font-bold mb-1">انقر أو اسحب الصورة هنا</span>
                                            <span className="text-sm">JPG, PNG (Max. 2MB)</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-sm font-bold text-[#1A3B5F] mb-2 block">محتوى المقال (عربي)</label>
                                    <Textarea
                                        placeholder="اكتب المحتوى هنا... (يمكن كتابته بتنسيق Markdown أو نصوص HTML)"
                                        className="min-h-[200px]"
                                        value={formData.content_ar}
                                        onChange={(e) => setFormData({ ...formData, content_ar: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-[#1A3B5F] mb-2 block">محتوى المقال (English)</label>
                                    <Textarea
                                        placeholder="Write content here... (Supports Markdown or HTML)"
                                        className="min-h-[200px]"
                                        dir="ltr"
                                        value={formData.content_en}
                                        onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-4">
                            <Button variant="outline" onClick={() => setIsModalOpen(false)}>إلغاء</Button>
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? 'جاري الحفظ...' : 'حفظ ونشر'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
