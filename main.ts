const NORMALIZE_COLORS_RGB_TO_HSV = false;  // Нормализация значений, для hitechnic не требуется!
const RGB_TO_HSV_MAX_RANGE = 255; // Диапазон 0 .. до MAX
const MIN_W = 5; // Минимальный белый для фикса рандомных прыжков значений в RgbToHsv

// Максимальные значения RGB (на белом цвете) для нормализации датчика определения цвета
let testColorSensorRgbMax: number[] = [0, 0, 0];

// Перевод RGB в HSV
function RgbToHsv(colorsRGB: number[], colorWhite: number, rgbMax: number[], debug: boolean = false): number[] {
    if (NORMALIZE_COLORS_RGB_TO_HSV) {
        for (let i = 0; i < 3; i++) {
            colorsRGB[i] = Math.round((colorsRGB[i] / rgbMax[i]) * RGB_TO_HSV_MAX_RANGE);
            if (colorsRGB[i] > RGB_TO_HSV_MAX_RANGE) colorsRGB[i] = RGB_TO_HSV_MAX_RANGE;
            else if (colorsRGB[i] < 0) colorsRGB[i] = 0;
        }
    }
    let W = colorWhite; // Белый цвет от датчика
    if (debug) brick.showValue("W", W, 4);
    if (W > MIN_W) { // Фикс прыжков значений датчика, который направлен в пространство
        let max = Math.max(colorsRGB[0], Math.max(colorsRGB[1], colorsRGB[2]));
        let min = Math.min(colorsRGB[0], Math.min(colorsRGB[1], colorsRGB[2]));
        let V = max, H = 0;
        let S = (max == 0 ? 0 : Math.round((1 - (min / max)) * 100));
        if (max == min) H = 0;
        else if (max == colorsRGB[0])
            if (colorsRGB[1] >= colorsRGB[2]) H = Math.round(60 * (colorsRGB[1] - colorsRGB[2]) / (max - min));
            else H = Math.round(60 * (colorsRGB[1] - colorsRGB[2]) / (max - min) + 360);
        else if (max == colorsRGB[1]) H = Math.round(60 * (colorsRGB[2] - colorsRGB[0]) / (max - min) + 120);
        else H = Math.round(60 * (colorsRGB[0] - colorsRGB[1]) / (max - min) + 240);
        if (debug) {
            brick.showValue("H", H, 5);
            brick.showValue("S", S, 6);
            brick.showValue("V", V, 7);
        }
        return [H, S, V];
    } else return [0, 0, 0];
}

// Получить из HSV цветовой код
function HsvToColor(hsv: number[]): number {
    let H = hsv[0], S = hsv[1], V = hsv[2];
    if (S > 50) { // Граница цветности
        if (H < 25) return 5; // Red
        else if (H < 100) return 4; // Yellow
        else if (H < 180) return 3; // Green
        else if (H < 250) return 2; // Blue
        else if (H < 360) return 5; // Red
        else return -1; // Error
    } else if (V > 120) return 6; // White
    else if (V < 60 && V > 5 && S < 50) return 1; // Black
    else return 0; // Empty
}