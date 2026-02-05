import { useState, useCallback } from "react";
import { Salad, History, Sparkles } from "lucide-react";
import { ImageUploader } from "@/components/ImageUploader";
import { NutritionResult } from "@/components/NutritionResult";
import { AnalysisHistory } from "@/components/AnalysisHistory";
import { analyzeFood } from "@/lib/ai";
import type { FoodAnalysis, AnalysisHistory as HistoryType } from "@/types/nutrition";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FoodAnalysis | null>(null);
  const [history, setHistory] = useState<HistoryType[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleImageSelect = useCallback((file: File, preview: string) => {
    setCurrentImage(preview);
    setCurrentFile(file);
    setAnalysis(null);
  }, []);

  const handleClear = useCallback(() => {
    if (currentImage) {
      URL.revokeObjectURL(currentImage);
    }
    setCurrentImage(null);
    setCurrentFile(null);
    setAnalysis(null);
  }, [currentImage]);

  const handleAnalyze = useCallback(async () => {
    if (!currentFile || !currentImage) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeFood(currentFile);
      setAnalysis(result);

      // Add to history
      const historyItem: HistoryType = {
        id: Date.now().toString(),
        imageUrl: currentImage,
        analysis: result,
        timestamp: new Date(),
      };
      setHistory((prev) => [historyItem, ...prev].slice(0, 10));

      toast.success("分析完成", {
        description: `识别到 ${result.foods.length} 种食物，共 ${result.totalCalories} 卡路里`,
      });
    } catch {
      toast.error("分析失败", {
        description: "请检查图片是否清晰，然后重试",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [currentFile, currentImage]);

  const handleHistorySelect = useCallback((item: HistoryType) => {
    setCurrentImage(item.imageUrl);
    setAnalysis(item.analysis);
    setShowHistory(false);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-elegant">
                <Salad className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">卡路里分析</h1>
                <p className="text-xs text-muted-foreground">AI 智能识别</p>
              </div>
            </div>
            {history.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHistory(!showHistory)}
                className="relative"
              >
                <History className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                  {history.length}
                </span>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container max-w-2xl mx-auto px-4 py-6 pb-24">
        {showHistory ? (
          <AnalysisHistory
            history={history}
            onSelect={handleHistorySelect}
            onClose={() => setShowHistory(false)}
          />
        ) : (
          <div className="space-y-6">
            {/* Upload Section */}
            <section>
              <ImageUploader
                onImageSelect={handleImageSelect}
                isAnalyzing={isAnalyzing}
                currentImage={currentImage}
                onClear={handleClear}
              />
            </section>

            {/* Analyze Button */}
            {currentImage && !analysis && !isAnalyzing && (
              <Button
                onClick={handleAnalyze}
                className="w-full h-14 text-lg font-semibold bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-elegant animate-scale-in"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                开始分析
              </Button>
            )}

            {/* Results Section */}
            {analysis && <NutritionResult analysis={analysis} />}

            {/* Empty State */}
            {!currentImage && !showHistory && (
              <div className="text-center py-12 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>上传食物图片，AI 自动识别营养成分</span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
