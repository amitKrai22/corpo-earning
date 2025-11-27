import React, { useState } from 'react';
import { Sparkles, Zap, Image as ImageIcon, Video, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthModal from '../components/AuthModal';
import DemoModal from '../components/DemoModal';
import { Button, Card } from '../components/ui';
import { AnimatedBackground } from '../components/AnimatedBackground';

const Landing: React.FC = () => {
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isDemoOpen, setIsDemoOpen] = useState(false);

    return (
        <div className="min-h-screen text-white selection:bg-purple-500 selection:text-white relative overflow-hidden">
            <AnimatedBackground />

            {/* Navbar */}
            <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center space-x-2"
                >
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <Sparkles size={24} className="text-white" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">EasyAds</span>
                </motion.div>
                <Button variant="outline" onClick={() => setIsAuthOpen(true)}>
                    Login
                </Button>
            </nav>

            {/* Hero */}
            <main className="container mx-auto px-6 pt-20 pb-32 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight tracking-tight">
                        Transform Products into <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 animate-gradient-x">
                            Viral Visuals
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Upload your product image and let our AI generate stunning marketing visuals and videos in seconds. <span className="text-white font-semibold">No studio required.</span>
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            onClick={() => setIsAuthOpen(true)}
                            className="text-lg px-8 py-4 flex items-center gap-2"
                        >
                            Start Creating Free <ArrowRight size={20} />
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() => setIsDemoOpen(true)}
                            className="text-lg px-8 py-4"
                        >
                            View Demo
                        </Button>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mt-32">
                    {[
                        {
                            icon: <ImageIcon className="text-purple-400" size={32} />,
                            title: "AI Product Photography",
                            desc: "Place your product in any environment with professional lighting and composition."
                        },
                        {
                            icon: <Video className="text-pink-400" size={32} />,
                            title: "Instant Video Ads",
                            desc: "Generate 5-second motion clips to grab attention on TikTok and Instagram Reels."
                        },
                        {
                            icon: <Zap className="text-orange-400" size={32} />,
                            title: "Lightning Fast",
                            desc: "From upload to download in under 30 seconds. Scale your content creation effortlessly."
                        }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                        >
                            <Card className="h-full text-left group">
                                <div className="mb-6 p-4 bg-white/5 rounded-2xl w-fit group-hover:bg-white/10 transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-lg">{feature.desc}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </main>

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
            <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
        </div>
    );
};

export default Landing;
