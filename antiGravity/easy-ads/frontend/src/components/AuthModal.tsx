import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                const formData = new FormData();
                formData.append('username', email);
                formData.append('password', password);
                const response = await api.post('/token', formData);
                login(response.data.access_token);
                onClose();
                navigate('/dashboard');
            } else {
                await api.post('/users/', { email, password });
                const formData = new FormData();
                formData.append('username', email);
                formData.append('password', password);
                const response = await api.post('/token', formData);
                login(response.data.access_token);
                onClose();
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'An error occurred');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-[#0A0A0A] p-8 rounded-3xl w-full max-w-md border border-gray-800 shadow-2xl relative z-10"
                    >
                        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                            <X size={24} />
                        </button>

                        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                            {isLogin ? 'Welcome Back' : 'Get Started'}
                        </h2>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2 text-sm font-medium">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-gray-700 rounded-xl p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                    required
                                />
                            </div>

                            <Button type="submit" className="w-full mt-2">
                                {isLogin ? 'Login' : 'Sign Up'}
                            </Button>
                        </form>

                        <p className="mt-6 text-center text-gray-400 text-sm">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                            >
                                {isLogin ? 'Sign Up' : 'Login'}
                            </button>
                        </p>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
