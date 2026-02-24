import React from 'react';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ElementType;
    isLoading?: boolean;
}

export const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    className = '',
    isLoading = false,
    disabled,
    ...props
}: ButtonProps) => {
    const variants = {
        primary: 'bg-[#00A3A3] hover:bg-[#008585] text-white',
        secondary: 'bg-[#1A3B5F] hover:bg-[#152f4a] text-white',
        outline: 'border-2 border-[#00A3A3] text-[#00A3A3] hover:bg-[#00A3A3] hover:text-white',
        ghost: 'text-[#1A3B5F] hover:bg-gray-100',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        success: 'bg-green-600 hover:bg-green-700 text-white',
    };

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <button
            className={cn(
                "font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2",
                variants[variant],
                sizes[size],
                "disabled:opacity-50 disabled:cursor-not-allowed active:scale-95",
                className
            )}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? <Loader className="animate-spin" size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} /> : Icon && <Icon size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18} />}
            {children}
        </button>
    );
};
