import { Trash2, Clock, ChevronRight, ArrowLeft } from "lucide-react";
import type { AnalysisHistory as HistoryType } from "@/types/nutrition";
import { Button } from "@/components/ui/button";

interface AnalysisHistoryProps {
  history: HistoryType[];
  onSelect: (item: HistoryType) => void;
  onClose: () => void;
}

export function AnalysisHistory({
  history,
  onSelect,
  onClose,
}: AnalysisHistoryProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return "刚刚";
    if (minutes < 60) return `${minutes} 分钟前`;
    if (hours < 24) return `${hours} 小时前`;
    return date.toLocaleDateString("zh-CN");
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onClose}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h2 className="text-xl font-bold text-foreground">分析历史</h2>
        </div>
        <span className="text-sm text-muted-foreground">
          {history.length} 条记录
        </span>
      </div>

      <div className="space-y-3">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="w-full glass-card p-4 flex items-center gap-4 hover:shadow-elegant transition-shadow text-left"
          >
            <img
              src={item.imageUrl}
              alt="Food"
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">
                {item.analysis.foods.map((f) => f.name).join(", ")}
              </p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm font-medium text-primary">
                  {item.analysis.totalCalories} kcal
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {formatTime(item.timestamp)}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
