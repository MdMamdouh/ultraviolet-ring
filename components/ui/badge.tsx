import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

export const Badge = ({ children, variant = 'primary', className, ...props }: BadgeProps) => {
    const variants = {
        primary: 'bg-[#e6f7f7] text-[#00A3A3]',
        secondary: 'bg-[#e8edf3] text-[#1A3B5F]',
        success: 'bg-green-50 text-green-700',
        warning: 'bg-orange-50 text-orange-700',
        danger: 'bg-red-50 text-red-700',
    };

    return (
        <span className={cn("px-3 py-1 rounded-full text-xs font-bold", variants[variant], className)} {...props}>
            {children}
        </span>
    );
};
