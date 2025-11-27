import { type User, type InsertUser, type Book, type InsertBook, type Order, type InsertOrder, type Review, type InsertReview } from "@shared/schema";
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
  getSoldBooks(): Promise<Book[]>;
  createBook(book: InsertBook): Promise<Book>;
  updateBook(id: string, updates: Partial<Book>): Promise<Book | undefined>;
  deleteBook(id: string): Promise<boolean>;
  
  // Order operations
  getAllOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByBuyer(buyerId: string): Promise<Order[]>;
  getOrdersBySeller(sellerId: string): Promise<Order[]>;
  getCompletedOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined>;

  // Review operations
  getAllReviews(): Promise<Review[]>;
  getReviewsBySeller(sellerId: string): Promise<Review[]>;
  getReviewByOrder(orderId: string): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  getSellerRating(sellerId: string): Promise<{ average: number; count: number }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private books: Map<string, Book>;
  private orders: Map<string, Order>;
  private reviews: Map<string, Review>;

  constructor() {
    this.users = new Map();
    this.books = new Map();
    this.orders = new Map();
    this.reviews = new Map();
    
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

    // Create sample sold books
    const soldBook1 = await this.createBook({
      title: "線性代數",
      author: "Gilbert Strang",
      subject: "理工科學",
      price: 400,
      condition: "八成新",
      description: "MIT 經典教材，已售出。",
      imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=300&h=400&fit=crop",
      sellerId: user1.id,
      status: "sold",
    });

    const soldBook2 = await this.createBook({
      title: "會計學原理",
      author: "Warren",
      subject: "商業管理",
      price: 320,
      condition: "九成新",
      description: "商學院必修，已售出。",
      imageUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=400&fit=crop",
      sellerId: user2.id,
      status: "sold",
    });

    const soldBook3 = await this.createBook({
      title: "有機化學",
      author: "Clayden",
      subject: "理工科學",
      price: 550,
      condition: "七成新",
      description: "化學系經典教材，已售出。",
      imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&h=400&fit=crop",
      sellerId: user1.id,
      status: "sold",
    });

    // Create completed orders
    const order1 = await this.createOrder({
      bookId: soldBook1.id,
      buyerId: user2.id,
      sellerId: user1.id,
      status: "completed",
      message: "書況很好，謝謝！",
    });

    const order2 = await this.createOrder({
      bookId: soldBook2.id,
      buyerId: user1.id,
      sellerId: user2.id,
      status: "completed",
      message: "很棒的交易體驗",
    });

    const order3 = await this.createOrder({
      bookId: soldBook3.id,
      buyerId: user2.id,
      sellerId: user1.id,
      status: "completed",
      message: "快速出貨",
    });

    // Create sample reviews
    await this.createReview({
      sellerId: user1.id,
      buyerId: user2.id,
      orderId: order1.id,
      rating: 5,
      comment: "賣家很親切，書況跟描述一樣好，推薦！",
    });

    await this.createReview({
      sellerId: user2.id,
      buyerId: user1.id,
      orderId: order2.id,
      rating: 4,
      comment: "書的狀況不錯，出貨速度快。",
    });

    await this.createReview({
      sellerId: user1.id,
      buyerId: user2.id,
      orderId: order3.id,
      rating: 5,
      comment: "非常好的賣家，強烈推薦！",
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

  async getSoldBooks(): Promise<Book[]> {
    return Array.from(this.books.values())
      .filter((book) => book.status === "sold")
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

  async getCompletedOrders(): Promise<Order[]> {
    return Array.from(this.orders.values())
      .filter((order) => order.status === "completed")
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  // Review operations
  async getAllReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values()).sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }

  async getReviewsBySeller(sellerId: string): Promise<Review[]> {
    return Array.from(this.reviews.values())
      .filter((review) => review.sellerId === sellerId)
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
  }

  async getReviewByOrder(orderId: string): Promise<Review | undefined> {
    return Array.from(this.reviews.values()).find(
      (review) => review.orderId === orderId,
    );
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = {
      ...insertReview,
      id,
      createdAt: new Date(),
    };
    this.reviews.set(id, review);
    return review;
  }

  async getSellerRating(sellerId: string): Promise<{ average: number; count: number }> {
    const reviews = await this.getReviewsBySeller(sellerId);
    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return {
      average: Math.round((sum / reviews.length) * 10) / 10,
      count: reviews.length,
    };
  }
}

export const storage = new MemStorage();
