const NORMALIZE_COLORS_RGB_TO_HSV = false;  // Нормализация значений, для hitechnic не требуется!
const RGB_TO_HSV_MAX_RANGE = 255; // Диапазон 0 .. до MAX

let min_w = 5; // Минимальный белый для фикса рандомных прыжков значений в RgbToHsv

function SetMinW(w: number) {
    min_w = w;
}

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
    if (W > min_w) { // Фикс прыжков значений датчика, который направлен в пространство
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

// Границы
let s_range = 40; // 50
let red_h_range = 25;
let yellow_h_range = 100;
let green_h_range = 180;
let blue_h_range = 250;
let white_v_range = 5; // 120
let black_ranges = [60, 5, 50];

// Установка значений для перевода hsv в цвет
function SetHsvToColorRanges(s_range_new: number, red_h_range_new: number, yellow_h_range_new: number, green_h_range_new: number, blue_h_range_new: number, white_v_range_new: number, black_ranges_new: number[]) {
    s_range = s_range_new;
    red_h_range = red_h_range_new;
    yellow_h_range = yellow_h_range_new;
    green_h_range = green_h_range_new;
    blue_h_range = blue_h_range_new;
    white_v_range = white_v_range_new;
    black_ranges = black_ranges_new;
}

// Получить из HSV цветовой код
function HsvToColor(hsv: number[]): number {
    let H = hsv[0], S = hsv[1], V = hsv[2];
    if (S > s_range) { // Граница цветности
        if (H < red_h_range) return 5; // Red
        else if (H < yellow_h_range) return 4; // Yellow
        else if (H < green_h_range) return 3; // Green
        else if (H < blue_h_range) return 2; // Blue
        else if (H < 360) return 5; // Red
        else return -1; // Error
    } else if (V > white_v_range) return 6; // White
    else if (V < black_ranges[0] && V > black_ranges[1] && black_ranges[2] < 50) return 1; // Black
    else return 0; // Empty
}