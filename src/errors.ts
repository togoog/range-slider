function err(s: string): Error {
  return new Error(s);
}

function errNotANumber(varName = '', v: unknown): Error {
  const msg = `
    ${varName} should be a number, 
    but ${typeof v} given instead
  `.trim();

  return err(msg);
}

function errNotANumberOrPairOfNumbers(varName = '', v: unknown): Error {
  const msg = `
    ${varName} should be a number or pair of numbers, 
    but ${typeof v} given instead
  `.trim();

  return err(msg);
}

function errNotOneOf(
  varName = '',
  possibleValues: unknown[],
  v: unknown,
): Error {
  const msg = `
      ${varName} should be one of: ${possibleValues.join(', ')}, 
      but ${v} given instead
    `.trim();

  return err(msg);
}

function errNotABooleanOrPairOfBooleans(varName = '', v: unknown) {
  const msg = `
    ${varName} should be a boolean or pair of booleans,
    but ${v} given instead
  `.trim();

  return err(msg);
}

function errIncorrectObjectShape(varName = '', keys: string[]) {
  const msg = `
    ${varName} should be an object with keys:
    ${keys.join(', ')}
  `.trim();

  return err(msg);
}

export {
  err,
  errNotANumber,
  errNotOneOf,
  errNotANumberOrPairOfNumbers,
  errNotABooleanOrPairOfBooleans,
  errIncorrectObjectShape,
};
