import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({
    className,
    variant = 'primary',
    ...props
}) => {
    const variants = {
        primary: "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25",
        secondary: "bg-white text-black hover:bg-gray-100",
        outline: "border border-white/20 hover:bg-white/10 text-white backdrop-blur-sm"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn("px-6 py-3 rounded-xl font-bold transition-all", variants[variant], className)}
            {...props}
        />
    );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={cn("bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:border-purple-500/50 transition-colors", className)}
        >
            {children}
        </motion.div>
    );
};
