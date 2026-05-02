export const fmt = {
  number: (n: number | string) => Number(n).toLocaleString("es-CO"),
  decimal: (n: number | string, d = 2) => Number(n).toFixed(d),
  km: (n: number | string) => `${Number(n).toFixed(2)} km`,
};
