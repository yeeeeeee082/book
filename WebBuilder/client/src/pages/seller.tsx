import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, BookOpen, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { BookForm } from "@/components/book-form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Link } from "wouter";
import type { Book } from "@shared/schema";

const statusLabels: Record<string, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  available: { label: "上架中", variant: "default" },
  sold: { label: "已售出", variant: "secondary" },
  reserved: { label: "已預訂", variant: "secondary" },
};

export default function Seller() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const sellerBooksQueryKey = user?.id ? [`/api/books/seller/${user.id}`] : [];
  
  const { data: books, isLoading, refetch } = useQuery<Book[]>({
    queryKey: sellerBooksQueryKey,
    enabled: isAuthenticated && !!user?.id,
  });

  const deleteMutation = useMutation({
    mutationFn: async (bookId: string) => {
      await apiRequest("DELETE", `/api/books/${bookId}`);
    },
    onSuccess: async () => {
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      toast({
        title: "刪除成功",
        description: "書籍已從您的列表中移除",
      });
    },
    onError: () => {
      toast({
        title: "刪除失敗",
        description: "無法刪除書籍，請稍後再試",
        variant: "destructive",
      });
    },
  });

  const markAsSoldMutation = useMutation({
    mutationFn: async (bookId: string) => {
      await apiRequest("PATCH", `/api/books/${bookId}`, { status: "sold" });
    },
    onSuccess: async () => {
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      toast({
        title: "更新成功",
        description: "書籍已標記為售出",
      });
    },
    onError: () => {
      toast({
        title: "更新失敗",
        description: "無法更新書籍狀態，請稍後再試",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">請先登入</h2>
            <p className="text-muted-foreground mb-4">
              您需要登入才能管理您的書籍
            </p>
            <Link href="/auth">
              <Button data-testid="button-goto-login">前往登入</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddSuccess = async () => {
    setIsAddDialogOpen(false);
    await refetch();
    queryClient.invalidateQueries({ queryKey: ["/api/books"] });
  };

  const handleEditSuccess = async () => {
    setEditingBook(null);
    await refetch();
    queryClient.invalidateQueries({ queryKey: ["/api/books"] });
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1" data-testid="text-seller-title">我的書籍</h1>
            <p className="text-muted-foreground">管理您上架的二手書籍</p>
          </div>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2" data-testid="button-add-book">
                <Plus className="w-4 h-4" />
                上架新書
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>上架新書</DialogTitle>
                <DialogDescription>
                  填寫書籍資訊，讓買家找到您的書籍
                </DialogDescription>
              </DialogHeader>
              <BookForm onSuccess={handleAddSuccess} sellerId={user?.id || ""} />
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-4 w-1/4" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : books && books.length > 0 ? (
          <>
            <div className="hidden md:block">
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>書名</TableHead>
                      <TableHead>作者</TableHead>
                      <TableHead>科目</TableHead>
                      <TableHead>價格</TableHead>
                      <TableHead>狀況</TableHead>
                      <TableHead>狀態</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {books.map((book) => (
                      <TableRow key={book.id} data-testid={`row-book-${book.id}`}>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {book.title}
                        </TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{book.subject}</Badge>
                        </TableCell>
                        <TableCell className="font-semibold">
                          NT$ {book.price.toLocaleString()}
                        </TableCell>
                        <TableCell>{book.condition}</TableCell>
                        <TableCell>
                          <Badge variant={statusLabels[book.status]?.variant || "default"}>
                            {statusLabels[book.status]?.label || book.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            {book.status === "available" && (
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => markAsSoldMutation.mutate(book.id)}
                                disabled={markAsSoldMutation.isPending}
                                data-testid={`button-mark-sold-${book.id}`}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                            <Dialog open={editingBook?.id === book.id} onOpenChange={(open) => !open && setEditingBook(null)}>
                              <DialogTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => setEditingBook(book)}
                                  data-testid={`button-edit-${book.id}`}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>編輯書籍</DialogTitle>
                                  <DialogDescription>
                                    更新書籍資訊
                                  </DialogDescription>
                                </DialogHeader>
                                {editingBook && (
                                  <BookForm
                                    book={editingBook}
                                    onSuccess={handleEditSuccess}
                                    sellerId={user?.id || ""}
                                  />
                                )}
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive"
                                  data-testid={`button-delete-${book.id}`}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>確定要刪除嗎？</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    此操作無法復原，書籍「{book.title}」將從您的列表中移除。
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>取消</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteMutation.mutate(book.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    刪除
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </div>

            <div className="md:hidden space-y-4">
              {books.map((book) => (
                <Card key={book.id} data-testid={`card-my-book-${book.id}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base line-clamp-1">{book.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                      </div>
                      <Badge variant={statusLabels[book.status]?.variant || "default"}>
                        {statusLabels[book.status]?.label || book.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">{book.subject}</Badge>
                      <Badge variant="outline">{book.condition}</Badge>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-lg font-bold text-primary">
                        NT$ {book.price.toLocaleString()}
                      </span>
                      <div className="flex items-center gap-1">
                        {book.status === "available" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsSoldMutation.mutate(book.id)}
                            disabled={markAsSoldMutation.isPending}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            已售出
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingBook(book)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>確定要刪除嗎？</AlertDialogTitle>
                              <AlertDialogDescription>
                                此操作無法復原，書籍將從您的列表中移除。
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>取消</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteMutation.mutate(book.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                刪除
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">還沒有上架任何書籍</h3>
              <p className="text-muted-foreground mb-4">
                點擊上方按鈕開始上架您的二手書籍
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                上架新書
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
