import React, { useState, useEffect } from 'react';
import { FileText, Download, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function DataRoom({ pitchId, isOwner = false }) {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadType, setUploadType] = useState(null);

    useEffect(() => {
        fetchDocuments();
    }, [pitchId]);

    const fetchDocuments = async () => {
        try {
            const response = await api.get(`/pitches/${pitchId}/data-room`);
            setDocuments(response.data.documents);
        } catch (error) {
            console.error('Error fetching documents:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (event, documentType) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedExtensions = ['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.xlsx', '.xls'];
        const fileExt = '.' + file.name.split('.').pop().toLowerCase();

        if (!allowedExtensions.includes(fileExt)) {
            alert(`Invalid file type. Allowed: ${allowedExtensions.join(', ')}`);
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('File size must be less than 10MB');
            return;
        }

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            let endpoint;
            if (documentType === 'pitch_deck') {
                endpoint = `/pitches/${pitchId}/upload-pitch-deck`;
            } else if (documentType === 'financial') {
                endpoint = `/pitches/${pitchId}/upload-financial-doc`;
            } else if (documentType === 'business_plan') {
                endpoint = `/pitches/${pitchId}/upload-business-plan`;
            }

            await api.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert('Document uploaded successfully!');
            fetchDocuments(); // Reload documents
            setUploadType(null);
        } catch (error) {
            console.error('Upload error:', error);
            alert(error.response?.data?.detail || 'Failed to upload document');
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (downloadUrl, filename) => {
        try {
            const response = await api.get(downloadUrl, {
                responseType: 'blob'
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to download document');
        }
    };

    const getFileIcon = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        if (['pdf'].includes(ext)) return '📄';
        if (['ppt', 'pptx'].includes(ext)) return '📊';
        if (['doc', 'docx'].includes(ext)) return '📝';
        if (['xls', 'xlsx'].includes(ext)) return '📈';
        return '📁';
    };

    const documentTypes = [
        { id: 'pitch_deck', label: 'Pitch Deck', description: 'Main presentation deck (PDF/PPT)' },
        { id: 'financial', label: 'Financial Projections', description: 'Revenue, expenses, forecasts' },
        { id: 'business_plan', label: 'Business Plan', description: 'Detailed business strategy' }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Data Room</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {documents.length} document{documents.length !== 1 && 's'} available
                    </p>
                </div>

                {isOwner && (
                    <button
                        onClick={() => setUploadType(uploadType ? null : 'pitch_deck')}
                        className="px-4 py-2 bg-blue-600 text-white  rounded-lg hover:bg-blue-700 flex items-center gap-2"
                    >
                        <Upload size={18} />
                        Upload Document
                    </button>
                )}
            </div>

            {/* Upload Section (Owner only) */}
            {isOwner && uploadType && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Upload Document</h3>
                    <div className="space-y-3">
                        {documentTypes.map(docType => (
                            <div key={docType.id} className="flex items-center gap-3">
                                <input
                                    type="file"
                                    id={`upload-${docType.id}`}
                                    accept=".pdf,.ppt,.pptx,.doc,.docx,.xlsx,.xls"
                                    onChange={(e) => handleFileUpload(e, docType.id)}
                                    className="hidden"
                                    disabled={uploading}
                                />
                                <label
                                    htmlFor={`upload-${docType.id}`}
                                    className="flex-1 cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 hover:bg-blue-50 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-gray-900">{docType.label}</p>
                                            <p className="text-sm text-gray-500">{docType.description}</p>
                                        </div>
                                        <Upload size={20} className="text-gray-400" />
                                    </div>
                                </label>
                            </div>
                        ))}
                    </div>

                    {uploading && (
                        <div className="mt-3 flex items-center gap-2 text-blue-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-sm">Uploading...</span>
                        </div>
                    )}
                </div>
            )}

            {/* Documents List */}
            {documents.length === 0 ? (
                <div className="text-center py-12">
                    <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No documents uploaded yet</p>
                    {isOwner && (
                        <p className="text-sm text-gray-400 mt-1">
                            Upload your pitch deck and financial documents to share with investors
                        </p>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {documents.map((doc, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                        >
                            <div className="flex items-center gap-3">
                                <div className="text-3xl">{getFileIcon(doc.filename)}</div>
                                <div>
                                    <p className="font-semibold text-gray-900">{doc.type}</p>
                                    <p className="text-sm text-gray-500">{doc.filename}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleDownload(doc.download_url, doc.filename)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                            >
                                <Download size={16} />
                                Download
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* File Format Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">
                    <span className="font-semibold">Supported formats:</span> PDF, PPT, PPTX, DOC, DOCX, XLS, XLSX
                </p>
                <p className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">Max file size:</span> 10 MB per document
                </p>
            </div>
        </div>
    );
}
