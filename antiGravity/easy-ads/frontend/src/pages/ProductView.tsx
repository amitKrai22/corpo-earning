import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, Download, ArrowLeft, Image as ImageIcon, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import { Button, Card } from '../components/ui';
import { AnimatedBackground } from '../components/AnimatedBackground';

interface Generation {
    id: number;
    prompt: string;
    result_image_url: string;
    result_video_url: string;
    status: string;
}

interface Product {
    id: number;
    name: string;
    image_url: string;
    description: string;
}

const ProductView: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<Product | null>(null);
    const [generations, setGenerations] = useState<Generation[]>([]);
    const [prompt, setPrompt] = useState('');
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            const [prodRes, genRes] = await Promise.all([
                api.get('/products/'),
                api.get(`/generations/${id}`)
            ]);
            const currentProd = prodRes.data.find((p: Product) => p.id === Number(id));
            setProduct(currentProd);
            setGenerations(genRes.data);
        } catch (error) {
            console.error('Fetch failed', error);
        }
    };

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setGenerating(true);
        try {
            await api.post('/generate/', {
                product_id: Number(id),
                prompt
            });
            setPrompt('');
            fetchData();
        } catch (error) {
            console.error('Generation failed', error);
        } finally {
            setGenerating(false);
        }
    };

    if (!product) return <div className="min-h-screen bg-black text-white p-8">Loading...</div>;

    return (
        <div className="min-h-screen text-white p-8 relative">
            <AnimatedBackground />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Dashboard
                </motion.button>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left: Product Info & Generate Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-1 space-y-8"
                    >
                        <Card className="p-0 overflow-hidden">
                            <img src={product.image_url} alt={product.name} className="w-full aspect-square object-cover" />
                            <div className="p-6 bg-black/40 backdrop-blur-md">
                                <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
                                <p className="text-gray-400">{product.description}</p>
                            </div>
                        </Card>

                        <Card>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Sparkles className="text-purple-500" />
                                Generate New Ad
                            </h2>
                            <form onSubmit={handleGenerate}>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    className="w-full bg-black/30 border border-gray-700 rounded-xl p-4 text-white focus:outline-none focus:border-purple-500 transition-colors h-32 resize-none mb-4 placeholder:text-gray-600"
                                    placeholder="Describe the scene (e.g., 'Model wearing the jacket on a neon city street at night')"
                                    required
                                />
                                <Button
                                    type="submit"
                                    disabled={generating}
                                    className="w-full relative overflow-hidden"
                                >
                                    {generating ? (
                                        <motion.div
                                            animate={{ opacity: [0.5, 1, 0.5] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            Generating Magic...
                                        </motion.div>
                                    ) : (
                                        'Generate Assets'
                                    )}
                                </Button>
                            </form>
                        </Card>
                    </motion.div>

                    {/* Right: Generations Grid */}
                    <div className="lg:col-span-2">
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-2xl font-bold mb-6"
                        >
                            Generated Assets
                        </motion.h2>

                        <div className="space-y-6">
                            <AnimatePresence>
                                {generations.map((gen) => (
                                    <motion.div
                                        key={gen.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        layout
                                    >
                                        <Card className="p-0 overflow-hidden border-gray-800">
                                            <div className="p-4 border-b border-gray-800 bg-white/5">
                                                <p className="text-sm text-gray-300 font-medium">"{gen.prompt}"</p>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-px bg-gray-800">
                                                {/* Image Result */}
                                                <div className="bg-black/40 p-4 backdrop-blur-sm">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2 text-purple-400">
                                                            <ImageIcon size={18} />
                                                            <span className="font-bold text-sm">Marketing Image</span>
                                                        </div>
                                                        <a href={gen.result_image_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                                            <Download size={18} />
                                                        </a>
                                                    </div>
                                                    <img src={gen.result_image_url} alt="Result" className="w-full rounded-lg shadow-lg" />
                                                </div>

                                                {/* Video Result */}
                                                <div className="bg-black/40 p-4 backdrop-blur-sm">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <div className="flex items-center gap-2 text-pink-400">
                                                            <Video size={18} />
                                                            <span className="font-bold text-sm">Motion Ad</span>
                                                        </div>
                                                        <a href={gen.result_video_url} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition-colors">
                                                            <Download size={18} />
                                                        </a>
                                                    </div>
                                                    <video
                                                        src={gen.result_video_url}
                                                        controls
                                                        className="w-full rounded-lg shadow-lg"
                                                        poster={gen.result_image_url}
                                                    />
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {generations.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-20 border border-dashed border-gray-800 rounded-2xl text-gray-500 bg-black/20"
                                >
                                    No generations yet. Try creating one!
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductView;
