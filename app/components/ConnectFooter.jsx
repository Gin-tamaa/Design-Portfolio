"use client";

// Pixel-art Pong footer. Port of the kokonutd "Prompting Is All You
// Need" canvas, retextured for this site:
//
//   - The pixel words read LETS / CONNECT instead of PROMPTING / IS
//     ALL YOU NEED
//   - A third row of pixel art under the words: three icon bricks
//     standing in for LinkedIn / Email / Resume. Each is its own
//     pixel grid the ball can chip away at, in the same style as the
//     letters above
//   - Canvas is bounded to the footer section (not fixed fullscreen),
//     so the rest of the page still scrolls normally below the
//     content above it
//   - Footer height ~600px on desktop, 480px on mobile
//
// On reduced motion the game loop is paused after the first paint —
// you still see the pixel composition, no ball or paddle movement.

import { useEffect, useRef } from "react";

// Light-theme palette. Pixel bricks render near-black on a white
// surface; hit bricks fade to a light grey rather than disappearing
// outright, so the wall reads as eroding instead of vanishing.
const COLOR = "#0a0a0a";
const HIT_COLOR = "#E5E5E5";
const BACKGROUND_COLOR = "#FFFFFF";
const BALL_COLOR = "#0a0a0a";
const PADDLE_COLOR = "#0a0a0a";
const LETTER_SPACING = 1;
const WORD_SPACING = 3;

