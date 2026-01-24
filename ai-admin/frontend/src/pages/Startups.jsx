import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Briefcase, Plus, CheckCircle2, AlertCircle, Clock, FileText, Sheet } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { exportToExcel, exportToPDF, MAPPERS } from "@/utils/exportUtils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Startups = () => {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const { data: startups, isLoading } = useQuery({
        queryKey: ['startups', search, statusFilter],
        queryFn: () => api.getStartups({
            search,
            status: statusFilter === "all" ? undefined : statusFilter
        })
    });

    const handleExportExcel = () => {
        if (!startups) return;
        exportToExcel(startups, "Startups_Export", "Startups", MAPPERS.startups);
    };

    const handleExportPDF = () => {
        if (!startups) return;
        exportToPDF(startups, "Startups_Export", "Startups Report", MAPPERS.startups);
    };

    const stats = [
        { label: "Total Pending", value: "24", subtext: "Requests awaiting review", icon: Briefcase, color: "text-yellow-500", change: "+5%" },
        { label: "Processed Today", value: "12", subtext: "Resolved in the last 24h", icon: CheckCircle2, color: "text-green-500", change: "-2%" },
        { label: "Avg. Approval Time", value: "4.2 hrs", subtext: "Since submission to resolution", icon: Clock, color: "text-blue-500", change: "+10%" },
    ];

    return (
        <DashboardLayout title="Startups">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Startup Upgrade Approvals</h2>
                    <p className="text-muted-foreground">Review and manage startup stage progression requests from the ecosystem.</p>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    {stats.map((stat, i) => (
                        <div key={i} className="p-6 rounded-xl bg-card border border-border shadow-sm">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <div className={`p-2 rounded-lg bg-secondary ${stat.color} bg-opacity-10`}>
                                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                                <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                                    {stat.change}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase">{stat.label}</p>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions Bar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search startups, sectors, or stages..."
                                className="pl-8 w-[300px] bg-secondary border-none"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="gap-2 bg-secondary border-none">
                                    <Download className="h-4 w-4" /> Export
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleExportExcel}>
                                    <Sheet className="mr-2 h-4 w-4" /> Export as Excel
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleExportPDF}>
                                    <FileText className="mr-2 h-4 w-4" /> Export as PDF
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[180px] bg-secondary border-none">
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Approved">Approved</SelectItem>
                                <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="rounded-md border border-border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow className="border-border hover:bg-transparent">
                            <TableHead className="text-muted-foreground font-semibold">STARTUP NAME</TableHead>
                            <TableHead className="text-muted-foreground font-semibold">SECTOR</TableHead>
                            <TableHead className="text-muted-foreground font-semibold">CURRENT STAGE</TableHead>
                            <TableHead className="text-muted-foreground font-semibold">REQUESTED UPGRADE</TableHead>
                            <TableHead className="text-muted-foreground font-semibold">SUBMISSION DATE</TableHead>
                            <TableHead className="text-muted-foreground font-semibold">STATUS</TableHead>
                            <TableHead className="text-right text-muted-foreground font-semibold">ACTIONS</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10">Loading...</TableCell>
                            </TableRow>
                        ) : startups?.map((startup) => (
                            <TableRow key={startup.id} className="border-border hover:bg-secondary/50">
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary text-xs">
                                            {startup.name.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-semibold">{startup.name}</div>
                                            <div className="text-xs text-muted-foreground">ID: {startup.id}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{startup.sector}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground uppercase text-[10px]">{startup.stage}</Badge>
                                </TableCell>
                                <TableCell className="text-blue-400 font-medium">
                                    ↗ {startup.requestedUpgrade}
                                </TableCell>
                                <TableCell>{startup.submissionDate}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={`
                        ${startup.status === 'Pending' ? 'border-yellow-500 text-yellow-500' : ''}
                        ${startup.status === 'Approved' ? 'border-green-500 text-green-500' : ''}
                        ${startup.status === 'Rejected' ? 'border-red-500 text-red-500' : ''}
                    `}>
                                        • {startup.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full"><div className="w-4 h-4 rounded-full border border-gray-400" /> </Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full"><div className="w-4 h-4 rounded-full border border-gray-400" /></Button>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full"><div className="w-4 h-4 rounded-full border border-gray-400" /></Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </DashboardLayout>
    );
};

export default Startups;
