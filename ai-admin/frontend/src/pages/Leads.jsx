import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Plus, Users, CheckCircle2, AlertCircle, Filter, MoreHorizontal, Globe, Calendar, Share2, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

const Leads = () => {
    const { data: leads, isLoading } = useQuery({
        queryKey: ['leads'],
        queryFn: api.getLeads
    });

    const stats = [
        { label: "Total Leads", value: "1,284", subtext: "+12% from last month", icon: Users, color: "text-blue-500", change: "+12%" },
        { label: "Converted Leads", value: "422", subtext: "conversion rate: 32.8%", icon: CheckCircle2, color: "text-green-500", change: "+5%" },
        { label: "Pending Follow-ups", value: "86", subtext: "requires attention", icon: AlertCircle, color: "text-orange-500", change: "-2%" },
    ];

    const getSourceIcon = (source) => {
        if (source.includes("Web")) return <Globe className="w-4 h-4 text-blue-400" />;
        if (source.includes("Summit")) return <Calendar className="w-4 h-4 text-purple-400" />;
        if (source.includes("LinkedIn")) return <Share2 className="w-4 h-4 text-blue-600" />;
        return <Mail className="w-4 h-4 text-gray-400" />;
    };

    const getInterestColor = (interest) => {
        switch (interest) {
            case 'Hot': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'Warm': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'Cold': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
            default: return 'bg-blue-500/10 text-blue-500';
        }
    };

    return (
        <DashboardLayout title="Leads">
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Lead Generation Management</h2>
                    <p className="text-muted-foreground mt-1">Monitor and track investment leads across all global sources and event partners.</p>
                </div>

                <div className="flex justify-end gap-3">
                    <Button variant="outline" className="bg-secondary border-none"><Download className="mr-2 h-4 w-4" /> Export Report</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700"><Plus className="mr-2 h-4 w-4" /> Add New Lead</Button>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    {stats.map((stat, i) => (
                        <div key={i} className="p-6 rounded-xl bg-card border border-border shadow-sm flex flex-col justify-between">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                            <div className="mt-4">
                                <div className="text-4xl font-bold">{stat.value}</div>
                                <div className={`mt-1 flex items-center text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-500' : 'text-orange-500'}`}>
                                    {stat.change} <span className="text-muted-foreground ml-1">{stat.subtext.replace(stat.change, '')}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters and Search - Assuming simplified for now based on image */}
                <div className="flex items-center justify-between p-1 bg-transparent">
                    <div className="flex gap-2">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-xs px-4 h-8">All Leads <span className="bg-blue-500 ml-2 px-1 rounded text-white text-[10px]">1.2k</span></Button>
                        <Button variant="outline" className="bg-secondary border-none text-xs px-4 h-8">Hot ▼</Button>
                        <Button variant="outline" className="bg-secondary border-none text-xs px-4 h-8">Warm ▼</Button>
                        <Button variant="outline" className="bg-secondary border-none text-xs px-4 h-8">Cold ▼</Button>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Icons for list view toggles */}
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-md border border-border bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="text-muted-foreground font-semibold text-xs uppercase">Lead Source</TableHead>
                                <TableHead className="text-muted-foreground font-semibold text-xs uppercase">Contact Name</TableHead>
                                <TableHead className="text-muted-foreground font-semibold text-xs uppercase">Interest Level</TableHead>
                                <TableHead className="text-muted-foreground font-semibold text-xs uppercase">Assigned Manager</TableHead>
                                <TableHead className="text-muted-foreground font-semibold text-xs uppercase">Follow-up Date</TableHead>
                                <TableHead className="text-right text-muted-foreground font-semibold text-xs uppercase">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10">Loading...</TableCell>
                                </TableRow>
                            ) : leads?.map((lead) => (
                                <TableRow key={lead.id} className="border-border hover:bg-secondary/50">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center">
                                                {getSourceIcon(lead.source)}
                                            </div>
                                            <span className="font-semibold text-sm">{lead.source}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full ${lead.color} flex items-center justify-center text-white text-xs`}>
                                                {lead.initials}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-sm">{lead.contact}</div>
                                                <div className="text-xs text-muted-foreground">{lead.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`${getInterestColor(lead.interest)} border flex items-center gap-1.5 px-2 py-0.5 w-fit`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${lead.interest === 'Hot' ? 'bg-red-500' : lead.interest === 'Warm' ? 'bg-orange-500' : 'bg-gray-400'}`}></div>
                                            {lead.interest}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">{lead.manager}</TableCell>
                                    <TableCell className={`text-sm ${lead.followUp.includes('Overdue') ? 'text-red-400' : 'text-muted-foreground'}`}>{lead.followUp}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="w-4 h-4" /></Button>
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

export default Leads;
