import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  school: text("school"),
});

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const books = pgTable("books", {
  id: varchar("id", { length: 36 }).primaryKey(),
  title: text("title").notNull(),
  author: text("author").notNull(),
  subject: text("subject").notNull(),
  price: integer("price").notNull(),
  condition: text("condition").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  sellerId: varchar("seller_id", { length: 36 }).notNull(),
  status: text("status").notNull().default("available"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertBookSchema = createInsertSchema(books).omit({ id: true, createdAt: true });
export type InsertBook = z.infer<typeof insertBookSchema>;
export type Book = typeof books.$inferSelect;

export const orders = pgTable("orders", {
  id: varchar("id", { length: 36 }).primaryKey(),
  bookId: varchar("book_id", { length: 36 }).notNull(),
  buyerId: varchar("buyer_id", { length: 36 }).notNull(),
  sellerId: varchar("seller_id", { length: 36 }).notNull(),
  status: text("status").notNull().default("pending"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

export const reviews = pgTable("reviews", {
  id: varchar("id", { length: 36 }).primaryKey(),
  sellerId: varchar("seller_id", { length: 36 }).notNull(),
  buyerId: varchar("buyer_id", { length: 36 }).notNull(),
  orderId: varchar("order_id", { length: 36 }).notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({ id: true, createdAt: true });
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export const bookConditions = ["全新", "九成新", "八成新", "七成新", "六成新以下"] as const;
export type BookCondition = typeof bookConditions[number];

export const bookSubjects = [
  "通識課程",
  "理工科學",
  "人文社會",
  "商業管理",
  "語言學習",
  "藝術設計",
  "醫學健康",
  "法律政治",
  "其他"
] as const;
export type BookSubject = typeof bookSubjects[number];
