import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, Save, Image as ImageIcon, Loader2 } from 'lucide-react';

const ChangePhoto = () => {
    const navigate = useNavigate();
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSave = async () => {
        if (!file) return;
        setLoading(true);

        // Simulating API upload for now
        // In a real app, you would use api.uploadProfilePhoto(file)
        setTimeout(() => {
            setLoading(false);
            navigate('/profile');
        }, 1500);
    };

    return (
        <div className="p-8 max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900">Change Profile Photo</h1>
                <p className="text-slate-500 mt-2">Update your photo to help startups and other investors recognize you.</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-12">
                <div className="flex flex-col items-center gap-8">
                    <div className="relative group">
                        <div className="w-40 h-40 bg-orange-100 rounded-full overflow-hidden border-4 border-white shadow-lg ring-1 ring-slate-100">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <img
                                    src={`https://ui-avatars.com/api/?name=User&background=FDBA74&color=7C2D12&size=128`}
                                    alt="Default"
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                        <p className="text-xs font-bold text-slate-400 mt-4 text-center uppercase tracking-widest">Current Photo</p>
                    </div>

                    <div className="w-full max-w-lg">
                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-400 transition-all group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                    <Upload size={24} />
                                </div>
                                <p className="mb-2 text-sm text-slate-700 font-bold">
                                    Click to upload or drag and drop
                                </p>
                                <p className="text-xs text-slate-400 font-medium">SVG, PNG, JPG or GIF (max. 5MB)</p>
                            </div>
                            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                        </label>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                        <button
                            onClick={() => navigate('/profile')}
                            className="px-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!file || loading}
                            className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                            Save Photo
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePhoto;
