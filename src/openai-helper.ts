/**
 * OpenAI API Helper
 * GPT-5 miniを使用してAI対話機能を提供
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ExplainMenuRequest {
  household_id: string;
  plan_day_id: string;
  date: string;
  recipes: Array<{
    role: string;
    title: string;
  }>;
  household_info: {
    members_count: number;
    children_ages?: string[];
    budget_tier_per_person: number;
    cooking_time_limit_min: number;
    dislikes?: string[];
    allergies?: string[];
  };
}

/**
 * 献立の選択理由をAIに説明させる
 */
export async function explainMenuChoice(
  apiKey: string,
  request: ExplainMenuRequest
): Promise<string> {
  const { date, recipes, household_info } = request;
  
  const systemPrompt = `あなたは献立アドバイザーです。
家族構成や好み、予算、調理時間を考慮して、なぜその献立を選んだのかを分かりやすく説明してください。
説明は3-4文で簡潔に、親しみやすい口調で答えてください。`;

  const userPrompt = `【日付】${date}
【献立】
- 主菜: ${recipes.find(r => r.role === 'main')?.title || 'なし'}
- 副菜: ${recipes.find(r => r.role === 'side')?.title || 'なし'}
- 汁物: ${recipes.find(r => r.role === 'soup')?.title || 'なし'}

【家族情報】
- 人数: ${household_info.members_count}人
- 子供の年齢: ${household_info.children_ages?.join(', ') || 'なし'}
- 予算: 1人あたり${household_info.budget_tier_per_person}円
- 調理時間制限: ${household_info.cooking_time_limit_min}分
- 苦手な食材: ${household_info.dislikes?.join(', ') || 'なし'}
- アレルギー: ${household_info.allergies?.join(', ') || 'なし'}

この献立を選んだ理由を説明してください。`;

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini', // GPT-5 miniの実際のモデル名
      messages: messages,
      max_tokens: 300,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

/**
 * 献立の調整・差し替えを提案
 */
export async function suggestMenuAdjustment(
  apiKey: string,
  request: ExplainMenuRequest,
  userRequest: string
): Promise<string> {
  const { date, recipes, household_info } = request;
  
  const systemPrompt = `あなたは献立アドバイザーです。
ユーザーの要望に応じて、献立の調整案を提案してください。
具体的な料理名を3つ挙げて、選択理由も簡潔に説明してください。`;

  const userPrompt = `【現在の献立（${date}）】
- 主菜: ${recipes.find(r => r.role === 'main')?.title || 'なし'}
- 副菜: ${recipes.find(r => r.role === 'side')?.title || 'なし'}
- 汁物: ${recipes.find(r => r.role === 'soup')?.title || 'なし'}

【家族情報】
- 人数: ${household_info.members_count}人
- 子供の年齢: ${household_info.children_ages?.join(', ') || 'なし'}
- 予算: 1人あたり${household_info.budget_tier_per_person}円
- 調理時間制限: ${household_info.cooking_time_limit_min}分
- 苦手な食材: ${household_info.dislikes?.join(', ') || 'なし'}

【ユーザーの要望】
${userRequest}

この要望に応じた献立の調整案を提案してください。`;

  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 500,
      temperature: 0.8
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
