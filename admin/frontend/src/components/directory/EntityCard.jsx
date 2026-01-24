import { Building, Cpu, Leaf, TrendingUp, Heart, Zap } from "lucide-react";


export function EntityCard({ name, subtitle, icon: Icon, iconBgColor = "bg-secondary" }) {
  return (
    <div className="entity-card">
      <div className={`entity-icon ${iconBgColor}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-medium text-foreground">{name}</h4>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
