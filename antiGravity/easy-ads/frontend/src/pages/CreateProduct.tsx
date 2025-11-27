import React, { useState } from 'react';
import { Upload, ArrowLeft, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const CreateProduct: React.FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('file', file);

        try {
            await api.post('/products/', formData);
            navigate('/dashboard');
        } catch (error) {
            console.error('Upload failed', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
            <div className="w-full max-w-2xl">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    Back to Dashboard
                </button>

                <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
                    <h1 className="text-3xl font-bold mb-8">Upload New Product</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Upload */}
                        <div className="relative group">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                required
                            />
                            <div className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${preview ? 'border-purple-500 bg-purple-500/10' : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800'}`}>
                                {preview ? (
                                    <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg shadow-lg" />
                                ) : (
                                    <div className="flex flex-col items-center text-gray-400">
                                        <Upload size={48} className="mb-4" />
                                        <p className="font-medium">Click or drag image here</p>
                                        <p className="text-sm mt-2 text-gray-500">Supports JPG, PNG</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details */}
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">Product Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="e.g. Vintage Denim Jacket"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-400 mb-2 text-sm">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 transition-colors h-32 resize-none"
                                placeholder="Describe your product..."
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black py-4 rounded-xl font-bold text-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" />
                                    Uploading...
                                </>
                            ) : (
                                'Create Project'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProduct;
