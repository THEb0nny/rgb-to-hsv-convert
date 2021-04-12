// Поиск максимальных значений RGB для конвертации RGB в HSV, чтобы записать максимальные значения RGB
function SearchSensorRgbMax(colorSensor: sensors.HiTechnicColorSensor, sensorRgbMax: number[]): number[] { // colorSensor: sensors.ColorSensor / sensors.HiTechnicColorSensor
    let btnPressed = 0;
    while (btnPressed < 2) {
        let colorRgb = colorSensor.getRGB(); // colorSensor.rawRGB() для Lego Color Sensor
        if (brick.buttonEnter.wasPressed()) { btnPressed++; pause(500); }
        if (btnPressed == 0) {
            brick.clearScreen();
            brick.showValue("R", colorRgb[0], 1); brick.showValue("G", colorRgb[1], 2); brick.showValue("B", colorRgb[2], 3);
        } else if (btnPressed == 1) {
            sensorRgbMax[0] = Math.max(colorRgb[0], sensorRgbMax[0]);
            sensorRgbMax[1] = Math.max(colorRgb[1], sensorRgbMax[1]);
            sensorRgbMax[2] = Math.max(colorRgb[2], sensorRgbMax[2]);
            brick.showValue("R_max", sensorRgbMax[0], 1); brick.showValue("G_max", sensorRgbMax[1], 2); brick.showValue("B_max", sensorRgbMax[2], 3);
        }
        pause(10);
    }
    return sensorRgbMax;
}

// Тестирование перевода из RGB в HSV и получение цвета
function TestRGBToHSVToColor() {
    let colorSensor = sensors.hitechnicColor1;
    testColorSensorRgbMax = SearchSensorRgbMax(colorSensor, testColorSensorRgbMax); // Найти максимальные значения
    while (true) {
        let colorRgb = colorSensor.getRGB();
        let colorWhite = colorSensor.getWhite(); // For HT
        //let colorWhite = colorRgb[0] + colorRgb[1] + colorRgb[2]; // For Lego
        brick.clearScreen();
        brick.showValue("R", colorRgb[0], 1); brick.showValue("G", colorRgb[1], 2); brick.showValue("B", colorRgb[2], 3); brick.showValue("W", colorWhite, 4);
        let hsv = RgbToHsv(colorRgb, colorWhite, testColorSensorRgbMax, true);
        let currentColor = HsvToColor(hsv);
        brick.showValue("color", currentColor, 8);
        pause(10);
    }
}

function Main() {
    TestRGBToHSVToColor();
}

Main();