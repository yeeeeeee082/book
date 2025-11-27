import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { apiRequest } from "@/lib/queryClient";

const loginSchema = z.object({
  username: z.string().min(3, "帳號至少需要3個字元"),
  password: z.string().min(6, "密碼至少需要6個字元"),
});

const registerSchema = z.object({
  username: z.string().min(3, "帳號至少需要3個字元"),
  password: z.string().min(6, "密碼至少需要6個字元"),
  confirmPassword: z.string().min(6, "請確認密碼"),
  email: z.string().email("請輸入有效的電子郵件"),
  phone: z.string().optional(),
  school: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "密碼不一致",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export default function Auth() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      phone: "",
      school: "",
    },
  });

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/login", data);
      const user = response;
      login(user);
      toast({
        title: "登入成功",
        description: `歡迎回來，${user.username}！`,
      });
      setLocation("/buyer");
    } catch (error: any) {
      toast({
        title: "登入失敗",
        description: error.message || "帳號或密碼錯誤",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...registerData } = data;
      const response = await apiRequest("POST", "/api/auth/register", registerData);
      const user = response;
      login(user);
      toast({
        title: "註冊成功",
        description: "您的帳號已建立，歡迎使用！",
      });
      setLocation("/buyer");
    } catch (error: any) {
      toast({
        title: "註冊失敗",
        description: error.message || "無法建立帳號，請稍後再試",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">歡迎使用二手書平台</CardTitle>
          <CardDescription>登入或註冊以開始買賣書籍</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" data-testid="tab-login">登入</TabsTrigger>
              <TabsTrigger value="register" data-testid="tab-register">註冊</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="mt-6">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>帳號</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="請輸入帳號" 
                            data-testid="input-login-username"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>密碼</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="請輸入密碼"
                            data-testid="input-login-password"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                    data-testid="button-submit-login"
                  >
                    {isLoading ? "登入中..." : "登入"}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="register" className="mt-6">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>帳號</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="請輸入帳號"
                            data-testid="input-register-username"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>電子郵件</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="example@school.edu.tw"
                            data-testid="input-register-email"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>密碼</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="至少6個字元"
                              data-testid="input-register-password"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>確認密碼</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              placeholder="再次輸入密碼"
                              data-testid="input-register-confirm-password"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={registerForm.control}
                    name="school"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>學校（選填）</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="您就讀的學校"
                            data-testid="input-register-school"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>手機號碼（選填）</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="09xx-xxx-xxx"
                            data-testid="input-register-phone"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                    data-testid="button-submit-register"
                  >
                    {isLoading ? "註冊中..." : "註冊"}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
