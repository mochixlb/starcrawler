# Star Crawler

Create your own cinematic opening crawl animation. Because sometimes you need to announce your epic tale in yellow text scrolling through space.

## What It Does

Star Crawler transforms your text into a cinematic opening crawl complete with:

- Animated starfield background
- Three-phase animation sequence (opening text → logo → scrolling crawl)
- Customizable episode number, subtitle, and crawl text
- Classic cinematic styling and typography

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) and start crafting your galactic narrative.

## Features

- **Customizable Content**: Set your opening text, logo, episode number, subtitle, and crawl text
- **Smooth Animations**: Powered by Framer Motion with proper 3D perspective transforms
- **Accessibility**: Respects `prefers-reduced-motion` for users who need it
- **Form Validation**: Ensures crawl text is between 10-2000 characters
- **Responsive Design**: Works beautifully on desktop and mobile devices

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Radix UI** - Accessible component primitives

## Project Structure

```
├── app/              # Next.js app directory
├── components/       # React components
│   ├── crawl/       # Crawl-specific components
│   └── ui/          # Reusable UI components
└── lib/              # Utilities, types, constants, validation
```

## How It Works

1. Fill out the form with your epic tale
2. Click "Play Crawl" to start the animation
3. Watch as your text scrolls through space (just like in the movies)
4. Use "Stop" to end early, or "Reset" to start over

The animation follows a classic cinematic sequence: opening text fades in, logo shrinks into the distance, then your crawl text scrolls upward with proper 3D perspective.

## Customization

All animation constants are centralized in `lib/constants.ts`, making it easy to adjust:

- Animation durations
- Font sizes and spacing
- Starfield density and speed
- Form validation limits

## License

Licensed under the [MIT License](LICENSE) - free and open source, available for everyone to use, modify, and distribute.

---
