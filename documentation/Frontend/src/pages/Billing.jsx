import React, { useState } from 'react';
import {
   Search,
   Bell,
   Download,
   Calendar,
   CreditCard,
   Plus,
   MoreHorizontal,
   ChevronLeft,
   ChevronRight,
   X,
   CheckCircle,
   AlertCircle,
   HelpCircle,
   ArrowRight
} from 'lucide-react';

const Billing = () => {
   // State
   const [dateRange, setDateRange] = useState('30');
   const [searchQuery, setSearchQuery] = useState('');
   const [currentPage, setCurrentPage] = useState(1);
   const [showPaymentModal, setShowPaymentModal] = useState(false);
   const [showMethodModal, setShowMethodModal] = useState(false);
   const [showDetailsModal, setShowDetailsModal] = useState(null);
   const [showNotifications, setShowNotifications] = useState(false);
   const [showSupport, setShowSupport] = useState(false);
   const [autoPayEnabled, setAutoPayEnabled] = useState(true);

   // Mock Data
   const payments = [
      { id: '#INV-2023-089', service: 'GST Registration Filing', date: '2023-10-24', amount: 250.00, status: 'Paid' },
      { id: '#INV-2023-088', service: 'Trademark Renewal - Class 35', date: '2023-10-20', amount: 450.00, status: 'Pending' },
      { id: '#INV-2023-085', service: 'Annual Compliance Package', date: '2023-10-15', amount: 390.00, status: 'Overdue' },
      { id: '#INV-2023-080', service: 'ROC Document Filing Fee', date: '2023-10-05', amount: 120.00, status: 'Paid' },
      { id: '#INV-2023-078', service: 'Staff Payroll - September', date: '2023-10-01', amount: 1200.00, status: 'Paid' },
      { id: '#INV-2023-075', service: 'Legal Consultation Hours', date: '2023-09-28', amount: 150.00, status: 'Paid' },
      { id: '#INV-2023-072', service: 'Tax Audit Advance', date: '2023-09-25', amount: 500.00, status: 'Paid' },
      { id: '#INV-2023-070', service: 'Digital Signature Cert', date: '2023-09-20', amount: 45.00, status: 'Paid' }
   ];

   // Filtering Logic
   const filteredPayments = payments.filter(p => {
      const matchesSearch = p.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
         p.id.toLowerCase().includes(searchQuery.toLowerCase());

      const paymentDate = new Date(p.date);
      const dayDiff = (new Date() - paymentDate) / (1000 * 60 * 60 * 24);
      const matchesDate = dayDiff <= parseInt(dateRange);

      return matchesSearch && matchesDate;
   });

   // Pagination Logic
   const itemsPerPage = 4;
   const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
   const paginatedPayments = filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

   const stats = [
      { label: 'Total Spend', value: '$12,450.00', trend: '+ 12% from last year', icon: '📊' },
      { label: 'Outstanding Balance', value: '$840.00', trend: 'Due in 5 days', icon: '📂' },
      { label: 'Next Payment Date', value: 'Nov 15, 2023', trend: 'Automatic renewal active', icon: '📅' },
   ];

   return (
      <div className="max-w-6xl mx-auto space-y-10 min-h-screen pb-20 relative">

         {/* Header */}
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
               <h1 className="text-3xl font-bold text-slate-900 mb-2">Billing and Invoices Management</h1>
               <p className="text-slate-500">Manage your business compliance financial records and payment history.</p>
            </div>
            <div className="flex items-center gap-4">
               {/* Notification Bell */}
               <div className="relative">
                  <button
                     onClick={() => setShowNotifications(!showNotifications)}
                     className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-200 transition"
                  >
                     <Bell size={20} />
                     <span className="absolute top-2 right-2.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                  </button>
                  {showNotifications && (
                     <div className="absolute top-full right-0 mt-4 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-30 p-4">
                        <h4 className="font-bold border-b pb-2 mb-2">Billing Alerts</h4>
                        <div className="space-y-3">
                           <div className="flex gap-3 text-sm">
                              <div className="text-orange-500"><AlertCircle size={16} /></div>
                              <div>Assuming overdue payment for #INV-2023-085</div>
                           </div>
                           <div className="flex gap-3 text-sm">
                              <div className="text-green-500"><CheckCircle size={16} /></div>
                              <div>Receipt generated for #INV-2023-080</div>
                           </div>
                        </div>
                     </div>
                  )}
               </div>

               <button
                  onClick={() => setShowSupport(true)}
                  className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-200 transition"
               >
                  <HelpCircle size={20} />
               </button>

               <button
                  onClick={() => setShowPaymentModal(true)}
                  className="flex items-center gap-2 px-6 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition"
               >
                  <Plus size={20} />
                  New Payment
               </button>
            </div>
         </div>

         {/* Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map(stat => (
               <div key={stat.label} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:border-blue-200 transition cursor-pointer">
                  <div className="absolute top-6 right-6 text-2xl opacity-10 group-hover:opacity-100 transition duration-500">{stat.icon}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{stat.label}</div>
                  <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
                  <div className="text-xs font-bold text-green-600">{stat.trend}</div>
               </div>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Main Table Section */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 overflow-hidden flex flex-col min-h-[600px]">
               <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
                  <h3 className="text-lg font-bold">Recent Invoices</h3>
                  <div className="flex flex-wrap gap-4 w-full md:w-auto">

                     {/* Search Bar */}
                     <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                           type="text"
                           placeholder="Search invoice or service..."
                           value={searchQuery}
                           onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                           className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition"
                        />
                        {searchQuery && (
                           <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-100 rounded-xl shadow-lg z-10 p-2">
                              <div className="text-[10px] font-bold text-slate-400 uppercase mb-1 px-2">Suggestions</div>
                              {filteredPayments.slice(0, 2).map(p => (
                                 <div key={p.id} className="text-xs p-2 hover:bg-slate-50 rounded cursor-pointer truncate">
                                    {p.service}
                                 </div>
                              ))}
                              {filteredPayments.length === 0 && <div className="text-xs p-2 text-slate-400">No results</div>}
                           </div>
                        )}
                     </div>

                     {/* Date Filter */}
                     <select
                        value={dateRange}
                        onChange={(e) => { setDateRange(e.target.value); setCurrentPage(1); }}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:border-blue-500 cursor-pointer"
                     >
                        <option value="3">Last 3 Days</option>
                        <option value="7">Last 7 Days</option>
                        <option value="14">Last 14 Days</option>
                        <option value="21">Last 21 Days</option>
                        <option value="30">Last 30 Days</option>
                     </select>

                     <button className="p-2 bg-slate-50 text-slate-400 rounded-xl border border-slate-200 hover:text-blue-600 transition" title="Download Report">
                        <Download size={20} />
                     </button>
                  </div>
               </div>

               <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left whitespace-nowrap">
                     <thead className="bg-slate-50 text-[10px] uppercase tracking-widest font-black text-slate-400">
                        <tr>
                           <th className="px-8 py-4">Invoice ID</th>
                           <th className="px-8 py-4">Service Name</th>
                           <th className="px-8 py-4">Date</th>
                           <th className="px-8 py-4">Amount</th>
                           <th className="px-8 py-4">Status</th>
                           <th className="px-8 py-4">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50 text-sm">
                        {paginatedPayments.map(inv => (
                           <tr
                              key={inv.id}
                              onClick={() => setShowDetailsModal(inv)}
                              className="hover:bg-slate-50 transition-colors cursor-pointer group"
                           >
                              <td className="px-8 py-6 font-bold text-slate-900">{inv.id}</td>
                              <td className="px-8 py-6 text-slate-600 max-w-[200px] truncate">{inv.service}</td>
                              <td className="px-8 py-6 text-slate-500">{inv.date}</td>
                              <td className="px-8 py-6 font-bold text-slate-900">${inv.amount.toFixed(2)}</td>
                              <td className="px-8 py-6">
                                 <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${inv.status === 'Paid' ? 'bg-green-50 text-green-600' :
                                       inv.status === 'Pending' ? 'bg-orange-50 text-orange-600' :
                                          'bg-red-50 text-red-600'
                                    }`}>
                                    {inv.status}
                                 </span>
                              </td>
                              <td className="px-8 py-6">
                                 <button className="text-blue-600 font-bold text-xs hover:underline opacity-0 group-hover:opacity-100 transition-opacity">Details</button>
                              </td>
                           </tr>
                        ))}
                        {paginatedPayments.length === 0 && (
                           <tr>
                              <td colSpan="6" className="text-center py-20 text-slate-400">No invoices found for this range.</td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>

               {/* Pagination */}
               <div className="p-6 bg-slate-50 flex items-center justify-between text-xs text-slate-400 font-bold uppercase border-t border-slate-100">
                  <span>Showing {paginatedPayments.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length} invoices</span>
                  <div className="flex gap-2">
                     <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 flex items-center gap-1"
                     >
                        <ChevronLeft size={14} /> Previous
                     </button>
                     <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 flex items-center gap-1"
                     >
                        Next <ChevronRight size={14} />
                     </button>
                  </div>
               </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">

               {/* Payment Methods */}
               <div className="bg-white rounded-3xl border border-slate-100 p-8 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-lg font-bold">Payment Methods</h3>
                     <button
                        onClick={() => setShowMethodModal(true)}
                        className="text-blue-600 font-bold text-xs hover:bg-blue-50 px-2 py-1 rounded transition"
                     >
                        + Add New
                     </button>
                  </div>
                  <div className="space-y-4">
                     <div className="p-6 border-2 border-blue-600 bg-blue-50/20 rounded-2xl relative">
                        <div className="absolute top-4 right-4 bg-blue-600 text-white text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded">Default</div>
                        <div className="flex items-center gap-4 mb-6">
                           <div className="h-8 w-12 bg-white rounded border border-slate-100 flex items-center justify-center">
                              <span className="text-blue-800 font-black text-[10px]">VISA</span>
                           </div>
                           <div className="text-sm font-bold text-slate-900">•••• •••• •••• 4242</div>
                        </div>
                        <div className="flex justify-between items-end">
                           <div>
                              <div className="text-[8px] font-bold text-slate-400 uppercase">Expiry</div>
                              <div className="text-xs font-bold text-slate-700">12 / 25</div>
                           </div>
                           <CreditCard className="h-6 w-6 text-slate-300" />
                        </div>
                     </div>

                     <div className="p-6 border border-slate-100 bg-slate-50/50 rounded-2xl group hover:border-blue-200 transition-all cursor-pointer">
                        <div className="flex items-center gap-4 mb-6">
                           <div className="h-8 w-12 bg-white rounded border border-slate-100 flex items-center justify-center">
                              <span className="text-red-500 font-black text-[10px]">MASTER</span>
                           </div>
                           <div className="text-sm font-bold text-slate-400 group-hover:text-slate-900 transition">•••• •••• •••• 8891</div>
                        </div>
                        <div className="flex justify-between items-end">
                           <div>
                              <div className="text-[8px] font-bold text-slate-400 uppercase">Expiry</div>
                              <div className="text-xs font-bold text-slate-400 group-hover:text-slate-700 transition">08 / 24</div>
                           </div>
                           <div className="h-6 w-6 bg-slate-200 rounded"></div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Auto-Pay Toggle */}
               <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                     <h4 className="text-sm font-bold">Auto-Pay Status</h4>
                     <button
                        onClick={() => setAutoPayEnabled(!autoPayEnabled)}
                        className={`h-6 w-11 rounded-full relative p-1 flex items-center transition-colors duration-300 ${autoPayEnabled ? 'bg-blue-600 justify-end' : 'bg-slate-300 justify-start'}`}
                     >
                        <div className="h-4 w-4 bg-white rounded-full shadow-md"></div>
                     </button>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                     {autoPayEnabled
                        ? "Enabled for all services. Next auto-charge will be on Nov 15th for the amount of $840.00."
                        : "Auto-pay is currently disabled. Please pay manually to avoid service interruption."}
                  </p>
                  <button className="w-full py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition flex items-center justify-center gap-2">
                     <MoreHorizontal className="h-4 w-4" />
                     Transaction History
                  </button>
               </div>
            </div>
         </div>

         {/* --- Modals --- */}

         {/* 1. New Payment Modal */}
         {showPaymentModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl animate-in zoom-in-95">
                  <h3 className="text-xl font-bold mb-6">Make a Payment</h3>
                  <div className="space-y-4">
                     <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Amount</label>
                        <div className="relative mt-1">
                           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                           <input type="number" className="w-full pl-8 pr-4 py-3 bg-slate-50 border rounded-xl font-bold text-slate-900" placeholder="0.00" />
                        </div>
                     </div>
                     <div className="flex gap-2 text-sm text-slate-500">
                        <div>Balance Due:</div>
                        <div className="font-bold text-slate-900">$840.00</div>
                     </div>
                     <button onClick={() => setShowPaymentModal(false)} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl mt-4">Pay Now</button>
                     <button onClick={() => setShowPaymentModal(false)} className="w-full py-3 text-slate-500 font-bold">Cancel</button>
                  </div>
               </div>
            </div>
         )}

         {/* 2. Add Method Modal */}
         {showMethodModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl animate-in zoom-in-95">
                  <h3 className="text-xl font-bold mb-6">Add Card</h3>
                  <div className="space-y-4">
                     <input type="text" placeholder="Card Number" className="w-full px-4 py-3 bg-slate-50 border rounded-xl" />
                     <div className="flex gap-4">
                        <input type="text" placeholder="MM/YY" className="w-1/2 px-4 py-3 bg-slate-50 border rounded-xl" />
                        <input type="text" placeholder="CVC" className="w-1/2 px-4 py-3 bg-slate-50 border rounded-xl" />
                     </div>
                     <button onClick={() => setShowMethodModal(false)} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl">Add Card</button>
                     <button onClick={() => setShowMethodModal(false)} className="w-full py-3 text-slate-500 font-bold">Cancel</button>
                  </div>
               </div>
            </div>
         )}

         {/* 3. Transaction Details Modal */}
         {showDetailsModal && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate-in zoom-in-95 relative">
                  <button onClick={() => setShowDetailsModal(null)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full"><X size={16} /></button>
                  <div className="text-center mb-6">
                     <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                     </div>
                     <h3 className="text-2xl font-bold text-slate-900">{showDetailsModal.amount.toFixed(2)} USD</h3>
                     <p className="text-slate-500">Payment Success</p>
                  </div>
                  <div className="space-y-4 bg-slate-50 p-6 rounded-2xl">
                     <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Transaction ID</span>
                        <span className="font-bold text-slate-900">{showDetailsModal.id}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Service</span>
                        <span className="font-bold text-slate-900 truncate max-w-[150px]">{showDetailsModal.service}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Date</span>
                        <span className="font-bold text-slate-900">{showDetailsModal.date}</span>
                     </div>
                  </div>
                  <div className="mt-8 flex gap-4">
                     <button className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl">Download PDF</button>
                     <button className="flex-1 py-3 border border-slate-200 font-bold rounded-xl text-slate-600">Email Receipt</button>
                  </div>
               </div>
            </div>
         )}

         {/* 4. Support Modal */}
         {showSupport && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
               <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl animate-in zoom-in-95 text-center">
                  <HelpCircle size={48} className="text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Need Help?</h3>
                  <p className="text-slate-500 text-sm mb-6">Our billing support team is available Mon-Fri, 9am - 6pm EST.</p>
                  <button onClick={() => setShowSupport(false)} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl mb-2">Contact Support</button>
                  <button onClick={() => setShowSupport(false)} className="w-full py-3 text-slate-500 font-bold">Close</button>
               </div>
            </div>
         )}

      </div>
   );
};

export default Billing;