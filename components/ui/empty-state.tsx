import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    icon: React.ElementType;
    title: string;
    description: string;
    action?: React.ReactNode;
}

export const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => (
    <div className="text-center py-20">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
            <Icon size={40} className="text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-[#1A3B5F] mb-3">{title}</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
        {action}
    </div>
);
