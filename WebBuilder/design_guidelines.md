# Design Guidelines: 大學生二手書交易平台

## Design Approach

**System:** Material Design-inspired approach optimized for information density and utility
**Rationale:** This is a functional marketplace requiring efficient browsing, clear information hierarchy, and frequent interactions. Students need quick access to book details and streamlined listing management.

**Reference Inspiration:** Facebook Marketplace (card layouts), Amazon (product grids), Craigslist (simplicity and speed)

---

## Typography

- **Primary Font:** Inter or Noto Sans TC (Google Fonts) - excellent readability for Chinese/English mix
- **Headings:** 
  - H1: text-3xl md:text-4xl font-bold
  - H2: text-2xl md:text-3xl font-semibold
  - H3: text-xl font-semibold
- **Body:** text-base leading-relaxed
- **Labels/Meta:** text-sm font-medium
- **Pricing:** text-2xl font-bold (prominent display)

---

## Layout System

**Spacing Units:** Consistently use Tailwind units of **2, 4, 6, 8, 12, 16**
- Component padding: p-4 or p-6
- Section spacing: py-8 md:py-12
- Card gaps: gap-4 or gap-6
- Form fields: space-y-4

**Container Widths:**
- Main content: max-w-7xl mx-auto px-4
- Forms: max-w-md
- Book detail: max-w-4xl

---

## Component Library

### Navigation
- **Header:** Sticky top navigation with logo, search bar (prominent), login/profile, buyer/seller toggle
- **Mobile:** Hamburger menu with bottom navigation tabs (Home, Search, Sell, Messages, Profile)

### Book Listings (Buyer Interface)
- **Grid Layout:** grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4
- **Book Card:** 
  - Book cover image (aspect-square)
  - Title (2-line truncate)
  - Price (prominent)
  - Condition badge
  - Subject/course tag
  - Seller rating indicator
  - Quick view overlay on hover (desktop)

### Search & Filters
- **Search Bar:** Full-width with icon, autocomplete dropdown
- **Filter Panel:** Sidebar on desktop (w-64), bottom sheet on mobile
- **Filter Chips:** Subject, Price range, Condition, Campus location
- **Active Filters:** Display as dismissible tags below search

### Seller Dashboard
- **My Listings:** Table view on desktop, card view on mobile
- **Quick Actions:** Edit/Delete/Mark as Sold buttons
- **Add Listing Button:** Prominent floating action button (bottom-right) or top CTA

### Forms (Add/Edit Listing)
- **Layout:** Single column, max-w-2xl
- **Image Upload:** Drag-drop zone with preview thumbnails
- **Fields:** Book title, Author, Subject/Course, Price, Condition (radio buttons), Description (textarea), Contact method
- **Submit:** Full-width primary button at bottom

### Book Detail Page
- **Layout:** Two-column on desktop (image gallery left, details right)
- **Image Gallery:** Main image with thumbnail carousel below
- **Details Panel:** 
  - Title and price at top
  - Condition badge
  - Course/subject tags
  - Description
  - Seller info card (name, rating, contact button)
  - "Request Book" or "Contact Seller" CTA button

### Authentication
- **Login/Register:** Centered modal (max-w-md) with tabs for login/register switching
- **Social Login:** Optional university email verification badge

### Messaging/Notifications
- **Message List:** WhatsApp-style conversation list
- **Notification Badge:** Red dot on message icon in header

---

## Images

### Book Covers
- **Primary:** User-uploaded book cover photos (aspect-square or 3:4)
- **Placeholder:** Generic book icon for missing images
- **Location:** Every book card and detail page

### Profile Photos
- **Seller Avatars:** Small circular images (w-10 h-10) in seller info cards
- **Placeholder:** Initial-based avatar backgrounds

**No Hero Image Required** - This is a utility platform, not a marketing site. Launch directly into search/browse functionality.

---

## Key Interactions

- **Hover States:** Subtle elevation on cards (shadow-md to shadow-lg)
- **Loading States:** Skeleton screens for book grids
- **Empty States:** Friendly illustrations for "No results" or "No listings yet"
- **Success Feedback:** Toast notifications for listing actions (added, edited, deleted)

---

## Accessibility

- Form labels always visible (not placeholders only)
- Keyboard navigation for all interactive elements
- ARIA labels for icon-only buttons
- Focus indicators on all inputs and buttons
- Contrast ratio minimum 4.5:1 for all text