import networkFlowImage from "@/assets/network-flow.jpg";

export function NetworkFlow() {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-foreground mb-4">Network Flow</h3>
      <div className="rounded-xl overflow-hidden border border-border">
        <img 
          src={networkFlowImage} 
          alt="Network visualization showing connected nodes" 
          className="w-full h-80 object-cover"
        />
      </div>
    </div>
  );
}
