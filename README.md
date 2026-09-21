# Macaw — hero landing page

Full-screen hero landing page for the fictional creative agency **Macaw®**,
built with React + TypeScript + Vite + Tailwind CSS.

## Running it

```bash
npm install
npm run dev      # dev server
npm run build    # typecheck + production build
npm run preview  # serve the production build
```

## What's in here

| Path | Purpose |
| --- | --- |
| `index.html` | Loads the two Helvetica Now Display webfonts. |
| `src/index.css` | Tailwind layers, `--font-heading` / `--font-body` variables, cursor `blink` keyframes. |
| `src/components/BackgroundVideo.tsx` | Fixed full-screen video, scrubbed by horizontal mouse movement. |
| `src/components/Navbar.tsx` | Fixed navbar, desktop links, animated hamburger + mobile overlay. |
| `src/components/Hero.tsx` | Blurred intro label, typewriter line, action pills. |
| `src/hooks/useTypewriter.ts` | Character-by-character reveal hook. |

## Mouse-scrub video

The video never autoplays. A `mousemove` listener on `window` tracks the previous
X position and converts each frame's horizontal delta into a time offset:

```
offset = (delta / window.innerWidth) * SENSITIVITY * video.duration   // SENSITIVITY = 0.8
```

The running target is clamped to `[0, duration]`. Seeks are issued one at a time:
while a seek is in flight no new one starts, and the `onSeeked` handler re-issues
a seek if the target has moved since. This keeps the decoder from being flooded
when the mouse moves fast.

## Dependencies

React, ReactDOM, Tailwind CSS, Vite. `lucide-react` is installed but unused —
the copy icon is inline SVG.

## Background video

Local asset `public/macaw.mp4` (replaces the previous remote computer clip). Scrubbed by horizontal mouse movement.
