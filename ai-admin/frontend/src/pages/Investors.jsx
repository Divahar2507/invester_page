import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Bell, Users, Wallet, Zap, Filter, FileText, Sheet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { exportToExcel, exportToPDF, MAPPERS } from "@/utils/exportUtils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Investors = () => {
  const [search, setSearch] = useState("");

  const { data: investors, isLoading } = useQuery({
    queryKey: ['investors', search],
    queryFn: () => api.getInvestors({ search })
  });

  const handleExportExcel = () => {
    if (!investors) return;
    exportToExcel(investors, "Investors_Export", "Investors", MAPPERS.investors);
  };

  const handleExportPDF = () => {
    if (!investors) return;
    exportToPDF(investors, "Investors_Export", "Investor Directory", MAPPERS.investors);
  };

  const stats = [
    { label: "Total Investors", value: "1,240", subtext: "+12% from last month", icon: Users, color: "text-blue-500" },
    { label: "Active Leads", value: "458", subtext: "+5% active now", icon: Zap, color: "text-cyan-400" },
    { label: "Total Capacity", value: "$2.5B", subtext: "Available investment pool", icon: Wallet, color: "text-blue-400" },
  ];

  return (
    <DashboardLayout title="Investors">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Investor Directory</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by name, firm or region..."
                className="pl-8 w-[300px] bg-secondary border-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Download className="mr-2 h-4 w-4" /> Export Options
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportExcel}>
                  <Sheet className="mr-2 h-4 w-4" /> Export to Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF}>
                  <FileText className="mr-2 h-4 w-4" /> Export to PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, i) => (
            <div key={i} className="p-6 rounded-xl bg-card border border-border shadow-sm">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <div className="text-4xl font-bold">{stat.value}</div>
                  <p className="text-sm text-green-500">{stat.subtext}</p>
                </div>
                <div className={`p-3 rounded-lg bg-secondary ${stat.color} bg-opacity-10`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 py-4">
          <span className="text-sm text-muted-foreground flex items-center gap-2"><Filter className="w-4 h-4" /> Filters:</span>
          <Button variant="outline" className="bg-secondary border-none text-sm">Sectors: All ▼</Button>
          <Button variant="outline" className="bg-secondary border-none text-sm">Region: Global ▼</Button>
          <Button variant="outline" className="bg-secondary border-none text-sm">Capacity: Any ▼</Button>
          <Button variant="outline" className="bg-secondary border-none text-sm">Last Active: 30d ▼</Button>
        </div>

        {/* Table */}
        <div className="rounded-md border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase">Investor Name</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase">Firm/Organization</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase">Capacity</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase">Focus Sectors</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase">Region</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs uppercase">Last Activity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10">Loading...</TableCell>
                </TableRow>
              ) : investors?.map((investor) => (
                <TableRow key={investor.id} className="border-border hover:bg-secondary/50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${investor.color || 'bg-blue-600'} flex items-center justify-center text-white text-xs font-bold`}>
                        {investor.initials}
                      </div>
                      <span className="font-semibold text-foreground">{investor.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{investor.organization}</TableCell>
                  <TableCell className="text-foreground">{investor.capacity}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-secondary/50 text-foreground border border-border px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold">
                      {investor.focus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{investor.region}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                      <span className="text-green-500 text-sm">{investor.lastActivity}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Investors;
