export const blank = <T>(value: T): value is Extract<T, null | undefined | '' | [] | Record<string, never>> => {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim() === '';
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object' && value !== null) {
    return Object.keys(value).length === 0;
  }

  return false;
};

export const filled = <T>(value: T): value is NonNullable<T> => !blank(value);

export const oneOf = <T>(value: T, options: T[]): value is T => options.includes(value);
