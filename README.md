# Star Crawler

A free, open-source web app for creating and sharing cinematic Star Wars-style opening crawl animations.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start creating.

## Features

- **Three-phase animation**: Opening text → logo → scrolling crawl with animated starfield background
- **Custom fonts**: Star Jedi font (regular for titles, hollow for logo)
- **Playback controls**: Play/pause, seek slider, and fullscreen mode
- **Keyboard shortcuts**: Space (pause/resume), Arrow keys (seek ±5s), F (fullscreen), Escape (stop)
- **URL-based sharing**: Shareable links with encoded crawl data (no database required)
- **Accessibility**: Respects `prefers-reduced-motion` preferences
- **Responsive**: Optimized for desktop and mobile

## Tech Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion** (animations)
- **Zod** (validation)
- **Lucide React** (icons)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── disclaimer/        # Disclaimer page
│   ├── privacy/           # Privacy policy page
│   ├── terms/             # Terms of service page
│   ├── icon.svg           # Favicon
│   ├── globals.css        # Global styles & font definitions
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/
│   ├── crawl/             # Crawl animation components
│   │   ├── crawl-display.tsx      # Main animation display
│   │   ├── crawl-controls.tsx     # Playback controls
│   │   ├── crawl-input.tsx        # Input form
│   │   ├── starfield.tsx          # Animated background
│   │   ├── fade-mask.tsx          # Fade effects
│   │   ├── share-modal.tsx        # Sharing UI
│   │   └── slider.tsx             # Custom slider
│   ├── legal/             # Legal page components
│   └── ui/                # Reusable UI components
└── lib/                   # Utilities, types, constants, validation
    ├── constants.ts       # Animation & UI constants
    ├── types.ts          # TypeScript types
    ├── utils.ts          # Helper functions
    └── validation.ts     # Form validation
```

## How It Works

1. Enter opening text, logo, episode number, subtitle, and crawl text
2. Click "Play Crawl" to start the animation
3. Use controls to pause, seek, or toggle fullscreen
4. Share via URL or social media

Animation timing, colors, and fonts are centralized in `lib/constants.ts` and `app/globals.css` for easy customization.

## License

MIT License - see [LICENSE](LICENSE) for details.

## Links

- **Live Site**: [starcrawler.vercel.app](https://starcrawler.vercel.app)
- **GitHub**: [github.com/mochixlb/starcrawler](https://github.com/mochixlb/starcrawler)
