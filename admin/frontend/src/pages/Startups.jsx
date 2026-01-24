import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Briefcase, CheckCircle2, Clock, FileText, Sheet, Rocket, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { exportToExcel, exportToPDF, MAPPERS } from "@/utils/exportUtils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const Startups = () => {
    const [search, setSearch] = useState("");

    const { data: startups, isLoading } = useQuery({
        queryKey: ['startups'],
        queryFn: () => api.getStartups()
    });

    const handleExportExcel = () => {
        if (!startups) return;
        exportToExcel(startups, "IPA_Global_Startup_Ledger", "Startups", MAPPERS.startups);
    };

    const handleExportPDF = () => {
        if (!startups) return;
        exportToPDF(startups, "IPA_Global_Startup_Ledger", "IPA Global Startup Ledger", MAPPERS.startups);
    };

    const stats = [
        { label: "Total Ventures", value: startups?.length || "...", subtext: "Unified Registry", icon: Rocket, color: "text-primary" },
        { label: "Approval Delta", value: "2h 15m", subtext: "Ecosystem Response Time", icon: Clock, color: "text-amber-500" },
        { label: "Combined Val", value: "$420M", subtext: "Vetted Portfolios", icon: DollarSign, color: "text-emerald-500" },
    ];

    return (
        <DashboardLayout title="Global Startup Ledger">
            <div className="animate-fade-in space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">IPA Global Startup Ledger</h2>
                    <p className="text-muted-foreground">Central controller for all startup entities, stage upgrades, and valuation tracking across the Investor & Startup portals.</p>
                </div>

                {/* Authority Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    {stats.map((stat, i) => (
                        <div key={i} className="p-6 rounded-xl bg-card border border-border shadow-sm group hover:border-primary/50 transition-all">
                            <div className="flex items-center justify-between pb-2">
                                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                                <stat.icon className={`h-4 w-4 ${stat.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
                            </div>
                            <div className="space-y-1">
                                <div className="text-3xl font-black">{stat.value}</div>
                                <p className="text-[11px] text-muted-foreground flex gap-1 items-center">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> {stat.subtext}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions Bar */}
                <div className="flex items-center justify-between bg-secondary/20 p-4 rounded-xl border border-border/50">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Universal search (ID, Sector, Name)..."
                            className="pl-9 w-[350px] bg-background border-none focus-visible:ring-1 ring-primary"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2 border-border/50 hover:bg-primary hover:text-white transition-all">
                                    <Download className="h-4 w-4" /> Comprehensive Export
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px]">
                                <DropdownMenuItem onClick={handleExportExcel} className="cursor-pointer">
                                    <Sheet className="mr-2 h-4 w-4" /> Excel (.xlsx)
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleExportPDF} className="cursor-pointer">
                                    <FileText className="mr-2 h-4 w-4" /> Official PDF
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button className="bg-primary/20 text-primary hover:bg-primary hover:text-white border border-primary/20">
                            Create IPA Registry Note
                        </Button>
                    </div>
                </div>

                {/* Ledger Table */}
                <div className="rounded-xl border border-border overflow-hidden bg-card/10 backdrop-blur-sm">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border hover:bg-transparent bg-secondary/10">
                                <TableHead className="text-muted-foreground font-black text-[10px] uppercase">IPA Registry ID</TableHead>
                                <TableHead className="text-muted-foreground font-black text-[10px] uppercase">Startup Entity</TableHead>
                                <TableHead className="text-muted-foreground font-black text-[10px] uppercase">Sector</TableHead>
                                <TableHead className="text-muted-foreground font-black text-[10px] uppercase">Market Stage</TableHead>
                                <TableHead className="text-muted-foreground font-black text-[10px] uppercase">Latest Valuation</TableHead>
                                <TableHead className="text-muted-foreground font-black text-[10px] uppercase">IPA Status</TableHead>
                                <TableHead className="text-right text-muted-foreground font-black text-[10px] uppercase">Authority Commands</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-20 font-mono text-xs animate-pulse">STREAMING LEDGER DATA...</TableCell>
                                </TableRow>
                            ) : startups?.map((startup) => (
                                <TableRow key={startup.id} className="border-border hover:bg-primary/5 transition-all group">
                                    <TableCell className="font-mono text-[11px] text-primary/80">{startup.id}</TableCell>
                                    <TableCell>
                                        <div className="font-bold text-sm text-foreground">{startup.name}</div>
                                        <div className="text-[10px] text-muted-foreground">Joined: {startup.submissionDate}</div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="secondary" className="bg-secondary/40 border-none text-[10px]">{startup.sector}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold">{startup.stage}</span>
                                            {startup.status === 'Pending' && (
                                                <span className="text-[9px] text-blue-400 font-bold uppercase tracking-tighter">↗ Upgrade to {startup.requestedUpgrade}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-black text-xs text-foreground/90">{startup.valuation || "N/A"}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`
                                            text-[10px] font-bold border-none
                                            ${startup.status === 'Pending' ? 'text-amber-400 bg-amber-400/10' : ''}
                                            ${startup.status === 'Approved' ? 'text-emerald-400 bg-emerald-400/10' : ''}
                                            ${startup.status === 'Rejected' ? 'text-rose-400 bg-rose-400/10' : ''}
                                        `}>
                                            • {startup.status.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2 px-2">
                                            <button className="h-6 w-12 rounded bg-secondary/50 hover:bg-primary hover:text-white transition-all text-[9px] font-black uppercase">View</button>
                                            <button className="h-6 w-12 rounded bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all text-[9px] font-black uppercase">Edit</button>
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

export default Startups;
