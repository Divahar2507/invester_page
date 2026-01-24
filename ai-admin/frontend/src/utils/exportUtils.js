import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from "sonner";

// --- Excel Export (Professional .xlsx) ---
export const exportToExcel = (data, fileName, sheetName = "Sheet1", mappingFunction = null) => {
    try {
        if (!data || data.length === 0) {
            toast.warning("No data found to export.");
            return false;
        }

        const finalData = mappingFunction ? data.map(mappingFunction) : data;
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(finalData);
        XLSX.utils.book_append_sheet(wb, ws, sheetName);

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        saveAs(blob, fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`);

        toast.success(`Exported ${fileName} as Excel successfully!`);
        return true;
    } catch (error) {
        console.error("Excel Export failed:", error);
        toast.error("Failed to export Excel. " + error.message);
        return false;
    }
};

// --- PDF Export (Professional .pdf) ---
export const exportToPDF = (data, fileName, title = "Export", mappingFunction = null) => {
    try {
        if (!data || data.length === 0) {
            toast.warning("No data found to export.");
            return false;
        }

        const finalData = mappingFunction ? data.map(mappingFunction) : data;

        // Extract headers and rows
        const headers = Object.keys(finalData[0]);
        const rows = finalData.map(item => Object.values(item));

        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text(title, 14, 22);
        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

        // Table
        doc.autoTable({
            startY: 40,
            head: [headers],
            body: rows,
            theme: 'striped',
            headStyles: { fillColor: [66, 133, 244] }, // Blue header
        });

        doc.save(fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`);

        toast.success(`Exported ${fileName} as PDF successfully!`);
        return true;
    } catch (error) {
        console.error("PDF Export failed:", error);
        toast.error("Failed to export PDF. " + error.message);
        return false;
    }
};

export const MAPPERS = {
    startups: (item) => ({
        "Startup Name": item.name,
        "Sector": item.sector,
        "Stage": item.stage,
        "Requested Upgrade": item.requestedUpgrade,
        "Submission Date": item.submissionDate,
        "Status": item.status
    }),
    investors: (item) => ({
        "Investor Name": item.name,
        "Organization": item.organization,
        "Type": item.type,
        "Focus": item.focus,
        "Capacity": item.capacity,
        "Region": item.region,
        "Last Activity": item.lastActivity
    }),
    events: (item) => ({
        "Event Name": item.name,
        "Date": item.date,
        "Location": item.location,
        "Type": item.type,
        "Status": item.status,
    }),
    aiLogs: (item) => ({
        "Timestamp": item.timestamp,
        "Action": item.action,
        "Details": item.details,
        "Status": item.status
    })
};
