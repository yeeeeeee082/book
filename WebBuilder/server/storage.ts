import { type User, type InsertUser, type Book, type InsertBook, type Order, type InsertOrder } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Book operations
  getAllBooks(): Promise<Book[]>;
  getBook(id: string): Promise<Book | undefined>;
  getBooksBySeller(sellerId: string): Promise<Book[]>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: string, updates: Partial<Book>): Promise<Book | undefined>;
  deleteBook(id: string): Promise<boolean>;
  
  // Order operations
  getAllOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByBuyer(buyerId: string): Promise<Order[]>;
  getOrdersBySeller(sellerId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private books: Map<string, Book>;
  private orders: Map<string, Order>;

  constructor() {
    this.users = new Map();
    this.books = new Map();
    this.orders = new Map();
    
    // Add some sample data for demonstration
    this.initSampleData();
  }

  private async initSampleData() {
    // Create sample users
    const user1 = await this.createUser({
      username: "demo_seller",
      password: "password123",
      email: "seller@school.edu.tw",
      phone: "0912-345-678",
      school: "國立台灣大學",
    });

    const user2 = await this.createUser({
      username: "demo_buyer",
      password: "password123",
      email: "buyer@school.edu.tw",
      phone: "0923-456-789",
      school: "國立清華大學",
    });

    // Create sample books
    await this.createBook({
      title: "微積分概論 第五版",
      author: "Stewart",
      subject: "理工科學",
      price: 450,
      condition: "八成新",
      description: "書況良好，有少量筆記，不影響閱讀。含習題解答。",
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=400&fit=crop",
      sellerId: user1.id,
      status: "available",
    });

    await this.createBook({
      title: "經濟學原理",
      author: "Mankiw",
      subject: "商業管理",
      price: 380,
      condition: "九成新",
      description: "幾乎全新，只翻閱過幾次。",
      imageUrl: "https://images.unsplash.com/photo-1557821552-17105176677c?w=300&h=400&fit=crop",
      sellerId: user1.id,
      status: "available",
    });

    await this.createBook({
      title: "英文寫作指南",
      author: "William Strunk",
      subject: "語言學習",
      price: 150,
      condition: "七成新",
      description: "有一些折痕但內容完整。",
      imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&h=400&fit=crop",
      sellerId: user2.id,
      status: "available",
    });

    await this.createBook({
      title: "程式設計入門 - Python",
      author: "John Zelle",
      subject: "理工科學",
      price: 520,
      condition: "全新",
      description: "全新未拆封，買錯版本所以出售。",
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=400&fit=crop",
      sellerId: user1.id,
      status: "available",
    });

    await this.createBook({
      title: "心理學導論",
      author: "Philip Zimbardo",
      subject: "人文社會",
      price: 280,
      condition: "八成新",
      description: "書況佳，適合心理系必修課使用。",
      imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
      sellerId: user2.id,
      status: "available",
    });

    await this.createBook({
      title: "法學緒論",
      author: "鄭玉波",
      subject: "法律政治",
      price: 350,
      condition: "九成新",
      description: "法律系必備教材，修訂二十五版，僅使用一學期。由黃宗樂、楊宏暉修訂。",
      imageUrl: "/attached_assets/法學緒論_1764251301024.webp",
      sellerId: user1.id,
      status: "available",
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Book operations
  async getAllBooks(): Promise<Book[]> {
    return Array.from(this.books.values()).sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async getBook(id: string): Promise<Book | undefined> {
    return this.books.get(id);
  }

  async getBooksBySeller(sellerId: string): Promise<Book[]> {
    return Array.from(this.books.values())
      .filter((book) => book.sellerId === sellerId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async createBook(insertBook: InsertBook): Promise<Book> {
    const id = randomUUID();
    const book: Book = {
      ...insertBook,
      id,
      createdAt: new Date(),
    };
    this.books.set(id, book);
    return book;
  }

  async updateBook(id: string, updates: Partial<Book>): Promise<Book | undefined> {
    const book = this.books.get(id);
    if (!book) return undefined;
    
    const updatedBook = { ...book, ...updates, id };
    this.books.set(id, updatedBook);
    return updatedBook;
  }

  async deleteBook(id: string): Promise<boolean> {
    return this.books.delete(id);
  }

  // Order operations
  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values()).sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByBuyer(buyerId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter((order) => order.buyerId === buyerId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getOrdersBySeller(sellerId: string): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter((order) => order.sellerId === sellerId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = {
      ...insertOrder,
      id,
      createdAt: new Date(),
    };
    this.orders.set(id, order);
    return order;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...updates, id };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
}

export const storage = new MemStorage();
