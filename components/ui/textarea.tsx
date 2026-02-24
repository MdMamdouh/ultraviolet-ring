import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
}

export const Textarea = ({ label, error, className, ...props }: TextareaProps) => (
    <div className="w-full">
        {label && <label className="block text-[#1A3B5F] font-bold mb-2 text-sm">{label}</label>}
        <textarea
            className={cn(
                "w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[#00A3A3] transition-colors min-h-[120px]",
                error ? 'border-red-500' : 'border-gray-200',
                className
            )}
            {...props}
        />
        {error && (
            <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                <AlertCircle size={14} />
                {error}
            </p>
        )}
    </div>
);
