// Utilitaire pour combiner des classes CSS avec Tailwind
export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}