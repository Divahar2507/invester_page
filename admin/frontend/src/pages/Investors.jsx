import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Users, Wallet, FileText, Sheet, Filter, ShieldCheck } from "lucide-react";
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
    exportToExcel(investors, "IPA_Investors_Registry", "Investors", MAPPERS.investors);
  };

  const handleExportPDF = () => {
    if (!investors) return;
    exportToPDF(investors, "IPA_Investors_Registry", "IPA Global Investor Registry", MAPPERS.investors);
  };

  const stats = [
    { label: "Global Investors", value: investors?.length || "...", subtext: "Verified Entitites", icon: Users, color: "text-blue-500" },
    { label: "Total Asset Cap", value: "$2.9B", subtext: "Combined Deployable", icon: Wallet, color: "text-emerald-500" },
    { label: "IPA Status", value: "Locked", subtext: "Manual Override Enforced", icon: ShieldCheck, color: "text-primary" },
  ];

  return (
    <DashboardLayout title="Global Investor Registry">
      <div className="animate-fade-in space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">IPA Global Investor Registry</h2>
            <p className="text-muted-foreground">Authorized database of institutional and accredited investors across all ecosystem nodes.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search IPA IDs, Firms..."
                className="pl-8 w-[300px] bg-secondary border-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Download className="mr-2 h-4 w-4" /> Authority Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExportExcel}>
                  <Sheet className="mr-2 h-4 w-4" /> Comprehensive Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPDF}>
                  <FileText className="mr-2 h-4 w-4" /> Official PDF Report
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat, i) => (
            <div key={i} className="p-6 rounded-xl bg-card/50 border border-border shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                <div className="text-3xl font-black">{stat.value}</div>
                <p className="text-[11px] text-muted-foreground font-mono">{stat.subtext}</p>
              </div>
              <div className={`p-3 rounded-xl bg-secondary ${stat.color} bg-opacity-10 shadow-inner`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border overflow-hidden bg-card/20 backdrop-blur-md">
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-bold text-[10px] uppercase">Authority ID</TableHead>
                <TableHead className="text-muted-foreground font-bold text-[10px] uppercase">Entity Name</TableHead>
                <TableHead className="text-muted-foreground font-bold text-[10px] uppercase">Category</TableHead>
                <TableHead className="text-muted-foreground font-bold text-[10px] uppercase">Capacity</TableHead>
                <TableHead className="text-muted-foreground font-bold text-[10px] uppercase">Strategic Focus</TableHead>
                <TableHead className="text-muted-foreground font-bold text-[10px] uppercase">Geographic Region</TableHead>
                <TableHead className="text-muted-foreground font-bold text-[10px] uppercase">Closed Deals</TableHead>
                <TableHead className="text-muted-foreground font-bold text-[10px] uppercase">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-20 font-mono text-xs opacity-50">INITIALIZING REGISTRY STREAM...</TableCell>
                </TableRow>
              ) : investors?.map((investor) => (
                <TableRow key={investor.id} className="border-border hover:bg-primary/5 transition-colors group">
                  <TableCell className="font-mono text-[11px] text-primary/70">{investor.id}</TableCell>
                  <TableCell className="font-semibold text-sm group-hover:text-primary transition-colors">{investor.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] bg-secondary/50 border-none font-medium uppercase tracking-tight">
                      {investor.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-xs">{investor.capacity}</TableCell>
                  <TableCell>
                    <span className="text-xs text-muted-foreground">{investor.focus}</span>
                  </TableCell>
                  <TableCell className="text-xs">{investor.region}</TableCell>
                  <TableCell className="font-mono text-xs text-center">{investor.totalDeals}</TableCell>
                  <TableCell>
                    <Badge className={investor.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}>
                      {investor.status}
                    </Badge>
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
