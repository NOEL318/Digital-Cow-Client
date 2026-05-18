/**
 * Devuelve el nombre del item de catalogo segun el locale actual.
 * Acepta cualquier objeto con nameEs y nameEn.
 */
export function localizedName(item: { nameEs: string; nameEn: string }, locale: string): string {
  return locale.startsWith('en') ? item.nameEn : item.nameEs;
}
