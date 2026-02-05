
import React, { useState } from 'react';

const Documents = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewingDocument, setViewingDocument] = useState(null);

  const folders = [
    { id: 'incorporation', title: 'Incorporation Docs', subtitle: 'COI, MoA, AoA, PAN, TAN', count: '12 Files', icon: '🏢' },
    { id: 'tax', title: 'Tax Registrations', subtitle: 'GST, Professional Tax, TDS', count: '8 Files', icon: '💵' },
    { id: 'ip', title: 'IP & Trademarks', subtitle: 'Trademarks, Patents, Copyrights', count: '5 Files', icon: '⚖️' },
    { id: 'compliance', title: 'Compliance Filings', subtitle: 'Annual Returns, ROC, Audits', count: '24 Files', icon: '📋' },
  ];

  const allDocuments = {
    incorporation: [
      { id: 1, name: 'Certificate_of_Incorporation.pdf', size: '2.4 MB', service: 'Incorporation', date: 'Oct 24, 2023', type: 'PDF' },
      { id: 2, name: 'Memorandum_of_Association.pdf', size: '1.8 MB', service: 'Incorporation', date: 'Oct 24, 2023', type: 'PDF' },
      { id: 3, name: 'Articles_of_Association.pdf', size: '2.1 MB', service: 'Incorporation', date: 'Oct 24, 2023', type: 'PDF' },
      { id: 4, name: 'PAN_Card_Company.pdf', size: '450 KB', service: 'Tax Registration', date: 'Oct 23, 2023', type: 'PDF' },
      { id: 5, name: 'TAN_Certificate.pdf', size: '380 KB', service: 'Tax Registration', date: 'Oct 23, 2023', type: 'PDF' },
      { id: 6, name: 'Director_ID_Proof.pdf', size: '1.2 MB', service: 'KYC', date: 'Oct 22, 2023', type: 'PDF' },
      { id: 7, name: 'Address_Proof_Business.pdf', size: '890 KB', service: 'Incorporation', date: 'Oct 22, 2023', type: 'PDF' },
      { id: 8, name: 'Share_Certificate.pdf', size: '650 KB', service: 'Incorporation', date: 'Oct 21, 2023', type: 'PDF' },
      { id: 9, name: 'Digital_Signature_Certificate.pdf', size: '1.5 MB', service: 'Digital Signing', date: 'Oct 20, 2023', type: 'PDF' },
      { id: 10, name: 'Bank_Account_Proof.pdf', size: '780 KB', service: 'Banking', date: 'Oct 19, 2023', type: 'PDF' },
      { id: 11, name: 'Utility_Bill_Business.pdf', size: '920 KB', service: 'Address Proof', date: 'Oct 18, 2023', type: 'PDF' },
      { id: 12, name: 'Telephone_Bill_Business.pdf', size: '680 KB', service: 'Address Proof', date: 'Oct 17, 2023', type: 'PDF' }
    ],
    tax: [
      { id: 13, name: 'GST_Registration_Certificate.pdf', size: '1.1 MB', service: 'GST Registration', date: 'Oct 22, 2023', type: 'PDF' },
      { id: 14, name: 'GST_Return_Filing_Sept.pdf', size: '890 KB', service: 'GST Filing', date: 'Oct 15, 2023', type: 'PDF' },
      { id: 15, name: 'Professional_Tax_Certificate.pdf', size: '450 KB', service: 'Professional Tax', date: 'Oct 10, 2023', type: 'PDF' },
      { id: 16, name: 'TDS_Certificate_Q3.pdf', size: '720 KB', service: 'TDS Filing', date: 'Oct 05, 2023', type: 'PDF' },
      { id: 17, name: 'Income_Tax_Return_FY22.pdf', size: '1.8 MB', service: 'Income Tax', date: 'Sep 30, 2023', type: 'PDF' },
      { id: 18, name: 'Tax_Audit_Report_FY22.pdf', size: '3.2 MB', service: 'Tax Audit', date: 'Sep 25, 2023', type: 'PDF' },
      { id: 19, name: 'Form_16_Director.pdf', size: '580 KB', service: 'Income Tax', date: 'Sep 20, 2023', type: 'PDF' },
      { id: 20, name: 'Advance_Tax_Payment.pdf', size: '340 KB', service: 'Tax Payment', date: 'Sep 15, 2023', type: 'PDF' }
    ],
    ip: [
      { id: 21, name: 'Trademark_Application_Form.pdf', size: '2.1 MB', service: 'Trademark', date: 'Oct 20, 2023', type: 'PDF' },
      { id: 22, name: 'Trademark_Registration_Certificate.pdf', size: '890 KB', service: 'Trademark', date: 'Oct 15, 2023', type: 'PDF' },
      { id: 23, name: 'Copyright_Application.pdf', size: '1.5 MB', service: 'Copyright', date: 'Oct 10, 2023', type: 'PDF' },
      { id: 24, name: 'Patent_Filing_Receipt.pdf', size: '670 KB', service: 'Patent', date: 'Oct 05, 2023', type: 'PDF' },
      { id: 25, name: 'Design_Registration.pdf', size: '1.2 MB', service: 'Design', date: 'Sep 28, 2023', type: 'PDF' }
    ],
    compliance: [
      { id: 26, name: 'ROC_Annual_Return_FY23.pdf', size: '4.8 MB', service: 'ROC Filing', date: 'Oct 15, 2023', type: 'PDF' },
      { id: 27, name: 'Director_KYC_Form.pdf', size: '1.3 MB', service: 'Director KYC', date: 'Oct 10, 2023', type: 'PDF' },
      { id: 28, name: 'Shareholder_Agreement.pdf', size: '2.5 MB', service: 'Shareholder', date: 'Oct 05, 2023', type: 'PDF' },
      { id: 29, name: 'Board_Resolution_FY23.pdf', size: '890 KB', service: 'Board Meeting', date: 'Sep 30, 2023', type: 'PDF' },
      { id: 30, name: 'Statutory_Audit_Report.pdf', size: '5.2 MB', service: 'Statutory Audit', date: 'Sep 25, 2023', type: 'PDF' },
      { id: 31, name: 'CSR_Report_FY22.pdf', size: '3.8 MB', service: 'CSR Compliance', date: 'Sep 20, 2023', type: 'PDF' },
      { id: 32, name: 'Secretarial_Audit_Report.pdf', size: '2.1 MB', service: 'Secretarial Audit', date: 'Sep 15, 2023', type: 'PDF' },
      { id: 33, name: 'MGT_7_Form.pdf', size: '1.7 MB', service: 'ROC Filing', date: 'Sep 10, 2023', type: 'PDF' },
      { id: 34, name: 'DIR_3_KYC_Form.pdf', size: '950 KB', service: 'Director KYC', date: 'Sep 05, 2023', type: 'PDF' },
      { id: 35, name: 'AOC_4_Form.pdf', size: '1.4 MB', service: 'ROC Filing', date: 'Aug 30, 2023', type: 'PDF' },
      { id: 36, name: 'Compliance_Certificate.pdf', size: '780 KB', service: 'Compliance', date: 'Aug 25, 2023', type: 'PDF' },
      { id: 37, name: 'Annual_Report_FY22.pdf', size: '6.5 MB', service: 'Annual Report', date: 'Aug 20, 2023', type: 'PDF' },
      { id: 38, name: 'Minutes_of_Meeting.pdf', size: '1.1 MB', service: 'Board Meeting', date: 'Aug 15, 2023', type: 'PDF' },
      { id: 39, name: 'Register_of_Charges.pdf', size: '890 KB', service: 'ROC Filing', date: 'Aug 10, 2023', type: 'PDF' },
      { id: 40, name: 'Share_Transfer_Form.pdf', size: '650 KB', service: 'Share Transfer', date: 'Aug 05, 2023', type: 'PDF' },
      { id: 41, name: 'Debenture_Certificate.pdf', size: '520 KB', service: 'Debentures', date: 'Jul 30, 2023', type: 'PDF' },
      { id: 42, name: 'Charge_Creation_Form.pdf', size: '980 KB', service: 'Charge Creation', date: 'Jul 25, 2023', type: 'PDF' },
      { id: 43, name: 'Compliance_Status_Report.pdf', size: '1.8 MB', service: 'Compliance', date: 'Jul 20, 2023', type: 'PDF' },
      { id: 44, name: 'Internal_Audit_Report.pdf', size: '3.1 MB', service: 'Internal Audit', date: 'Jul 15, 2023', type: 'PDF' },
      { id: 45, name: 'Risk_Assessment_Report.pdf', size: '2.3 MB', service: 'Risk Assessment', date: 'Jul 10, 2023', type: 'PDF' },
      { id: 46, name: 'ESG_Compliance_Report.pdf', size: '4.2 MB', service: 'ESG Compliance', date: 'Jul 05, 2023', type: 'PDF' },
      { id: 47, name: 'Data_Privacy_Policy.pdf', size: '1.6 MB', service: 'Data Privacy', date: 'Jun 30, 2023', type: 'PDF' },
      { id: 48, name: 'IT_Security_Audit.pdf', size: '2.8 MB', service: 'IT Security', date: 'Jun 25, 2023', type: 'PDF' },
      { id: 49, name: 'Environmental_Compliance.pdf', size: '3.5 MB', service: 'Environmental', date: 'Jun 20, 2023', type: 'PDF' }
    ]
  };

  const handleFolderClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const handleViewDocument = (document) => {
    setViewingDocument(document);
  };

  const handleDownloadDocument = (document) => {
    // Mock download functionality
    alert(`Downloading ${document.name}`);
  };

  const handleShareDocument = (document) => {
    // Mock share functionality
    const shareUrl = `https://compliancepro.com/share/${document.id}`;
    navigator.clipboard.writeText(shareUrl);
    alert(`Share link copied: ${shareUrl}`);
  };

  const handleUploadDocument = () => {
    // Mock upload functionality
    alert('Upload functionality would open file picker here');
  };

  const getFilteredDocuments = () => {
    let docs = selectedCategory ? allDocuments[selectedCategory] || [] : [];

    if (searchQuery) {
      docs = docs.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.service.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return docs;
  };

  const getCurrentPageDocuments = () => {
    const filtered = getFilteredDocuments();
    const startIndex = (currentPage - 1) * 10;
    return filtered.slice(startIndex, startIndex + 10);
  };

  const totalPages = Math.ceil(getFilteredDocuments().length / 10);

  const getDocumentTypeIcon = (type) => {
    switch (type) {
      case 'PDF': return '📄';
      case 'JPG': return '🖼️';
      case 'PNG': return '🖼️';
      case 'DOC': return '📝';
      case 'XLS': return '📊';
      default: return '📄';
    }
  };

  const recentDocs = selectedCategory ? getCurrentPageDocuments().slice(0, 4) : [];

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 mb-2">
             {selectedCategory ? `${folders.find(f => f.id === selectedCategory)?.title} Documents` : 'Secure Document Vault'}
           </h1>
           <p className="text-slate-500">
             {selectedCategory ? `Browse and manage your ${folders.find(f => f.id === selectedCategory)?.title.toLowerCase()}` : 'Manage and access all your business compliance documents in one secure place.'}
           </p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleUploadDocument}
            className="flex items-center gap-2 px-6 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
            Upload New Document
          </button>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 px-6 py-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition"
            >
              ← Back to All
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      {selectedCategory && (
        <div className="bg-white p-6 rounded-3xl border border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <svg className="h-5 w-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                type="text"
                placeholder="Search documents by name or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* Folder Grid */}
      {!selectedCategory && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {folders.map(folder => (
            <div
              key={folder.id}
              onClick={() => handleFolderClick(folder.id)}
              className="bg-white p-6 rounded-3xl border border-slate-100 hover:shadow-xl hover:border-blue-300 transition-all cursor-pointer group"
            >
               <div className="flex justify-between items-start mb-6">
                 <div className="text-3xl">{folder.icon}</div>
                 <div className="text-[10px] font-bold text-slate-400 uppercase">{folder.count}</div>
               </div>
               <h4 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition">{folder.title}</h4>
               <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{folder.subtitle}</p>
            </div>
          ))}
        </div>
      )}

      {/* Document Table */}
      {selectedCategory && (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
             <h3 className="text-lg font-bold">{folders.find(f => f.id === selectedCategory)?.title} Documents</h3>
             <button
               onClick={() => setSelectedCategory(null)}
               className="text-sm font-bold text-blue-600 hover:underline"
             >
               ← Back to Categories
             </button>
          </div>
          <table className="w-full text-left">
             <thead className="bg-slate-50 text-[10px] uppercase tracking-widest font-black text-slate-400">
                <tr>
                  <th className="px-8 py-4">Document Name</th>
                  <th className="px-8 py-4">Associated Service</th>
                  <th className="px-8 py-4">Date Uploaded</th>
                  <th className="px-8 py-4">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-50 text-sm">
                {getCurrentPageDocuments().map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                         <div className="h-10 w-10 bg-blue-50 text-blue-600 flex items-center justify-center rounded-xl font-bold text-[10px]">
                           {getDocumentTypeIcon(doc.type)}
                         </div>
                         <div>
                           <div className="font-bold text-slate-800">{doc.name}</div>
                           <div className="text-[10px] text-slate-400 uppercase font-medium">{doc.size}</div>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">{doc.service}</span>
                    </td>
                    <td className="px-8 py-6 text-slate-500 font-medium">{doc.date}</td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-3 text-slate-400">
                          <button
                            onClick={() => handleViewDocument(doc)}
                            className="hover:text-blue-600 transition p-2 hover:bg-blue-50 rounded-lg"
                            title="View Document"
                          >
                             <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                             </svg>
                          </button>
                          <button
                            onClick={() => handleDownloadDocument(doc)}
                            className="hover:text-blue-600 transition p-2 hover:bg-blue-50 rounded-lg"
                            title="Download Document"
                          >
                             <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                             </svg>
                          </button>
                          <button
                            onClick={() => handleShareDocument(doc)}
                            className="hover:text-blue-600 transition p-2 hover:bg-blue-50 rounded-lg"
                            title="Share Document"
                          >
                             <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                             </svg>
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
             </tbody>
          </table>
          <div className="p-6 bg-slate-50 flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
             <span>Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, getFilteredDocuments().length)} of {getFilteredDocuments().length} documents</span>
             <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Recent Documents - only show when not in category view */}
      {!selectedCategory && (
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
             <h3 className="text-lg font-bold">Recent Documents</h3>
             <button
               onClick={() => setSelectedCategory('compliance')}
               className="text-sm font-bold text-blue-600 hover:underline"
             >
               View All
             </button>
          </div>
          <table className="w-full text-left">
             <thead className="bg-slate-50 text-[10px] uppercase tracking-widest font-black text-slate-400">
                <tr>
                  <th className="px-8 py-4">Document Name</th>
                  <th className="px-8 py-4">Associated Service</th>
                  <th className="px-8 py-4">Date Uploaded</th>
                  <th className="px-8 py-4">Actions</th>
                </tr>
             </thead>
             <tbody className="divide-y divide-slate-50 text-sm">
                {recentDocs.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                         <div className="h-10 w-10 bg-blue-50 text-blue-600 flex items-center justify-center rounded-xl font-bold text-[10px]">
                           {getDocumentTypeIcon(doc.type)}
                         </div>
                         <div>
                           <div className="font-bold text-slate-800">{doc.name}</div>
                           <div className="text-[10px] text-slate-400 uppercase font-medium">{doc.size}</div>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">{doc.service}</span>
                    </td>
                    <td className="px-8 py-6 text-slate-500 font-medium">{doc.date}</td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-3 text-slate-400">
                          <button
                            onClick={() => handleViewDocument(doc)}
                            className="hover:text-blue-600 transition p-2 hover:bg-blue-50 rounded-lg"
                            title="View Document"
                          >
                             <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                             </svg>
                          </button>
                          <button
                            onClick={() => handleDownloadDocument(doc)}
                            className="hover:text-blue-600 transition p-2 hover:bg-blue-50 rounded-lg"
                            title="Download Document"
                          >
                             <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                             </svg>
                          </button>
                          <button
                            onClick={() => handleShareDocument(doc)}
                            className="hover:text-blue-600 transition p-2 hover:bg-blue-50 rounded-lg"
                            title="Share Document"
                          >
                             <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                             </svg>
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
             </tbody>
          </table>
          <div className="p-6 bg-slate-50 flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
             <span>Showing 1 to 4 of 49 documents</span>
             <div className="flex gap-2">
                <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50">Previous</button>
                <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100">Next</button>
             </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {viewingDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold">{viewingDocument.name}</h3>
              <button
                onClick={() => setViewingDocument(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="p-6 bg-gray-50 h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">{getDocumentTypeIcon(viewingDocument.type)}</div>
                <p className="text-gray-500">Document preview would be displayed here</p>
                <p className="text-sm text-gray-400 mt-2">Size: {viewingDocument.size} | Type: {viewingDocument.type}</p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-4">
              <button
                onClick={() => handleDownloadDocument(viewingDocument)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
              >
                Download
              </button>
              <button
                onClick={() => setViewingDocument(null)}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-600 rounded-3xl p-8 text-white flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">☁️</div>
            <div>
               <h4 className="text-xl font-bold mb-1">Storage Usage</h4>
               <p className="text-blue-100 text-sm">You are using <span className="font-bold">4.2 GB</span> of your 10 GB secure storage. <a href="#" className="underline">Upgrade plan</a></p>
               <div className="w-80 h-2 bg-white/20 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-white transition-all duration-1000" style={{ width: '42%' }}></div>
               </div>
            </div>
         </div>
         <button className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-blue-50 transition">Manage Space</button>
      </div>
    </div>
  );
};

export default Documents;
