import React, { useState, useRef } from 'react';
import { Upload, Check, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './FileUpload.css';

const FileUpload = ({ onUploadComplete, label = "Upload File" }) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState(null);
    const inputRef = useRef(null);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (selectedFile) => {
        setFile(selectedFile);
        setUploading(true);
        setProgress(0);

        // Simulate progress for "magical" feel before real upload finishes or real progress events
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) {
                    clearInterval(interval);
                    return 90;
                }
                return prev + 10;
            });
        }, 100);

        const formData = new FormData();
        formData.append("file", selectedFile);

        try {
            const response = await fetch('http://localhost:8001/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setProgress(100);
                setTimeout(() => {
                    setUploadedUrl(data.url);
                    setUploading(false);
                    onUploadComplete(data.url);
                }, 500);
            } else {
                console.error("Upload failed");
                setUploading(false);
                setFile(null); // Reset on fail
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            setUploading(false);
            setFile(null);
        } finally {
            clearInterval(interval);
        }
    };

    const resetUpload = (e) => {
        e.stopPropagation();
        setFile(null);
        setUploadedUrl(null);
        setProgress(0);
        onUploadComplete(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div
            className={`file-upload-container ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current.click()}
        >
            <input
                ref={inputRef}
                type="file"
                className="file-input"
                onChange={handleChange}
                accept=".pdf"
            />

            <AnimatePresence mode="wait">
                {!file ? (
                    <motion.div
                        key="placeholder"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="upload-placeholder"
                    >
                        <div className="icon-circle">
                            <Upload size={24} />
                        </div>
                        <p className="upload-text">{label}</p>
                        <p className="upload-hint">PDF up to 10MB</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="file-status"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="file-status"
                    >
                        <div className="file-info">
                            <div className={`icon-circle ${uploadedUrl ? 'success' : 'uploading'}`}>
                                {uploadedUrl ? <Check size={20} /> : <FileText size={20} />}
                            </div>
                            <div className="file-details">
                                <span className="file-name">{file.name}</span>
                                <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                            </div>
                            <button className="btn-reset" onClick={resetUpload}>
                                <X size={16} />
                            </button>
                        </div>

                        <div className="progress-track">
                            <motion.div
                                className="progress-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "easeInOut" }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {dragActive && <div className="drag-overlay"><Upload size={48} /></div>}
        </div>
    );
};

export default FileUpload;
