'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Badge } from '@/components/ui/badge';

interface ContactMessage {
    id: number;
    name: string;
    email: string;
    message: string;
    status: 'new' | 'read' | 'replied';
    created_at: string;
}

interface DashboardMessagesProps {
    messages: ContactMessage[];
}

export function DashboardMessages({ messages }: DashboardMessagesProps) {
    const { t } = useLanguage();

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-lg">رسائل التواصل</h3>
                <div className="text-sm text-gray-500">{messages?.length || 0} رسالة</div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 text-sm font-bold text-gray-500">الاسم</th>
                            <th className="p-4 text-sm font-bold text-gray-500">البريد الإلكتروني</th>
                            <th className="p-4 text-sm font-bold text-gray-500">الرسالة</th>
                            <th className="p-4 text-sm font-bold text-gray-500">التاريخ</th>
                            <th className="p-4 text-sm font-bold text-gray-500">الحالة</th>
                        </tr>
                    </thead>
                    <tbody>
                        {messages && messages.length > 0 ? (
                            messages.map((msg) => (
                                <tr key={msg.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4 font-bold text-[#1A3B5F]">{msg.name}</td>
                                    <td className="p-4 text-gray-600">{msg.email}</td>
                                    <td className="p-4 text-gray-600 max-w-xs truncate" title={msg.message}>{msg.message}</td>
                                    <td className="p-4 text-gray-600">{new Date(msg.created_at).toLocaleDateString()}</td>
                                    <td className="p-4">
                                        <Badge variant={msg.status === 'new' ? 'success' : 'secondary'}>
                                            {msg.status === 'new' ? 'جديدة' : 'مقروءة'}
                                        </Badge>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    لا توجد رسائل حالياً
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
