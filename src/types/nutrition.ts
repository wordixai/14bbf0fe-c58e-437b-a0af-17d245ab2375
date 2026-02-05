export interface NutritionInfo {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  serving: string;
}

export interface FoodAnalysis {
  foods: NutritionInfo[];
  totalCalories: number;
  confidence: number;
  suggestions?: string[];
}

export interface AnalysisHistory {
  id: string;
  imageUrl: string;
  analysis: FoodAnalysis;
  timestamp: Date;
}
