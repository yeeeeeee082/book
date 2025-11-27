import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Leaf, BookOpen, TrendingUp, Recycle } from "lucide-react";

interface TransactionBook {
  id: string;
  title: string;
  author: string;
  price: number;
  imageUrl?: string;
  subject: string;
}

interface Transaction {
  id: string;
  bookId: string;
  buyerId: string;
  sellerId: string;
  status: string;
  message?: string;
  createdAt: string;
  book: TransactionBook | null;
  buyer: { id: string; username: string } | null;
  seller: { id: string; username: string } | null;
}

interface TransactionData {
  transactions: Transaction[];
  stats: {
    totalBooks: number;
    totalValue: number;
    carbonSaved: number;
  };
}

export default function Transactions() {
  const { data, isLoading } = useQuery<TransactionData>({
    queryKey: ["/api/transactions"],
  });

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = data?.stats || { totalBooks: 0, totalValue: 0, carbonSaved: 0 };
  const transactions = data?.transactions || [];

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">成交紀錄</h1>
          <p className="text-muted-foreground">
            每一本二手書的交易，都是對環境的一份貢獻
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-full">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-700 dark:text-green-300 font-medium">減少碳足跡</p>
                  <p className="text-3xl font-bold text-green-800 dark:text-green-200">
                    {stats.carbonSaved.toFixed(1)} kg
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400">CO₂ 排放量</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 rounded-full">
                  <Recycle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">成功交易</p>
                  <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">
                    {stats.totalBooks} 本
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">二手書籍</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500 rounded-full">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-700 dark:text-purple-300 font-medium">交易總額</p>
                  <p className="text-3xl font-bold text-purple-800 dark:text-purple-200">
                    NT$ {stats.totalValue.toLocaleString()}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400">節省金額</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6 bg-green-50/50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CardContent className="py-4">
            <div className="flex items-center gap-3">
              <Leaf className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-700 dark:text-green-300">
                <strong>環保小知識：</strong>每本二手書交易平均可減少約 2.5 公斤的碳排放，
                相當於種植一棵樹一年的碳吸收量。透過二手書交易，我們一起為地球盡一份心力！
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              最近成交
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                  <BookOpen className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">目前還沒有成交紀錄</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {transaction.book?.imageUrl ? (
                        <img
                          src={transaction.book.imageUrl}
                          alt={transaction.book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">
                        {transaction.book?.title || "已刪除的書籍"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {transaction.book?.author}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {transaction.book?.subject}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {transaction.seller?.username} → {transaction.buyer?.username}
                        </span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-primary">
                        NT$ {transaction.book?.price.toLocaleString()}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                        <Leaf className="w-3 h-3" />
                        <span>-2.5 kg CO₂</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
