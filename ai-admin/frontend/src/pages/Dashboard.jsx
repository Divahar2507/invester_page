import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { NetworkFlow } from "@/components/dashboard/NetworkFlow";
import { CriticalAlerts } from "@/components/dashboard/CriticalAlerts";
import { Rocket, DollarSign, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

const Dashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: api.getDashboardStats
  });

  return (
    <DashboardLayout title="Business Development">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard</h1>

        {/* System Pulse Stats */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">System Pulse</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="Total Startups"
              value={isLoading ? "..." : stats?.totalStartups}
              icon={Rocket}
            />
            <StatCard
              title="Investor Capital"
              value={isLoading ? "..." : stats?.investorCapital}
              icon={DollarSign}
            />
            <StatCard
              title="Live Events"
              value={isLoading ? "..." : stats?.liveEvents}
              icon={Calendar}
            />
          </div>
        </section>

        {/* Network Flow Visualization */}
        <NetworkFlow />

        {/* Critical Alerts */}
        <CriticalAlerts />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;

