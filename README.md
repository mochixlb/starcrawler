# Star Crawler

A Star Wars-themed web application that allows users to input a custom message and generate an opening crawl animation styled identically to the iconic Star Wars intro sequence.

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript 5** (Strict mode)
- **Tailwind CSS 4**
- **ShadCN UI**
- **Framer Motion**

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

## Project Structure

```
app/
├── layout.tsx
├── page.tsx
└── globals.css
components/
├── ui/          # ShadCN UI components
├── crawl/       # Crawl-related components
└── shared/      # Shared components and types
lib/
├── utils.ts
└── constants.ts
```

## Development Roadmap

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture and development phases.

