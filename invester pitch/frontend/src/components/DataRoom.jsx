import React, { useState, useEffect } from 'react';
import { FileText, Download, Upload, CheckCircle, AlertCircle, Eye, X, Shield, Lock, FileSpreadsheet, FilePieChart, Briefcase } from 'lucide-react';
import { api } from '../services/api';

export default function DataRoom({ pitchId, isOwner = false }) {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadType, setUploadType] = useState(null);
    const [viewingDoc, setViewingDoc] = useState(null);

    useEffect(() => {
        fetchDocuments();
    }, [pitchId]);

    const fetchDocuments = async () => {
        try {
            const data = await api.getDocuments(pitchId);
            setDocuments(data.documents || []);
        } catch (error) {
            console.error('Error fetching documents:', error);
            setDocuments([]); // No docs on error
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event, documentType) => {
        const file = event.target.files[0];
        if (!file) return;

        const allowedExtensions = ['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.xlsx', '.xls'];
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();

        if (!allowedExtensions.includes(fileExt)) {
            alert(`Invalid file type. Allowed: ${allowedExtensions.join(', ')}`);
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${import.meta.env.PROD ? '/api' : 'http://127.0.0.1:8000'}/pitches/${pitchId}/upload-${documentType.replace('_', '-')}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) throw new Error('Upload failed');

            alert('Document uploaded successfully!');
            fetchDocuments();
            setUploadType(null);
        } catch (error) {
            console.error('Upload error:', error);
            alert('Failed to upload document');
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = (downloadUrl, filename) => {
        if (downloadUrl === '#') {
            alert("This is a demo file. Real downloads are available for uploaded documents.");
            return;
        }
        const fullUrl = downloadUrl.startsWith('http') ? downloadUrl : `${import.meta.env.PROD ? '' : 'http://127.0.0.1:8000'}/${downloadUrl}`;
        window.open(fullUrl, '_blank');
    };

    const handleView = (doc) => {
        if (doc.download_url === '#') {
            alert("This is a demo file. Real viewing is available for uploaded documents.");
            return;
        }
        const fullUrl = doc.download_url.startsWith('http')
            ? doc.download_url
            : `${window.location.protocol}//${window.location.host}${doc.download_url.startsWith('/') ? '' : '/'}${doc.download_url}`;

        const ext = doc.filename.split('.').pop().toLowerCase();
        if (['ppt', 'pptx', 'doc', 'docx', 'xls', 'xlsx'].includes(ext)) {
            const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fullUrl)}&embedded=true`;
            setViewingDoc({ ...doc, viewerUrl });
        } else {
            setViewingDoc({ ...doc, viewerUrl: fullUrl });
        }
    };

    const getFileIcon = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        if (['pdf'].includes(ext)) return <FileText className="text-rose-500" size={24} />;
        if (['ppt', 'pptx'].includes(ext)) return <FilePieChart className="text-amber-500" size={24} />;
        if (['doc', 'docx'].includes(ext)) return <Briefcase className="text-blue-500" size={24} />;
        if (['xls', 'xlsx'].includes(ext)) return <FileSpreadsheet className="text-emerald-500" size={24} />;
        return <FileText className="text-slate-400" size={24} />;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20 bg-white rounded-[32px] border border-slate-100 shadow-xl">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Encrypting Connection...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden font-['Plus Jakarta Sans']">
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-900 rounded-xl">
                        <Shield size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Security Data Room</h2>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {documents.length} Encrypted Assets Available
                            </p>
                        </div>
                    </div>
                </div>

                {isOwner && (
                    <button
                        onClick={() => setUploadType(uploadType ? null : 'pitch_deck')}
                        className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm group"
                    >
                        <Upload size={18} className="text-slate-400 group-hover:text-blue-600" />
                    </button>
                )}
            </div>

            <div className="p-8 space-y-4">
                {documents.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50/50 rounded-[28px] border-2 border-dashed border-slate-100">
                        <Lock size={48} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Zero Access Protocols Active</p>
                        <p className="text-[10px] text-slate-300 mt-1">Founder has not released documentation yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {documents.map((doc, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-5 bg-white border border-slate-50 rounded-[24px] hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
                            >
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                                        {getFileIcon(doc.filename)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-black text-slate-900 uppercase tracking-tight text-sm italic">{doc.type}</p>
                                            {doc.category && (
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[8px] font-black rounded-lg uppercase tracking-tighter">
                                                    {doc.category}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1">
                                            <p className="text-xs font-bold text-slate-400 truncate max-w-[150px]">{doc.filename}</p>
                                            <span className="text-[10px] font-black text-slate-300 uppercase">{doc.size || '0.0 MB'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => handleView(doc)}
                                        className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all active:scale-90"
                                        title="View Document"
                                    >
                                        <Eye size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDownload(doc.download_url, doc.filename)}
                                        className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all active:scale-90"
                                        title="Download Asset"
                                    >
                                        <Download size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Secure Badge */}
                <div className="pt-4 flex items-center justify-center gap-2 opacity-30 select-none">
                    <Lock size={12} className="text-slate-400" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">End-to-End SSL Architecture</span>
                </div>
            </div>

            {/* Viewing Modal */}
            {viewingDoc && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-xl p-8 animate-in fade-in duration-300">
                    <div className="w-full max-w-6xl h-full bg-white rounded-[40px] overflow-hidden flex flex-col relative shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] border border-white/20">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                                    <Eye size={20} />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-900 uppercase tracking-tight">{viewingDoc.filename}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Viewer Interface</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setViewingDoc(null)}
                                className="p-3 hover:bg-slate-50 rounded-full transition-all active:scale-90"
                            >
                                <X size={24} className="text-slate-400" />
                            </button>
                        </div>
                        <div className="flex-1 bg-slate-100">
                            <iframe
                                src={viewingDoc.viewerUrl}
                                className="w-full h-full border-none"
                                title="Secure Document Portal"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
