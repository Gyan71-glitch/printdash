# The Indianberg 🕵️‍♂️

**Breaking barriers, shaping narrative.**

The Indianberg is a premium investigative journalism platform focused on modern cybercrime, forensic analysis, and the digital underground. Built with a high-performance modern stack, it delivers deep-dive reporting through a sophisticated editorial interface.

## 🚀 Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Scraping**: Puppeteer, Cheerio

## ✨ Key Features

- **Dynamic Editorial Grid**: A custom-built dashboard for multi-section news delivery.
- **Live News Flash**: Real-time ticker for breaking stories.
- **Business Ledger**: Specialized section for financial and corporate investigative reporting.
- **Advanced Scraping**: Automated data ingestion from global digital sources.
- **Premium Design**: Dark mode support, responsive typography, and high-contrast visuals.
- **Live Stock Ticker**: Integrated financial market data visualization.

## 🛠 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env.local`:
   ```env
   MONGODB_URI=your_mongodb_uri
   NEXTAUTH_SECRET=your_secret
   NEXTAUTH_URL=http://localhost:3000
   ```
4. Seed the database (optional):
   ```bash
   node seed_direct.js
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## 📂 Architecture

- `/src/app`: Page routes and API handlers.
- `/src/components`: UI components (Ads, Layout, Article Feed).
- `/src/models`: Mongoose schemas for Posts and Users.
- `/src/lib`: Database utilities and fetching logic.
- `scraper.js`: Independent scraping script for data acquisition.

---

© 2026 The Indianberg. All rights reserved.
