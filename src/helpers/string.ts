const ucFirst = (input: string): string => {
  const [first, ...rest] = input.split("");
  return `${first.toUpperCase()}${rest.join("").toLowerCase()}`;
};

const normalize = (input: string) => {
  return input
    .split(" ")
    .join("_")
    .toLowerCase();
};

export { normalize, ucFirst };
