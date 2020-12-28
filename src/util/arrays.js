export function arrayWrap(value) {
    return Array.isArray(value) ? value : [value];
}
