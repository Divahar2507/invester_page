import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText } from 'lucide-react';
import './PDFViewerModal.css';

const PDFViewerModal = ({ isOpen, onClose, pdfUrl, title }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="pdf-modal-overlay" onClick={onClose}>
                    <motion.div
                        className="pdf-modal-content"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="pdf-modal-header">
                            <div className="pdf-modal-title">
                                <div className="pdf-icon-bg">
                                    <FileText size={20} />
                                </div>
                                <span>{title || "Document Preview"}</span>
                            </div>
                            <div className="pdf-modal-actions">
                                <a
                                    href={pdfUrl}
                                    download
                                    className="btn-icon"
                                    title="Download PDF"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <Download size={20} />
                                </a>
                                <button className="btn-icon close-btn" onClick={onClose}>
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="pdf-viewer-container">
                            {pdfUrl ? (
                                <iframe
                                    src={`${pdfUrl}#toolbar=0`}
                                    title="PDF Viewer"
                                    className="pdf-frame"
                                />
                            ) : (
                                <div className="pdf-error">
                                    <p>No document available to preview.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default PDFViewerModal;
