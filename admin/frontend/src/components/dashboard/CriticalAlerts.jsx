import { Shield, CheckCircle, AlertTriangle } from "lucide-react";

const alerts = [
  {
    id: "1",
    type: "warning",
    title: "Spam Alert",
    description: "Potential spam detected in user messages.",
  },
  {
    id: "2",
    type: "info",
    title: "Validation Required",
    description: "New startup applications pending validation.",
  },
];

export function CriticalAlerts() {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-foreground mb-4">Critical Alerts</h3>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-start gap-4 p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              alert.type === "warning" 
                ? "bg-warning/10 text-warning" 
                : "bg-primary/10 text-primary"
            }`}>
              {alert.type === "warning" ? (
                <Shield className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
            </div>
            <div>
              <h4 className="font-medium text-foreground">{alert.title}</h4>
              <p className="text-sm text-muted-foreground">{alert.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
