import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { api } from "@/services/api";

const Settings = () => {
  const [language, setLanguage] = useState("");
  const [timezone, setTimezone] = useState("");
  const [exportOptions, setExportOptions] = useState({
    startups: false,
    investors: false,
    events: false,
    aiLogs: false,
  });

  const [companyProfile, setCompanyProfile] = useState({
    companyName: "",
    website: "",
    linkedin: "",
    phone: "",
    email: "",
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setCompanyProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    // Basic validation for URLs
    if (companyProfile.website && !companyProfile.website.startsWith('http')) {
      toast.error("Website URL must start with http:// or https://");
      return;
    }
    if (companyProfile.linkedin && !companyProfile.linkedin.startsWith('http')) {
      toast.error("LinkedIn URL must start with http:// or https://");
      return;
    }

    console.log("Saving profile:", companyProfile);
    toast.success("Company profile saved successfully!");
  };

  const handleExport = async () => {
    const selectedExports = Object.keys(exportOptions).filter(key => exportOptions[key]);

    if (selectedExports.length === 0) {
      toast.error("Please select at least one data type to export.");
      return;
    }

    toast.info("Generating export...");

    try {
      const wb = XLSX.utils.book_new();
      let hasData = false;

      if (exportOptions.startups) {
        const rawData = await api.getStartups();
        const data = rawData.map(item => ({
          "Startup Name": item.name,
          "Sector": item.sector,
          "Stage": item.stage,
          "Requested Upgrade": item.requestedUpgrade,
          "Submission Date": item.submissionDate,
          "Status": item.status
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Startups");
        hasData = true;
      }

      if (exportOptions.investors) {
        const rawData = await api.getInvestors();
        const data = rawData.map(item => ({
          "Investor Name": item.name,
          "Organization": item.organization,
          "Type": item.type,
          "Focus Sectors": item.focus,
          "Capacity": item.capacity,
          "Region": item.region,
          "Contact": item.contact,
          "Last Activity": item.lastActivity
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Investors");
        hasData = true;
      }

      if (exportOptions.events) {
        const rawData = await api.getEvents();
        const data = rawData.map(item => ({
          "Event Name": item.name,
          "Date": item.date,
          "Location": item.location,
          "Type": item.type,
          "Status": item.status,
          "Attendees": item.attendees
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "Events");
        hasData = true;
      }

      if (exportOptions.aiLogs) {
        const mockLogs = [
          { id: 1, timestamp: "2023-10-24 10:00", action: "Startup Analysis", details: "Analyzed TechNova pitch deck", status: "Success" },
          { id: 2, timestamp: "2023-10-24 11:30", action: "Matchmaking", details: "Matched AgriGrow with Investor A", status: "Success" },
          { id: 3, timestamp: "2023-10-24 14:15", action: "Risk Assessment", details: "Flagged high burn rate for Quantum Health", status: "Warning" },
          { id: 4, timestamp: "2023-10-25 09:45", action: "Trend Report", details: "Generated Q3 Fintech Market Report", status: "Success" },
          { id: 5, timestamp: "2023-10-25 10:00", action: "Email Automation", details: "Sent quarterly updates to 150 investors", status: "Success" },
          { id: 6, timestamp: "2023-10-25 13:20", action: "Due Diligence", details: "Verified legal documents for EduVantage", status: "Success" },
          { id: 7, timestamp: "2023-10-25 16:50", action: "System Alert", details: "High latency detected in matching engine", status: "Resolved" }
        ];
        const data = mockLogs.map(item => ({
          "Timestamp": item.timestamp,
          "Action": item.action,
          "Details": item.details,
          "Status": item.status
        }));
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "AI Logs");
        hasData = true;
      }

      if (hasData) {
        // Generate buffer
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

        // Create Blob
        const blob = new Blob([wbout], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

        // Create download link
        const url = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = "Ecosystem_Data_Export.xlsx";
        document.body.appendChild(anchor);
        anchor.click();

        // Cleanup
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(url);

        toast.success("Export completed successfully!");
      } else {
        toast.warning("No data found to export.");
      }

    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to generate export. " + error.message);
    }
  };

  const toggleExport = (key) => {
    setExportOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <DashboardLayout title="Settings">
      <div className="animate-fade-in max-w-2xl">
        <h1 className="text-3xl font-bold text-foreground mb-8">Business Development: Control Center</h1>

        {/* Company Profile Settings */}
        <section className="mb-10 bg-card/30 p-6 rounded-lg border border-border/50 backdrop-blur-sm">
          <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            Company Profile
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                placeholder="Ex: TechNova Solutions"
                value={companyProfile.companyName}
                onChange={handleProfileChange}
                className="bg-secondary/50 border-input focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email ID</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="contact@company.com"
                value={companyProfile.email}
                onChange={handleProfileChange}
                className="bg-secondary/50 border-input focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={companyProfile.phone}
                onChange={handleProfileChange}
                className="bg-secondary/50 border-input focus:ring-primary/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website Link</Label>
              <Input
                id="website"
                name="website"
                placeholder="https://www.example.com"
                value={companyProfile.website}
                onChange={handleProfileChange}
                className="bg-secondary/50 border-input focus:ring-primary/50"
              />
              <p className="text-xs text-muted-foreground">Must include http:// or https://</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="linkedin">LinkedIn Profile</Label>
              <Input
                id="linkedin"
                name="linkedin"
                placeholder="https://linkedin.com/company/..."
                value={companyProfile.linkedin}
                onChange={handleProfileChange}
                className="bg-secondary/50 border-input focus:ring-primary/50"
              />
              <p className="text-xs text-muted-foreground">Must include http:// or https://</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={handleSaveProfile} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Save Profile
            </Button>
          </div>
        </section>

        {/* System Configuration */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-foreground mb-6">System Configuration</h2>

          <div className="space-y-6">
            <div>
              <Label className="text-foreground mb-2 block">System Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-foreground mb-2 block">Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger className="bg-secondary border-border text-foreground">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">Eastern Time (EST)</SelectItem>
                  <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                  <SelectItem value="gmt">GMT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Data Export Center */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-4">Data Export Center</h2>
          <h3 className="text-base font-medium text-foreground mb-4">Generate Report</h3>

          <div className="space-y-4 mb-6">
            {[
              { key: "startups", label: "Startups" },
              { key: "investors", label: "Investors" },
              { key: "events", label: "Events" },
              { key: "aiLogs", label: "AI Logs" },
            ].map((option) => (
              <div key={option.key} className="flex items-center space-x-3">
                <Checkbox
                  id={option.key}
                  checked={exportOptions[option.key]}
                  onCheckedChange={() => toggleExport(option.key)}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor={option.key}
                  className="text-foreground cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>

          <Button onClick={handleExport} className="bg-primary text-primary-foreground hover:bg-primary/90">
            Export to Excel (.xlsx)
          </Button>
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
