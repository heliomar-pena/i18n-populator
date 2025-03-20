function sortElements(
  elements: string[],
  criterion: "A-Z" | "Z-A" | "none"
): string[] {
  switch (criterion) {
    case "A-Z":
      return elements.sort((a, b) => a.localeCompare(b));
    case "Z-A":
      return elements.sort((a, b) => b.localeCompare(a));
    case "none":
    default:
      return elements;
  }
}

export { sortElements };