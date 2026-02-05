import type { FoodAnalysis } from "@/types/nutrition";

const AI_API_URL = "https://api.openai.com/v1/chat/completions";

export async function analyzeFood(file: File): Promise<FoodAnalysis> {
  // Convert file to base64
  const base64 = await fileToBase64(file);

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    // Return mock data for demo
    return getMockAnalysis();
  }

  const response = await fetch(AI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `你是一个专业的营养分析师。分析用户上传的食物图片，识别其中的食物并估算营养成分。
请以JSON格式返回分析结果，格式如下：
{
  "foods": [
    {
      "name": "食物名称（中文）",
      "calories": 卡路里数值,
      "protein": 蛋白质克数,
      "carbs": 碳水化合物克数,
      "fat": 脂肪克数,
      "fiber": 膳食纤维克数,
      "sugar": 糖分克数,
      "serving": "份量描述（如：1碗、100克）"
    }
  ],
  "totalCalories": 总卡路里,
  "confidence": 置信度(0-1),
  "suggestions": ["营养建议1", "营养建议2"]
}
只返回JSON，不要其他内容。`,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "请分析这张食物图片中的营养成分",
            },
            {
              type: "image_url",
              image_url: {
                url: base64,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error("AI分析请求失败");
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error("AI返回内容为空");
  }

  // Parse JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("无法解析AI返回的JSON");
  }

  return JSON.parse(jsonMatch[0]) as FoodAnalysis;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function getMockAnalysis(): FoodAnalysis {
  return {
    foods: [
      {
        name: "米饭",
        calories: 230,
        protein: 4.3,
        carbs: 50.2,
        fat: 0.4,
        fiber: 0.6,
        sugar: 0.1,
        serving: "1碗 (约200g)",
      },
      {
        name: "红烧肉",
        calories: 380,
        protein: 15.2,
        carbs: 8.5,
        fat: 32.1,
        fiber: 0.3,
        sugar: 5.2,
        serving: "约150g",
      },
      {
        name: "炒青菜",
        calories: 65,
        protein: 2.8,
        carbs: 4.2,
        fat: 4.5,
        fiber: 2.1,
        sugar: 1.8,
        serving: "约100g",
      },
    ],
    totalCalories: 675,
    confidence: 0.87,
    suggestions: [
      "这顿饭蛋白质摄入适中，但脂肪含量较高",
      "建议增加蔬菜摄入量以获得更多膳食纤维",
      "如果是减脂期，可以适当减少红烧肉的份量",
    ],
  };
}
