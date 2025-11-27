import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertBookSchema, insertOrderSchema, insertReviewSchema } from "@shared/schema";
import { generateAIChatResponse } from "./ai-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const result = insertUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input data" });
      }

      const existingUser = await storage.getUserByUsername(result.data.username);
      if (existingUser) {
        return res.status(409).json({ message: "帳號已存在" });
      }

      const user = await storage.createUser(result.data);
      // Return user with ID included (exclude password only)
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        school: user.school,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "請提供帳號和密碼" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "帳號或密碼錯誤" });
      }

      // Return user with ID included (exclude password only)
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        school: user.school,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Book routes
  app.get("/api/books", async (req, res) => {
    try {
      const books = await storage.getAllBooks();
      
      // Enrich books with seller information
      const booksWithSeller = await Promise.all(
        books.map(async (book) => {
          const seller = await storage.getUser(book.sellerId);
          return {
            ...book,
            seller: seller ? { 
              id: seller.id, 
              username: seller.username, 
              email: seller.email,
              phone: seller.phone,
              school: seller.school
            } : null,
          };
        })
      );
      
      res.json(booksWithSeller);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/books/seller/:sellerId", async (req, res) => {
    try {
      const sellerId = req.params.sellerId;
      
      if (!sellerId) {
        return res.status(400).json({ message: "Seller ID is required" });
      }
      
      const books = await storage.getBooksBySeller(sellerId);
      res.json(books);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/books/:id", async (req, res) => {
    try {
      const book = await storage.getBook(req.params.id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      const seller = await storage.getUser(book.sellerId);
      res.json({
        ...book,
        seller: seller ? {
          id: seller.id,
          username: seller.username,
          email: seller.email,
          phone: seller.phone,
          school: seller.school
        } : null,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/books", async (req, res) => {
    try {
      const result = insertBookSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input data", errors: result.error.errors });
      }

      const book = await storage.createBook(result.data);
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/books/:id", async (req, res) => {
    try {
      const book = await storage.getBook(req.params.id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      const updatedBook = await storage.updateBook(req.params.id, req.body);
      res.json(updatedBook);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/books/:id", async (req, res) => {
    try {
      const book = await storage.getBook(req.params.id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      await storage.deleteBook(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Order routes
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const result = insertOrderSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input data", errors: result.error.errors });
      }

      const order = await storage.createOrder(result.data);
      res.status(201).json(order);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const updatedOrder = await storage.updateOrder(req.params.id, req.body);
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // AI Chat routes
  app.post("/api/ai/chat", async (req, res) => {
    try {
      const { bookInfo, sellerInfo, userMessage } = req.body;

      if (!bookInfo || !sellerInfo || !userMessage) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const response = await generateAIChatResponse(bookInfo, sellerInfo, userMessage);
      res.json({ response });
    } catch (error: any) {
      console.error("AI Chat Error:", error);
      const message = error.message || "AI 服務暫時不可用";
      res.status(503).json({ message });
    }
  });

  // Transaction routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const soldBooks = await storage.getSoldBooks();
      const completedOrders = await storage.getCompletedOrders();
      
      const transactionsWithDetails = await Promise.all(
        completedOrders.map(async (order) => {
          const book = await storage.getBook(order.bookId);
          const buyer = await storage.getUser(order.buyerId);
          const seller = await storage.getUser(order.sellerId);
          return {
            ...order,
            book: book ? {
              id: book.id,
              title: book.title,
              author: book.author,
              price: book.price,
              imageUrl: book.imageUrl,
              subject: book.subject,
            } : null,
            buyer: buyer ? { id: buyer.id, username: buyer.username } : null,
            seller: seller ? { id: seller.id, username: seller.username } : null,
          };
        })
      );
      
      const totalBooks = soldBooks.length;
      const totalValue = soldBooks.reduce((sum, book) => sum + book.price, 0);
      const carbonSaved = totalBooks * 2.5;
      
      res.json({
        transactions: transactionsWithDetails,
        stats: {
          totalBooks,
          totalValue,
          carbonSaved,
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Review routes
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getAllReviews();
      
      const reviewsWithDetails = await Promise.all(
        reviews.map(async (review) => {
          const buyer = await storage.getUser(review.buyerId);
          const seller = await storage.getUser(review.sellerId);
          return {
            ...review,
            buyer: buyer ? { id: buyer.id, username: buyer.username } : null,
            seller: seller ? { id: seller.id, username: seller.username } : null,
          };
        })
      );
      
      res.json(reviewsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/reviews/seller/:sellerId", async (req, res) => {
    try {
      const sellerId = req.params.sellerId;
      const reviews = await storage.getReviewsBySeller(sellerId);
      const rating = await storage.getSellerRating(sellerId);
      
      const reviewsWithDetails = await Promise.all(
        reviews.map(async (review) => {
          const buyer = await storage.getUser(review.buyerId);
          return {
            ...review,
            buyer: buyer ? { id: buyer.id, username: buyer.username } : null,
          };
        })
      );
      
      res.json({
        reviews: reviewsWithDetails,
        rating,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const result = insertReviewSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid input data", errors: result.error.errors });
      }

      const existingReview = await storage.getReviewByOrder(result.data.orderId);
      if (existingReview) {
        return res.status(409).json({ message: "此訂單已有評價" });
      }

      const review = await storage.createReview(result.data);
      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
