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

export function replaceValue({
  data,
  text,
  boundary = '%',
}: {
  data: object[];
  text: string;
  boundary?: string;
}) {
  const values = data
    .map((d) =>
      Object.fromEntries(
        Object.entries(d).map(([k, v]) => [`${boundary}${k}${boundary}`, v])
      )
    )
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});

  let newMsg = text;
  const pattern = new RegExp(`(${boundary}[^${boundary} ]+${boundary})`, 'g');
  let value = pattern.exec(text);
  while (value) {
    if (values[value[0]])
      newMsg = newMsg.replace(new RegExp(value[0], 'g'), values[value[0]]);
    value = pattern.exec(text);
  }
  return newMsg;
}
