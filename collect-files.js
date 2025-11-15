const fs = require("fs");
const path = require("path");

// Путь к исходной директории (можно изменить)
const SOURCE_DIR = "./src"; // замените на нужный путь
// Путь к выходному файлу
const OUTPUT_FILE = "output.txt";

// Буфер для содержимого всех файлов
let collectedContent = "";
// Массив для хранения структуры директорий и файлов
let structure = [];

/**
 * Рекурсивно обходит директорию и собирает данные
 * @param {string} dirPath - путь к директории
 * @param {string} prefix - отступы для древовидной структуры
 */
function walkDirectory(dirPath, prefix = "") {
  const items = fs.readdirSync(dirPath);

  items.forEach((item) => {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      // Это директория
      structure.push(prefix + item + "/");
      walkDirectory(itemPath, prefix + "  ");
    } else {
      // Это файл
      structure.push(prefix + item);

      try {
        const content = fs.readFileSync(itemPath, "utf8");
        collectedContent += `\n--- Файл: ${itemPath} ---\n`;
        collectedContent += content;
        collectedContent += "\n" + "-".repeat(50) + "\n";
      } catch (err) {
        console.error(`Ошибка при чтении файла ${itemPath}:`, err);
      }
    }
  });
}

/**
 * Записывает собранные данные в выходной файл
 */
function writeOutput() {
  let output = collectedContent;

  // Добавляем разделитель перед структурой
  output += "\n" + "=".repeat(60) + "\n";
  output += "CNHERNEHF ДИРЕКТОРИИ:\n";
  output += "=".repeat(60) + "\n";
  output += structure.join("\n");

  fs.writeFileSync(OUTPUT_FILE, output, "utf8");
  console.log(`Данные успешно собраны в файл: ${OUTPUT_FILE}`);
}

// Основной запуск
try {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Директория не найдена: ${SOURCE_DIR}`);
    process.exit(1);
  }

  console.log(`Начинаем обход директории: ${SOURCE_DIR}`);
  walkDirectory(SOURCE_DIR);
  writeOutput();
} catch (err) {
  console.error("Произошла ошибка:", err);
}
