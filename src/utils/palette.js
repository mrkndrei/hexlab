import { hexToRgb, rgbToHex } from './colorUtils'

function clamp(n, lo = 0, hi = 100) { return Math.max(lo, Math.min(hi, n)); }

// Convert HSL to RGB (0..255) and return hex
function hslToRgb(h, s, l) {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

// Convert hex -> palette shades 50..900
export function generateShades(hex) {
  const rgb = hexToRgb(hex)
  if (!rgb) return null
  const baseHex = rgbToHex(rgb.r, rgb.g, rgb.b)
  // derive HSL from RGB
  const r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0, l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break
      case g: h = (b - r) / d + 2; break
      case b: h = (r - g) / d + 4; break
    }
    h /= 6
  }
  h = Math.round(h * 360)
  s = Math.round(s * 100)
  l = Math.round(l * 100)

  // Target lightness scale for 50..900 (from light to dark)
  const lightnessScale = [97, 90, 80, 70, 60, 50, 40, 30, 20]
  const steps = [50,100,200,300,400,500,600,700,800]
  const palette = {}
  steps.forEach((step, i) => {
    const L = clamp(lightnessScale[i], 0, 100)
    // keep saturation near original but slightly higher for mid tones
    const S = clamp(Math.round(s * (i < 4 ? 0.9 : 1.05)), 10, 100)
    const rgbShade = hslToRgb(h, S, L)
    palette[step] = rgbToHex(rgbShade.r, rgbShade.g, rgbShade.b)
  })
  // Add 900 as darkest (near blackened version)
  const dark = hslToRgb(h, clamp(Math.round(s * 0.9), 5, 100), 12)
  palette[900] = rgbToHex(dark.r, dark.g, dark.b)

  // map to keys 50..900
  const mapped = {
    50: palette[50],
    100: palette[100],
    200: palette[200],
    300: palette[300],
    400: palette[400],
    500: palette[500],
    600: palette[600],
    700: palette[700],
    800: palette[800],
    900: palette[900],
  }

  // find the shade closest to the base color (in RGB space) and replace it with the exact input hex
  const baseRgb = { r: rgb.r, g: rgb.g, b: rgb.b }
  let bestKey = null
  let bestDist = Infinity
  Object.entries(mapped).forEach(([k, v]) => {
    const sRgb = hexToRgb(v)
    if (!sRgb) return
    const dr = sRgb.r - baseRgb.r
    const dg = sRgb.g - baseRgb.g
    const db = sRgb.b - baseRgb.b
    const dist = dr * dr + dg * dg + db * db
    if (dist < bestDist) {
      bestDist = dist
      bestKey = k
    }
  })

  if (bestKey) {
    mapped[bestKey] = baseHex
  }

  return { shades: mapped, selected: bestKey }
}

export default generateShades
