/**
 * Utilities for Luanti / Mineclonia texture modifier simulation and generation.
 * Handles `^[multiply:#HEX`, `^[colorize:#HEX:ALPHA`, base textures and canvas export.
 */

export interface BaseTextureOption {
  id: string;
  name: string;
  category: 'wood' | 'stone' | 'dirt' | 'leaves' | 'tool' | 'food' | 'potion' | 'misc';
  pattern: 'grain' | 'bricks' | 'smooth' | 'leaves' | 'tool_sword' | 'tool_pickaxe' | 'food' | 'potion';
}

export const BASE_TEXTURES: BaseTextureOption[] = [
  { id: 'mcl_trees_wood_oak.png', name: 'Oak Wood Planks', category: 'wood', pattern: 'grain' },
  { id: 'mcl_trees_tree_oak.png', name: 'Oak Tree Bark', category: 'wood', pattern: 'grain' },
  { id: 'mcl_trees_leaves_oak.png', name: 'Oak Leaves', category: 'leaves', pattern: 'leaves' },
  { id: 'mcl_core_stone.png', name: 'Natural Stone', category: 'stone', pattern: 'smooth' },
  { id: 'mcl_core_stonebrick.png', name: 'Stone Bricks', category: 'stone', pattern: 'bricks' },
  { id: 'mcl_core_cobble.png', name: 'Cobblestone', category: 'stone', pattern: 'bricks' },
  { id: 'mcl_core_dirt.png', name: 'Dirt', category: 'dirt', pattern: 'smooth' },
  { id: 'mcl_core_dirt_with_grass.png', name: 'Dirt with Grass', category: 'dirt', pattern: 'smooth' },
  { id: 'mcl_tools_sword_iron.png', name: 'Sword Blade', category: 'tool', pattern: 'tool_sword' },
  { id: 'mcl_tools_pick_iron.png', name: 'Pickaxe Head', category: 'tool', pattern: 'tool_pickaxe' },
  { id: 'mcl_farming_apple.png', name: 'Fruit / Berry', category: 'food', pattern: 'food' },
  { id: 'mcl_potions_bottle.png', name: 'Potion Flask', category: 'potion', pattern: 'potion' },
];

export const COLOR_PRESETS = [
  { name: 'Poplar / Dappled', hex: '#d97706' },
  { name: 'Redwood / Sequoia', hex: '#991b1b' },
  { name: 'Birch Gold', hex: '#fef08a' },
  { name: 'Cherry Blossom', hex: '#f472b6' },
  { name: 'Crimson Nether', hex: '#b91c1c' },
  { name: 'Warped Cyan', hex: '#06b6d4' },
  { name: 'Dark Oak Chocolate', hex: '#451a03' },
  { name: 'Ebony Charcoal', hex: '#1e293b' },
  { name: 'Ruby Vermillion', hex: '#e11d48' },
  { name: 'Emerald Jade', hex: '#059669' },
  { name: 'Amethyst Violet', hex: '#7c3aed' },
  { name: 'Lapis Deep Blue', hex: '#2563eb' },
];

/**
 * Returns formatted Luanti texture string with modifier if applicable:
 * e.g. "default_wood.png^[multiply:#d97706"
 */
export function formatLuantiTexture(base: string, tintHex?: string, useMultiplier = true): string {
  if (!tintHex || !useMultiplier || tintHex.toUpperCase() === '#FFFFFF') {
    return base;
  }
  const cleanHex = tintHex.startsWith('#') ? tintHex : `#${tintHex}`;
  return `${base}^[multiply:${cleanHex}`;
}

/**
 * Procedurally draws a 16x16 pixelated base canvas for instant realistic preview,
 * tinted with the multiplier color.
 */
export function renderProceduralTexture(
  canvas: HTMLCanvasElement,
  pattern: BaseTextureOption['pattern'],
  tintHex: string,
  customImageData?: string
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  if (customImageData) {
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = customImageData;
    return;
  }

  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);

  // Parse tint
  const rgb = hexToRgb(tintHex) || { r: 255, g: 255, b: 255 };

  // Draw 16x16 grid
  const pixelSize = width / 16;

  // Base patterns with pseudo-random seed determinism
  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      let shade = 1.0;

      if (pattern === 'grain') {
        // Wood grain stripes
        const isPlankGap = y % 4 === 0;
        if (isPlankGap) {
          shade = 0.55;
        } else {
          const noise = ((x * 7 + y * 13) % 17) / 60;
          shade = 0.85 + noise;
        }
      } else if (pattern === 'bricks') {
        const isRowBorder = y % 4 === 0;
        const offset = Math.floor(y / 4) % 2 === 0 ? 0 : 4;
        const isColBorder = (x + offset) % 8 === 0;
        if (isRowBorder || isColBorder) {
          shade = 0.5;
        } else {
          const noise = ((x * 11 + y * 19) % 23) / 80;
          shade = 0.85 + noise;
        }
      } else if (pattern === 'leaves') {
        // Foliage pattern with transparency gaps
        const noise = ((x * 17 + y * 31) % 29) / 29;
        if (noise < 0.2) {
          ctx.clearRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
          continue;
        }
        shade = 0.65 + noise * 0.45;
      } else if (pattern === 'tool_sword') {
        // Sword shape
        const isBlade = Math.abs(x - y) <= 1 && x > 3 && y < 13;
        const isHilt = (x === 3 && y === 12) || (x === 4 && y === 13) || (x === 2 && y === 13) || (x === 3 && y === 14);
        const isHandle = (x === 1 && y === 14) || (x === 2 && y === 15);

        if (isBlade) {
          shade = x === y ? 1.05 : 0.85;
        } else if (isHilt) {
          ctx.fillStyle = '#78350f';
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
          continue;
        } else if (isHandle) {
          ctx.fillStyle = '#451a03';
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
          continue;
        } else {
          continue;
        }
      } else if (pattern === 'tool_pickaxe') {
        // Pickaxe shape
        const isHead = y <= 3 && Math.abs(x - (15 - y)) <= 3;
        const isShaft = x === y;
        if (isHead) {
          shade = 0.9 + ((x + y) % 3) * 0.1;
        } else if (isShaft) {
          ctx.fillStyle = '#78350f';
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
          continue;
        } else {
          continue;
        }
      } else if (pattern === 'food') {
        // Apple/berry circle
        const dx = x - 8;
        const dy = y - 8;
        if (dx * dx + dy * dy <= 28) {
          shade = 0.8 + ((x * y) % 5) * 0.05;
        } else {
          continue;
        }
      } else if (pattern === 'potion') {
        // Bottle outline
        const isNeck = x >= 6 && x <= 9 && y >= 2 && y <= 5;
        const isBody = x >= 4 && x <= 11 && y >= 6 && y <= 13;
        if (isNeck || isBody) {
          shade = 0.8 + ((x * y) % 5) * 0.05;
        } else {
          continue;
        }
      } else {
        // Smooth noise
        const noise = ((x * 23 + y * 41) % 37) / 100;
        shade = 0.8 + noise;
      }

      // Multiply with tint
      const r = Math.min(255, Math.floor(rgb.r * shade));
      const g = Math.min(255, Math.floor(rgb.g * shade));
      const b = Math.min(255, Math.floor(rgb.b * shade));

      ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
  }
}

/**
 * Creates a raw PNG Data URL string for exporting inside a zip file
 */
export function generatePngDataUrl(pattern: BaseTextureOption['pattern'], tintHex: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 16;
  canvas.height = 16;
  renderProceduralTexture(canvas, pattern, tintHex);
  return canvas.toDataURL('image/png');
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
