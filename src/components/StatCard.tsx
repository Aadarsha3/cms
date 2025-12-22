import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  testId?: string;
}

export function StatCard({ title, value, icon: Icon, trend, testId }: StatCardProps) {
  return (
    <Card data-testid={testId}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm text-muted-foreground">{title}</span>
            <span className="text-2xl font-semibold">{value}</span>
            {trend && (
              <span
                className={`text-xs ${
                  trend.value >= 0 ? "text-chart-4" : "text-destructive"
                }`}
              >
                {trend.value >= 0 ? "+" : ""}
                {trend.value}% {trend.label}
              </span>
            )}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
