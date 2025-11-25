/**
 * Simple color utility to generate palette from a hex color
 */

// Convert hex to RGB object
function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
        ? {
            r: parseInt(result[1]!, 16),
            g: parseInt(result[2]!, 16),
            b: parseInt(result[3]!, 16),
        }
        : null
}

// Convert RGB object to hex
function rgbToHex(r: number, g: number, b: number) {
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

// Mix two colors
function mix(color1: { r: number; g: number; b: number }, color2: { r: number; g: number; b: number }, weight: number) {
    const w = weight / 100
    const w2 = 1 - w
    return {
        r: Math.round(color1.r * w + color2.r * w2),
        g: Math.round(color1.g * w + color2.g * w2),
        b: Math.round(color1.b * w + color2.b * w2),
    }
}

export function generatePalette(hex: string) {
    const rgb = hexToRgb(hex)
    if (!rgb) return null

    const white = { r: 255, g: 255, b: 255 }
    const black = { r: 0, g: 0, b: 0 }

    return {
        50: rgbToHex(mix(white, rgb, 95).r, mix(white, rgb, 95).g, mix(white, rgb, 95).b),
        100: rgbToHex(mix(white, rgb, 90).r, mix(white, rgb, 90).g, mix(white, rgb, 90).b),
        200: rgbToHex(mix(white, rgb, 80).r, mix(white, rgb, 80).g, mix(white, rgb, 80).b),
        300: rgbToHex(mix(white, rgb, 70).r, mix(white, rgb, 70).g, mix(white, rgb, 70).b),
        400: rgbToHex(mix(white, rgb, 50).r, mix(white, rgb, 50).g, mix(white, rgb, 50).b),
        500: hex,
        600: rgbToHex(mix(black, rgb, 10).r, mix(black, rgb, 10).g, mix(black, rgb, 10).b),
        700: rgbToHex(mix(black, rgb, 20).r, mix(black, rgb, 20).g, mix(black, rgb, 20).b),
        800: rgbToHex(mix(black, rgb, 30).r, mix(black, rgb, 30).g, mix(black, rgb, 30).b),
        900: rgbToHex(mix(black, rgb, 40).r, mix(black, rgb, 40).g, mix(black, rgb, 40).b),
        950: rgbToHex(mix(black, rgb, 50).r, mix(black, rgb, 50).g, mix(black, rgb, 50).b),
    }
}
