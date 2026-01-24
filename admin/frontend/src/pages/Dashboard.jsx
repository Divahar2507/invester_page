import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { CriticalAlerts } from "@/components/dashboard/CriticalAlerts";
import { Rocket, DollarSign, Calendar, Zap, Shield, Activity, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: api.getDashboardStats
  });

  const { data: health, isLoading: healthLoading } = useQuery({
    queryKey: ['systemHealth'],
    queryFn: api.getHealth
  });

  return (
    <DashboardLayout title="IPA Global Nerve Center">
      <div className="animate-fade-in space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-primary h-6 w-6" />
            <h1 className="text-3xl font-bold text-foreground">Integrated Platform Authority</h1>
          </div>
          <p className="text-muted-foreground">Global Control Plane for all Ecosystem Microservices</p>
        </div>

        {/* Global Statistics */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Startups"
              value={statsLoading ? "..." : stats?.totalStartups}
              icon={Rocket}
              description="Unified IPA Registry"
            />
            <StatCard
              title="Global Capital"
              value={statsLoading ? "..." : stats?.investorCapital}
              icon={DollarSign}
              description="Vetted Investor Capacity"
            />
            <StatCard
              title="Integrated Events"
              value={statsLoading ? "..." : stats?.liveEvents}
              icon={Calendar}
              description="Active Infinite_BZ Modules"
            />
            <StatCard
              title="System Uptime"
              value={statsLoading ? "..." : stats?.systemHealth}
              icon={Zap}
              description="Real-time Health Score"
            />
          </div>
        </section>

        {/* Microservice Operational Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-card/30 border border-border p-6 rounded-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Service Orchestration
              </h2>
              <Badge variant="outline" className="text-xs uppercase">Source: Docker Daemon</Badge>
            </div>

            <div className="space-y-4">
              {healthLoading ? (
                <div className="text-center py-10 text-muted-foreground italic">Syncing with nodes...</div>
              ) : (
                health?.map((svc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-background/40 border border-border/50 rounded-lg hover:border-primary/50 transition-all">
                    <div>
                      <h4 className="font-semibold text-sm">{svc.service}</h4>
                      <p className="text-xs text-muted-foreground">Latency: {svc.latency} | Load: {svc.load}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={svc.status === 'Operational' ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'}>
                        {svc.status}
                      </Badge>
                      <button className="text-[10px] uppercase font-bold text-muted-foreground hover:text-primary transition-colors">Restart</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Recent Authority Logs
            </h2>
            <div className="bg-card/20 border border-border rounded-xl p-4 h-[400px] overflow-y-auto space-y-3 font-mono text-[11px]">
              <div className="text-muted-foreground"><span className="text-primary">[14:22:01]</span> IPA_BOT: Syncing events from infinite_bz... SUCCESS</div>
              <div className="text-muted-foreground"><span className="text-primary">[14:21:45]</span> AUTH: User 'admin' granted global view perm...</div>
              <div className="text-muted-foreground"><span className="text-primary">[14:20:12]</span> MONITOR: LeadGen Engine reported high load (45%)...</div>
              <div className="text-muted-foreground"><span className="text-emerald-500">[14:18:00]</span> HUB: Central Hub v2.0 deployed to production...</div>
              <div className="text-muted-foreground italic mt-4 opacity-50">-- Continuous stream restricted --</div>
            </div>
          </div>
        </section>

        {/* Intelligence Layer */}
        <CriticalAlerts />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
