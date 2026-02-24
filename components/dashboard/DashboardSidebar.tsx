'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LayoutDashboard, Briefcase, Users, FileText, Settings, Mail, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardSidebarProps {
    activeTab: 'overview' | 'jobs' | 'applications' | 'content' | 'messages' | 'blog';
    setActiveTab: (tab: 'overview' | 'jobs' | 'applications' | 'content' | 'messages' | 'blog') => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export function DashboardSidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: DashboardSidebarProps) {
    const { t } = useLanguage();

    const tabs = [
        { id: 'overview' as const, icon: LayoutDashboard, label: t('dashboard') },
        { id: 'jobs' as const, icon: Briefcase, label: t('manageJobs') },
        { id: 'applications' as const, icon: Users, label: t('allApplications') },
        { id: 'content' as const, icon: Settings, label: 'إدارة المحتوى' },
        { id: 'blog' as const, icon: FileText, label: 'إدارة المقالات' },
        { id: 'messages' as const, icon: Mail, label: 'الرسائل' },
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed inset-y-0 start-0 z-50 w-64 bg-[#1A3B5F] text-white h-full overflow-y-auto transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black">JAHEZ Admin</h2>
                        <button
                            className="lg:hidden text-white/70 hover:text-white"
                            onClick={() => setIsOpen(false)}
                            aria-label="Close menu"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id ? 'bg-[#00A3A3]' : 'hover:bg-white/10'}`}
                            >
                                <tab.icon size={20} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
