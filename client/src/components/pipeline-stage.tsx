import { Lead } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { LeadCard } from "./lead-card";

interface PipelineStageProps {
  title: string;
  count: number;
  leads: Lead[];
  badgeVariant: "default" | "secondary" | "destructive" | "outline";
  onLeadClick: (lead: Lead) => void;
}

export function PipelineStage({ title, count, leads, badgeVariant, onLeadClick }: PipelineStageProps) {
  return (
    <div className="bg-background rounded-lg p-4 min-h-[300px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-foreground">{title}</h3>
        <Badge variant={badgeVariant} data-testid={`stage-count-${title.toLowerCase()}`}>
          {count}
        </Badge>
      </div>
      <div className="space-y-3">
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onClick={() => onLeadClick(lead)}
          />
        ))}
      </div>
    </div>
  );
}
