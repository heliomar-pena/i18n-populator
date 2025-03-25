import { Settings, SortOrder } from "../types/settings";

function sortObjectKeys(obj: any, sortOrder: SortOrder): any {
  if (sortOrder === SortOrder.NONE) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => sortObjectKeys(item, sortOrder));
  } else if (obj !== null && typeof obj === "object") {
    // Convertimos el objeto a un array de [clave, valor] y aplicamos recursión en los valores
    const entries = Object.entries(obj).map(([key, value]) => [
      key,
      sortObjectKeys(value, sortOrder),
    ]);

    // Ordenamos el array según la clave, de forma ascendente o descendente
    const sortedEntries =
      sortOrder === SortOrder.ASC
        ? entries.sort((a, b) => a[0].localeCompare(b[0]))
        : entries.sort((a, b) => b[0].localeCompare(a[0]));

    // Reconstruimos el objeto a partir de las entradas ordenadas
    return Object.fromEntries(sortedEntries);
  }

  return obj;
}

export { sortObjectKeys };
