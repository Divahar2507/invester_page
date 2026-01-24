import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { SearchInput } from "@/components/directory/SearchInput";
import { EntityCard } from "@/components/directory/EntityCard";
import { Building, Cpu, Leaf, TrendingUp, Heart, Zap, Landmark, Users, Globe, Briefcase, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/services/api";

const getIconForIndustry = (industry, isInvestor = false) => {
  if (isInvestor) {
    switch (industry) {
      case "VC": return Landmark;
      case "Angel": return Users;
      case "PE": return Globe;
      case "CVC": return Briefcase;
      case "Impact": return Target;
      default: return Users;
    }
  }
  switch (industry) {
    case "Tech": return Cpu;
    case "AI": return Building;
    case "Energy": return Leaf;
    case "Finance": return TrendingUp;
    case "Health": return Heart;
    default: return Building;
  }
};

const getColorForIndustry = (industry) => {
  // Simple rotation or logic based on string chars could work, sticking to random-like assignment for now
  const colors = ["bg-primary/20", "bg-secondary", "bg-success/20", "bg-warning/20"];
  return colors[industry.length % colors.length];
};

const Directory = () => {
  const [startupSearch, setStartupSearch] = useState("");
  const [investorSearch, setInvestorSearch] = useState("");

  const { data: startups = [], isLoading: loadingStartups } = useQuery({
    queryKey: ['startups'],
    queryFn: api.getStartups
  });

  const { data: investors = [], isLoading: loadingInvestors } = useQuery({
    queryKey: ['investors'],
    queryFn: api.getInvestors
  });

  const filteredStartups = startups.filter(s =>
    s.name.toLowerCase().includes(startupSearch.toLowerCase())
  );

  const filteredInvestors = investors.filter(i =>
    i.name.toLowerCase().includes(investorSearch.toLowerCase())
  );

  return (
    <DashboardLayout title="Directory">
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground mb-2">Business Development | Ecosystem</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          {/* Startups Section */}
          <section>
            <div className="mb-6">
              <SearchInput
                placeholder="Search Startups"
                value={startupSearch}
                onChange={setStartupSearch}
              />
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-4">Startups</h3>
            <div className="space-y-2">
              {loadingStartups ? (
                <p>Loading startups...</p>
              ) : (
                filteredStartups.map((startup) => (
                  <EntityCard
                    key={startup.id}
                    name={startup.name}
                    subtitle={startup.subtitle}
                    icon={getIconForIndustry(startup.industry)}
                    iconBgColor={getColorForIndustry(startup.industry)}
                  />
                ))
              )}
            </div>
          </section>

          {/* Investors Section */}
          <section>
            <div className="mb-6">
              <SearchInput
                placeholder="Search Investors"
                value={investorSearch}
                onChange={setInvestorSearch}
              />
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-4">Investors</h3>
            <div className="space-y-2">
              {loadingInvestors ? (
                <p>Loading investors...</p>
              ) : (
                filteredInvestors.map((investor) => (
                  <EntityCard
                    key={investor.id}
                    name={investor.name}
                    subtitle={investor.subtitle}
                    icon={getIconForIndustry(investor.type, true)}
                    iconBgColor={getColorForIndustry(investor.type)}
                  />
                ))
              )}
            </div>
          </section>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            Relationship Map
          </Button>
          <Button variant="outline" className="border-border text-foreground hover:bg-secondary">
            Premium Access
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Directory;

