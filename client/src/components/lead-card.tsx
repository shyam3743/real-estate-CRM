import { Lead } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

export function LeadCard({ lead, onClick }: LeadCardProps) {
  const formatCurrency = (amount: string | number | null) => {
    if (!amount) return "Budget not specified";
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (num >= 10000000) {
      return `₹${(num / 10000000).toFixed(1)}Cr`;
    } else if (num >= 100000) {
      return `₹${(num / 100000).toFixed(1)}L`;
    } else {
      return `₹${num.toLocaleString()}`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "contacted": return "bg-yellow-100 text-yellow-800";
      case "site_visit": return "bg-purple-100 text-purple-800";
      case "negotiation": return "bg-orange-100 text-orange-800";
      case "booking": return "bg-green-100 text-green-800";
      case "sold": return "bg-emerald-100 text-emerald-800";
      case "lost": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const timeAgo = (date: Date | string | null) => {
    if (!date) return "No contact yet";
    const now = new Date();
    const past = new Date(date);
    const diffInMs = now.getTime() - past.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) {
      return `${diffInDays}d ago`;
    } else if (diffInHours > 0) {
      return `${diffInHours}h ago`;
    } else {
      return "Recently";
    }
  };

  return (
    <Card 
      className="hover:shadow-md transition-shadow cursor-pointer" 
      onClick={onClick}
      data-testid={`lead-card-${lead.id}`}
    >
      <CardContent className="p-3">
        <h4 className="font-medium text-foreground text-sm">
          {lead.firstName} {lead.lastName}
        </h4>
        <p className="text-xs text-muted-foreground">
          {lead.requirements || "No specific requirements"}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatCurrency(lead.budget)}
        </p>
        <div className="flex items-center justify-between mt-2">
          <Badge className={getStatusColor(lead.status || "new")}>
            {formatStatus(lead.status || "new")}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {timeAgo(lead.lastContactedAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
