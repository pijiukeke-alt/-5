"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IPItem } from "@/types";
import { RISK_COLORS } from "@/config";
import { calculateCompositeScore } from "@/lib/scoring";
import { formatNumber } from "@/lib/transform";

interface IPCardProps {
  ip: IPItem;
}

export function IPCard({ ip }: IPCardProps) {
  const score = calculateCompositeScore(ip);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary text-lg">
              {ip.name.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-base truncate">{ip.name}</h3>
              <Badge variant="secondary" className="text-xs">
                {ip.category}
              </Badge>
            </div>
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <span>热度 {ip.heatScore}</span>
              <span>粉丝 {formatNumber(ip.followerCount)}</span>
              <span>评分 {score}</span>
            </div>
            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
              {ip.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                  {tag}
                </Badge>
              ))}
              <span
                className="ml-auto text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: RISK_COLORS[ip.riskLevel] + "20",
                  color: RISK_COLORS[ip.riskLevel],
                }}
              >
                {ip.riskLevel === "low" ? "低风险" : ip.riskLevel === "medium" ? "中风险" : "高风险"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
