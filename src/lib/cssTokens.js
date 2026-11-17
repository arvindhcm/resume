export function readCssColor(name, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

const LEAF_FALLBACKS = ["#2F4A3F", "#4A6B66", "#6F8C6A", "#A9B996", "#C8B064", "#DCD29A"];

export function readLeafColors() {
  return LEAF_FALLBACKS.map((fallback, index) => readCssColor(`--leaf-${index + 1}`, fallback));
}
