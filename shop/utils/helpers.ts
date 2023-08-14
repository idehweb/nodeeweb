export function roundPrice(price: number, isRial?: boolean, minValue = 1) {
  // rial
  if (isRial) price /= 10;

  price /= minValue;

  // ceil
  price = Math.ceil(price);

  price *= minValue;

  // toman
  return Math.max(0, price);
}
