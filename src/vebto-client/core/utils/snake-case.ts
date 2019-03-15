/**
 * Convert specified string to snake_case
 */
export function snakeCase(string: string) {
    return string
        .replace(/\s/g, '_')
        .replace(/\.?([A-Z]+)/g, function (x,y){return "_" + y})
        .replace(/^_/, '')
        .toLowerCase();
}