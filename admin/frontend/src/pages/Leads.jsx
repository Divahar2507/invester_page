import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Plus, Users, CheckCircle2, AlertCircle, Filter, MoreHorizontal, Globe, Calendar, Share2, Mail, ShieldAlert, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

const Leads = () => {
    const { data: leads, isLoading } = useQuery({
        queryKey: ['leads'],
        queryFn: api.getLeads
    });

    const stats = [
        { label: "Total Captured", value: leads?.length || "...", subtext: "Unified Lead Pool", icon: Zap, color: "text-amber-500" },
        { label: "AI Conversion", value: "32.8%", subtext: "Predictive Score", icon: CheckCircle2, color: "text-emerald-500" },
        { label: "Authority Lock", value: "Enforced", subtext: "Lead Isolation Active", icon: ShieldAlert, color: "text-rose-500" },
    ];

    const getSourceIcon = (source) => {
        if (source.includes("Web") || source.includes("Scraper")) return <Globe className="w-4 h-4 text-cyan-400" />;
        if (source.includes("LinkedIn") || source.includes("Automation")) return <Share2 className="w-4 h-4 text-blue-500" />;
        return <Mail className="w-4 h-4 text-gray-400" />;
    };

    return (
        <DashboardLayout title="Integrated Lead Ledger">
            <div className="animate-fade-in space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">IPA Integrated Lead Ledger</h2>
                        <p className="text-muted-foreground">Global capture stream from LeadGen engines, marketing scrapers, and automation nodes.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="border-border/50 hover:bg-secondary transition-all">
                            <Download className="mr-2 h-4 w-4" /> Global Export
                        </Button>
                        <Button className="bg-primary hover:bg-primary/90">
                            <Plus className="mr-2 h-4 w-4" /> Manual Inject
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    {stats.map((stat, i) => (
                        <div key={i} className="p-6 rounded-xl bg-card/40 border border-border shadow-sm flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                                <div className="text-3xl font-black">{stat.value}</div>
                                <p className="text-[11px] text-muted-foreground">{stat.subtext}</p>
                            </div>
                            <div className={`p-3 rounded-xl bg-secondary ${stat.color} bg-opacity-10`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="rounded-xl border border-border bg-card/10 overflow-hidden backdrop-blur-md">
                    <Table>
                        <TableHeader className="bg-secondary/20">
                            <TableRow className="border-border hover:bg-transparent">
                                <TableHead className="text-muted-foreground font-bold text-[10px] uppercase">Lead Identity ID</TableHead>
                                <TableHead className="text-muted-foreground font-bold text-[10px] uppercase">Engine Source</TableHead>
                                <TableHead className="text-muted-foreground font-bold text-[10px] uppercase">Primary Contact</TableHead>
                                <TableHead className="text-muted-foreground font-bold text-[10px] uppercase">Associated Company</TableHead>
                                <TableHead className="text-muted-foreground font-bold text-[10px] uppercase">Interest LVL</TableHead>
                                <TableHead className="text-muted-foreground font-bold text-[10px] uppercase">Capture Epoch</TableHead>
                                <TableHead className="text-right text-muted-foreground font-bold text-[10px] uppercase">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-20 font-mono text-[10px] opacity-40 italic">INTERCEPTING LEAD STREAM...</TableCell>
                                </TableRow>
                            ) : leads?.map((lead) => (
                                <TableRow key={lead.id} className="border-border hover:bg-primary/5 transition-all">
                                    <TableCell className="font-mono text-[11px] text-primary/70">{lead.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getSourceIcon(lead.source)}
                                            <span className="text-xs font-semibold">{lead.source}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-bold text-sm">{lead.contact}</div>
                                    </TableCell>
                                    <TableCell className="text-xs text-muted-foreground italic">{lead.company}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`
                                            text-[10px] font-black border-none px-2
                                            ${lead.interest === 'High' ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}
                                        `}>
                                            {lead.interest.toUpperCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-xs font-mono opacity-80">{lead.captured_at}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors"><MoreHorizontal className="w-4 h-4" /></Button>
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
