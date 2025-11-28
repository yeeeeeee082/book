// Real OpenAI integration for book marketplace assistant
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateAIChatResponse(
  bookInfo: {
    title: string;
    author: string;
    price: number;
    condition: string;
  },
  sellerInfo: {
    username: string;
    school?: string;
  },
  userMessage: string
): Promise<string> {
  try {
    const systemPrompt = `你是一個友善的大學二手書交易平台購書助手。根據書籍和賣家資訊，用繁體中文提供實用建議。
    
書籍資訊：
- 書名：${bookInfo.title}
- 作者：${bookInfo.author}
- 價格：NT$ ${bookInfo.price}
- 書況：${bookInfo.condition}

賣家資訊：
- 用戶名：${sellerInfo.username}
- 學校：${sellerInfo.school || "未提供"}

請根據使用者的提問，提供關於購書的專業建議。回應應該簡潔、實用且鼓勵交易。`;

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userMessage,
        },
      ],
      max_completion_tokens: 500,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No content in response");
    }

    return content;
  } catch (error: any) {
    console.error("AI Service Error:", error);
    if (error.message?.includes("API")) {
      throw new Error("AI 服務暫時無法使用，請稍後再試");
    }
    throw new Error("AI 回應出錯，請稍後再試");
  }
}

export async function generateSuggestionForBookSearch(
  searchQuery: string,
  availableBooks: Array<{ title: string; author: string }>
): Promise<string> {
  try {
    if (availableBooks.length === 0) {
      return "";
    }

    // Simple keyword matching for suggestions
    const bookTitles = availableBooks.map((b) => b.title);
    const matching = bookTitles.filter((title) =>
      title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (matching.length > 0) {
      return `找到相關書籍：${matching[0]}`;
    }

    return `我們有 ${bookTitles.length} 本書籍。試試看 ${bookTitles[0]}？`;
  } catch (error) {
    console.error("AI Suggestion Error:", error);
    return "";
  }
}
