# 大學生二手書交易平台

## 專案概覽

這是一個專為大學生設計的二手教科書交易平台，讓學生可以輕鬆買賣二手書籍，節省開銷並環保再利用。

### 目前狀態
- **開發階段**: MVP 完成
- **最後更新**: 2024年

## 核心功能

### 用戶系統
- 註冊與登入功能
- 用戶資料（帳號、電子郵件、電話、學校）
- Session 基於 localStorage 的認證狀態管理

### 買家介面 (`/buyer`)
- 瀏覽所有可購買的二手書籍
- 搜尋功能（書名、作者、科目）
- 篩選功能（科目類別、書籍狀況、價格範圍）
- 響應式設計，支援手機與電腦

### 賣家介面 (`/seller`)
- 查看自己上架的書籍
- 上架新書（表單驗證）
- 編輯現有書籍資訊
- 刪除書籍
- 標記書籍為已售出

### 書籍詳細頁 (`/book/:id`)
- 顯示完整書籍資訊
- 顯示賣家聯絡資訊
- 發送購買意向給賣家

## 技術架構

### 前端
- **框架**: React + TypeScript
- **路由**: Wouter
- **狀態管理**: TanStack Query (React Query v5)
- **表單**: React Hook Form + Zod 驗證
- **UI 組件**: Shadcn UI + Tailwind CSS
- **圖示**: Lucide React

### 後端
- **框架**: Express.js
- **儲存**: 記憶體儲存 (MemStorage)
- **驗證**: Zod schemas

### 共用
- **Schema**: Drizzle ORM schemas + Drizzle-Zod

## 專案結構

```
├── client/
│   └── src/
│       ├── components/       # UI 組件
│       │   ├── ui/           # Shadcn 基礎組件
│       │   ├── header.tsx    # 導航列
│       │   ├── book-card.tsx # 書籍卡片
│       │   ├── book-form.tsx # 書籍表單
│       │   ├── theme-provider.tsx
│       │   └── theme-toggle.tsx
│       ├── context/
│       │   └── auth-context.tsx  # 認證狀態
│       ├── pages/
│       │   ├── home.tsx      # 首頁
│       │   ├── auth.tsx      # 登入/註冊
│       │   ├── buyer.tsx     # 買家頁面
│       │   ├── seller.tsx    # 賣家頁面
│       │   └── book-detail.tsx
│       └── App.tsx
├── server/
│   ├── routes.ts             # API 路由
│   └── storage.ts            # 資料儲存
└── shared/
    └── schema.ts             # 資料模型
```

## API 端點

### 認證
- `POST /api/auth/register` - 用戶註冊
- `POST /api/auth/login` - 用戶登入

### 書籍
- `GET /api/books` - 取得所有書籍（含賣家資訊）
- `GET /api/books/:id` - 取得單一書籍詳情
- `GET /api/books/seller/:sellerId` - 取得特定賣家的書籍
- `POST /api/books` - 新增書籍
- `PATCH /api/books/:id` - 更新書籍
- `DELETE /api/books/:id` - 刪除書籍

### 訂單
- `GET /api/orders` - 取得所有訂單
- `POST /api/orders` - 新增訂單
- `PATCH /api/orders/:id` - 更新訂單

## 資料模型

### User
- id, username, password, email, phone, school

### Book
- id, title, author, subject, price, condition, description, sellerId, status, createdAt

### Order
- id, bookId, buyerId, sellerId, status, message, createdAt

## 書籍狀況選項
- 全新、九成新、八成新、七成新、六成新以下

## 科目類別
- 通識課程、理工科學、人文社會、商業管理、語言學習、藝術設計、醫學健康、法律政治、其他

## 用戶偏好

### 設計風格
- 使用 Inter 字體支援中英文混合
- 藍色主色調 (primary: 210 85%)
- 支援深色/淺色模式切換
- 響應式設計

## 開發指南

### 運行專案
```bash
npm run dev
```

### 測試帳號
- 帳號: demo_seller / 密碼: password123
- 帳號: demo_buyer / 密碼: password123

## 未來功能規劃
- 圖片上傳功能
- 即時聊天系統
- 評價與評論系統
- 交易歷史記錄
- 地圖功能顯示交易地點
