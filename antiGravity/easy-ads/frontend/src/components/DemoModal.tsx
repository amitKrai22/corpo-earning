import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DemoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-[#0A0A0A] rounded-3xl w-full max-w-4xl border border-gray-800 shadow-2xl relative z-10 overflow-hidden"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 text-gray-400 hover:text-white transition-colors bg-black/50 rounded-full p-2 backdrop-blur-sm"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-8">
                            <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                                See EasyAds in Action
                            </h2>

                            <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-gray-800">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                                    title="EasyAds Demo"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="w-full h-full"
                                />
                            </div>

                            <p className="mt-6 text-gray-400 text-center">
                                Watch how EasyAds transforms product images into stunning marketing content in seconds
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default DemoModal;
