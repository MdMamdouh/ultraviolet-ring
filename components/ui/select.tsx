import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { value: string; label: string }[];
    error?: string;
}

export const Select = ({ label, options, error, className, ...props }: SelectProps) => (
    <div className="w-full">
        {label && <label className="block text-[#1A3B5F] font-bold mb-2 text-sm">{label}</label>}
        <select
            className={cn(
                "w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[#00A3A3] transition-colors bg-white",
                error ? 'border-red-500' : 'border-gray-200',
                className
            )}
            {...props}
        >
            {options.map((opt, i) => (
                <option key={i} value={opt.value}>{opt.label}</option>
            ))}
        </select>
        {error && (
            <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                <AlertCircle size={14} />
                {error}
            </p>
        )}
    </div>
);
