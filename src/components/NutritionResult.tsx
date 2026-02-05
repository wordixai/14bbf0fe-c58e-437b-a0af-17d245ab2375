import { Flame, Beef, Wheat, Droplet, Cookie, Leaf } from "lucide-react";
import type { FoodAnalysis, NutritionInfo } from "@/types/nutrition";
import { Progress } from "@/components/ui/progress";

interface NutritionResultProps {
  analysis: FoodAnalysis;
}

const NutrientIcon = {
  protein: Beef,
  carbs: Wheat,
  fat: Droplet,
  fiber: Leaf,
  sugar: Cookie,
};

const NutrientColor = {
  protein: "text-red-500",
  carbs: "text-amber-500",
  fat: "text-blue-500",
  fiber: "text-green-600",
  sugar: "text-pink-500",
};

const NutrientBg = {
  protein: "bg-red-100 dark:bg-red-900/30",
  carbs: "bg-amber-100 dark:bg-amber-900/30",
  fat: "bg-blue-100 dark:bg-blue-900/30",
  fiber: "bg-green-100 dark:bg-green-900/30",
  sugar: "bg-pink-100 dark:bg-pink-900/30",
};

function NutrientBadge({
  type,
  value,
  unit = "g",
}: {
  type: keyof typeof NutrientIcon;
  value: number;
  unit?: string;
}) {
  const Icon = NutrientIcon[type];
  const labels = {
    protein: "蛋白质",
    carbs: "碳水",
    fat: "脂肪",
    fiber: "膳食纤维",
    sugar: "糖分",
  };

  return (
    <div className={`stat-card flex items-center gap-3 ${NutrientBg[type]}`}>
      <div className={`p-2 rounded-lg ${NutrientBg[type]}`}>
        <Icon className={`w-5 h-5 ${NutrientColor[type]}`} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{labels[type]}</p>
        <p className="font-semibold text-foreground">
          {value.toFixed(1)} {unit}
        </p>
      </div>
    </div>
  );
}

function FoodCard({ food }: { food: NutritionInfo }) {
  return (
    <div className="glass-card p-5 animate-slide-up">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-lg text-foreground">{food.name}</h3>
          <p className="text-sm text-muted-foreground">{food.serving}</p>
        </div>
        <div className="flex items-center gap-2 bg-gradient-primary px-4 py-2 rounded-full shadow-elegant">
          <Flame className="w-5 h-5 text-primary-foreground" />
          <span className="font-bold text-primary-foreground">
            {food.calories} kcal
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <NutrientBadge type="protein" value={food.protein} />
        <NutrientBadge type="carbs" value={food.carbs} />
        <NutrientBadge type="fat" value={food.fat} />
        <NutrientBadge type="fiber" value={food.fiber} />
        <NutrientBadge type="sugar" value={food.sugar} />
      </div>
    </div>
  );
}

export function NutritionResult({ analysis }: NutritionResultProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Total Calories Summary */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">总卡路里</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">AI 置信度</span>
            <span className="text-sm font-medium text-primary">
              {(analysis.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="flex items-end gap-2 mb-3">
          <span className="text-5xl font-bold text-gradient">
            {analysis.totalCalories}
          </span>
          <span className="text-xl text-muted-foreground pb-1">kcal</span>
        </div>

        <Progress value={analysis.confidence * 100} className="h-2" />
      </div>

      {/* Food Items */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground px-1">
          识别到的食物 ({analysis.foods.length})
        </h2>
        {analysis.foods.map((food, index) => (
          <FoodCard key={index} food={food} />
        ))}
      </div>

      {/* Suggestions */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <div className="glass-card p-5">
          <h3 className="font-semibold text-foreground mb-3">营养建议</h3>
          <ul className="space-y-2">
            {analysis.suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
