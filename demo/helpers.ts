function getRandomId(prefix: string) {
  return `${prefix}-${Math.random()
    .toString(36)
    .substring(2, 7)}`;
}

function getFunctionBody(fn: Function): string {
  return fn
    .toString()
    .match(/function[^{]+\{([\s\S]*)\}$/)[1]
    .trim();
}

function valueFormatter(value: number): string {
  return value.toFixed(3);
}

export { getRandomId, getFunctionBody, valueFormatter };
