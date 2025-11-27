// Local AI service using rule-based responses for textbook marketplace
const bookResponses = {
  price: [
    "這個價格很實在，適合學生入手。",
    "價格還不錯，有興趣的話可以再跟賣家聊聊看。",
    "以目前市場行情來看，這個價位是合理的。",
    "考量書況與稀有程度，這價格算是划算的。",
    "如果覺得偏高，也可以嘗試議價看看喔！",
    "這價格比新書便宜很多，是不錯的選擇。",
    "看起來是個合理的起跳價，建議先詢問細節。",
    "有些賣家願意議價，可以試著談談看！",
  ],
  condition: [
    "書況良好的話，讀起來不會有太大影響。",
    "這本書若只有輕微使用痕跡，還是非常值得考慮的。",
    "你可以再問問賣家是否有畫記或破損，確保品質。",
    "如果書況接近全新，那就很值得入手了！",
    "建議詢問是否有缺頁或污損，以免影響使用。",
    "若是常用科目的書，有些折舊是可以接受的。",
    "翻舊一點沒關係，只要內容完整就很好用。",
    "賣家通常會如實說明書況，可以再請對方補圖。",
  ],
  shipping: [
    "建議先詢問賣家提供哪些寄送方式及運費細節。",
    "部分賣家會提供面交或超取，可以視情況討論。",
    "如果趕時間，可以請賣家提供最快的出貨方式。",
    "記得確認是否含運費，避免額外支出。",
    "若是同校，可以考慮面交省運費。",
    "有些賣家願意吸收運費，可以多問問。",
    "如果想寄到校內宿舍，也可以詢問是否方便。",
    "超商取貨是常見選項，也滿方便的喔！",
  ],
  contact: [
    "你可以透過平台留言聯絡賣家喔！",
    "建議先聊聊，確認書況與交易方式再下單。",
    "如果你對這本書有興趣，可以主動發訊息給賣家看看。",
    "多詢問幾句也好，有時候還能談到好價格。",
    "和賣家確認清楚內容與版本，才不會買錯書。",
    "可以先自我介紹一下，再進一步詢問書籍細節。",
    "問問賣家是否還有其他書也想出清，順便買一買。",
    "如果平台有聊天功能，直接私訊最快最方便！",
  ],
  payment: [
    "付款方式通常會由賣家決定，可以先詢問清楚。",
    "有些賣家接受轉帳、面交付現或行動支付。",
    "平台如果有第三方支付，會更有保障喔。",
    "建議在確認書況後再進行付款，以保障雙方權益。",
    "最好避免先匯款給不熟的對象，可請對方提供證明。",
  ],
  edition: [
    "可以詢問書籍是第幾版，是否為最新版本。",
    "不同版本的內容可能會有差異，建議確認清楚。",
    "舊版通常價格較便宜，仍可參考使用。",
    "若是指定教科書，建議確認老師要求哪一版。",
    "有時第幾版差不多，重點在是否附有重點或解答。",
  ],
  course: [
    "這本書常被用在經濟系／管理學等相關課程。",
    "你可以問問賣家是修哪一門課時用的，會更清楚。",
    "確認這本是否符合你所修的課程需求再購買。",
    "有些書雖然名稱相似，但內容可能不完全一致。",
    "如有疑問，也可以直接詢問老師或學長姐。",
  ],
};

function getRandomResponse(category: string[]): string {
  return category[Math.floor(Math.random() * category.length)];
}

function generateResponse(message: string, bookTitle: string): string {
  const lowerMessage = message.toLowerCase();

  // Detect intent and provide relevant response
  if (lowerMessage.includes("價") || lowerMessage.includes("价") || lowerMessage.includes("多少錢") || lowerMessage.includes("price")) {
    return `關於《${bookTitle}》：${getRandomResponse(bookResponses.price)}`;
  }

  if (lowerMessage.includes("狀況") || lowerMessage.includes("状况") || lowerMessage.includes("新舊") || lowerMessage.includes("condition")) {
    return `${getRandomResponse(bookResponses.condition)}`;
  }

  if (lowerMessage.includes("運") || lowerMessage.includes("运") || lowerMessage.includes("寄") || lowerMessage.includes("ship")) {
    return `${getRandomResponse(bookResponses.shipping)}`;
  }

  if (lowerMessage.includes("聯") || lowerMessage.includes("联") || lowerMessage.includes("問") || lowerMessage.includes("contact")) {
    return `${getRandomResponse(bookResponses.contact)}`;
  }

  if (lowerMessage.includes("付") || lowerMessage.includes("款") || lowerMessage.includes("pay")) {
    return `${getRandomResponse(bookResponses.payment)}`;
  }

  if (lowerMessage.includes("版") || lowerMessage.includes("edition")) {
    return `${getRandomResponse(bookResponses.edition)}`;
  }

  if (lowerMessage.includes("課") || lowerMessage.includes("课") || lowerMessage.includes("course")) {
    return `${getRandomResponse(bookResponses.course)}`;
  }

  // Default responses
  const defaultResponses = [
    `《${bookTitle}》是一本很受歡迎的教科書。有什麼其他問題我可以幫忙嗎？`,
    `這是關於${bookTitle}的詢問。建議你直接聯繫賣家詢問詳細信息。`,
    `我了解你對這本書感興趣。如有需要，可以通過平台聯繫賣家。`,
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

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
    // Generate a smart response based on the message content and book info
    const response = generateResponse(userMessage, bookInfo.title);
    return response;
  } catch (error: any) {
    console.error("AI Service Error:", error);
    throw new Error("AI 本地服務運行出錯");
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
