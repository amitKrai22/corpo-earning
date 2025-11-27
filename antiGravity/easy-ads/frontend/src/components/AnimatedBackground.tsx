import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 -z-50 overflow-hidden bg-black">
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-600/30 rounded-full blur-[120px]"
            />
            <motion.div
                animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                }}
                className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-600/20 rounded-full blur-[120px]"
            />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>
    );
};
