/**
 * Проверяет, является ли путь к файлу или каталогу первого уровня вложенности
 *
 * @example
 *  file.txt => true
 *  dir/file.txt => false
 *
 * @param {string} path Путь к файлу или каталогу
 * @return {boolean}
 */
function isPathOfFirstLevel(path) {
  if (!path) {
    return false;
  }

  return !/[\/\\]/.test(path);
}

module.exports = isPathOfFirstLevel;
