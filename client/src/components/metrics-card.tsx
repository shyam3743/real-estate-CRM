import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  className?: string;
}

export function MetricsCard({
  title,
  value,
  subtitle,
  change,
  changeType = "neutral",
  icon: Icon,
  iconColor,
  iconBgColor,
  className,
}: MetricsCardProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={cn("p-3 rounded-lg mr-4", iconBgColor)}>
            <Icon className={cn("w-6 h-6", iconColor)} />
          </div>
          <div>
            <p className={cn("text-3xl font-bold", iconColor)} data-testid={`metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
              {value}
            </p>
            <p className="text-sm text-muted-foreground">{title}</p>
            {change && (
              <p className={cn(
                "text-xs font-medium",
                changeType === "positive" ? "text-green-600" :
                changeType === "negative" ? "text-red-600" : "text-muted-foreground"
              )}>
                {change}
              </p>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
