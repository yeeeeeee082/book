# 大學生二手書交易平台

## Overview
A university second-hand book trading platform built with React, Express, TypeScript, and in-memory storage. The platform enables students to buy and sell used textbooks with features including carbon footprint tracking, browsing history, and seller ratings.

## Recent Changes
- 2025-11-27: Implemented seller reviews display on book detail pages
- 2025-11-27: Created browsing history feature using localStorage
- 2025-11-27: Added transactions page with carbon footprint statistics

## Project Architecture

### Tech Stack
- Frontend: React + TypeScript + Vite
- Backend: Express + TypeScript
- Storage: In-memory (MemStorage)
- Styling: Tailwind CSS + shadcn/ui

### Directory Structure
```
WebBuilder/
├── client/
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── context/        # React context providers
│       ├── pages/          # Page components
│       │   ├── home.tsx
│       │   ├── auth.tsx
│       │   ├── buyer.tsx
│       │   ├── seller.tsx
│       │   ├── book-detail.tsx
│       │   ├── transactions.tsx
│       │   └── history.tsx
│       └── lib/            # Utility functions
├── server/
│   ├── routes.ts          # API endpoints
│   ├── storage.ts         # In-memory data storage
│   └── index-dev.ts       # Server entry point
├── shared/
│   └── schema.ts          # Type definitions
└── attached_assets/       # Static files (images)
```

### Key Features
1. **User Authentication**: Login/Register with demo accounts (demo_seller/demo_buyer, password: password123)
2. **Book Listings**: Browse, filter, and search for books
3. **Book Details**: View book information with seller info and reviews
4. **Seller Dashboard**: List and manage books for sale
5. **Transactions**: View completed transactions with carbon footprint savings
6. **Browsing History**: Track viewed books (localStorage-based)
7. **Seller Reviews**: 5-star rating system with comments

### API Endpoints
- GET /api/books - List all available books
- GET /api/books/:id - Get book details
- POST /api/books - Create new book listing
- POST /api/auth/login - User login
- POST /api/auth/register - User registration
- GET /api/transactions - Get completed transactions
- GET /api/users/:id/reviews - Get seller reviews
- POST /api/reviews - Submit a review

### Carbon Footprint Calculation
Each second-hand book transaction saves approximately 2.5kg CO₂ emissions.

### User Preferences
- Language: Traditional Chinese (繁體中文)
- Currency: New Taiwan Dollar (NT$)
