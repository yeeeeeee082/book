import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Send, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Book, User } from "@shared/schema";

interface AIChatAssistantProps {
  book: Book;
  seller: User | null;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIChatAssistant({ book, seller }: AIChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/ai/chat", {
        bookInfo: {
          title: book.title,
          author: book.author,
          price: book.price,
          condition: book.condition,
        },
        sellerInfo: {
          username: seller?.username || "Anonymous",
          school: seller?.school,
        },
        userMessage: message,
      });
      return await response.json();
    },
    onSuccess: (data: any) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "無法取得AI回應，請稍後再試";
      toast({
        title: "AI回應失敗",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: input }]);
    mutation.mutate(input);
    setInput("");
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="w-4 h-4 text-primary" />
        <h3 className="font-semibold text-sm">AI 購書助手</h3>
      </div>

      <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-xs text-muted-foreground italic">
            向本地 AI 提問關於這本書的任何事情...
          </p>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {mutation.isPending && (
          <div className="flex gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-xs">本地 AI 處理中...</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="詢問關於這本書..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          disabled={mutation.isPending}
          className="text-sm"
          data-testid="input-ai-message"
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={mutation.isPending || !input.trim()}
          data-testid="button-send-ai-message"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
}