// 4-5 wide × 5 tall bitmap glyphs. Reused + extended from the
// reference snippet so LETS CONNECT renders fully.
const PIXEL_MAP = {
  L: [
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  E: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  T: [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ],
  S: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  C: [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ],
  O: [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 1, 1],
  ],
  N: [
    [1, 0, 0, 0, 1],
    [1, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [1, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
  ],
};

// 8×8 icon bitmaps. Drawn in the same pixel-on-black style so the
// ball reads them as another brick wall to chip apart.
const ICON_MAP = {
  // LinkedIn — boxed "in" mark
  LINKEDIN: [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1],
    [1, 0, 1, 0, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // Email — envelope with flap line
  EMAIL: [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ],
  // Resume — document with text lines + dog-eared corner
  RESUME: [
    [1, 1, 1, 1, 1, 1, 0, 0],
    [1, 0, 0, 0, 0, 1, 1, 0],
    [1, 0, 1, 1, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ],
};

const ICON_ORDER = ["LINKEDIN", "EMAIL", "RESUME"];
const ICON_GAP_RATIO = 3; // gap (in icon pixels) between icons

export default function ConnectFooter() {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const pixelsRef = useRef([]);
  const ballRef = useRef({ x: 0, y: 0, dx: 0, dy: 0, radius: 0 });
  const paddlesRef = useRef([]);
  const scaleRef = useRef(1);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const calculateWordWidth = (word, pixelSize) => {
      return (
        word.split("").reduce((w, letter) => {
          const letterWidth = PIXEL_MAP[letter]?.[0]?.length ?? 0;
          return w + letterWidth * pixelSize + LETTER_SPACING * pixelSize;
        }, 0) -
        LETTER_SPACING * pixelSize
      );
    };

    const initializeGame = () => {
      // Size everything relative to the footer HEIGHT so the wall
      // never blows up wider than the section. The big word ends up
      // around 22% of footer height, the small word about half of
      // that, and the icons match the small word's pixel size.
      const adjLarge = Math.max(6, Math.round(canvas.height * 0.045));
      const adjSmall = Math.max(3, Math.round(adjLarge * 0.5));
      const adjIcon = Math.max(3, Math.round(adjLarge * 0.55));
      const BALL_SPEED = Math.max(3, Math.round(adjLarge * 0.55));

      pixelsRef.current = [];
      const words = ["LETS", "CONNECT"];

      const largeTextHeight = 5 * adjLarge;
      const smallTextHeight = 5 * adjSmall;
      const iconRowHeight = 8 * adjIcon;
      const gapWordsBlock = Math.round(adjLarge * 2.2);
      const gapIconsBlock = Math.round(adjLarge * 2.8);
      const totalHeight =
        largeTextHeight +
        gapWordsBlock +
        smallTextHeight +
        gapIconsBlock +
        iconRowHeight;

      let cursorY = Math.max(adjLarge, (canvas.height - totalHeight) / 2);

      const drawWord = (word, pixelSize) => {
        const totalWidth = calculateWordWidth(word, pixelSize);
        let startX = (canvas.width - totalWidth) / 2;
        word.split("").forEach((letter) => {
          const map = PIXEL_MAP[letter];
          if (!map) return;
          for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[i].length; j++) {
              if (map[i][j]) {
                pixelsRef.current.push({
                  x: startX + j * pixelSize,
                  y: cursorY + i * pixelSize,
                  size: pixelSize,
                  hit: false,
                });
              }
            }
          }
          startX += (map[0].length + LETTER_SPACING) * pixelSize;
        });
      };

      // Row 1, LETS
      drawWord(words[0], adjLarge);
      cursorY += largeTextHeight + gapWordsBlock;

      // Row 2, CONNECT
      drawWord(words[1], adjSmall);
      cursorY += smallTextHeight + gapIconsBlock;

      // Row 3, icons — gap is sized in icon-pixels so the icons stay
      // tidy whatever scale we land on
      const iconWidth = 8 * adjIcon;
      const iconGap = Math.max(4, ICON_GAP_RATIO * adjIcon);
      const totalIconsWidth =
        ICON_ORDER.length * iconWidth +
        (ICON_ORDER.length - 1) * iconGap;
      let iconStartX = (canvas.width - totalIconsWidth) / 2;
      ICON_ORDER.forEach((key) => {
        const grid = ICON_MAP[key];
        for (let i = 0; i < grid.length; i++) {
          for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j]) {
              pixelsRef.current.push({
                x: iconStartX + j * adjIcon,
                y: cursorY + i * adjIcon,
                size: adjIcon,
                hit: false,
              });
            }
          }
        }
        iconStartX += iconWidth + iconGap;
      });

      // Ball: top-right corner, heading down-left
      ballRef.current = {
        x: canvas.width * 0.9,
        y: canvas.height * 0.12,
        dx: -BALL_SPEED,
        dy: BALL_SPEED,
        radius: adjLarge / 2,
      };

      const paddleW = Math.max(4, Math.round(adjLarge * 0.55));
      const paddleL = Math.max(40, Math.round(adjLarge * 6));
      paddlesRef.current = [
        {
          x: 0,
          y: canvas.height / 2 - paddleL / 2,
          width: paddleW,
          height: paddleL,
          targetY: canvas.height / 2 - paddleL / 2,
          isVertical: true,
        },
        {
          x: canvas.width - paddleW,
          y: canvas.height / 2 - paddleL / 2,
          width: paddleW,
          height: paddleL,
          targetY: canvas.height / 2 - paddleL / 2,
          isVertical: true,
        },
        {
          x: canvas.width / 2 - paddleL / 2,
          y: 0,
          width: paddleL,
          height: paddleW,
          targetY: canvas.width / 2 - paddleL / 2,
          isVertical: false,
        },
        {
          x: canvas.width / 2 - paddleL / 2,
          y: canvas.height - paddleW,
          width: paddleL,
          height: paddleW,
          targetY: canvas.width / 2 - paddleL / 2,
          isVertical: false,
        },
      ];
    };

    const resizeCanvas = () => {
      const w = wrapper.clientWidth;
      const h = wrapper.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      canvas.width = w;
      canvas.height = h;
      scaleRef.current = Math.min(w / 1000, h / 600);
      initializeGame();
    };

    const updateGame = () => {
      const ball = ballRef.current;
      const paddles = paddlesRef.current;

      ball.x += ball.dx;
      ball.y += ball.dy;

      if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy;
      }
      if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx = -ball.dx;
      }

      paddles.forEach((p) => {
        if (p.isVertical) {
          if (
            ball.x - ball.radius < p.x + p.width &&
            ball.x + ball.radius > p.x &&
            ball.y > p.y &&
            ball.y < p.y + p.height
          ) {
            ball.dx = -ball.dx;
          }
        } else {
          if (
            ball.y - ball.radius < p.y + p.height &&
            ball.y + ball.radius > p.y &&
            ball.x > p.x &&
            ball.x < p.x + p.width
          ) {
            ball.dy = -ball.dy;
          }
        }
      });

      paddles.forEach((p) => {
        if (p.isVertical) {
          p.targetY = ball.y - p.height / 2;
          p.targetY = Math.max(
            0,
            Math.min(canvas.height - p.height, p.targetY)
          );
          p.y += (p.targetY - p.y) * 0.1;
        } else {
          p.targetY = ball.x - p.width / 2;
          p.targetY = Math.max(0, Math.min(canvas.width - p.width, p.targetY));
          p.x += (p.targetY - p.x) * 0.1;
        }
      });

      pixelsRef.current.forEach((px) => {
        if (
          !px.hit &&
          ball.x + ball.radius > px.x &&
          ball.x - ball.radius < px.x + px.size &&
          ball.y + ball.radius > px.y &&
          ball.y - ball.radius < px.y + px.size
        ) {
          px.hit = true;
          const cx = px.x + px.size / 2;
          const cy = px.y + px.size / 2;
          if (Math.abs(ball.x - cx) > Math.abs(ball.y - cy)) {
            ball.dx = -ball.dx;
          } else {
            ball.dy = -ball.dy;
          }
        }
      });
    };

    const drawGame = () => {
      ctx.fillStyle = BACKGROUND_COLOR;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      pixelsRef.current.forEach((px) => {
        ctx.fillStyle = px.hit ? HIT_COLOR : COLOR;
        ctx.fillRect(px.x, px.y, px.size, px.size);
      });

      ctx.fillStyle = BALL_COLOR;
      ctx.beginPath();
      ctx.arc(
        ballRef.current.x,
        ballRef.current.y,
        ballRef.current.radius,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.fillStyle = PADDLE_COLOR;
      paddlesRef.current.forEach((p) => {
        ctx.fillRect(p.x, p.y, p.width, p.height);
      });
    };

    const loop = () => {
      updateGame();
      drawGame();
      rafRef.current = requestAnimationFrame(loop);
    };

    resizeCanvas();
    const onResize = () => resizeCanvas();
    window.addEventListener("resize", onResize);

    if (reducedMotion) {
      drawGame();
    } else {
      loop();
    }

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <footer
      role="contentinfo"
      ref={wrapperRef}
      className="relative w-full overflow-hidden border-t border-black/10"
      style={{
        background: "#FFFFFF",
        height: "clamp(260px, 32vh, 360px)",
      }}
      aria-label="Lets connect, pixel pong footer"
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        aria-label="Pixel pong animation breaking apart the words LETS CONNECT and three social icons"
      />
    </footer>
  );
}
