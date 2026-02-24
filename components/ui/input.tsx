import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ElementType;
}

export const Input = ({ label, error, icon: Icon, className, ...props }: InputProps) => (
    <div className="w-full">
        {label && <label className="block text-[#1A3B5F] font-bold mb-2 text-sm">{label}</label>}
        <div className="relative">
            {Icon && <Icon className="absolute top-3.5 start-3 text-gray-400" size={20} />}
            <input
                className={cn(
                    "w-full py-3 border-2 rounded-lg focus:outline-none focus:border-[#00A3A3] transition-colors",
                    Icon ? 'ps-10 pe-4' : 'px-4',
                    error ? 'border-red-500' : 'border-gray-200',
                    className
                )}
                {...props}
            />
        </div>
        {error && (
            <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                <AlertCircle size={14} />
                {error}
            </p>
        )}
    </div>
);
