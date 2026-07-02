export function formatPrice(amount: number): string {
  return `S/ ${amount.toFixed(2)}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
