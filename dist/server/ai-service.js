// Real OpenAI and Google Gemini integration for book marketplace assistant
// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
// the newest Gemini model is "gemini-2.5-flash"
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const gemini = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GEMINI_API_KEY,
});
// Fallback local responses for when API is unavailable
const localResponses = {
    price: [
        "這個價格很實在，適合學生入手。",
        "價格還不錯，有興趣的話可以再跟賣家聊聊看。",
        "以目前市場行情來看，這個價位是合理的。",
    ],
    condition: [
        "書況良好的話，讀起來不會有太大影響。",
        "這本書若只有輕微使用痕跡，還是非常值得考慮的。",
        "你可以再問問賣家是否有畫記或破損，確保品質。",
    ],
    shipping: [
        "建議先詢問賣家提供哪些寄送方式及運費細節。",
        "部分賣家會提供面交或超取，可以視情況討論。",
        "如果趕時間，可以請賣家提供最快的出貨方式。",
    ],
    contact: [
        "你可以透過平台留言聯絡賣家喔！",
        "建議先聊聊，確認書況與交易方式再下單。",
        "如果你對這本書有興趣，可以主動發訊息給賣家看看。",
    ],
};
function getRandomLocalResponse(category) {
    return category[Math.floor(Math.random() * category.length)];
}
function generateLocalResponse(message, bookTitle) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("價") || lowerMessage.includes("价") || lowerMessage.includes("多少錢")) {
        return `關於《${bookTitle}》：${getRandomLocalResponse(localResponses.price)}`;
    }
    if (lowerMessage.includes("狀況") || lowerMessage.includes("状况") || lowerMessage.includes("新舊")) {
        return `${getRandomLocalResponse(localResponses.condition)}`;
    }
    if (lowerMessage.includes("運") || lowerMessage.includes("运") || lowerMessage.includes("寄")) {
        return `${getRandomLocalResponse(localResponses.shipping)}`;
    }
    if (lowerMessage.includes("聯") || lowerMessage.includes("联") || lowerMessage.includes("問")) {
        return `${getRandomLocalResponse(localResponses.contact)}`;
    }
    return `這是很棒的書籍！建議你聯繫賣家詢問更多詳情。`;
}
export async function generateAIChatResponse(bookInfo, sellerInfo, userMessage) {
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
    // Try Gemini first (more reliable for this user)
    if (process.env.GOOGLE_GEMINI_API_KEY) {
        try {
            console.log("Trying Google Gemini API...");
            const response = await gemini.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                text: `${systemPrompt}\n\n使用者提問: ${userMessage}`,
                            },
                        ],
                    },
                ],
            });
            const content = response.text;
            if (content) {
                console.log("Successfully used Gemini API");
                return content;
            }
        }
        catch (error) {
            console.error("Gemini API Error:", error);
        }
    }
    // Fallback to OpenAI if Gemini fails
    if (process.env.OPENAI_API_KEY) {
        try {
            console.log("Trying OpenAI API...");
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
            if (content) {
                console.log("Successfully used OpenAI API");
                return content;
            }
        }
        catch (error) {
            console.error("OpenAI API Error:", error);
        }
    }
    // Final fallback to local rule-based AI
    console.log("Using local fallback AI");
    return generateLocalResponse(userMessage, bookInfo.title);
}
export async function generateSuggestionForBookSearch(searchQuery, availableBooks) {
    try {
        if (availableBooks.length === 0) {
            return "";
        }
        // Simple keyword matching for suggestions
        const bookTitles = availableBooks.map((b) => b.title);
        const matching = bookTitles.filter((title) => title.toLowerCase().includes(searchQuery.toLowerCase()));
        if (matching.length > 0) {
            return `找到相關書籍：${matching[0]}`;
        }
        return `我們有 ${bookTitles.length} 本書籍。試試看 ${bookTitles[0]}？`;
    }
    catch (error) {
        console.error("AI Suggestion Error:", error);
        return "";
    }
}
