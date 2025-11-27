import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, BookOpen, X, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { BookCard } from "@/components/book-card";
import { bookSubjects, bookConditions } from "@shared/schema";
import type { Book, User } from "@shared/schema";

interface BookWithSeller extends Book {
  seller?: User | null;
}

export default function Buyer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [priceRange, setPriceRange] = useState<string>("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: books, isLoading } = useQuery<BookWithSeller[]>({
    queryKey: ["/api/books"],
  });

  const filteredBooks = books?.filter((book) => {
    if (book.status !== "available") return false;
    
    const matchesSearch =
      !searchQuery ||
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubject = !selectedSubject || book.subject === selectedSubject;
    const matchesCondition = !selectedCondition || book.condition === selectedCondition;

    let matchesPrice = true;
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number);
      if (max) {
        matchesPrice = book.price >= min && book.price <= max;
      } else {
        matchesPrice = book.price >= min;
      }
    }

    return matchesSearch && matchesSubject && matchesCondition && matchesPrice;
  });

  const activeFiltersCount = [selectedSubject, selectedCondition, priceRange].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedSubject("");
    setSelectedCondition("");
    setPriceRange("");
    setSearchQuery("");
  };

  // Get recommended books (always show some recommendations)
  const recommendedBooks = books
    ?.filter(b => b.status === "available")
    .sort(() => Math.random() - 0.5)
    .slice(0, 4) || [];

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium mb-2 block">科目類別</label>
        <Select value={selectedSubject} onValueChange={setSelectedSubject}>
          <SelectTrigger data-testid="select-subject">
            <SelectValue placeholder="選擇科目" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部科目</SelectItem>
            {bookSubjects.map((subject) => (
              <SelectItem key={subject} value={subject}>
                {subject}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">書籍狀況</label>
        <Select value={selectedCondition} onValueChange={setSelectedCondition}>
          <SelectTrigger data-testid="select-condition">
            <SelectValue placeholder="選擇狀況" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部狀況</SelectItem>
            {bookConditions.map((condition) => (
              <SelectItem key={condition} value={condition}>
                {condition}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">價格範圍</label>
        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger data-testid="select-price">
            <SelectValue placeholder="選擇價格" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部價格</SelectItem>
            <SelectItem value="0-100">NT$ 100 以下</SelectItem>
            <SelectItem value="100-300">NT$ 100 - 300</SelectItem>
            <SelectItem value="300-500">NT$ 300 - 500</SelectItem>
            <SelectItem value="500-1000">NT$ 500 - 1,000</SelectItem>
            <SelectItem value="1000-">NT$ 1,000 以上</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {activeFiltersCount > 0 && (
        <Button variant="outline" onClick={clearFilters} className="w-full" data-testid="button-clear-filters">
          <X className="w-4 h-4 mr-2" />
          清除篩選條件
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2" data-testid="text-buyer-title">瀏覽書籍</h1>
          <p className="text-muted-foreground">找到您需要的二手教科書</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="搜尋書名、作者或科目..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>

          <div className="hidden md:flex gap-2">
            <Select value={selectedSubject} onValueChange={(v) => setSelectedSubject(v === "all" ? "" : v)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="科目" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部科目</SelectItem>
                {bookSubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCondition} onValueChange={(v) => setSelectedCondition(v === "all" ? "" : v)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="狀況" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部狀況</SelectItem>
                {bookConditions.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={(v) => setPriceRange(v === "all" ? "" : v)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="價格" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部價格</SelectItem>
                <SelectItem value="0-100">$100 以下</SelectItem>
                <SelectItem value="100-300">$100-300</SelectItem>
                <SelectItem value="300-500">$300-500</SelectItem>
                <SelectItem value="500-1000">$500-1000</SelectItem>
                <SelectItem value="1000-">$1000+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="outline" className="gap-2" data-testid="button-mobile-filter">
                <Filter className="h-4 w-4" />
                篩選
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[60vh]">
              <SheetHeader>
                <SheetTitle>篩選條件</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedSubject && (
              <Badge variant="secondary" className="gap-1">
                {selectedSubject}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setSelectedSubject("")}
                />
              </Badge>
            )}
            {selectedCondition && (
              <Badge variant="secondary" className="gap-1">
                {selectedCondition}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setSelectedCondition("")}
                />
              </Badge>
            )}
            {priceRange && (
              <Badge variant="secondary" className="gap-1">
                NT$ {priceRange.replace("-", " - ")}
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setPriceRange("")}
                />
              </Badge>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-md" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-6 w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredBooks && filteredBooks.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-4" data-testid="text-result-count">
              找到 {filteredBooks.length} 本書籍
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} seller={book.seller} />
              ))}
            </div>

            {recommendedBooks.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold">你可能也會喜歡</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {recommendedBooks.slice(0, 4).map((book) => (
                    <BookCard key={book.id} book={book} seller={book.seller} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : books && books.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {books.filter(b => b.status === "available").map((book) => (
                <BookCard key={book.id} book={book} seller={book.seller} />
              ))}
            </div>
            
            {recommendedBooks.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-bold">你可能也會喜歡</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {recommendedBooks.slice(0, 4).map((book) => (
                    <BookCard key={book.id} book={book} seller={book.seller} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">找不到符合的書籍</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || activeFiltersCount > 0
                ? "試著調整搜尋條件或篩選條件"
                : "目前沒有可購買的書籍，請稍後再來看看"}
            </p>
            {(searchQuery || activeFiltersCount > 0) && (
              <Button variant="outline" onClick={clearFilters}>
                清除所有條件
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
