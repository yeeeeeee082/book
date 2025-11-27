import { useState, useEffect } from "react";
import { useRoute, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ArrowLeft, BookOpen, Mail, Phone, School, MessageCircle, User, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { apiRequest } from "@/lib/queryClient";
import { AIChatAssistant } from "@/components/ai-chat-assistant";
import { addToHistory } from "@/pages/history";
import type { Book, User as UserType } from "@shared/schema";

interface ReviewWithBuyer {
  id: string;
  sellerId: string;
  buyerId: string;
  orderId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  buyer: { id: string; username: string } | null;
}

interface SellerReviewData {
  reviews: ReviewWithBuyer[];
  rating: { average: number; count: number };
}

interface BookWithSeller extends Book {
  seller?: UserType | null;
}

const conditionColors: Record<string, string> = {
  "全新": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "九成新": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "八成新": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  "七成新": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "六成新以下": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

export default function BookDetail() {
  const [, params] = useRoute("/book/:id");
  const bookId = params?.id;
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isContactOpen, setIsContactOpen] = useState(false);

  const { data: book, isLoading } = useQuery<BookWithSeller>({
    queryKey: ["/api/books", bookId],
    enabled: !!bookId,
  });

  const { data: allBooks } = useQuery<BookWithSeller[]>({
    queryKey: ["/api/books"],
  });

  const { data: sellerReviews } = useQuery<SellerReviewData>({
    queryKey: ["/api/reviews/seller", book?.sellerId],
    enabled: !!book?.sellerId,
  });

  useEffect(() => {
    if (bookId) {
      addToHistory(bookId);
    }
  }, [bookId]);

  const recommendedBooks = allBooks
    ?.filter(b => b.status === "available" && b.id !== bookId)
    .sort(() => Math.random() - 0.5)
    .slice(0, 4) || [];

  const requestMutation = useMutation({
    mutationFn: async (data: { bookId: string; message: string }) => {
      return await apiRequest("POST", "/api/orders", {
        bookId: data.bookId,
        buyerId: user?.id,
        sellerId: book?.sellerId,
        message: data.message,
        status: "pending",
      });
    },
    onSuccess: () => {
      toast({
        title: "請求已送出",
        description: "您的購買意向已通知賣家，請等待回覆",
      });
      setIsContactOpen(false);
      setMessage("");
    },
    onError: () => {
      toast({
        title: "送出失敗",
        description: "無法送出購買請求，請稍後再試",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)]">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">找不到此書籍</h2>
            <p className="text-muted-foreground mb-4">
              書籍可能已被下架或不存在
            </p>
            <Link href="/buyer">
              <Button>返回書籍列表</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwnBook = user?.id === book.sellerId;

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link href="/buyer">
          <Button variant="ghost" className="gap-2 mb-6" data-testid="button-back">
            <ArrowLeft className="w-4 h-4" />
            返回書籍列表
          </Button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
            {book.imageUrl ? (
              <img 
                src={book.imageUrl} 
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <BookOpen className="w-24 h-24 text-muted-foreground/50" />
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-start gap-2 flex-wrap mb-2">
                <Badge variant="secondary">{book.subject}</Badge>
                <Badge className={conditionColors[book.condition] || ""} variant="outline">
                  {book.condition}
                </Badge>
                {book.status !== "available" && (
                  <Badge variant="destructive">
                    {book.status === "sold" ? "已售出" : "已預訂"}
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2" data-testid="text-book-title">
                {book.title}
              </h1>
              <p className="text-lg text-muted-foreground" data-testid="text-book-author">
                {book.author}
              </p>
            </div>

            <div className="text-3xl font-bold text-primary" data-testid="text-book-price">
              NT$ {book.price.toLocaleString()}
            </div>

            {book.description && (
              <div>
                <h3 className="font-semibold mb-2">書籍描述</h3>
                <p className="text-muted-foreground whitespace-pre-wrap" data-testid="text-book-description">
                  {book.description}
                </p>
              </div>
            )}

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">賣家資訊</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {book.seller?.username?.charAt(0).toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium" data-testid="text-seller-name">
                      {book.seller?.username || "匿名賣家"}
                    </p>
                    {book.seller?.school && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <School className="w-3 h-3" />
                        {book.seller.school}
                      </p>
                    )}
                  </div>
                </div>

                {book.seller?.email && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Mail className="w-4 h-4" />
                    <span data-testid="text-seller-email">{book.seller.email}</span>
                  </div>
                )}
                {book.seller?.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span data-testid="text-seller-phone">{book.seller.phone}</span>
                  </div>
                )}

                {sellerReviews && sellerReviews.rating.count > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.round(sellerReviews.rating.average)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{sellerReviews.rating.average}</span>
                      <span className="text-sm text-muted-foreground">
                        ({sellerReviews.rating.count} 則評價)
                      </span>
                    </div>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {sellerReviews.reviews.slice(0, 3).map((review) => (
                        <div key={review.id} className="text-sm p-2 bg-muted/50 rounded">
                          <div className="flex items-center gap-1 mb-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3 h-3 ${
                                  star <= review.rating
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                            <span className="text-xs text-muted-foreground ml-2">
                              {review.buyer?.username}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-muted-foreground">{review.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {book.status === "available" && !isOwnBook && (
              <>
                <AIChatAssistant book={book} seller={book.seller || null} />
                <Dialog open={isContactOpen} onOpenChange={setIsContactOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full gap-2" size="lg" data-testid="button-contact-seller">
                      <MessageCircle className="w-5 h-5" />
                      聯繫賣家
                    </Button>
                  </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>聯繫賣家</DialogTitle>
                    <DialogDescription>
                      發送訊息給賣家表達您的購買意向
                    </DialogDescription>
                  </DialogHeader>
                  {isAuthenticated ? (
                    <>
                      <div className="space-y-4 py-4">
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <BookOpen className="w-8 h-8 text-muted-foreground" />
                          <div>
                            <p className="font-medium line-clamp-1">{book.title}</p>
                            <p className="text-sm text-muted-foreground">
                              NT$ {book.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <Textarea
                          placeholder="輸入您想對賣家說的話..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="min-h-[120px]"
                          data-testid="textarea-message"
                        />
                        {!message.trim() && (
                          <p className="text-xs text-muted-foreground mt-1">請輸入訊息以送出請求</p>
                        )}
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={() => requestMutation.mutate({ bookId: book.id, message })}
                          disabled={requestMutation.isPending || !message.trim()}
                          data-testid="button-send-request"
                        >
                          {requestMutation.isPending ? "送出中..." : "送出請求"}
                        </Button>
                      </DialogFooter>
                    </>
                  ) : (
                    <div className="py-6 text-center">
                      <div className="w-12 h-12 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                        <User className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground mb-4">
                        請先登入以聯繫賣家
                      </p>
                      <Link href="/auth">
                        <Button data-testid="button-login-to-contact">前往登入</Button>
                      </Link>
                    </div>
                  )}
                </DialogContent>
                </Dialog>
              </>
            )}

            {isOwnBook && (
              <Link href="/seller">
                <Button variant="outline" className="w-full gap-2" size="lg">
                  這是您的書籍，前往管理
                </Button>
              </Link>
            )}
          </div>
        </div>

        {recommendedBooks.length > 0 && (
          <div className="mt-16 pt-8 border-t">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-bold">你可能也會喜歡</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommendedBooks.map((rec) => (
                <Link key={rec.id} href={`/book/${rec.id}`}>
                  <Card 
                    className="h-full hover-elevate cursor-pointer transition-all group overflow-visible"
                    data-testid={`card-recommended-${rec.id}`}
                  >
                    <CardContent className="p-0">
                      <div className="aspect-square bg-muted flex items-center justify-center rounded-t-md overflow-hidden">
                        {rec.imageUrl ? (
                          <img 
                            src={rec.imageUrl} 
                            alt={rec.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                        ) : (
                          <BookOpen className="w-16 h-16 text-muted-foreground/50 group-hover:scale-105 transition-transform" />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-base line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                          {rec.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">{rec.author}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {rec.subject}
                          </Badge>
                          <Badge className={`text-xs ${conditionColors[rec.condition] || ""}`} variant="outline">
                            {rec.condition}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardContent className="p-4 pt-0">
                      <span className="text-xl font-bold text-primary">
                        NT$ {rec.price.toLocaleString()}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
