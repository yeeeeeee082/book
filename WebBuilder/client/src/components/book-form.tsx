import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { bookSubjects, bookConditions, type Book } from "@shared/schema";

const bookFormSchema = z.object({
  title: z.string().min(1, "請輸入書名"),
  author: z.string().min(1, "請輸入作者"),
  subject: z.string().min(1, "請選擇科目"),
  price: z.coerce.number().min(1, "價格必須大於 0"),
  condition: z.string().min(1, "請選擇書籍狀況"),
  description: z.string().optional(),
});

type BookFormData = z.infer<typeof bookFormSchema>;

interface BookFormProps {
  book?: Book;
  onSuccess: () => void;
  sellerId: string;
}

export function BookForm({ book, onSuccess, sellerId }: BookFormProps) {
  const { toast } = useToast();
  const isEditing = !!book;

  const form = useForm<BookFormData>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: book?.title || "",
      author: book?.author || "",
      subject: book?.subject || "",
      price: book?.price || 0,
      condition: book?.condition || "",
      description: book?.description || "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: BookFormData) => {
      const response = await apiRequest(
        isEditing ? "PATCH" : "POST",
        isEditing ? `/api/books/${book.id}` : "/api/books",
        isEditing ? data : { ...data, sellerId, status: "available" }
      );
      return await response.json();
    },
    onSuccess: async () => {
      toast({
        title: isEditing ? "更新成功" : "上架成功",
        description: isEditing ? "書籍資訊已更新" : "您的書籍已成功上架",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: isEditing ? "更新失敗" : "上架失敗",
        description: "請稍後再試",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BookFormData) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>書名</FormLabel>
              <FormControl>
                <Input 
                  placeholder="例如：微積分概論 第五版" 
                  data-testid="input-book-title"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>作者</FormLabel>
              <FormControl>
                <Input 
                  placeholder="例如：王小明" 
                  data-testid="input-book-author"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>科目類別</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-book-subject">
                      <SelectValue placeholder="選擇科目" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {bookSubjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>價格 (NT$)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="0" 
                    min={1}
                    data-testid="input-book-price"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>書籍狀況</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="grid grid-cols-2 md:grid-cols-5 gap-2"
                >
                  {bookConditions.map((condition) => (
                    <div key={condition}>
                      <RadioGroupItem
                        value={condition}
                        id={condition}
                        className="peer sr-only"
                        data-testid={`radio-condition-${condition}`}
                      />
                      <label
                        htmlFor={condition}
                        className="flex items-center justify-center rounded-md border-2 border-muted bg-transparent p-3 hover-elevate cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 text-sm font-medium"
                      >
                        {condition}
                      </label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>書籍描述（選填）</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="描述書籍的狀態、特點或其他資訊..."
                  className="resize-none min-h-[100px]"
                  data-testid="textarea-book-description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button 
            type="submit" 
            disabled={mutation.isPending}
            data-testid="button-submit-book"
          >
            {mutation.isPending ? "處理中..." : isEditing ? "更新" : "上架"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
