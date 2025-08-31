export function toPascalCase(input: string): string {
  const words = input
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2") // แยก fooBar -> foo Bar
    .split(/[^A-Za-z0-9]+/g)                // แยกด้วย non-alnum เช่น - _ space
    .filter(Boolean);

  return words
    .map(w => w[0].toLocaleUpperCase() + w.slice(1).toLocaleLowerCase())
    .join("");
}
