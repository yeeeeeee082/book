import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User } from "lucide-react";
import type { Book, User as UserType } from "@shared/schema";

interface BookCardProps {
  book: Book;
  seller?: UserType | null;
  showSellerInfo?: boolean;
}

const conditionColors: Record<string, string> = {
  "全新": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  "九成新": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  "八成新": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  "七成新": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  "六成新以下": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

export function BookCard({ book, seller, showSellerInfo = true }: BookCardProps) {
  return (
    <Link href={`/book/${book.id}`}>
      <Card 
        className="h-full hover-elevate cursor-pointer transition-all group overflow-visible"
        data-testid={`card-book-${book.id}`}
      >
        <CardContent className="p-0">
          <div className="aspect-square bg-muted flex items-center justify-center rounded-t-md overflow-hidden">
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
            <h3 className="font-semibold text-base line-clamp-2 mb-1 group-hover:text-primary transition-colors" data-testid={`text-book-title-${book.id}`}>
              {book.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs">
                {book.subject}
              </Badge>
              <Badge className={`text-xs ${conditionColors[book.condition] || ""}`} variant="outline">
                {book.condition}
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center gap-2">
          <span className="text-xl font-bold text-primary" data-testid={`text-book-price-${book.id}`}>
            NT$ {book.price.toLocaleString()}
          </span>
          {showSellerInfo && seller && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <User className="w-3 h-3" />
              <span>{seller.username}</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
