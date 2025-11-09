# Star Crawler

Create and share cinematic opening crawl animations. Transform your text into a scrolling space epic with customizable episode numbers, subtitles, and crawl text.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start creating.

## Features

- **Cinematic Animation**: Three-phase sequence (opening text → logo → scrolling crawl) with animated starfield background
- **Custom Fonts**: Star Jedi font (regular for titles, hollow for logo animation)
- **Playback Controls**: Play/pause, seek slider, and fullscreen mode with YouTube-style controls
- **Keyboard Shortcuts**: Space (pause/resume), Arrow keys (seek ±5s), F (fullscreen), Escape (stop)
- **Sharing**: Share modal with social media options and URL copy (no database required)
- **URL-Based State**: Shareable links with URL-encoded crawl data
- **Accessibility**: Respects `prefers-reduced-motion` preferences
- **Responsive**: Optimized for desktop and mobile with touch-friendly controls

## Tech Stack

- **Next.js 16** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS 4** (CSS-first configuration)
- **Framer Motion** (animations)
- **Radix UI** (accessible components)
- **Lucide React** (icons)

## Project Structure

```
├── app/                    # Next.js app directory
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
│   └── ui/                # Reusable UI components
└── lib/                   # Utilities, types, constants, validation
    ├── constants.ts       # Animation & UI constants
    ├── types.ts          # TypeScript types
    ├── utils.ts          # Helper functions
    └── validation.ts     # Form validation
```

## How It Works

1. Enter your opening text, logo, episode number, subtitle, and crawl text
2. Click "Play Crawl" to start the three-phase animation
3. Use controls to pause, seek, or toggle fullscreen
4. Share via URL or social media platforms

Animation timing, colors, and fonts are centralized in `lib/constants.ts` and `app/globals.css` for easy customization.

## License

MIT License - see [LICENSE](LICENSE) for details.
