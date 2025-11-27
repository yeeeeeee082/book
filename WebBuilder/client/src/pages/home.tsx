import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ShoppingCart, Store, Users, Recycle, DollarSign } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: DollarSign,
      title: "節省開銷",
      description: "以優惠價格購買二手教科書，省下更多預算",
    },
    {
      icon: Recycle,
      title: "環保再利用",
      description: "讓書籍循環使用，減少浪費，愛護地球",
    },
    {
      icon: Users,
      title: "校園社群",
      description: "與同校學生直接交易，安全又便利",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)]">
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <BookOpen className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4" data-testid="text-hero-title">
            大學生二手書交易平台
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            輕鬆買賣二手教科書，節省開銷、環保再利用。找到您需要的課本，或將閒置書籍轉讓給需要的同學。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/buyer">
              <Button size="lg" className="w-full sm:w-auto gap-2" data-testid="button-browse-books">
                <ShoppingCart className="w-5 h-5" />
                瀏覽書籍
              </Button>
            </Link>
            <Link href="/seller">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2" data-testid="button-sell-books">
                <Store className="w-5 h-5" />
                上架書籍
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-10">
            為什麼選擇我們？
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover-elevate">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
            如何開始？
          </h2>
          <p className="text-muted-foreground mb-8">
            只需要簡單幾個步驟，就能開始您的二手書交易
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">註冊帳號</h3>
              <p className="text-sm text-muted-foreground">建立您的帳號，加入我們的社群</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">瀏覽或上架</h3>
              <p className="text-sm text-muted-foreground">搜尋需要的書籍，或上架您的二手書</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">聯繫交易</h3>
              <p className="text-sm text-muted-foreground">與賣家/買家聯繫，完成交易</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <span className="font-semibold">二手書平台</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 大學生二手書交易平台. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
