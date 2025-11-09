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
- **Playback Controls**: Play/pause, seek slider, and fullscreen mode
- **Keyboard Shortcuts**: Space (pause/resume), Arrow keys (seek ±5s), F (fullscreen), Escape (stop)
- **Sharing**: Share modal with social media options (Twitter, Facebook, WhatsApp, Email), Web Share API support, and URL copy
- **URL-Based State**: Shareable links with URL-encoded crawl data (no database required)
- **Accessibility**: Respects `prefers-reduced-motion` preferences
- **Responsive**: Optimized for desktop and mobile devices
- **Form Validation**: Crawl text validation (10-2000 characters)

## Tech Stack

- Next.js 16 (App Router) + React 19
- TypeScript
- Tailwind CSS 4
- Framer Motion
- Radix UI

## Project Structure

```
├── app/              # Next.js app directory
├── components/       # React components
│   ├── crawl/       # Crawl animation components
│   └── ui/          # Reusable UI components
└── lib/              # Utilities, types, constants, validation
```

## How It Works

1. Enter your opening text, logo, episode info, and crawl text
2. Click "Play Crawl" to start the animation
3. Use controls to pause, seek, or share
4. Share via URL or social media platforms

Animation constants are centralized in `lib/constants.ts` for easy customization.

## License

MIT License - see [LICENSE](LICENSE) for details.
