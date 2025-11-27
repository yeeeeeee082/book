import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, History, Trash2, Clock } from "lucide-react";
import type { Book, User as UserType } from "@shared/schema";

interface BookWithSeller extends Book {
  seller?: UserType | null;
}

const HISTORY_KEY = "book-browsing-history";
const MAX_HISTORY = 20;

export function addToHistory(bookId: string) {
  const history = getHistory();
  const filtered = history.filter((id) => id !== bookId);
  filtered.unshift(bookId);
  const trimmed = filtered.slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
}

export function getHistory(): string[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

const conditionColors: Record<string, string> = {
  "全新": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "九成新": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "八成新": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  "七成新": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "六成新以下": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

export default function BrowsingHistory() {
  const [historyIds, setHistoryIds] = useState<string[]>([]);

  useEffect(() => {
    setHistoryIds(getHistory());
  }, []);

  const { data: allBooks } = useQuery<BookWithSeller[]>({
    queryKey: ["/api/books"],
  });

  const historyBooks = historyIds
    .map((id) => allBooks?.find((book) => book.id === id))
    .filter((book): book is BookWithSeller => book !== undefined);

  const handleClearHistory = () => {
    clearHistory();
    setHistoryIds([]);
  };

  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-TW", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <History className="w-8 h-8" />
              瀏覽紀錄
            </h1>
            <p className="text-muted-foreground mt-1">
              您最近瀏覽過的書籍
            </p>
          </div>
          {historyBooks.length > 0 && (
            <Button variant="outline" onClick={handleClearHistory} className="gap-2">
              <Trash2 className="w-4 h-4" />
              清除紀錄
            </Button>
          )}
        </div>

        {historyBooks.length === 0 ? (
          <Card>
            <CardContent className="py-16">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                  <Clock className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">還沒有瀏覽紀錄</h2>
                <p className="text-muted-foreground mb-6">
                  開始瀏覽書籍，您的紀錄會顯示在這裡
                </p>
                <Link href="/buyer">
                  <Button>開始瀏覽</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {historyBooks.map((book) => (
              <Link key={book.id} href={`/book/${book.id}`}>
                <Card className="h-full hover:shadow-lg cursor-pointer transition-all group overflow-hidden">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                      {book.imageUrl ? (
                        <img
                          src={book.imageUrl}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          loading="lazy"
                        />
                      ) : (
                        <BookOpen className="w-16 h-16 text-muted-foreground/50 group-hover:scale-105 transition-transform" />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-base line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                        {book.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                      <div className="flex items-center gap-2 flex-wrap mb-3">
                        <Badge variant="secondary" className="text-xs">
                          {book.subject}
                        </Badge>
                        <Badge className={`text-xs ${conditionColors[book.condition] || ""}`} variant="outline">
                          {book.condition}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          NT$ {book.price.toLocaleString()}
                        </span>
                        {book.status !== "available" && (
                          <Badge variant="destructive" className="text-xs">
                            已售出
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
