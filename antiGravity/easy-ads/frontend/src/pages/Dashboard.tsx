import React, { useEffect, useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/ui';
import { AnimatedBackground } from '../components/AnimatedBackground';

interface Product {
    id: number;
    name: string;
    image_url: string;
    description: string;
}

const Dashboard: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products/');
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        } finally {
            setLoading(false);
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen text-white p-8 relative overflow-hidden">
            <AnimatedBackground />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex justify-between items-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400"
                    >
                        Your Products
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Button
                            onClick={() => navigate('/create')}
                            className="flex items-center gap-2"
                        >
                            <Plus size={20} />
                            New Project
                        </Button>
                    </motion.div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-purple-500" size={40} />
                    </div>
                ) : products.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 border border-dashed border-gray-800 rounded-2xl bg-black/20 backdrop-blur-sm"
                    >
                        <p className="text-gray-400 text-xl mb-6">No products yet</p>
                        <Button
                            variant="outline"
                            onClick={() => navigate('/create')}
                        >
                            Create your first ad
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid md:grid-cols-3 lg:grid-cols-4 gap-6"
                    >
                        {products.map((product) => (
                            <motion.div
                                key={product.id}
                                variants={item}
                                onClick={() => navigate(`/product/${product.id}`)}
                                className="group cursor-pointer"
                            >
                                <Card className="p-0 overflow-hidden border-gray-800 hover:border-purple-500/50 h-full">
                                    <div className="aspect-square relative overflow-hidden">
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                            <span className="text-white font-bold text-lg">View Generations</span>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-black/40 backdrop-blur-md">
                                        <h3 className="font-bold text-lg truncate mb-1">{product.name}</h3>
                                        <p className="text-gray-400 text-sm truncate">{product.description}</p>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
